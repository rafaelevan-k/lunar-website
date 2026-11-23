import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  // Dev only: lets the dev server be opened at 127.0.0.1 as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  // Unknown URLs get app/global-not-found.tsx: the root layout sits under [locale], so there is
  // no single layout to build a 404 from.
  experimental: { globalNotFound: true },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Don't announce the framework in a response header.
  poweredByHeader: false,
  // English is the default language. No guessing from the browser: "/" always goes to /en.
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// Messages are compiled at build time, so the browser gets no ICU message parser.
export default createNextIntlPlugin({
  requestConfig: "./src/i18n/request.ts",
  experimental: {
    messages: { format: "json", path: "./messages", locales: "infer", precompile: true },
  },
})(nextConfig);
