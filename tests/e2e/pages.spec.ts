import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { en } from "../../src/content/en";
import { id } from "../../src/content/id";

const PAGES = ["/en/features", "/en/privacy", "/en/download", "/en/changelog", "/id/privacy"];

test.describe("inner pages", () => {
  for (const path of PAGES) {
    test(`${path} has one h1 and no serious axe violations`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(serious).toEqual([]);
    });
  }

  test("the header's Download goes to the download page", async ({ page }) => {
    await page.goto("/en/features");
    await page.getByRole("banner").getByRole("link", { name: "Download", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/download$/);
    await expect(page.getByRole("link", { name: /Download Lunar/ }).first()).toHaveAttribute(
      "href",
      /github\.com\/rafaelevan-k\/lunar\/releases\//,
    );
  });

  test("features has a section for every island page", async ({ page }) => {
    await page.goto("/en/features");
    for (const p of en.pages) {
      await expect(page.locator(`#feature-${p.id}`)).toBeVisible();
    }
  });

  test("privacy lists every row of the table in both languages", async ({ page }) => {
    for (const [locale, content] of [
      ["en", en],
      ["id", id],
    ] as const) {
      await page.goto(`/${locale}/privacy`);
      for (const row of content.privacy.table) {
        await expect(page.getByRole("rowheader", { name: row.name })).toBeVisible();
      }
    }
  });

  test("the changelog shows every release with a link to its notes", async ({ page }) => {
    await page.goto("/en/changelog");
    for (const release of en.changelog) {
      await expect(page.getByRole("heading", { name: release.version, level: 2 })).toBeVisible();
      await expect(page.locator(`a[href$="/releases/tag/v${release.version}"]`)).toBeVisible();
    }
  });

  test("an unknown URL gets the Lunar 404 in both languages", async ({ page }) => {
    const response = await page.goto("/en/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lunar can't find that page");
    await expect(page.getByRole("link", { name: "Go to the home page" })).toHaveAttribute(
      "href",
      "/en",
    );
    await expect(page.getByRole("link", { name: "Ke beranda" })).toHaveAttribute("href", "/id");
  });
});
