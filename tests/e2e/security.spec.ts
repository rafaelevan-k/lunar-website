import { expect, test } from "@playwright/test";

test("pages are served with the security headers", async ({ request }) => {
  for (const path of ["/en", "/id"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const headers = response.headers();
    const csp = headers["content-security-policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("unsafe-eval");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["permissions-policy"]).toContain("microphone=()");
    expect(headers["permissions-policy"]).toContain("geolocation=()");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-powered-by"]).toBeUndefined();
  }
});

test("the page works under its CSP: no violations, scripts run", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (message) => {
    if (/Content Security Policy|Content-Security-Policy/i.test(message.text())) {
      violations.push(message.text());
    }
  });
  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  // Hydration happened: the theme control reacts.
  await page.getByRole("group", { name: "Theme" }).getByText("Light").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(violations).toEqual([]);
});
