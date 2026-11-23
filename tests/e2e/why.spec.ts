import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { en } from "../../src/content/en";

// Headless Chromium has no GPU, so WebGL is off and the cards fall back to 2D everywhere else.
// This file turns on SwiftShader (software WebGL) to test the 3D path; it is CPU-heavy, so only here.
test.use({ launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } });
test.describe.configure({ timeout: 60_000 });

const why = (page: Page) => page.locator("[data-why]");
// React Three Fiber marks its canvas with data-engine; the flat fallbacks are plain 2D canvases.
const webglCanvas = (page: Page) => page.locator("[data-why] canvas[data-engine]");

/** Makes the browser refuse WebGL (2D still works), to test the flat version. */
async function withoutWebGL(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error -- test double: refuse WebGL, keep 2D
    HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
      if (type.startsWith("webgl")) return null;
      return original.call(this, type, ...rest);
    };
  });
}

async function goToWhy(page: Page) {
  // After hydration: the pinned tour above makes the page taller once it takes over (it stays
  // plain with reduced motion).
  await page.waitForFunction(
    () =>
      document.querySelector("[data-tour=pinned]") ||
      document.documentElement.dataset.motion === "reduce" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  await page.evaluate(() => {
    const h = document.getElementById("why-lunar")!;
    window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY - 100);
  });
}

test.describe("Why Lunar", () => {
  test("shows every reason from the content, the first one wide", async ({ page }) => {
    await page.goto("/en");
    const cards = page.locator("[data-why-card]");
    await expect(cards).toHaveCount(en.why.length);
    for (const [i, item] of en.why.entries()) {
      await expect(cards.nth(i)).toHaveAttribute("data-why-card", item.id);
      await expect(cards.nth(i).getByRole("heading", { level: 3 })).toHaveText(item.title);
    }
    await expect(cards.first()).toHaveClass(/col-span-2/);
  });

  test("Three.js loads only near the section, then draws every card in one canvas", async ({
    page,
  }) => {
    const csp: string[] = [];
    page.on("console", (m) => {
      if (/Content.Security.Policy/i.test(m.text())) csp.push(m.text());
    });
    await page.goto("/en");
    await expect(webglCanvas(page)).toHaveCount(0);
    await goToWhy(page);
    await expect(why(page)).toHaveAttribute("data-why", "3d", { timeout: 40_000 });
    await expect(webglCanvas(page)).toHaveCount(1);
    // The whole canvas is decorative.
    await expect(
      page.locator("[data-why] [aria-hidden=true]:has(canvas[data-engine])"),
    ).toHaveCount(1);
    expect(csp).toEqual([]);
  });

  test("a card opens as a detail view; Escape closes it and focus goes back", async ({ page }) => {
    // The dialog is the same with or without 3D; the flat version keeps axe fast under software WebGL.
    await withoutWebGL(page);
    await page.goto("/en");
    await goToWhy(page);
    const item = en.why[2];
    const opener = page.getByRole("button", { name: `More about ${item.title}` });
    await opener.click();
    const dialog = page.getByRole("dialog", { name: item.title });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(item.body)).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

    const results = await new AxeBuilder({ page }).include("dialog").analyze();
    expect(
      results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")),
    ).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
  });

  test("with reduced motion the cards are flat drawings, no WebGL", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await goToWhy(page);
    await page.waitForTimeout(1500);
    await expect(why(page)).toHaveAttribute("data-why", "flat");
    await expect(webglCanvas(page)).toHaveCount(0);
  });

  test("without WebGL each card still shows its face, drawn in 2D", async ({ page }) => {
    await withoutWebGL(page);
    await page.goto("/en");
    await goToWhy(page);
    await page.waitForTimeout(1500);
    await expect(why(page)).toHaveAttribute("data-why", "flat");
    const drawn = await page
      .locator("[data-why-card=focus] canvas")
      .evaluate((c: HTMLCanvasElement) => {
        const data = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
        let painted = 0;
        for (let i = 3; i < data.length; i += 4) if (data[i] > 0) painted++;
        return painted;
      });
    expect(drawn).toBeGreaterThan(100);
  });
});
