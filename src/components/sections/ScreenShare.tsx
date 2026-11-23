"use client";

import { Mic, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { LunarPill } from "@/components/lunar/LunarPill";

/*
 * "Invisible in screen shares": the same desktop twice, split by a line the visitor drags (a real
 * range input underneath, so the keyboard and screen readers can use it). Left of the line is your
 * screen, with Lunar and its note; right of it is what the people in the meeting see: no Lunar.
 */

function Desktop({
  withLunar,
  label,
  children,
}: {
  withLunar: boolean;
  label: string;
  children?: ReactNode;
}) {
  const t = useTranslations("Sections.share");
  return (
    <div className="absolute inset-0 bg-(image:--sample-wallpaper)">
      {withLunar && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2">
          <LunarPill label={null} className="w-28 sm:w-36" eyes={{ blink: false }} />
        </div>
      )}
      {/* A meeting window, the same on both sides. */}
      <div className="lunar-island absolute inset-x-[8%] top-[24%] bottom-[10%] rounded-2xl border border-lunar-border bg-lunar-bg/90 p-3 sm:p-4">
        <div className="flex items-center justify-between text-xs text-lunar-text-2 sm:text-sm">
          <span>{t("meeting")}</span>
          <span className="flex gap-2 [&_svg]:size-4">
            <Mic />
            <Video />
          </span>
        </div>
        <div className="mt-3 grid h-[70%] grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-lunar-surface" />
          ))}
        </div>
      </div>
      {children}
      <span className="lunar-island absolute bottom-2 left-3 rounded-full bg-lunar-bg/70 px-2.5 py-0.5 text-xs text-lunar-text">
        {label}
      </span>
    </div>
  );
}

export function ScreenShare({ title, lead }: { title: string; lead: string }) {
  const t = useTranslations("Sections.share");
  const [split, setSplit] = useState(55);

  return (
    <section aria-labelledby="screen-share" className="mx-auto w-full max-w-6xl px-4 py-24">
      <h2 id="screen-share" className="text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-lunar-text-2">{lead}</p>

      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[28px] select-none sm:aspect-[16/7]">
        {/* What they see: everything except Lunar. */}
        <Desktop withLunar={false} label={t("theirs")} />
        {/* Your screen, cut at the line. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
          aria-hidden="true"
        >
          <Desktop withLunar label={t("yours")}>
            <div className="lunar-island absolute top-[30%] right-[10%] w-[34%] rounded-xl border border-lunar-border bg-lunar-surface p-2 text-xs text-lunar-text sm:p-3 sm:text-sm">
              {t("notes")}
            </div>
          </Desktop>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label={t("slider")}
          aria-valuetext={`${split}%`}
          className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          data-testid="share-slider"
        />
        {/* The line and its handle: drawn after the (invisible) range input so the handle can show
            the keyboard focus ring; the input does the work. */}
        <div
          aria-hidden="true"
          className="lunar-island pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-lunar-text/90 peer-focus-visible:[&>span]:outline-2 peer-focus-visible:[&>span]:outline-offset-2 peer-focus-visible:[&>span]:outline-lunar-focus"
          style={{ left: `${split}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-9 -translate-1/2 place-items-center rounded-full bg-lunar-text text-sm font-bold text-lunar-bg shadow-lg">
            ⇆
          </span>
        </div>
      </div>
    </section>
  );
}
