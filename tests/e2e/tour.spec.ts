import { expect, test, type Page } from "@playwright/test";
import { en } from "../../src/content/en";

/** Scrolls to a point of the pinned tour: 0 = start, 1 = end. Waits for the pinned version first. */
async function scrollTour(page: Page, at: number) {
  await page.locator("[data-tour-pin]").waitFor({ state: "attached" });
  await page.evaluate((p) => {
    const pin = document.querySelector("[data-tour-pin]") as HTMLElement;
    const top = pin.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + (pin.offsetHeight - window.innerHeight) * p);
  }, at);
}

const tour = (page: Page) => page.locator("[data-tour]");

test.describe("Meet the island (pinned)", () => {
  test("scrolling opens the island and walks through the six pages", async ({ page }) => {
    await page.goto("/en");
    await expect(tour(page)).toHaveAttribute("data-tour", "pinned");

    for (const [at, index] of [
      [0.2, 0],
      [0.45, 2],
      [0.95, 5],
    ] as const) {
      await scrollTour(page, at);
      await expect(tour(page)).toHaveAttribute("data-page", String(index));
      await expect(tour(page).getByRole("heading", { level: 3 })).toHaveText(en.pages[index].name);
      await expect(
        page.getByRole("tablist", { name: "Pages" }).getByRole("tab").nth(index),
      ).toHaveAttribute("aria-selected", "true");
    }
  });

  test("picking a page on the panel scrolls to it", async ({ page, isMobile }) => {
    test.skip(isMobile, "Clicks the small page dots");
    await page.goto("/en");
    await scrollTour(page, 0.2);
    await expect(tour(page)).toHaveAttribute("data-page", "0");
    const before = await page.evaluate(() => window.scrollY);
    await page.getByRole("tablist", { name: "Pages" }).getByRole("tab").nth(4).click();
    await expect(tour(page)).toHaveAttribute("data-page", "4");
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });

  test("the closed Notch shows only itself, not the panel behind its shoulders", async ({
    page,
  }) => {
    await page.goto("/en");
    await page.locator("[data-tour-pin]").waitFor({ state: "attached" });
    await page.getByRole("group", { name: "Island style" }).getByText("Notch").click();
    await scrollTour(page, 0);
    // The panel body (background, tabs, pages) is the first child of the island element.
    const bodyOpacity = () =>
      page
        .locator("[data-tour] [data-island-style] > div")
        .first()
        .evaluate((el) => Number(getComputedStyle(el).opacity));
    await expect.poll(bodyOpacity).toBeLessThan(0.05);
    await scrollTour(page, 0.3);
    await expect.poll(bodyOpacity).toBe(1);
  });

  test("the next section follows the tour closely", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop size");
    await page.setViewportSize({ width: 1840, height: 915 });
    await page.goto("/en");
    await page.locator("[data-tour-pin]").waitFor({ state: "attached" });
    // Past the end of the pinned scroll the panel is released and scrolls up with the page; measure
    // there, with the next heading halfway down the screen.
    await page.evaluate(() => {
      const next = document.getElementById("island-activities")!;
      window.scrollTo(0, next.getBoundingClientRect().top + window.scrollY - 500);
    });
    await page.waitForTimeout(300);
    const gap = await page.evaluate(() => {
      const desktop = document
        .querySelector("[data-tour] [data-island-style]")!
        .closest("[class*='rounded-[28px]']")!;
      const next = document.getElementById("island-activities")!;
      return next.getBoundingClientRect().top - desktop.getBoundingClientRect().bottom;
    });
    expect(gap).toBeLessThan(150);
  });

  test("Skip the tour jumps past it", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "Skip the tour" }).click();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.getElementById("after-the-island")!.getBoundingClientRect().top,
        ),
      )
      .toBeLessThan(200);
  });

  test("with reduced motion it is a plain section with every page listed", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await expect(tour(page)).toHaveAttribute("data-tour", "plain");
    const items = tour(page).locator("ol > li");
    await expect(items).toHaveCount(6);
    for (const [i, p] of en.pages.entries()) await expect(items.nth(i)).toContainText(p.body);
  });

  test("without JavaScript every page is listed too", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/en");
    await expect(page.locator("[data-tour=plain] ol > li")).toHaveCount(6);
    await context.close();
  });
});
