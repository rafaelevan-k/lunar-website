import { expect, test } from "@playwright/test";

// No fonts, embeds, trackers or anything else from another origin (AGENTS.md §10), on every page,
// including what loads later while scrolling (the 3D chunk, lazy sections).
const PAGES = [
  "/en",
  "/id",
  "/en/features",
  "/en/privacy",
  "/en/download",
  "/en/changelog",
  "/en/no-such-page",
];

for (const path of PAGES) {
  test(`${path} makes no request to another origin`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const foreign: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (!url.startsWith("data:") && !url.startsWith("blob:") && new URL(url).origin !== origin)
        foreign.push(url);
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    // Walk down the page so everything that loads near the viewport loads.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 800) {
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(60);
    }
    await page.waitForLoadState("networkidle");
    expect(foreign).toEqual([]);
  });
}

test("every link to another site says noopener noreferrer", async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  for (const path of PAGES.slice(0, 6)) {
    await page.goto(path);
    const bad = await page.$$eval(
      "a[href]",
      (links, own) =>
        links
          .filter((a) => new URL((a as HTMLAnchorElement).href).origin !== own)
          .filter(
            (a) =>
              !/noopener/.test((a as HTMLAnchorElement).rel) ||
              !/noreferrer/.test((a as HTMLAnchorElement).rel),
          )
          .map((a) => (a as HTMLAnchorElement).href),
      origin,
    );
    expect(bad, path).toEqual([]);
  }
});
