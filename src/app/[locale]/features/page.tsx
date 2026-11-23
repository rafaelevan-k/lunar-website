import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CollapsedIsland } from "@/components/lunar/island/CollapsedIsland";
import { FeaturePanel } from "@/components/pages/FeaturePanel";
import { PageIntro } from "@/components/pages/PageIntro";
import { SectionNav } from "@/components/pages/SectionNav";
import { getContent } from "@/content";
import type { LimitId, PageItem, WhyId } from "@/content/types";
import { alternatesFor } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.features");
  return {
    title: `${t("title")} — Lunar`,
    description: t("lead"),
    alternates: alternatesFor("/features", await getLocale()),
  };
}

/** Which limits belong next to which page or feature. */
const PAGE_LIMITS: Partial<Record<PageItem["id"], LimitId[]>> = {
  system: ["windowsSwitches"],
  pomodoro: ["dnd"],
  converter: ["wordToPdf"],
  usage: ["usageAddress"],
};
const MORE: { id: string; why: WhyId; limits: LimitId[] }[] = [
  { id: "style", why: "style", limits: [] },
  { id: "translate", why: "translate", limits: ["translateKey"] },
  { id: "updates", why: "updates", limits: [] },
  { id: "everyone", why: "everyone", limits: [] },
];

export default async function FeaturesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Pages.features");
  const content = getContent(locale);
  const limit = (id: LimitId) => content.limits.find((l) => l.id === id)!;
  const why = (id: WhyId) => content.why.find((w) => w.id === id)!;

  const nav = [
    ...content.pages.map((p) => ({ id: `feature-${p.id}`, name: p.name })),
    ...MORE.map((m) => ({ id: `feature-${m.id}`, name: t(`more.${m.id}` as "more.style") })),
  ];

  const Notes = ({ ids }: { ids: LimitId[] }) =>
    ids.length ? (
      <div className="mt-6 border-l-2 border-lunar-border pl-4">
        <p className="text-sm font-semibold">{t("needs")}</p>
        {ids.map((id) => (
          <p key={id} className="mt-1 text-sm text-lunar-text-2">
            {limit(id).body}
          </p>
        ))}
      </div>
    ) : null;

  return (
    <>
      <PageIntro title={t("title")} lead={t("lead")} />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 pb-24 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <SectionNav label={t("onThisPage")} items={nav} />
        </aside>
        <div className="flex flex-col gap-24">
          {content.pages.map((page) => (
            <section
              key={page.id}
              id={`feature-${page.id}`}
              aria-labelledby={`feature-${page.id}-title`}
              className="grid scroll-mt-28 items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            >
              <div>
                <h2 id={`feature-${page.id}-title`} className="text-3xl font-bold tracking-tight">
                  {page.name}
                </h2>
                <p className="mt-3 text-lunar-text-2">{page.body}</p>
                <Notes ids={PAGE_LIMITS[page.id] ?? []} />
              </div>
              <FeaturePanel page={page.id} />
            </section>
          ))}

          {MORE.map((m) => (
            <section
              key={m.id}
              id={`feature-${m.id}`}
              aria-labelledby={`feature-${m.id}-title`}
              className="grid scroll-mt-28 items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            >
              <div>
                <h2 id={`feature-${m.id}-title`} className="text-3xl font-bold tracking-tight">
                  {why(m.why).title}
                </h2>
                <p className="mt-3 text-lunar-text-2">{why(m.why).body}</p>
                <Notes ids={m.limits} />
              </div>
              {m.id === "style" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {(["pill", "notch"] as const).map((style) => (
                    <div
                      key={style}
                      className="flex justify-center overflow-hidden rounded-[24px] bg-(image:--sample-wallpaper) pb-14"
                    >
                      <div className={style === "pill" ? "pt-4" : ""}>
                        <CollapsedIsland islandStyle={style} activity="eyes" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div aria-hidden="true" className="hidden md:block" />
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
