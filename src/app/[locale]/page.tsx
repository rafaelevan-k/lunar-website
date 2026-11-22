import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { LunarPill } from "@/components/lunar/LunarPill";
import { LATEST_RELEASE_URL } from "@/content/site";
import { alternatesFor } from "@/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternatesFor("/", await getLocale()) };
}

// Starter page. The real home page is built in WEB-09 to WEB-12.
export default async function Home() {
  const t = await getTranslations("Home");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <LunarPill label={t("pillLabel")} className="w-64 sm:w-80" />
      <h1 className="max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight font-stretch-[88%] sm:text-7xl">
        {t("title")}
      </h1>
      <p className="max-w-xl text-lg text-lunar-text-2">{t("lead")}</p>
      <a
        href={LATEST_RELEASE_URL}
        className="flex min-h-12 items-center rounded-full bg-lunar-accent px-6 font-medium text-lunar-on-accent"
      >
        {t("download")}
      </a>
    </div>
  );
}
