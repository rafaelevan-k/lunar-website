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
    const panels = page.locator('[data-tour] [role="tabpanel"]');
    await expect(panels).toHaveCount(6);
    await expect(panels.nth(0)).not.toHaveAttribute("inert");
    await expect(panels.nth(1)).toHaveAttribute("inert");
    await expect(panels.nth(0)).toContainText("Clock, volume and brightness");
  });

  test("the Notch style puts the pages as named tabs along the top", async ({ page }) => {
    await page.goto("/en");
    await page
      .locator("[data-tour]")
      .getByRole("group", { name: "Island style" })
      .getByText("Notch")
      .click();
    await expect(page.locator("[data-island-style]")).toHaveAttribute("data-island-style", "notch");
    const tabs = page.getByRole("tablist", { name: "Pages" }).getByRole("tab");
    await expect(tabs.nth(0)).toHaveAccessibleName("System");
    await expect(page.getByRole("button", { name: "Next page" })).toHaveCount(0);
    await tabs.nth(3).click();
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
  });

  test("Indonesian names come from the app", async ({ page }) => {
    await page.goto("/id");
    await page
      .locator("[data-tour]")
      .getByRole("group", { name: "Gaya pulau" })
      .getByText("Notch")
      .click();
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

  test("each activity is shown at the app's sizes, in both styles", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const live = page.locator("section[aria-labelledby=live-island]");
    const size = () =>
      live
        .locator("[data-activity]")
        .first()
        .evaluate((el) => [el.getAttribute("data-activity"), el.clientWidth, el.clientHeight]);
    const expected = {
      pill: {
        Music: ["media", 160, 44],
        Recording: ["recording", 232, 44],
        Focus: ["focus", 160, 44],
        "Focus done": ["eyes", 160, 44],
      },
      notch: {
        Music: ["media", 280, 32],
        Recording: ["recording", 300, 32],
        Focus: ["focus", 230, 32],
        "Focus done": ["eyes", 230, 32],
      },
    } as const;
    for (const style of ["Pill", "Notch"] as const) {
      await live
        .getByRole("group", { name: "Island style" })
        .getByText(style, { exact: true })
        .click();
      for (const [moment, want] of Object.entries(expected[style === "Pill" ? "pill" : "notch"])) {
        await live
          .getByRole("group", { name: "Activity" })
          .getByText(moment, { exact: true })
          .click();
        await expect.poll(size).toEqual(want);
      }
    }
  });

  test("the closed Notch in the tour is the app's Notch size", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("[data-tour=pinned]")).toBeAttached();
    await page
      .locator("[data-tour]")
      .getByRole("group", { name: "Island style" })
      .getByText("Notch")
      .click();
    await expect.poll(() => sizes(page, "[data-tour]")).toEqual([["eyes", 230, 32]]);
  });

  // The bars start "reduced" on the first render; they must start moving after a full page load.
  const showRecording = (page: Page) =>
    page
      .locator("section[aria-labelledby=live-island]")
      .getByRole("group", { name: "Activity" })
      .getByText("Recording", { exact: true })
      .click();
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
    await showRecording(page);
    expect(await barScales(page)).toBeGreaterThan(2);
  });

  test("with reduced motion the sound bars stand still", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    await showRecording(page);
    expect(await barScales(page)).toBe(1);
  });
});
