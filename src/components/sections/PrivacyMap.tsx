"use client";

import { Laptop } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cn } from "@/lib/cn";

/*
 * "Your privacy": a small map of everything that can leave the PC. Three destinations, each a tab;
 * the chosen one's line lights up (with a slow flow, unless reduced motion) and its details show.
 * Below: what is never logged, the microphone, and this website itself.
 */

type Way = { title: string; body: string };

const ENDPOINTS = [
  { key: "github", when: "daily" },
  { key: "anthropic", when: "off" },
  { key: "azure", when: "onAsk" },
] as const;

export function PrivacyMap({
  summary,
  waysTitle,
  ways,
  never,
  recordings,
  thisSite,
}: {
  summary: string;
  waysTitle: string;
  ways: Way[];
  never: string;
  recordings: string;
  thisSite: string;
}) {
  const t = useTranslations("Sections.privacy");
  const reduced = useReducedMotion();
  const id = useId();
  const [active, setActive] = useState(0);
  const ys = [50, 150, 250];

  return (
    <section aria-labelledby="privacy" className="mx-auto w-full max-w-6xl px-4 py-24">
      <h2 id="privacy" className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-lunar-text-2">{summary}</p>

      <h3 className="mt-12 text-xl font-semibold">{waysTitle}</h3>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <div className="lunar-island row-span-3 grid size-28 place-items-center rounded-[24px] border border-lunar-border bg-lunar-bg text-center text-sm text-lunar-text sm:row-span-1 sm:size-32">
            <span className="grid justify-items-center gap-2">
              <Laptop className="size-7" aria-hidden="true" />
              {t("pc")}
            </span>
          </div>

          <svg
            viewBox="0 0 100 300"
            preserveAspectRatio="none"
            className="hidden h-72 w-full sm:block"
            aria-hidden="true"
          >
            {ys.map((y, i) => {
              const d = `M0 150 C 50 150, 50 ${y}, 100 ${y}`;
              const on = i === active;
              return (
                <g key={y}>
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--lunar-border)"
                    strokeWidth={on ? 0 : 1.5}
                    vectorEffect="non-scaling-stroke"
                  />
                  {on && (
                    <motion.path
                      d={d}
                      fill="none"
                      stroke="var(--lunar-text)"
                      strokeWidth={2.5}
                      strokeDasharray="6 8"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={reduced ? undefined : { strokeDashoffset: -28 }}
                      transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <div role="tablist" aria-label={t("map")} className="flex flex-col gap-3">
            {ENDPOINTS.map((e, i) => (
              <button
                key={e.key}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(ev) => {
                  const next =
                    ev.key === "ArrowDown" || ev.key === "ArrowRight"
                      ? (i + 1) % 3
                      : ev.key === "ArrowUp" || ev.key === "ArrowLeft"
                        ? (i + 2) % 3
                        : null;
                  if (next !== null) {
                    ev.preventDefault();
                    setActive(next);
                    document.getElementById(`${id}-tab-${next}`)?.focus();
                  }
                }}
                className={cn(
                  "min-h-14 rounded-2xl border px-4 py-2 text-left transition-colors",
                  i === active
                    ? "border-lunar-text bg-lunar-surface ring-1 ring-lunar-text"
                    : "border-lunar-border hover:bg-lunar-surface",
                )}
              >
                <span className="block font-semibold">{t(e.key)}</span>
                <span className="block text-sm text-lunar-text-2">{t(e.when)}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${active}`}
          className="rounded-[24px] border border-lunar-border p-6"
        >
          <h4 className="text-lg font-semibold">{ways[active].title}</h4>
          <p className="mt-2 text-lunar-text-2">{ways[active].body}</p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 border-t border-lunar-border pt-8 md:grid-cols-3">
        <p className="text-lunar-text-2">{never}</p>
        <p className="text-lunar-text-2">{recordings}</p>
        <p className="text-lunar-text-2">{thisSite}</p>
      </div>
    </section>
  );
}
