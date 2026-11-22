import { expect, test } from "@playwright/test";

test.describe("island preview", () => {
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

  test("the closed island is shown for each activity at the app's sizes", async ({ page }) => {
    await page.goto("/en");
    const sizes = async () =>
      page
        .locator("[data-activity]")
        .evaluateAll((els) =>
          els.map((el) => [el.getAttribute("data-activity"), el.clientWidth, el.clientHeight]),
        );
    expect(await sizes()).toEqual([
      ["eyes", 160, 44],
      ["media", 160, 44],
      ["recording", 232, 44],
      ["focus", 160, 44],
    ]);
    await page.getByRole("group", { name: "Island style" }).getByText("Notch").click();
    expect(await sizes()).toEqual([
      ["eyes", 230, 32],
      ["media", 280, 32],
      ["recording", 300, 32],
      ["focus", 230, 32],
    ]);
    await expect(page.getByRole("img", { name: "Voice recorder" })).toBeVisible();
  });

  test("Indonesian names come from the app", async ({ page }) => {
    await page.goto("/id");
    await page.getByRole("group", { name: "Gaya pulau" }).getByText("Notch").click();
    const tabs = page.getByRole("tablist", { name: "Halaman" }).getByRole("tab");
    await expect(tabs.nth(3)).toHaveAccessibleName("Pengonversi berkas");
  });
});
