import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/pages/PageIntro";
import { Install } from "@/components/sections/Install";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { getContent } from "@/content";
import { LUNAR_REPO_URL } from "@/content/site";
import { alternatesFor } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";
import { downloadButtonText } from "@/lib/download-text";
import { DOWNLOAD_URL, formatReleaseDate, formatSize, getRelease } from "@/lib/release";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.download");
  return {
    title: `${t("title")} — Lunar`,
    description: t("lead"),
    alternates: alternatesFor("/download", await getLocale()),
  };
}

export default async function DownloadPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Pages.download");
  const content = getContent(locale);
  const release = getRelease();

  const facts = [
    [t("version"), release.version],
    [t("released"), formatReleaseDate(release.publishedAt, locale)],
    [t("size"), formatSize(release.sizeBytes, locale)],
  ] as const;

  return (
    <>
      <PageIntro title={t("title")} lead={t("lead")}>
        <div className="mt-10 flex flex-col items-start gap-8">
          <DownloadButton
            className="items-start"
            href={DOWNLOAD_URL}
            text={await downloadButtonText(locale, release)}
          />
          <dl className="grid w-full max-w-3xl grid-cols-2 gap-x-10 gap-y-4 border-t border-lunar-border pt-6 sm:grid-cols-3">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-lunar-text-2">{label}</dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
            {release.sha256 && (
              <div className="col-span-full">
                <dt className="text-sm text-lunar-text-2">{t("sha")}</dt>
                <dd className="mt-1 font-mono text-xs break-all">{release.sha256}</dd>
              </div>
            )}
          </dl>
          <a
            href={`${LUNAR_REPO_URL}/releases`}
            className="inline-flex min-h-11 items-center gap-1 text-lunar-text-2 underline underline-offset-4 hover:text-lunar-text"
          >
            {t("allReleases")}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </PageIntro>
      <Install
        steps={content.install.steps}
        smartScreen={content.install.smartScreen}
        verify={content.install.verify}
        verifyCommand={content.install.verifyCommand}
        requirements={content.install.requirements}
        updating={content.install.updating}
        removing={content.install.removing}
        version={release.version}
        sha256={release.sha256}
      />
    </>
  );
}
