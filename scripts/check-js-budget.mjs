// First-load JavaScript per page, gzip, from the prerendered HTML of `next build`.
// Fails when a page goes over its budget (PRD §8.2): home 245 KB, other pages 225 KB. Revised by
// the owner on 2026-11-23 from 200/150 KB: Next.js 16 + React 19 alone are about 133 KB.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const KB = 1024;
const PAGES = [
  { html: "en.html", budget: 245 * KB },
  { html: "id.html", budget: 245 * KB },
  ...["features", "privacy", "download", "changelog"].flatMap((p) =>
    ["en", "id"].map((l) => ({ html: `${l}/${p}.html`, budget: 225 * KB })),
  ),
];
const verbose = process.argv.includes("--verbose");

let failed = false;
for (const { html, budget } of PAGES) {
  const file = join(".next/server/app", html);
  if (!existsSync(file)) {
    console.error(`missing ${file}: run npm run build first`);
    process.exit(1);
  }
  const source = readFileSync(file, "utf8");
  // Modern browsers skip noModule scripts (the legacy polyfills), so they don't count.
  const tags = [...source.matchAll(/<script[^>]*src="\/_next\/(static\/[^"]+\.js)"[^>]*>/g)];
  const chunks = [...new Set(tags.filter((m) => !/noModule/i.test(m[0])).map((m) => m[1]))];
  const sizes = chunks.map((c) => ({ c, gz: gzipSync(readFileSync(join(".next", c))).length }));
  const total = sizes.reduce((sum, s) => sum + s.gz, 0);
  const ok = total <= budget;
  failed ||= !ok;
  console.log(
    `${ok ? "ok  " : "OVER"} /${html.replace(/\.html$/, "")}  ${(total / KB).toFixed(1)} KB gzip of ${budget / KB} KB (${chunks.length} chunks)`,
  );
  if (verbose)
    for (const s of sizes.sort((a, b) => b.gz - a.gz))
      console.log(`       ${(s.gz / KB).toFixed(1).padStart(6)} KB  ${s.c}`);
}
process.exit(failed ? 1 : 0);
