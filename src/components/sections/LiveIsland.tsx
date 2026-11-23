"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { CollapsedIsland } from "@/components/lunar/island/CollapsedIsland";
import type { Activity, IslandStyle } from "@/components/lunar/island/geometry";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cn } from "@/lib/cn";

/*
 * The closed island on a sample desktop, showing what is going on: music, a recording, a focus
 * session, the smile when focus is over. Pick an activity and a style (Pill or Notch); while the
 * visitor hasn't picked, it plays through them by itself when on screen (not with reduced motion).
 */

type Moment = "music" | "recording" | "focus" | "done";
const MOMENTS: Moment[] = ["music", "recording", "focus", "done"];
const ACTIVITY: Record<Moment, Activity> = {
  music: "media",
  recording: "recording",
  focus: "focus",
  done: "eyes",
};
const STEP_MS = 3200;

function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    // Label above the choices: four activities don't fit beside a label in this column.
    <fieldset className="flex flex-col items-start gap-2">
      <legend className="sr-only">{legend}</legend>
      <span aria-hidden="true" className="text-sm text-lunar-text-2">
        {legend}
      </span>
      <div className="flex flex-wrap rounded-[22px] border border-lunar-border p-1">
        {options.map((o) => (
          <label
            key={o.value}
            className="relative grid min-h-9 cursor-pointer place-items-center rounded-full px-4 text-sm text-lunar-text-2 has-checked:bg-(--toggle-on-bg) has-checked:text-(--toggle-on-text) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-lunar-focus"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              // A click on the option already shown still counts as a choice (it stops autoplay).
              onClick={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LiveIsland() {
  const t = useTranslations("Sections.live");
  const island = useTranslations("Island");
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const [moment, setMoment] = useState<Moment>("music");
  const [style, setStyle] = useState<IslandStyle>("pill");
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playing = auto && visible && !reduced;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setMoment((m) => MOMENTS[(MOMENTS.indexOf(m) + 1) % MOMENTS.length]),
      STEP_MS,
    );
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <section aria-labelledby="live-island" className="mx-auto w-full max-w-6xl px-4 py-24">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <h2 id="live-island" className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-lunar-text-2">{t("lead")}</p>
          <div className="mt-8 flex flex-col gap-5">
            <Segmented
              legend={t("activity")}
              value={moment}
              onChange={(m) => {
                setAuto(false);
                setMoment(m);
              }}
              options={MOMENTS.map((m) => ({ value: m, label: t(m) }))}
            />
            <Segmented
              legend={t("style")}
              value={style}
              onChange={(s) => {
                setAuto(false);
                setStyle(s);
              }}
              options={[
                { value: "pill", label: island("pill") },
                { value: "notch", label: island("notch") },
              ]}
            />
          </div>
          <p className="mt-4 min-h-5 text-sm text-lunar-text-2" aria-live="polite">
            {playing ? t("autoplay") : ""}
          </p>
        </div>

        <div
          ref={stage}
          data-live-island={`${style}-${moment}`}
          className={cn(
            "relative flex aspect-[16/9] justify-center overflow-hidden rounded-[28px] bg-(image:--sample-wallpaper)",
            style === "pill" ? "pt-4" : "pt-0",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${style}-${moment}`}
              initial={{ opacity: 0, scale: 0.85, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              style={{ originY: 0 }}
            >
              <CollapsedIsland
                islandStyle={style}
                activity={ACTIVITY[moment]}
                smile={moment === "done"}
                className="origin-top scale-125 sm:scale-150"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
