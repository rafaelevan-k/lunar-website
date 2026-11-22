"use client";

import {
  ArrowLeftRight,
  Bluetooth,
  FilePlus2,
  Languages,
  Minus,
  Music,
  Pause,
  Plus,
  SkipBack,
  SkipForward,
  Sun,
  Volume2,
  Wifi,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { PixelEgg } from "./activity";
import { Card, IconButton, IconTile, Slider, StatusChip, Switch } from "./parts";

/*
 * The six pages of the open island, redrawn from src/Lunar.Desktop/Features/*Page.xaml with sample
 * content. Pictures only: the panel around them handles the keyboard and screen readers.
 */

export const PAGE_IDS = ["system", "media", "pomodoro", "converter", "notes", "usage"] as const;
export type PageId = (typeof PAGE_IDS)[number];

/** The live clock and date of the System page, in the visitor's language. */
function Clock() {
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const time = now?.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) ?? "09:41";
  const date =
    now?.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" }) ?? "";
  return (
    <span className="flex min-w-0 items-baseline gap-2.5">
      <span className="font-display text-xl font-semibold text-lunar-accent">{time}</span>
      <span className="truncate text-sm text-lunar-text-2">{date}</span>
    </span>
  );
}

export function SystemPage({ wide }: { wide: boolean }) {
  const t = useTranslations("Island.system");
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between pl-0.5">
        <Clock />
        <IconButton>
          <Languages />
        </IconButton>
      </div>
      <div className={cn("grid gap-1.5", wide && "grid-cols-[1.2fr_1fr_1fr] items-start")}>
        <Card>
          <div className="flex items-center gap-2">
            <IconButton size={32} primary>
              <Volume2 />
            </IconButton>
            <Slider value={62} />
            <span className="w-11 text-right text-sm">62</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid w-8 place-items-center text-lunar-text-2 [&_svg]:size-4">
              <Sun />
            </span>
            <Slider value={80} />
            <span className="w-11 text-right text-sm">80</span>
          </div>
        </Card>
        <div className={cn("grid gap-1.5", wide ? "contents" : "grid-cols-2")}>
          <RadioCard icon={<Wifi />} title={t("wifi")} status={t("connected")} ok />
          <RadioCard icon={<Bluetooth />} title={t("bluetooth")} status={t("onNotConnected")} />
        </div>
      </div>
    </div>
  );
}

function RadioCard({
  icon,
  title,
  status,
  ok = false,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  ok?: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <IconTile>{icon}</IconTile>
        <Switch on />
      </div>
      <p className="mt-1 text-sm font-semibold">{title}</p>
      <div className="mt-1">
        <StatusChip ok={ok}>{status}</StatusChip>
      </div>
    </Card>
  );
}

export function MediaPage() {
  const t = useTranslations("Island.media");
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-1">
      <div className="flex items-center gap-3">
        <span className="grid size-[72px] shrink-0 place-items-center rounded-[18px] bg-(image:--sample-artwork) text-lunar-text [&_svg]:size-7">
          <Music />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold">{t("title")}</span>
          <span className="block truncate text-sm text-lunar-text-2">{t("artist")}</span>
          <span className="block truncate text-xs text-lunar-text-2">
            {t("sourceLine", { source: t("source"), status: t("playing") })}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-lunar-text-2">
        <span className="w-9">1:24</span>
        <span className="relative h-1 flex-1 rounded-full bg-lunar-text-disabled/55">
          <span className="absolute inset-y-0 left-0 w-[37%] rounded-full bg-lunar-accent" />
        </span>
        <span className="w-9 text-right">3:52</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <IconButton>
          <SkipBack />
        </IconButton>
        <IconButton size={36} primary>
          <Pause />
        </IconButton>
        <IconButton>
          <SkipForward />
        </IconButton>
        <IconButton>
          <ArrowLeftRight />
        </IconButton>
      </div>
    </div>
  );
}

