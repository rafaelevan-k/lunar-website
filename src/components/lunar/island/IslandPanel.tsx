"use client";

import {
  ChevronLeft,
  ChevronRight,
  FileInput,
  Gauge,
  Music,
  SlidersHorizontal,
  StickyNote,
  Timer,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { islandSpring } from "@/lib/motion";
import { notchPath, PANEL_RADIUS, SIZES, type IslandStyle } from "./geometry";
import { IslandScaler } from "./IslandScaler";
import {
  ConverterPage,
  MediaPage,
  NotesPage,
  PAGE_IDS,
  PomodoroPage,
  SystemPage,
  UsagePage,
  type PageId,
} from "./pages";

/*
 * The open island, as in the app (Navigation/SwiperView.xaml, ADR-0027):
 * - Pill: a 380×320 panel with radius 24, round arrows at the sides and page dots at the bottom.
 * - Notch: a 680×310 panel hanging from the top edge, with the pages as tabs along its top.
 * The tabs are a real tablist (arrow keys, Home, End); the pages are pictures with a text summary.
 */

const TAB_ICONS: Record<PageId, ReactNode> = {
  system: <SlidersHorizontal />,
  media: <Music />,
  pomodoro: <Timer />,
  converter: <FileInput />,
  notes: <StickyNote />,
  usage: <Gauge />,
};

function PageContent({ id, wide }: { id: PageId; wide: boolean }) {
  switch (id) {
    case "system":
      return <SystemPage wide={wide} />;
    case "media":
      return <MediaPage />;
    case "pomodoro":
      return <PomodoroPage />;
    case "converter":
      return <ConverterPage />;
    case "notes":
      return <NotesPage />;
    case "usage":
      return <UsagePage />;
  }
}

export function IslandPanel({ islandStyle }: { islandStyle: IslandStyle }) {
  const t = useTranslations("Island");
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { width, height } = SIZES[islandStyle].expanded;
  const notch = islandStyle === "notch";
  const last = PAGE_IDS.length - 1;

  // Pages sit side by side in a strip that slides, like the app's swiper.
  const viewportWidth = notch ? width - 16 : width;

  const go = (next: number, focus = false) => {
    const clamped = Math.max(0, Math.min(last, next));
    setIndex(clamped);
    if (focus) tabs.current[clamped]?.focus();
  };

  const onTabKey = (event: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: last,
    };
    if (event.key in keys) {
      event.preventDefault();
      go(keys[event.key], true);
    }
  };

  const tabList = (
    <div
      role="tablist"
      aria-label={t("pagesLabel")}
      onKeyDown={onTabKey}
      className={cn("flex items-center justify-center", notch ? "gap-1" : "gap-0")}
    >
      {PAGE_IDS.map((id, i) => {
        const selected = i === index;
        const name = t(`pages.${id}.name`);
        return (
          <button
            key={id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${id}`}
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${id}`}
            aria-label={notch ? undefined : name}
            tabIndex={selected ? 0 : -1}
            onClick={() => go(i)}
            className={cn(
              "grid place-items-center",
              notch
                ? cn(
                    "h-[26px] rounded-[13px] px-2.5 text-xs [&_svg]:size-[13px]",
                    selected
                      ? "bg-lunar-surface text-lunar-text"
                      : "text-lunar-text-2 hover:text-lunar-text",
                  )
                : "size-[22px] rounded-full",
            )}
          >
            {notch ? (
              <span className="flex items-center gap-1.5">
                {TAB_ICONS[id]}
                <span className={selected ? "" : "sr-only"}>{name}</span>
              </span>
            ) : (
              <span
                className={cn(
                  "size-2 rounded-full",
                  selected ? "bg-lunar-accent" : "bg-lunar-text-disabled hover:bg-lunar-text-2",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  const arrow = (direction: -1 | 1) => {
    const disabled = direction < 0 ? index === 0 : index === last;
    return (
      <button
        type="button"
        onClick={() => go(index + direction)}
        disabled={disabled}
        aria-label={direction < 0 ? t("previous") : t("next")}
        className={cn(
          "absolute top-1/2 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-lunar-border bg-lunar-surface text-lunar-text hover:border-lunar-accent disabled:opacity-35 [&_svg]:size-4",
          direction < 0 ? "left-1" : "right-1",
        )}
      >
        {direction < 0 ? <ChevronLeft strokeWidth={2.4} /> : <ChevronRight strokeWidth={2.4} />}
      </button>
    );
  };

  return (
    <IslandScaler width={width} height={height}>
      <div
        className="lunar-island relative"
        style={{ width, height }}
        data-island-style={islandStyle}
      >
        {notch ? (
          <svg className="absolute inset-0" width={width} height={height} aria-hidden="true">
            <path d={notchPath(width, height)} fill="var(--lunar-bg)" />
          </svg>
        ) : (
          <div
            className="absolute inset-0 border border-lunar-border bg-lunar-bg"
            style={{ borderRadius: PANEL_RADIUS }}
          />
        )}

        <div
          className={cn("relative flex h-full flex-col", notch ? "px-2 pt-2.5 pb-4" : "pt-3 pb-2")}
        >
          {notch && <div className="mb-2">{tabList}</div>}

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <motion.div
              className="flex h-full"
              animate={{ x: -index * viewportWidth }}
              transition={islandSpring}
              drag="x"
              dragConstraints={{ left: -last * viewportWidth, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(index + 1);
                else if (info.offset.x > 60) go(index - 1);
              }}
            >
              {PAGE_IDS.map((id, i) => (
                <div
                  key={id}
                  role="tabpanel"
                  id={`${baseId}-panel-${id}`}
                  aria-labelledby={`${baseId}-tab-${id}`}
                  inert={i !== index}
                  className={cn("h-full shrink-0", notch ? "px-6" : "px-[38px]")}
                  style={{ width: viewportWidth }}
                >
                  <p className="sr-only">{t(`pages.${id}.summary`)}</p>
                  <div aria-hidden="true" className="h-full select-none">
                    <PageContent id={id} wide={notch} />
                  </div>
                </div>
              ))}
            </motion.div>
            {!notch && arrow(-1)}
            {!notch && arrow(1)}
          </div>

          {!notch && <div className="mt-1">{tabList}</div>}
        </div>

        <p className="sr-only" aria-live="polite">
          {t("pageOf", {
            name: t(`pages.${PAGE_IDS[index]}.name`),
            n: index + 1,
            total: PAGE_IDS.length,
          })}
        </p>
      </div>
    </IslandScaler>
  );
}
