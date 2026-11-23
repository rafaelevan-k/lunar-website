import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LUNAR_REPO_URL } from "@/content/site";
import { Accordion } from "@/components/ui/Accordion";

/*
 * The calm end of the page: limits, open source and questions. Server-rendered, no JavaScript;
 * the accordions are <details> elements.
 */

export async function GoodToKnow({ items }: { items: { title: string; body: string }[] }) {
  const t = await getTranslations("Sections.limits");
  return (
    <section aria-labelledby="good-to-know" className="mx-auto w-full max-w-4xl px-4 py-24">
      <h2 id="good-to-know" className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h2>
      <div className="mt-10">
        <Accordion items={items} />
      </div>
    </section>
  );
}

export async function OpenSource({ body, stack }: { body: string; stack: string }) {
  const t = await getTranslations("Sections.open");
  return (
    <section aria-labelledby="open-source" className="mx-auto w-full max-w-4xl px-4 py-24">
      <h2 id="open-source" className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-lunar-text-2">{body}</p>
      <p className="mt-2 max-w-2xl text-lunar-text-2">{stack}</p>
      <a
        rel="noopener noreferrer"
        href={LUNAR_REPO_URL}
        className="mt-8 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-lunar-border px-5 font-medium hover:bg-lunar-surface"
      >
        {t("cta")}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}

export async function Faq({ items }: { items: { question: string; answer: string }[] }) {
  const t = await getTranslations("Sections.faq");
  return (
    <section aria-labelledby="faq" className="mx-auto w-full max-w-4xl px-4 py-24">
      <h2 id="faq" className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h2>
      <div className="mt-10">
        <Accordion items={items.map((i) => ({ title: i.question, body: i.answer }))} />
      </div>
    </section>
  );
}
