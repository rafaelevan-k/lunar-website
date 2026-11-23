import { expect, test, type Page } from "@playwright/test";
import { en } from "../../src/content/en";

const heroPill = (page: Page) =>
  page.getByRole("button", { name: "Make Lunar smile" }).first().locator("xpath=..");
const heroLid = (page: Page) => page.locator("main svg[data-wake]").getAttribute("data-lid");

test.describe("hero", () => {
  test("shows the title, the lead and the facts from the content", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.hero.title);
    const hero = page.locator("section[aria-labelledby=hero-title]");
    await expect(hero.getByText(en.hero.lead)).toBeVisible();
    for (const fact of en.hero.facts) {
      await expect(hero.getByText(fact, { exact: true })).toBeVisible();
    }
  });

  test("the download button is in view on a 1366×768 screen", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop size");
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/en");
    const link = page.getByRole("link", { name: "Download Lunar for Windows 11" }).first();
    await expect(link).toBeVisible();
    // Measure the final layout: the heading font swaps in after the first paint.
    await page.evaluate(() => document.fonts.ready);
    const box = await link.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(768);
  });

  test("Lunar wakes up: the eyes start closed and open", async ({ page }) => {
    await page.goto("/en");
    await expect.poll(() => heroLid(page), { timeout: 4000 }).toBe("0.00");
  });

  test("scrolling shrinks the pill toward the header", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse wheel");
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 120);
    await expect
      .poll(() => heroPill(page).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a))
      .toBeLessThan(0.9);
  });

  test("with reduced motion the pill doesn't move and the eyes are open", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await expect.poll(() => heroLid(page)).toBe("0.00");
    await page.evaluate(() => window.scrollTo(0, 150));
    await page.waitForTimeout(300);
    expect(await heroPill(page).evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });

  test("without JavaScript the eyes are open and the download works", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/en");
    const lid = page.locator('main svg[data-wake] [data-part="lid"]').first();
    expect(await lid.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    await expect(
      page.getByRole("link", { name: "Download Lunar for Windows 11" }).first(),
    ).toHaveAttribute("href", /Lunar\.msi$/);
    await context.close();
  });
});
