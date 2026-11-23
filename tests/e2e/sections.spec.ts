import { expect, test, type Page } from "@playwright/test";
import { en } from "../../src/content/en";

/** Waits until the page is hydrated: the tour swaps to its pinned version only then. */
async function ready(page: Page) {
  await page.goto("/en");
  await page.locator("[data-tour=pinned]").waitFor();
}

test.describe("home sections", () => {
  test("the live island plays by itself until an activity is picked", async ({ page }) => {
    await ready(page);
    const stage = page.locator("[data-live-island]");
    await stage.scrollIntoViewIfNeeded();
    const first = await stage.getAttribute("data-live-island");
    await expect(stage).not.toHaveAttribute("data-live-island", first!, { timeout: 8000 });
    const live = page.locator("section[aria-labelledby=live-island]");
    await live
      .getByRole("group", { name: "Activity" })
      .getByText("Recording", { exact: true })
      .click();
    await expect(stage).toHaveAttribute("data-live-island", "pill-recording");
    await page.waitForTimeout(3600);
    await expect(stage).toHaveAttribute("data-live-island", "pill-recording");
  });

  test("the screen-share slider moves with the keyboard", async ({ page }) => {
    await ready(page);
    const slider = page.getByRole("slider", {
      name: "Compare your screen with what others see",
    });
    await slider.focus();
    const before = Number(await slider.inputValue());
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    expect(Number(await slider.inputValue())).toBe(before - 2);
  });

  test("the translation demo works with the button and with Ctrl+Alt+T", async ({ page }) => {
    await ready(page);
    const text = page.locator("[data-translated]");
    await text.scrollIntoViewIfNeeded();
    await expect(text).toHaveAttribute("data-translated", "original");
    await page.getByRole("button", { name: "Translate the screen" }).click();
    await expect(text).toHaveAttribute("data-translated", "id");
    await expect(text).toContainText("Rapat Anda dimulai");
    await page.getByText("日本語").click();
    await expect(text).toContainText("会議");
    await page.keyboard.press("Control+Alt+t");
    await expect(text).toHaveAttribute("data-translated", "original");
  });

  test("the privacy map shows each destination's details", async ({ page }) => {
    await page.goto("/en");
    const map = page.locator("section[aria-labelledby=privacy]");
    await map.getByRole("tab", { name: /Microsoft Azure/ }).click();
    await expect(map.getByRole("tabpanel")).toContainText(en.privacy.ways[2].body);
    await map.getByRole("tab", { name: /Microsoft Azure/ }).press("ArrowUp");
    await expect(map.getByRole("tab", { name: /Anthropic/ })).toBeFocused();
    await expect(map.getByRole("tabpanel")).toContainText(en.privacy.ways[1].body);
  });

  test("install: copy the check command and reveal Run anyway", async ({ page, browserName }) => {
    await page.goto("/en");
    const install = page.locator("section[aria-labelledby=install]");
    await install.getByRole("button", { name: "More info" }).click();
    await expect(install.getByRole("button", { name: "Run anyway" })).toBeVisible();
    if (browserName === "chromium") {
      await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
      await install.getByRole("button", { name: "Copy" }).click();
      await expect(install.getByRole("button", { name: "Copied" })).toBeVisible();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        en.install.verifyCommand,
      );
    }
  });

  test("limits and questions open without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/en");
    const faq = page.locator("section[aria-labelledby=faq]");
    await faq.getByText(en.faq[0].question).click();
    await expect(faq.getByText(en.faq[0].answer)).toBeVisible();
    await expect(page.locator("section[aria-labelledby=good-to-know] details")).toHaveCount(
      en.limits.length,
    );
    await context.close();
  });
});
