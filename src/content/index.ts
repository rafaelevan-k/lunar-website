import type { Locale } from "@/i18n/routing";
import { en } from "./en";
import { id } from "./id";
import type { SiteContent } from "./types";

export { CONTENT_VERSION } from "./types";
export type { SiteContent } from "./types";

const CONTENT: Record<Locale, SiteContent> = { en, id };

/** The long-form copy about Lunar in one language. */
export function getContent(locale: Locale): SiteContent {
  return CONTENT[locale];
}
