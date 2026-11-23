import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/alternates";
import { routing } from "@/i18n/routing";
import { getRelease } from "@/lib/release";

/** Every page in every language, each listing its other languages. Built once at build time. */
const PATHS = ["", "/features", "/privacy", "/download", "/changelog"];

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages change with Lunar's releases, so the latest release date is their last change.
  const lastModified = getRelease().publishedAt;
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    })),
  );
}
