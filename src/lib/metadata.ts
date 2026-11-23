import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesFor, SITE_URL } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";
import { LUNAR_REPO_URL } from "@/content/site";
import { DOWNLOAD_URL, type Release } from "./release";

/** Where the share card of a language is served (app/[locale]/opengraph-image.tsx). */
export const shareImagePath = (locale: Locale) => `/${locale}/opengraph-image`;

/** Open Graph locale names for each site language. */
const OG_LOCALE: Record<Locale, string> = { en: "en_US", id: "id_ID" };

/**
 * Title, description, canonical, hreflang and the Open Graph/Twitter card of one page.
 * Pass no title for the home page: it uses the site title from Metadata.title.
 * The share image is the one app/[locale]/opengraph-image.tsx draws for the language. It is named
 * here because a page's own openGraph replaces the one the file would add.
 */
export async function pageMetadata({
  path,
  locale,
  title,
  description,
}: {
  path: string;
  locale: Locale;
  title?: string;
  description?: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const fullTitle = title ? `${title} — Lunar` : t("title");
  const text = description ?? t("description");
  const alternates = alternatesFor(path, locale);
  const image = {
    url: shareImagePath(locale),
    width: 1200,
    height: 630,
    type: "image/png",
    alt: t("title"),
  };
  return {
    title: fullTitle,
    description: text,
    alternates,
    openGraph: {
      type: "website",
      siteName: "Lunar",
      title: fullTitle,
      description: text,
      url: `/${locale}${path === "/" ? "" : path}`,
      locale: OG_LOCALE[locale],
      alternateLocale: Object.entries(OG_LOCALE)
        .filter(([l]) => l !== locale)
        .map(([, og]) => og),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: text, images: [image] },
  };
}

/**
 * schema.org SoftwareApplication for Lunar, from the build-time release data. No rating or review:
 * there are none to report (AGENTS.md §5, §11).
 */
export function softwareJsonLd(locale: Locale, description: string, release: Release) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lunar",
    description,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}${shareImagePath(locale)}`,
    inLanguage: locale,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Windows 11 (x64)",
    softwareVersion: release.version,
    datePublished: release.publishedAt.slice(0, 10),
    downloadUrl: DOWNLOAD_URL,
    fileSize: `${Math.round(release.sizeBytes / (1024 * 1024))}MB`,
    isAccessibleForFree: true,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    sameAs: LUNAR_REPO_URL,
  };
  // Escape "<" so no text in the data can close the script element.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
