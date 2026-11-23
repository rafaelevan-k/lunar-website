import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { LunarPill } from "@/components/lunar/LunarPill";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { DEFAULT_MOTION, DEFAULT_THEME, PREFERENCE_SCRIPT } from "@/lib/preferences";
import en from "../../messages/en.json";
import id from "../../messages/id.json";
import "./globals.css";

/*
 * The 404 for any URL the site doesn't have. It sits outside [locale], so it can't know the
 * visitor's language: it says the same thing in English and in Indonesian, each with its own link.
 */

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${en.Pages.notFound.title} — Lunar`,
  description: en.Pages.notFound.body,
};

const LANGUAGES = [
  { lang: "en", home: "/en", text: en.Pages.notFound },
  { lang: "id", home: "/id", text: id.Pages.notFound },
] as const;

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      data-motion={DEFAULT_MOTION}
      className={`${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: PREFERENCE_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <ReducedMotionProvider>
          <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-20">
            {/* Lunar looks around for the page that isn't there. */}
            <LunarPill label={null} className="w-48 sm:w-56" eyes={{ gaze: "wander" }} />
            <p
              aria-hidden="true"
              className="mt-10 font-display text-[clamp(5rem,22vw,10rem)] leading-none font-bold tracking-tight [font-stretch:84%]"
            >
              404
            </p>
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              {LANGUAGES.map(({ lang, home, text }, i) => (
                <section key={lang} lang={lang}>
                  {i === 0 ? (
                    <h1 className="text-2xl font-bold tracking-tight">{text.title}</h1>
                  ) : (
                    <h2 className="text-2xl font-bold tracking-tight">{text.title}</h2>
                  )}
                  <p className="mt-3 text-lunar-text-2">{text.body}</p>
                  {/* A plain link: the page outside the app router needs a full load anyway. */}
                  <a
                    href={home}
                    className="mt-6 inline-flex min-h-11 items-center rounded-full bg-lunar-accent px-5 font-medium text-lunar-on-accent transition-[filter] hover:brightness-110"
                  >
                    {text.home}
                  </a>
                </section>
              ))}
            </div>
          </main>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
