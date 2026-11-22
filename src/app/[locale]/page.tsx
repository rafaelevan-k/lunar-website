import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { IslandPreview } from "@/components/sections/IslandPreview";
import { StarterHero } from "@/components/sections/StarterHero";
import { alternatesFor } from "@/i18n/alternates";
import { DOWNLOAD_URL, formatReleaseDate, formatSize, getRelease } from "@/lib/release";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternatesFor("/", await getLocale()) };
}

// Starter page. The real home page is built later.
export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations("Home");
  const d = await getTranslations("Download");
  const release = getRelease();

  return (
    <>
      <StarterHero
        title={t("title")}
        lead={t("lead")}
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
