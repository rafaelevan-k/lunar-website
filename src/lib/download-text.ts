import { getTranslations } from "next-intl/server";
import type { DownloadButtonText } from "@/components/ui/DownloadButton";
import type { Locale } from "@/i18n/routing";
import { formatReleaseDate, formatSize, type Release } from "./release";

/** The download button's words for a page, with the release facts read at build time. */
export async function downloadButtonText(
  locale: Locale,
  release: Release,
): Promise<DownloadButtonText> {
  const t = await getTranslations("Home");
  const d = await getTranslations("Download");
  return {
    button: t("download"),
    details: d("details", {
      version: release.version,
      size: formatSize(release.sizeBytes, locale),
      date: formatReleaseDate(release.publishedAt, locale),
    }),
    notWindows: d("notWindows"),
    copy: d("copy"),
    copied: d("copied"),
  };
}
