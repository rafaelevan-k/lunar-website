import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/pages/PageIntro";
import { getContent } from "@/content";
import { LUNAR_REPO_URL } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Pages.privacy");
  return pageMetadata({ path: "/privacy", locale, title: t("title"), description: t("lead") });
}

export default async function PrivacyPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Pages.privacy");
  const p = getContent(locale).privacy;
  const fullNotice = `${LUNAR_REPO_URL}/blob/main/docs/PRIVACY.md`;

  return (
    <>
      <PageIntro title={t("title")} lead={t("lead")}>
        <p className="mt-6 max-w-2xl text-lg">{p.summary}</p>
      </PageIntro>

      <section aria-labelledby="leaves" className="mx-auto w-full max-w-6xl px-4 pb-20">
        <h2 id="leaves" className="text-3xl font-bold tracking-tight">
          {t("tableTitle")}
        </h2>
        {/* A real table on wide screens; each row becomes a card on phones. */}
        <div className="mt-8 overflow-hidden rounded-[24px] border border-lunar-border">
          <table className="w-full border-collapse text-left">
            <thead className="hidden bg-lunar-surface text-sm text-lunar-text-2 md:table-header-group">
              <tr>
                <th scope="col" className="w-[16%] p-4 font-semibold">
                  <span className="sr-only">{t("tableTitle")}</span>
                </th>
                <th scope="col" className="p-4 font-semibold">
                  {t("what")}
                </th>
                <th scope="col" className="p-4 font-semibold">
                  {t("when")}
                </th>
                <th scope="col" className="p-4 font-semibold">
                  {t("where")}
                </th>
                <th scope="col" className="p-4 font-semibold">
                  {t("off")}
                </th>
              </tr>
            </thead>
            <tbody>
              {p.table.map((row) => (
                <tr
                  key={row.name}
                  className="block border-t border-lunar-border p-4 align-top first:border-t-0 md:table-row md:p-0 md:first:border-t"
                >
                  <th
                    scope="row"
                    className="block pb-2 text-left font-semibold md:table-cell md:p-4"
                  >
                    {row.name}
                  </th>
                  {(
                    [
                      ["what", row.what],
                      ["when", row.when],
                      ["where", row.where],
                      ["off", row.off],
                    ] as const
                  ).map(([key, value]) => (
                    <td key={key} className="block py-1 text-lunar-text-2 md:table-cell md:p-4">
                      <span className="block text-xs font-semibold text-lunar-text md:hidden">
                        {t(key)}
                      </span>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="on-your-pc" className="mx-auto w-full max-w-6xl px-4 pb-20">
        <h2 id="on-your-pc" className="text-3xl font-bold tracking-tight">
          {t("onYourPc")}
        </h2>
        <div className="mt-6 grid gap-6 text-lunar-text-2 md:grid-cols-2">
          <p>{p.never}</p>
          <p>{p.logs}</p>
          <p>{p.notes}</p>
          <p>{p.recordings}</p>
          <p>{p.uninstall}</p>
        </div>
      </section>

      <section aria-labelledby="this-site" className="mx-auto w-full max-w-6xl px-4 pb-24">
        <h2 id="this-site" className="text-3xl font-bold tracking-tight">
          {t("thisSite")}
        </h2>
        <p className="mt-4 max-w-2xl text-lunar-text-2">{p.thisSite}</p>
        <a
          href={fullNotice}
          className="mt-8 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-lunar-border px-5 font-medium hover:bg-lunar-surface"
        >
          {t("full")}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </section>
    </>
  );
}
