import { expect, test } from "@playwright/test";
import en from "../../messages/en.json";

const PATHS = ["", "/features", "/privacy", "/download", "/changelog"];

test.describe("SEO", () => {
  for (const locale of ["en", "id"] as const) {
    for (const path of PATHS) {
      test(`/${locale}${path} has its own title, canonical, hreflang and share card`, async ({
        page,
      }) => {
        await page.goto(`/${locale}${path}`);
        const head = page.locator("head");
        await expect(page).toHaveTitle(/Lunar/);
        await expect(head.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
        await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
          "href",
          new RegExp(`/${locale}${path}$`),
        );
        for (const l of ["en", "id", "x-default"]) {
          await expect(head.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveCount(1);
        }
        const og = head.locator('meta[property="og:image"]');
        await expect(og).toHaveCount(1);
        await expect(og).toHaveAttribute("content", new RegExp(`/${locale}/opengraph-image$`));
        await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute(
          "content",
          "summary_large_image",
        );
      });
    }
  }

  test("titles differ between pages and languages", async ({ page }) => {
    const titles = new Set<string>();
    for (const locale of ["en", "id"]) {
      for (const path of PATHS) {
        await page.goto(`/${locale}${path}`);
        titles.add(await page.title());
      }
    }
    expect(titles.size).toBe(PATHS.length * 2);
  });

  test("the share card is a 1200x630 PNG in each language", async ({ request }) => {
    for (const locale of ["en", "id"]) {
      const response = await request.get(`/${locale}/opengraph-image`);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");
      const png = await response.body();
      expect(png.readUInt32BE(16)).toBe(1200);
      expect(png.readUInt32BE(20)).toBe(630);
    }
  });

  test("the home page describes Lunar as software, with no rating", async ({ page }) => {
    await page.goto("/en");
    const json = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(json!);
    expect(data["@type"]).toBe("SoftwareApplication");
    expect(data.description).toBe(en.Metadata.description);
    expect(data.operatingSystem).toContain("Windows 11");
    expect(data.offers.price).toBe("0");
    expect(data.softwareVersion).toMatch(/^\d+\.\d+\.\d+$/);
    expect(data.aggregateRating).toBeUndefined();
    expect(data.review).toBeUndefined();
  });

  test("the sitemap lists every page in both languages", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const locale of ["en", "id"]) {
      for (const path of PATHS) {
        expect(xml).toContain(`/${locale}${path}</loc>`);
      }
    }
    expect(xml).toContain('hreflang="id"');
  });

  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text();
    expect(text).toContain("Allow: /");
    expect(text).toMatch(/Sitemap: .*\/sitemap\.xml/);
  });

  test("the 404 is kept out of search results", async ({ page }) => {
    await page.goto("/en/no-such-page");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
