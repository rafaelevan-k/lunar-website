import { expect, test, type Page } from "@playwright/test";

// The panel's own controls, tested on the plain version of the tour (reduced motion), where the
// panel is an ordinary interactive element. The pinned, scroll-driven version is in tour.spec.ts.
test.describe("island panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("the pages are tabs: arrows, keys and the side buttons move between them", async ({
    page,
  }) => {
    await page.goto("/en");
    const tabs = page.getByRole("tablist", { name: "Pages" }).getByRole("tab");
    await expect(tabs).toHaveCount(6);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("button", { name: "Previous page" })).toBeDisabled();

    await page.getByRole("button", { name: "Next page" }).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("Media, page 2 of 6")).toBeAttached();

    await tabs.nth(1).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(2)).toBeFocused();
    await page.keyboard.press("End");
    await expect(tabs.nth(5)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  test("only the current page is reachable; the others are inert", async ({ page }) => {
    await page.goto("/en");
    const panels = page.locator('[role="tabpanel"]');
    await expect(panels).toHaveCount(6);
    await expect(panels.nth(0)).not.toHaveAttribute("inert");
    await expect(panels.nth(1)).toHaveAttribute("inert");
    await expect(panels.nth(0)).toContainText("Clock, volume and brightness");
  });

  test("the Notch style puts the pages as named tabs along the top", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("group", { name: "Island style" }).getByText("Notch").click();
    await expect(page.locator("[data-island-style]")).toHaveAttribute("data-island-style", "notch");
    const tabs = page.getByRole("tablist", { name: "Pages" }).getByRole("tab");
    await expect(tabs.nth(0)).toHaveAccessibleName("System");
    await expect(page.getByRole("button", { name: "Next page" })).toHaveCount(0);
    await tabs.nth(3).click();
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
  });

  test("Indonesian names come from the app", async ({ page }) => {
    await page.goto("/id");
    await page.getByRole("group", { name: "Gaya pulau" }).getByText("Notch").click();
    const tabs = page.getByRole("tablist", { name: "Halaman" }).getByRole("tab");
    await expect(tabs.nth(3)).toHaveAccessibleName("Pengonversi berkas");
  });
});

test.describe("closed island", () => {
  const sizes = (page: Page, scope: string) =>
    page
      .locator(`${scope} [data-activity]`)
      .evaluateAll((els) =>
        els.map((el) => [el.getAttribute("data-activity"), el.clientWidth, el.clientHeight]),
      );

  test("each activity is shown at the app's Pill size", async ({ page }) => {
    await page.goto("/en");
    // Polled: right after the page loads the elements can still report 0 while layout settles.
    await expect
      .poll(() => sizes(page, "section[aria-labelledby=island-activities]"))
      .toEqual([
        ["eyes", 160, 44],
        ["media", 160, 44],
        ["recording", 232, 44],
        ["focus", 160, 44],
      ]);
    await expect(page.getByRole("img", { name: "Voice recorder" })).toBeVisible();
  });

  test("the closed Notch in the tour is the app's Notch size", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("[data-tour=pinned]")).toBeAttached();
    await page.getByRole("group", { name: "Island style" }).getByText("Notch").click();
    await expect.poll(() => sizes(page, "[data-tour]")).toEqual([["eyes", 230, 32]]);
  });

  // The bars start "reduced" on the first render; they must start moving after a full page load.
  const barScales = (page: Page) =>
    page
      .locator("[data-activity=recording] span.bg-lunar-recording")
      .first()
      .evaluate(async (bar) => {
        const seen = new Set<string>();
        for (let i = 0; i < 8; i++) {
          seen.add(getComputedStyle(bar).transform);
          await new Promise((r) => setTimeout(r, 150));
        }
        return seen.size;
      });

  test("the sound bars move after a full page load", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    expect(await barScales(page)).toBeGreaterThan(2);
  });

  test("with reduced motion the sound bars stand still", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    expect(await barScales(page)).toBe(1);
  });
});
