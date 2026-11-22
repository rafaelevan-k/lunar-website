"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { readResolvedTheme, setTheme, subscribePreferences } from "@/lib/preferences";

const getServerSnapshot = () => "dark" as const;

/** Flips between dark and light. "Follow system" lives in the footer's display settings. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribePreferences, readResolvedTheme, getServerSnapshot);
  const t = useTranslations("Theme");
  const next = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={next === "light" ? t("switchToLight") : t("switchToDark")}
      className={cn(
        "grid size-11 place-items-center rounded-full text-lunar-text-2 transition-colors hover:bg-lunar-surface hover:text-lunar-text",
        className,
      )}
    >
      <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
