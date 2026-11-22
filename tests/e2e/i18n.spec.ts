import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

function keys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

function messages(locale: string) {
  return JSON.parse(readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"));
}

test("English and Indonesian have exactly the same message keys", () => {
  expect(keys(messages("id")).sort()).toEqual(keys(messages("en")).sort());
});

test("/ goes to the English home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("/id is in Bahasa Indonesia", async ({ page }) => {
  await page.goto("/id");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(messages("id").Home.title);
  await expect(page).toHaveTitle(messages("id").Metadata.title);
  await expect(page.getByRole("link", { name: "Langsung ke konten" })).toBeAttached();
});

test("both languages are linked with hreflang", async ({ page }) => {
  await page.goto("/en");
  const href = (lang: string) =>
    page.locator(`link[rel="alternate"][hreflang="${lang}"]`).getAttribute("href");
  expect(await href("en")).toMatch(/\/en$/);
  expect(await href("id")).toMatch(/\/id$/);
  expect(await href("x-default")).toMatch(/\/en$/);
  expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(/\/en$/);
});

test("the footer switches language and stays on the page", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("contentinfo").getByRole("link", { name: "Bahasa Indonesia" }).click();
  await expect(page).toHaveURL(/\/id$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Bahasa Indonesia" }),
  ).toHaveAttribute("aria-current", "true");
});

test("an unknown language is a 404", async ({ request }) => {
  const response = await request.get("/fr");
  expect(response.status()).toBe(404);
});
