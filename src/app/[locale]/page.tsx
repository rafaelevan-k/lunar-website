import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Install } from "@/components/sections/Install";
import { Lightweight } from "@/components/sections/Lightweight";
import { LiveIsland } from "@/components/sections/LiveIsland";
import { MeetTheIsland } from "@/components/sections/MeetTheIsland";
import { PrivacyMap } from "@/components/sections/PrivacyMap";
import { Faq, GoodToKnow, OpenSource } from "@/components/sections/QuietSections";
import { ScreenShare } from "@/components/sections/ScreenShare";
import { TranslateDemo } from "@/components/sections/TranslateDemo";
import { WhatsNew } from "@/components/sections/WhatsNew";
import { WhyLunar } from "@/components/sections/WhyLunar";
import { getContent } from "@/content";
import { alternatesFor } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";
import { DOWNLOAD_URL, formatReleaseDate, formatSize, getRelease } from "@/lib/release";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternatesFor("/", await getLocale()) };
}

// The home page, in the order of PRD §7.1.
export default async function Home() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home");
  const d = await getTranslations("Download");
  const s = await getTranslations("Sections");
  const island = await getTranslations("Island");
  const content = getContent(locale);
  const release = getRelease();
  const why = (id: string) => content.why.find((w) => w.id === id)!;

  const downloadText = {
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

  return (
    <>
      <Hero
        title={content.hero.title}
        lead={content.hero.lead}
        facts={content.hero.facts}
        downloadHref={DOWNLOAD_URL}
        downloadText={downloadText}
        pillAction={t("pillAction")}
      />
      <MeetTheIsland
        title={island("preview.title")}
        pages={content.pages.map(({ id, name, body }) => ({ id, name, body }))}
      />
      <LiveIsland />
      <WhyLunar items={content.why.map(({ id, title, body }) => ({ id, title, body }))} />
      <ScreenShare title={s("share.title")} lead={s("share.lead")} />
      <TranslateDemo title={s("translate.title")} lead={s("translate.lead")} />
      <Lightweight title={s("light.title")} body={why("light").body} />
      <WhatsNew
        version={content.whatsNew.version}
        items={content.whatsNew.items}
        releaseUrl={release.releaseUrl}
      />
      <PrivacyMap
        summary={content.privacy.summary}
        waysTitle={content.privacy.waysTitle}
        ways={content.privacy.ways}
        never={content.privacy.never}
        recordings={content.privacy.recordings}
        thisSite={content.privacy.thisSite}
      />
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
      <GoodToKnow items={content.limits} />
      <OpenSource body={content.openSource.body} stack={content.openSource.stack} />
      <Faq items={content.faq} />
      <FinalCta
        title={s("cta.title")}
        lead={s("cta.lead")}
        downloadHref={DOWNLOAD_URL}
        downloadText={downloadText}
        pillAction={t("pillAction")}
      />
    </>
  );
}
