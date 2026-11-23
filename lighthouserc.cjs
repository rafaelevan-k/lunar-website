// Lighthouse CI: mobile budgets of PRD §8.2 on the production build (`npm run build` first).
// Uses CHROME_PATH when set, else Playwright's Chromium (CI). Chrome starts with a fresh temporary
// profile either way. Reports stay on disk
// (.lighthouseci/): nothing is uploaded anywhere.
// Lighthouse CI loads its config with require(), so this file is CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require("@playwright/test");

module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start -- --port 3200",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3200/en",
        "http://localhost:3200/en/features",
        "http://localhost:3200/en/download",
      ],
      numberOfRuns: 3,
      chromePath: process.env.CHROME_PATH || chromium.executablePath(),
      settings: {
        // Lighthouse's default is a mid-range phone on a slow 4G connection.
        chromeFlags: "--headless=new --no-sandbox",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9, aggregationMethod: "median-run" }],
        "categories:accessibility": ["error", { minScore: 0.95, aggregationMethod: "median-run" }],
        "categories:best-practices": ["error", { minScore: 0.95, aggregationMethod: "median-run" }],
        "categories:seo": ["error", { minScore: 0.95, aggregationMethod: "median-run" }],
        "largest-contentful-paint": [
          "error",
          { maxNumericValue: 2500, aggregationMethod: "median-run" },
        ],
        "cumulative-layout-shift": [
          "error",
          { maxNumericValue: 0.05, aggregationMethod: "median-run" },
        ],
        // Lab stand-in for INP, which needs a real visitor. A warning, not a failure (owner decision,
        // 2026-11-23): it swings 150–464 ms between identical runs and already counts toward the
        // Performance score above, which stays an error.
        "total-blocking-time": ["warn", { maxNumericValue: 200, aggregationMethod: "median-run" }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
