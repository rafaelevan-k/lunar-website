import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

/** The newest release's changes, from the content, with a link to its notes on GitHub. */
export async function WhatsNew({
  version,
  items,
  releaseUrl,
}: {
  version: string;
  items: { title: string; body: string }[];
  releaseUrl: string;
}) {
  const t = await getTranslations("Sections.whatsNew");
  return (
    <section aria-labelledby="whats-new" className="mx-auto w-full max-w-6xl px-4 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="whats-new" className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title", { version })}
        </h2>
        <a
          rel="noopener noreferrer"
          href={releaseUrl}
          className="inline-flex min-h-11 items-center gap-1 text-lunar-text-2 underline underline-offset-4 hover:text-lunar-text"
        >
          {t("releaseNotes")}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <ul className="mt-10 grid gap-x-10 gap-y-8 border-t border-lunar-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title}>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-lunar-text-2">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
