"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Switches language and stays on the same page. "compact" is a single link to the other
 * language (header); "list" shows both languages with the current one marked (footer, menu).
 */
export function LocaleSwitcher({
  variant,
  className,
}: {
  variant: "compact" | "list";
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Language");

  if (variant === "compact") {
    const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
    return (
      <Link
        href={pathname}
        locale={other}
        hrefLang={other}
        lang={other}
        className={cn(
          "grid h-11 min-w-11 place-items-center rounded-full px-2 text-sm font-medium text-lunar-text-2 transition-colors hover:bg-lunar-surface hover:text-lunar-text",
          className,
        )}
      >
        {/* The spoken name starts with the visible code, then says the language in full. */}
        <span>
          {other.toUpperCase()}
          <span className="sr-only"> {t(other)}</span>
        </span>
      </Link>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      <span className="w-16 text-sm text-lunar-text-2">{t("label")}</span>
      <ul className="flex rounded-full border border-lunar-border p-1">
        {routing.locales.map((l) => {
          const current = l === locale;
          return (
            <li key={l}>
              <Link
                href={pathname}
                locale={l}
                hrefLang={l}
                lang={l}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "grid min-h-9 place-items-center rounded-full px-3.5 text-sm transition-colors",
                  current
                    ? "bg-(--toggle-on-bg) text-(--toggle-on-text)"
                    : "text-lunar-text-2 hover:text-lunar-text",
                )}
              >
                {t(l)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
