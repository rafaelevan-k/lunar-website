import { expect, test } from "@playwright/test";

test.describe("display preferences", () => {
  test("dark is the default and the theme choice survives a reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.getByRole("group", { name: "Theme" }).getByText("Light").click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();
  });

  test("the header button flips between dark and light", async ({ page, isMobile }) => {
    test.skip(isMobile, "The header theme button is in the menu on small screens");
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("Reduced motion stops CSS transitions and is remembered", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("group", { name: "Motion" }).getByText("Reduced").click();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
    const duration = await page
      .getByRole("link", { name: "Download", exact: true })
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(duration)).toBeLessThan(0.001);
  });

  test("the system's reduced-motion setting is followed by default", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "system");
    const duration = await page
      .getByRole("link", { name: "Download", exact: true })
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(duration)).toBeLessThan(0.001);
  });
});

test.describe("layout", () => {
  test("skip link moves focus to the main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard test");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("the menu opens into a panel and Escape closes it", async ({ page, isMobile }) => {
    test.skip(!isMobile, "The menu button shows on small screens only");
    await page.goto("/");
    const button = page.getByRole("button", { name: "Open menu" });
    await button.click();
    const menu = page.locator("#site-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Features" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("no horizontal scroll at 320 px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
