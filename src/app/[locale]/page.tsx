import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { IslandPreview } from "@/components/sections/IslandPreview";
import { getContent } from "@/content";
import { alternatesFor } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";
import { DOWNLOAD_URL, formatReleaseDate, formatSize, getRelease } from "@/lib/release";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternatesFor("/", await getLocale()) };
}

// The home page. More sections follow the hero as they are built.
export default async function Home() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home");
  const d = await getTranslations("Download");
  const content = getContent(locale);
  const release = getRelease();

  return (
    <>
      <Hero
        title={content.hero.title}
        lead={content.hero.lead}
        facts={content.hero.facts}
        downloadHref={DOWNLOAD_URL}
        downloadText={{
          button: t("download"),
          details: d("details", {
            version: release.version,
            size: formatSize(release.sizeBytes, locale),
            date: formatReleaseDate(release.publishedAt, locale),
          }),
          notWindows: d("notWindows"),
          copy: d("copy"),
          copied: d("copied"),
        }}
        pillAction={t("pillAction")}
      />
      <IslandPreview />
    </>
  );
}
