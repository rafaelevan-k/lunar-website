// Reads the latest Lunar release from GitHub before `next dev` / `next build` and writes
// src/content/release.generated.json. Runs at build time only: visitors' browsers never call GitHub.
// If anything fails (offline, rate limit, odd data), it writes a copy of
// src/content/release-fallback.json instead (marked "fallback"). It never fails the build.
//
// Optional: GITHUB_TOKEN raises GitHub's rate limit on CI. It is only sent to api.github.com.

import { copyFile, writeFile } from "node:fs/promises";

const REPO = "rafaelevan-k/lunar";
// Tests point these elsewhere to check the fallback without touching the real file.
const OUT =
  process.env.RELEASE_OUT ?? new URL("../src/content/release.generated.json", import.meta.url);
const API = process.env.RELEASE_API ?? "https://api.github.com";
const FALLBACK = new URL("../src/content/release-fallback.json", import.meta.url);
const TIMEOUT_MS = 10_000;

function log(message) {
  console.log(`[release] ${message}`);
}

async function getJson(url, headers) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.json();
}

async function getText(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.text();
}

async function main() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "lunar-website-build",
  };
  if (process.env.GITHUB_TOKEN && API === "https://api.github.com")
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const release = await getJson(`${API}/repos/${REPO}/releases/latest`, headers);
  const version = String(release.tag_name ?? "").replace(/^v/, "");
  const msi = release.assets?.find((a) => a.name === "Lunar.msi");
  const checksum = release.assets?.find((a) => a.name === "Lunar.msi.sha256");

  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`unexpected tag ${release.tag_name}`);
  if (!msi || !(msi.size > 0)) throw new Error("the release has no Lunar.msi");
  if (release.draft || release.prerelease)
    throw new Error("latest release is a draft or prerelease");

  let sha256 = null;
  if (checksum) {
    const match = (await getText(checksum.browser_download_url)).match(/\b[a-fA-F0-9]{64}\b/);
    sha256 = match ? match[0].toLowerCase() : null;
  }

  const data = {
    version,
    publishedAt: release.published_at,
    sizeBytes: msi.size,
    sha256,
    releaseUrl: release.html_url,
    source: "github",
  };
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  log(`Lunar ${version}, ${msi.size} bytes, sha256 ${sha256 ? "found" : "missing"}`);
}

main().catch(async (error) => {
  await copyFile(FALLBACK, OUT);
  log(`could not read the latest release (${error.message}); using release-fallback.json`);
});
