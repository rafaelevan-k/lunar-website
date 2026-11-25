import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Bricolage_Grotesque } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SITE_URL } from "@/i18n/alternates";
import { routing } from "@/i18n/routing";
import { DEFAULT_MOTION, DEFAULT_THEME, PREFERENCE_SCRIPT } from "@/lib/preferences";
import "../globals.css";

// Headings only. Body text uses Segoe UI Variable, the font of the Lunar app itself, which Windows
// already has. next/font downloads Bricolage at build time and serves it from this site.
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

// Every page is prerendered for each language at build time.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("Common");

  return (
    <html
      lang={locale}
      data-theme={DEFAULT_THEME}
      data-motion={DEFAULT_MOTION}
      className={`${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Extensions sometimes change scripts in <head>; the theme script is fixed text, so ignore that. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: PREFERENCE_SCRIPT }} />
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body>; don't treat that as a mismatch. */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-lunar-accent px-5 py-3 font-medium text-lunar-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <ReducedMotionProvider>
            <SmoothScroll>
              <SiteHeader />
              <main id="main" tabIndex={-1} className="flex flex-1 flex-col pt-24 outline-none">
                {children}
              </main>
              <SiteFooter />
            </SmoothScroll>
          </ReducedMotionProvider>
        </NextIntlClientProvider>
        {/* Vercel Web Analytics: cookieless page-view counts, served from this site (/_vercel/insights).
            The privacy page tells visitors about it. */}
        <Analytics />
      </body>
    </html>
  );
}
