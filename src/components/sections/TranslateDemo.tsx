"use client";

import { Languages } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/*
 * "Translate your screen in place": a sample window whose text is shown in another language right
 * over the original, as Lunar draws it. The button or a real Ctrl+Alt+T (while the section is on
 * screen) translates; the language switch picks Indonesian or Japanese. The translations here are
 * fixed sample text, not a live service.
 */

type Target = "id" | "ja";
const SAMPLE: Record<"en" | Target, { title: string; body: string }> = {
  en: {
    title: "Reminder",
    body: "Your meeting starts in 5 minutes. Join from the link in the invite.",
  },
  id: {
    title: "Pengingat",
    body: "Rapat Anda dimulai dalam 5 menit. Bergabunglah lewat tautan di undangan.",
  },
  ja: {
    title: "リマインダー",
    body: "会議は5分後に始まります。招待状のリンクから参加してください。",
  },
};
const TARGET_NAMES: Record<Target, string> = { id: "Bahasa Indonesia", ja: "日本語" };

export function TranslateDemo({ title, lead }: { title: string; lead: string }) {
  const t = useTranslations("Sections.translate");
  const section = useRef<HTMLElement>(null);
  const [target, setTarget] = useState<Target>("id");
  const [translated, setTranslated] = useState(false);
  const name = useId();

  // The real shortcut works here too, but only while this section is on screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let visible = false;
    const observer = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    observer.observe(el);
    const onKey = (e: KeyboardEvent) => {
      if (visible && e.ctrlKey && e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        setTranslated((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const shown = translated ? SAMPLE[target] : SAMPLE.en;

  return (
    <section
      ref={section}
      aria-labelledby="translate-demo"
      className="mx-auto w-full max-w-6xl px-4 py-24"
    >
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <h2 id="translate-demo" className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-lunar-text-2">{lead}</p>

          <fieldset className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <legend className="sr-only">{t("to")}</legend>
            <span aria-hidden="true" className="w-24 shrink-0 text-sm text-lunar-text-2">
              {t("to")}
            </span>
            <div className="flex rounded-full border border-lunar-border p-1">
              {(["id", "ja"] as const).map((l) => (
                <label
                  key={l}
                  lang={l}
                  className="relative grid min-h-9 cursor-pointer place-items-center rounded-full px-4 text-sm text-lunar-text-2 has-checked:bg-(--toggle-on-bg) has-checked:text-(--toggle-on-text) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-lunar-focus"
                >
                  <input
                    type="radio"
                    name={name}
                    value={l}
                    checked={target === l}
                    onChange={() => setTarget(l)}
                    className="sr-only"
                  />
                  {TARGET_NAMES[l]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              aria-pressed={translated}
              onClick={() => setTranslated((v) => !v)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-lunar-accent px-5 font-medium text-lunar-on-accent"
            >
              <Languages className="size-4" aria-hidden="true" />
              {translated ? t("original") : t("button")}
            </button>
            <span className="text-sm text-lunar-text-2">{t("shortcut")}</span>
          </div>
          <p className="mt-6 max-w-md text-sm text-lunar-text-2">{t("note")}</p>
        </div>

        {/* A sample notification window on the sample desktop. */}
        <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-[28px] bg-(image:--sample-wallpaper) p-6">
          <div className="lunar-island w-full max-w-md rounded-2xl border border-lunar-border bg-lunar-bg/90 p-6 shadow-2xl">
            <div
              aria-live="polite"
              lang={translated ? target : "en"}
              className="relative min-h-28"
              data-translated={translated ? target : "original"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={translated ? target : "en"}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.22 }}
                  className={cn(translated && "-m-2 rounded-lg bg-lunar-surface/90 p-2")}
                >
                  <p className="text-lg font-semibold text-lunar-text">{shown.title}</p>
                  <p className="mt-2 text-lunar-text-2">{shown.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