export function PomodoroPage() {
  const t = useTranslations("Island.pomodoro");
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <PixelEgg />
      <div className="flex gap-1.5">
        {[15, 25, 45, 60].map((m) => (
          <span
            key={m}
            className={cn(
              "rounded-xl border px-2.5 py-0.5 text-sm",
              m === 25
                ? "border-lunar-accent bg-lunar-accent text-lunar-on-accent"
                : "border-lunar-border bg-lunar-surface",
            )}
          >
            {m}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <IconButton>
          <Minus />
        </IconButton>
        <span className="font-display text-[28px] font-semibold tabular-nums">25:00</span>
        <IconButton>
          <Plus />
        </IconButton>
      </div>
      <span className="rounded-full bg-lunar-accent px-6 py-1 text-sm font-medium text-lunar-on-accent">
        {t("start")}
      </span>
      <p className="max-w-[18rem] text-center text-xs text-lunar-text-2">{t("hint")}</p>
    </div>
  );
}

export function ConverterPage() {
  const t = useTranslations("Island.converter");
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-lunar-border px-4 py-6 text-center">
        <span className="text-lunar-text-2 [&_svg]:size-7">
          <FilePlus2 />
        </span>
        <span className="font-semibold">{t("drop")}</span>
        <span className="rounded-full bg-lunar-accent px-4 py-1 text-sm font-medium text-lunar-on-accent">
          {t("add")}
        </span>
      </div>
      <p className="text-center text-xs text-lunar-text-2">{t("hint")}</p>
    </div>
  );
}

export function NotesPage() {
  const t = useTranslations("Island.notes");
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex rounded-full border border-lunar-border p-0.5 text-sm">
          <span className="rounded-full bg-lunar-surface px-3">{t("notesTab")}</span>
          <span className="px-3 text-lunar-text-2">{t("recordsTab")}</span>
        </span>
        <span className="rounded-full bg-lunar-accent px-3 py-0.5 text-sm font-medium text-lunar-on-accent">
          {t("newNote")}
        </span>
      </div>
      <Card className="px-3 py-2">
        <p className="truncate text-sm">{t("noteOne")}</p>
        <p className="text-xs text-lunar-text-2">{t("today")}</p>
      </Card>
      <Card className="px-3 py-2">
        <p className="truncate text-sm">{t("noteTwo")}</p>
        <p className="text-xs text-lunar-text-2">{t("yesterday")}</p>
      </Card>
      <p className="text-xs text-lunar-text-2">{t("count")}</p>
    </div>
  );
}

/** The Usage page keeps its own light card colours in the app (Themes/Colors.Usage.xaml). */
export function UsagePage() {
  const t = useTranslations("Island.usage");
  const limit = (title: string, percent: number, reset: string) => (
    <div className="rounded-[13px] border border-(--usage-ink) bg-(--usage-card) px-3 py-2 text-(--usage-ink)">
      <div className="flex justify-between text-sm font-semibold">
        <span>{title}</span>
        <span>{t("percent", { n: percent })}</span>
      </div>
      <span className="mt-1 block h-2 rounded bg-(--usage-track)">
        <span className="block h-full rounded bg-(--usage-fill)" style={{ width: `${percent}%` }} />
      </span>
      <p className="mt-0.5 text-xs text-(--usage-muted)">{reset}</p>
    </div>
  );
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      <div className="flex items-center justify-between rounded-[13px] border border-(--usage-ink) bg-(--usage-card) px-2.5 py-1 text-sm font-semibold text-(--usage-ink)">
        <span>Claude</span>
        <span className="rounded-[13px] border border-(--usage-ink) bg-(--usage-fill) px-2.5 text-xs">
          {t("refresh")}
        </span>
      </div>
      {limit(t("fiveHour"), 42, t("resetFive"))}
      {limit(t("weekly"), 18, t("resetWeek"))}
    </div>
  );
}
