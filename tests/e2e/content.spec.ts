import { expect, test } from "@playwright/test";
import { en } from "../../src/content/en";
import { id } from "../../src/content/id";
import { CONTENT_VERSION } from "../../src/content/types";

// The shape of a value: keys and array lengths, with every string replaced by "string".
// `source`, `id`, `version`, `date` and the verify command must be identical, not just present.
const SAME = new Set(["source", "id", "version", "date", "verifyCommand"]);

function shape(value: unknown, key = ""): unknown {
  if (typeof value === "string") return SAME.has(key) ? value : "string";
  if (Array.isArray(value)) return value.map((v) => shape(v, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v, k)]));
  }
  return value;
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

test.describe("site content", () => {
  test("English and Indonesian have the same structure, ids and sources", () => {
    expect(shape(id)).toEqual(shape(en));
  });

  test("no text is empty or left untranslated by accident", () => {
    for (const s of [...strings(en), ...strings(id)]) expect(s.trim()).not.toBe("");
    const englishBodies = en.why.map((w) => w.body);
    for (const w of id.why) expect(englishBodies).not.toContain(w.body);
  });

  test("the content describes the release it says it does", () => {
    expect(en.whatsNew.version).toBe(CONTENT_VERSION);
    expect(en.changelog[0].version).toBe(CONTENT_VERSION);
    const dates = en.changelog.map((r) => r.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  test("every page of the island is described once", () => {
    expect(en.pages.map((p) => p.id)).toEqual([
      "system",
      "media",
      "pomodoro",
      "converter",
      "notes",
      "usage",
    ]);
  });

  test("the limits that must never be hidden are there", () => {
    const text = strings(en.limits).join(" ");
    for (const must of [
      "Windows 10 is not supported",
      "Word files can't be converted to PDF",
      "doesn't document",
      "your own Azure Translator key",
      "isn't officially documented",
      "single monitor",
    ]) {
      expect(text).toContain(must);
    }
    expect(strings(en.install).join(" ")).toContain("isn't code-signed");
  });
});
