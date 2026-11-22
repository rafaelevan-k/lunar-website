/*
 * The shape of the site's long-form content (one object per language in en.ts and id.ts).
 * Short UI labels live in messages/*.json; this is the copy about Lunar itself.
 *
 * Every claim carries a `source`: where it is written in rafaelevan-k/lunar for version
 * CONTENT_VERSION. Sources are for review only and are never shown on the page.
 */

/** The Lunar release this content describes. Update it, and every source, together. */
export const CONTENT_VERSION = "1.1.1";

export type Source = string;

export type Item = { title: string; body: string; source: Source };

export type PageItem = {
  id: "system" | "media" | "pomodoro" | "converter" | "notes" | "usage";
  name: string;
  body: string;
  source: Source;
};

export type ReleaseNote = {
  version: string;
  /** ISO date the release was published on GitHub. */
  date: string;
  items: string[];
  source: Source;
};

export type SiteContent = {
  hero: {
    title: string;
    lead: string;
    /** Short facts shown near the download button. */
    facts: string[];
    source: Source;
  };
  why: Item[];
  pages: PageItem[];
  whatsNew: { version: string; items: Item[] };
  privacy: {
    summary: string;
    waysTitle: string;
    ways: Item[];
    never: string;
    recordings: string;
    thisSite: string;
    source: Source;
  };
  install: {
    steps: string[];
    smartScreen: string;
    verify: string;
    verifyCommand: string;
    updating: string;
    removing: string;
    requirements: string;
    source: Source;
  };
  limits: Item[];
  openSource: { body: string; stack: string; source: Source };
  faq: { question: string; answer: string; source: Source }[];
  changelog: ReleaseNote[];
};
