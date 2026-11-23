import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/pages/PageIntro";
import { getContent } from "@/content";
import { LUNAR_REPO_URL } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { formatReleaseDate } from "@/lib/release";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Pages.changelog");
  return pageMetadata({ path: "/changelog", locale, title: t("title"), description: t("lead") });
}

/** Every public release, newest first, as a timeline (a real sequence, so it is an ordered list). */
export default async function ChangelogPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Pages.changelog");
  const releases = getContent(locale).changelog;

  return (
    <>
      <PageIntro title={t("title")} lead={t("lead")} />
      <ol className="mx-auto w-full max-w-4xl px-4 pb-24">
        {releases.map((release, i) => (
          <li
            key={release.version}
            className="relative grid gap-4 border-l border-lunar-border pb-14 pl-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-10 sm:pl-10"
          >
            {/* The dot on the timeline; the newest is filled. */}
            <span
              aria-hidden="true"
              className={
                i === 0
                  ? "absolute top-1.5 -left-[7px] size-3.5 rounded-full bg-lunar-text"
                  : "absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-lunar-border bg-lunar-bg"
              }
            />
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight">{release.version}</h2>
              <p className="mt-1 text-sm text-lunar-text-2">
                <time dateTime={release.date}>
                  {formatReleaseDate(`${release.date}T00:00:00Z`, locale)}
                </time>
              </p>
            </div>
            <div>
              <ul className="flex list-disc flex-col gap-2 pl-5 text-lunar-text-2 marker:text-lunar-border">
                {release.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                href={`${LUNAR_REPO_URL}/releases/tag/v${release.version}`}
                className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm text-lunar-text-2 underline underline-offset-4 hover:text-lunar-text"
              >
                {t("notes")}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
