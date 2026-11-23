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
  test("shows every reason from the content, in order, before any 3D", async ({ page }) => {
    await page.goto("/en");
    await expect(why(page)).toHaveAttribute("data-why", "flat");
    const cards = page.locator("[data-why-card]");
    await expect(cards).toHaveCount(en.why.length);
    for (const [i, item] of en.why.entries()) {
      await expect(cards.nth(i)).toHaveAttribute("data-why-card", item.id);
      await expect(cards.nth(i).getByRole("heading", { level: 3 })).toHaveText(item.title);
      await expect(cards.nth(i)).toContainText(item.body);
    }
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
    await expect(page.locator("[data-why] [aria-hidden=true] canvas[data-engine]")).toHaveCount(1);
    expect(csp).toEqual([]);
  });

  test("the arc turns with the buttons and arrow keys; Pause stops it turning on its own", async ({
    page,
  }) => {
    await page.goto("/en");
    await goToWhy(page);
    await expect(why(page)).toHaveAttribute("data-why", "3d", { timeout: 40_000 });
    const current = page.locator("[data-why-card]:not([hidden])");
    const showing = (i: number) =>
      expect(current.getByRole("heading", { level: 3 })).toHaveText(en.why[i].title);

    await page.getByRole("button", { name: "Stop turning on its own" }).click();
    // It may already have turned on its own before Pause: start from wherever it is.
    const counter = page.locator("[data-why-counter]");
    const start = Number((await counter.textContent())!.split(" / ")[0]) - 1;
    await showing(start);
    await page.getByRole("button", { name: "Next reason" }).click();
    await showing((start + 1) % en.why.length);
    for (let i = 0; i <= start; i++) await page.keyboard.press("ArrowLeft");
    await showing(0);
    // Endless: before the first comes the last.
    await page.keyboard.press("ArrowLeft");
    await showing(en.why.length - 1);
    await expect(page.getByText(`${en.why.length} / ${en.why.length}`)).toBeVisible();

    // Paused, and focus is inside: nothing turns on its own.
    await page.waitForTimeout(5000);
    await showing(en.why.length - 1);

    // The front card's title on the arc is an HTML copy, hidden from screen readers.
    const label = page
      .locator("[data-why-stage] p")
      .filter({ hasText: en.why[en.why.length - 1].title });
    await expect(label).toBeVisible();
    await expect(page.locator("[data-why-stage]")).toHaveAttribute("aria-hidden", "true");

    // Clicking the front card opens its detail view.
    const box = (await page.locator("[data-why-stage]").boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.getByRole("dialog", { name: en.why[en.why.length - 1].title })).toBeVisible();
  });

  test("the arc turns on its own while nobody is using it", async ({ page }) => {
    await page.goto("/en");
    await goToWhy(page);
    await expect(why(page)).toHaveAttribute("data-why", "3d", { timeout: 40_000 });
    await page.mouse.move(0, 0);
    await expect(
      page.locator("[data-why-card]:not([hidden])").getByRole("heading", { level: 3 }),
    ).not.toHaveText(en.why[0].title, { timeout: 10_000 });
  });

  test("a card opens as a detail view; Escape closes it and focus goes back", async ({ page }) => {
    // The dialog is the same with or without 3D; the flat version keeps axe fast under software WebGL.
    await withoutWebGL(page);
    await page.goto("/en");
    await goToWhy(page);
    const item = en.why[2];
    const opener = page.getByRole("button", { name: `Read more about ${item.title}` });
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

  test("with reduced motion the cards are a flat row, no WebGL", async ({ page }) => {
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
