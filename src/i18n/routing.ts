import { defineRouting } from "next-intl/routing";

/*
 * English and Bahasa Indonesia, the two languages of the Lunar app. Every page lives under its
 * locale (/en, /id). There is no proxy: the site never guesses a language from the browser, and
 * "/" is a plain redirect to /en in next.config.ts.
 */
export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
