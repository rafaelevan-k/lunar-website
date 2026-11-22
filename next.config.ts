import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Dev only: lets the dev server be opened at 127.0.0.1 as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // English is the default language. No guessing from the browser: "/" always goes to /en.
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default createNextIntlPlugin("./src/i18n/request.ts")(nextConfig);
