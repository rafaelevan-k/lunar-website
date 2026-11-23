import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home shows the Lunar pill and a download link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Make Lunar smile" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /download lunar/i }).first()).toHaveAttribute(
    "href",
    /github\.com\/rafaelevan-k\/lunar\/releases/,
  );
});

for (const theme of ["dark", "light"] as const) {
  test(`home has no serious accessibility violations (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("lunar-theme", value), theme);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious).toEqual([]);
  });
}
