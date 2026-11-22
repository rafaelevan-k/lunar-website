import type { Metadata } from "next";
import { routing, type Locale } from "./routing";

// Production URL on Vercel, localhost otherwise. Used to make canonical and hreflang URLs absolute.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/**
 * Canonical URL and hreflang links for one page, e.g. path "/" or "/features".
 * x-default points to English, the default language.
 */
export function alternatesFor(path: string, locale: Locale): Metadata["alternates"] {
  const suffix = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${suffix}`;
  languages["x-default"] = `/${routing.defaultLocale}${suffix}`;
  return { canonical: `/${locale}${suffix}`, languages };
}
