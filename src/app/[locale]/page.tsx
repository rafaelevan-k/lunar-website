import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { StarterHero } from "@/components/sections/StarterHero";
import { LATEST_RELEASE_URL } from "@/content/site";
import { alternatesFor } from "@/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternatesFor("/", await getLocale()) };
}

// Starter page. The real home page is built in WEB-09 to WEB-12.
export default async function Home() {
  const t = await getTranslations("Home");
  return (
    <StarterHero
      title={t("title")}
      lead={t("lead")}
      download={t("download")}
      downloadHref={LATEST_RELEASE_URL}
      pillAction={t("pillAction")}
    />
  );
}
