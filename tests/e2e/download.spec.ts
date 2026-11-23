import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const release = JSON.parse(
  readFileSync(join(process.cwd(), "src/content/release.generated.json"), "utf8"),
);
const DOWNLOAD = "https://github.com/rafaelevan-k/lunar/releases/latest/download/Lunar.msi";

test("the main button downloads the newest Lunar.msi and says which one", async ({ page }) => {
  await page.goto("/en");
  const button = page.getByRole("link", { name: "Download Lunar for Windows 11" }).first();
  await expect(button).toHaveAttribute("href", DOWNLOAD);
  const size = (release.sizeBytes / 1024 / 1024).toFixed(1);
  await expect(
    page.getByText(`Lunar ${release.version}, ${size} MB, released`).first(),
  ).toBeVisible();
});

test("the Indonesian page formats the same facts in Indonesian", async ({ page }) => {
  await page.goto("/id");
  await expect(
    page.getByRole("link", { name: "Unduh Lunar untuk Windows 11" }).first(),
  ).toHaveAttribute("href", DOWNLOAD);
  await expect(
    page.getByText(new RegExp(`Lunar ${release.version}, .+ MB, rilis`)).first(),
  ).toBeVisible();
});

test("on Windows there is no note; elsewhere the note and a copy button appear", async ({
  page,
  isMobile,
  browserName,
}) => {
  await page.goto("/en");
  const note = page.getByTestId("not-windows").first();
  if (!isMobile) {
    await expect(note).toBeHidden();
    return;
  }
  await expect(note).toContainText("Lunar is for Windows 11 PCs");
  if (browserName === "chromium") {
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await note.getByRole("button", { name: "Copy download link" }).click();
    await expect(note.getByRole("button", { name: "Link copied" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(DOWNLOAD);
  }
});

test("the release data is valid and the build falls back when GitHub can't be reached", () => {
  expect(release.version).toMatch(/^\d+\.\d+\.\d+$/);
  expect(release.sha256 === null || /^[a-f0-9]{64}$/.test(release.sha256)).toBe(true);

  const out = join(mkdtempSync(join(tmpdir(), "lunar-release-")), "release.json");
  execFileSync(process.execPath, ["scripts/fetch-release.mjs"], {
    env: { ...process.env, RELEASE_API: "http://127.0.0.1:9", RELEASE_OUT: out },
  });
  const written = JSON.parse(readFileSync(out, "utf8"));
  const fallback = JSON.parse(
    readFileSync(join(process.cwd(), "src/content/release-fallback.json"), "utf8"),
  );
  expect(written).toEqual(fallback);
  expect(written.source).toBe("fallback");
});
