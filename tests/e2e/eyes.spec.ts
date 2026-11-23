import { expect, test, type Page } from "@playwright/test";

const heroEyes = (page: Page) => page.locator("main svg[data-lid]").first();

async function pupilX(page: Page) {
  return heroEyes(page).evaluate((svg) => {
    const g = svg.querySelector("[mask] [clip-path] > g") as SVGGElement | null;
    const match = g?.style.transform.match(/translateX\((-?[\d.]+)px\)/);
    return match ? Number(match[1]) : 0;
  });
}

test.describe("Lunar's eyes", () => {
  test.skip(({ isMobile }) => isMobile, "Pointer tests run on desktop");

  test("the pupils look toward the pointer", async ({ page }) => {
    await page.goto("/en");
    // The hero eyes open once the page is hydrated and they are on screen; only then is the
    // pointer followed.
    await expect(heroEyes(page)).toHaveAttribute("data-lid", "0.00");
    const box = (await page
      .getByRole("button", { name: "Make Lunar smile" })
      .first()
      .boundingBox())!;
    await page.mouse.move(box.x + box.width + 300, box.y + box.height / 2);
    await expect.poll(() => pupilX(page)).toBeGreaterThan(3);
    await page.mouse.move(box.x - 300, box.y + box.height / 2);
    await expect.poll(() => pupilX(page)).toBeLessThan(-3);
  });

  test("they smile while the download button has focus", async ({ page }) => {
    await page.goto("/en");
    await expect(heroEyes(page)).toHaveAttribute("data-smiling", "false");
    await page.getByRole("link", { name: "Download Lunar for Windows 11" }).first().focus();
    await expect(heroEyes(page)).toHaveAttribute("data-smiling", "true");
    await page.getByRole("link", { name: "Download Lunar for Windows 11" }).first().blur();
    await expect(heroEyes(page)).toHaveAttribute("data-smiling", "false");
  });

  test("clicking the pill makes them smile for a moment", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Make Lunar smile" }).first().click();
    await expect(heroEyes(page)).toHaveAttribute("data-smiling", "true");
    await expect(heroEyes(page)).toHaveAttribute("data-smiling", "false", { timeout: 3000 });
  });

  test("they blink by themselves", async ({ page }) => {
    await page.goto("/en");
    await page.waitForFunction(
      () => Number(document.querySelector("main svg[data-lid]")?.getAttribute("data-lid")) > 0.5,
      undefined,
      { polling: "raf", timeout: 9000 },
    );
  });

  test("with reduced motion they neither follow the pointer nor blink", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    // The server renders the moving version; the still one replaces it after hydration (the
    // plain tour appears at the same moment).
    await page.locator("[data-tour=plain]").waitFor();
    const box = (await page
      .getByRole("button", { name: "Make Lunar smile" })
      .first()
      .boundingBox())!;
    await page.mouse.move(box.x + box.width + 300, box.y);
    const lids: number[] = [];
    for (let i = 0; i < 16; i++) {
      await page.waitForTimeout(500);
      lids.push(Number(await heroEyes(page).getAttribute("data-lid")));
    }
    expect(Math.max(...lids)).toBe(0);
    expect(await pupilX(page)).toBe(0);
  });
});
