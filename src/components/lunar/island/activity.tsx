"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cn } from "@/lib/cn";

/*
 * Moving parts of the closed island, redrawn from the app:
 * - PlaybackBars: 6 bars, 3 px wide, in 32×20 (Controls/PlaybackBarsView.cs)
 * - VoiceLevels: 16 red bars, 3 px wide, 26 high (Controls/VoiceLevelsView.cs)
 * - PixelEgg: the Pomodoro egg, one rect per pixel (Features/Pomodoro/EggArt.cs)
 * The levels are made up (no audio is read); with reduced motion the bars stand still.
 */

function Bars({
  count,
  className,
  barClassName,
  seed,
}: {
  count: number;
  className?: string;
  barClassName: string;
  seed: number;
}) {
  const reduced = useReducedMotion();
  return (
    <span aria-hidden="true" className={cn("flex items-center justify-between", className)}>
      {Array.from({ length: count }, (_, i) => {
        // A fixed pseudo-random pattern per bar, so the server and the browser draw the same picture.
        const a = 0.25 + ((i * 7 + seed) % 10) / 14;
        const b = 0.2 + ((i * 3 + seed * 5) % 10) / 13;
        const still = 0.3 + ((i * 5 + seed) % 7) / 12;
        return (
          // Keyed on `reduced`: the server renders the moving version (it can't know the visitor's
          // setting), and Motion doesn't start or stop a repeating animation when the props change
          // afterwards, so the bar is mounted again if the setting turns out different.
          <motion.span
            key={`${i}-${reduced}`}
            className={cn("h-full w-[3px] rounded-full", barClassName)}
            style={{ originY: 0.5 }}
            initial={{ scaleY: still }}
            animate={reduced ? { scaleY: still } : { scaleY: [still, a, b, still] }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9 + (i % 4) * 0.17, repeat: Infinity, ease: "easeInOut" }
            }
          />
        );
      })}
    </span>
  );
}

export function PlaybackBars({ className }: { className?: string }) {
  return (
    <Bars count={6} seed={3} className={cn("h-5 w-8", className)} barClassName="bg-lunar-text" />
  );
}

export function VoiceLevels({ className }: { className?: string }) {
  return (
    <Bars
      count={16}
      seed={1}
      className={cn("h-[26px]", className)}
      barClassName="bg-lunar-recording"
    />
  );
}

const WHOLE_EGG = [
  "....ooo....",
  "...owwwo...",
  "..owwwwwo..",
  "..owhwwwo..",
  ".owwwwwwwo.",
  ".owwwwwwwo.",
  "owwwwwwwwwo",
  "owwwwwwwwso",
  "owwwwwwwwso",
  "owwwwwwwsso",
  ".owwwwwwso.",
  ".owwwwwsso.",
  "..owwssso..",
  "...ooooo...",
];

const PIXEL_FILL: Record<string, string> = {
  o: "var(--lunar-egg-outline)",
  w: "var(--lunar-egg-white)",
  h: "var(--lunar-egg-white)",
  s: "var(--lunar-egg-shade)",
  y: "var(--lunar-egg-yolk)",
};

/** The whole egg of the Pomodoro page, 3 px per pixel like the app. */
export function PixelEgg({ pixel = 3 }: { pixel?: number }) {
  const rows = WHOLE_EGG;
  return (
    <svg
      aria-hidden="true"
      width={rows[0].length * pixel}
      height={rows.length * pixel}
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          PIXEL_FILL[ch] ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PIXEL_FILL[ch]} />
          ) : null,
        ),
      )}
    </svg>
  );
}
