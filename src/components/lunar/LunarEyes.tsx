"use client";

import { animate, motion, useMotionValue, type MotionValue } from "motion/react";
import { useEffect, useId, useImperativeHandle, useRef, useState, type Ref } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cn } from "@/lib/cn";
import { readReducedMotion } from "@/lib/preferences";
import {
  BLINK,
  between,
  EYE_CENTERS,
  EYES_VIEWBOX,
  FEEDBACK,
  GAZE,
  gazeOffset,
  SLEEP,
  SMILE,
  WAKE,
} from "./eyeMotion";

/*
 * Lunar's eyes, drawn on the same 62x26 grid as src/Lunar.Desktop/Features/Eyes/EyesView.xaml:
 * two 24x26 eyes (TextPrimary), a 12x12 pupil (Background) with a 4x4 highlight at its top left,
 * an eyelid (Surface) that drops from the top to blink, and a round cheek (Background) that rises
 * from below to turn each eye into a smiling arch. Timings follow the app (see eyeMotion.ts).
 *
 * Use it inside a .lunar-island (LunarPill or the header) so the colors are the island's.
 * With reduced motion there is no blinking and no gaze; a smile appears and goes without moving.
 */

export type LunarEyesHandle = {
  /** A happy moment: smile for about a second and hop a little (no hop with reduced motion). */
  celebrate: () => void;
};

type LunarEyesProps = {
  className?: string;
  /** Blink by themselves every few seconds. */
  blink?: boolean;
  /** "page": the pupils follow the pointer anywhere on the page. "none": they look ahead. */
  gaze?: "page" | "none";
  /** Hold a smile while true (e.g. while the download button is hovered). */
  smile?: boolean;
  /** Grow a little on hover and shrink on press, like the app. For eyes inside a button. */
  feedback?: boolean;
  /** Start with the eyes closed and open them once they are on screen: Lunar waking up. */
  wake?: boolean;
  ref?: Ref<LunarEyesHandle>;
};

export function LunarEyes({
  className,
  blink = true,
  gaze = "none",
  smile = false,
  feedback = false,
  wake = false,
  ref,
}: LunarEyesProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const lid = useMotionValue(wake ? 1 : 0); // 0 open, 1 closed
  const [awake, setAwake] = useState(!wake);
  const cheek = useMotionValue<number>(SMILE.hiddenY);
  const hop = useMotionValue(0);
  const pupils = [
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
  ];

  // Only run anything while the eyes are on screen and the tab is visible.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let inView = false;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(svg);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // Expose the lid for tests and debugging without re-rendering on every frame.
  useEffect(
    () => lid.on("change", (value) => svgRef.current?.setAttribute("data-lid", value.toFixed(2))),
    [lid],
  );

  // Waking up: the eyes open a moment after they first appear. Reads the motion setting directly,
  // because the context says "reduced" until the browser has reported the real setting.
  // Without JavaScript a CSS rule keeps the lids open (globals.css, [data-wake]).
  useEffect(() => {
    if (awake) return;
    const still = readReducedMotion();
    if (!still && !visible) return;
    const timer = window.setTimeout(
      () => {
        if (still) {
          lid.jump(0);
          setAwake(true);
        } else {
          animate(lid, 0, { duration: WAKE.openMs / 1000, ease: "easeOut" }).then(() =>
            setAwake(true),
          );
        }
      },
      still ? 0 : WAKE.delayMs,
    );
    return () => window.clearTimeout(timer);
  }, [awake, visible, lid]);

  // Blinking, double blinks and falling asleep after 5 minutes without interaction.
  useEffect(() => {
    if (!awake) return;
    if (!blink || reduced || !visible) {
      lid.jump(0); // never leave a lid frozen shut
      return;
    }
    let timer: number | undefined;
    let asleep = false;
    let lastInteraction = performance.now();
    const at = (ms: number, run: () => void) => {
      timer = window.setTimeout(run, ms);
    };
    const scheduleNext = () => at(between(BLINK.intervalMs), tick);

    const blinkOnce = (thenDouble: boolean) => {
      const total = between(BLINK.durationMs);
      animate(lid, 1, { duration: (total * BLINK.closeShare) / 1000, ease: "easeIn" });
      at(total * (BLINK.closeShare + BLINK.holdShare), () => {
        animate(lid, 0, {
          duration: (total * (1 - BLINK.closeShare - BLINK.holdShare)) / 1000,
          ease: "easeOut",
        });
        at(total * (1 - BLINK.closeShare - BLINK.holdShare), () =>
          thenDouble ? at(between(BLINK.doubleGapMs), () => blinkOnce(false)) : scheduleNext(),
        );
      });
    };

    function tick() {
      if (performance.now() - lastInteraction >= SLEEP.afterMs) {
        asleep = true;
        animate(lid, SLEEP.closure, { duration: SLEEP.inMs / 1000 });
        return;
      }
      blinkOnce(Math.random() < BLINK.doubleChance);
    }

    const onInteraction = () => {
      lastInteraction = performance.now();
      if (asleep) {
        asleep = false;
        animate(lid, 0, { duration: SLEEP.wakeMs / 1000 });
        scheduleNext();
      }
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll"] as const;
    for (const e of events) window.addEventListener(e, onInteraction, { passive: true });
    scheduleNext();
    return () => {
      window.clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, onInteraction);
      lid.jump(0);
    };
  }, [awake, blink, reduced, visible, lid]);

  // Gaze: the pupils look toward the pointer, anywhere on the page.
  useEffect(() => {
    const neutral = () => {
      for (const p of pupils) {
        animate(p.x, 0, { duration: GAZE.returnMs / 1000, ease: "easeOut" });
        animate(p.y, 0, { duration: GAZE.returnMs / 1000, ease: "easeOut" });
      }
    };
    if (gaze === "none" || reduced || !visible) {
      for (const p of pupils) {
        p.x.jump(0);
        p.y.jump(0);
      }
      return;
    }
    let frame = 0;
    let returnTimer: number | undefined;
    let pointer = { x: 0, y: 0 };
    const follow = () => {
      frame = 0;
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const unit = rect.width / EYES_VIEWBOX.width; // px per grid unit
      EYE_CENTERS.forEach((center, i) => {
        const dx = (pointer.x - (rect.left + center.x * unit)) / unit;
        const dy = (pointer.y - (rect.top + center.y * unit)) / unit;
        const { x, y } = gazeOffset(dx, dy);
        animate(pupils[i].x, x, { duration: GAZE.followMs / 1000, ease: "easeOut" });
        animate(pupils[i].y, y, { duration: GAZE.followMs / 1000, ease: "easeOut" });
      });
    };
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      window.clearTimeout(returnTimer);
      // A touch is a glance: look there, then look ahead again.
      if (event.pointerType === "touch") returnTimer = window.setTimeout(neutral, 1200);
      if (!frame) frame = requestAnimationFrame(follow);
    };
    const onLeave = (event: PointerEvent) => {
      if (!event.relatedTarget) neutral(); // the pointer left the window
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(returnTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerout", onLeave);
      neutral();
    };
    // pupils are stable motion values created once per render order
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gaze, reduced, visible]);

  // The smile: held while `smile` is true, or for a moment while celebrating.
  const smiling = smile || celebrating;
  useEffect(() => {
    if (reduced) {
      cheek.jump(smiling ? 0 : SMILE.hiddenY);
      return;
    }
    const controls = smiling
      ? animate(cheek, 0, { duration: SMILE.inMs / 1000, ease: "backOut" })
      : animate(cheek, SMILE.hiddenY, { duration: SMILE.outMs / 1000, ease: "easeIn" });
    return () => controls.stop();
  }, [smiling, reduced, cheek]);

  useImperativeHandle(
    ref,
    () => ({
      celebrate() {
        setCelebrating(true);
        window.setTimeout(() => setCelebrating(false), SMILE.holdUntilMs);
        if (reduced) return;
        animate(hop, SMILE.hopY, { duration: SMILE.hopUpMs / 1000, ease: "easeOut" }).then(() =>
          animate(hop, 0, { type: "spring", stiffness: 700, damping: 14 }),
        );
      },
    }),
    [reduced, hop],
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${EYES_VIEWBOX.width} ${EYES_VIEWBOX.height}`}
      className={cn("h-full w-auto overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
      data-smiling={smiling ? "true" : "false"}
      data-lid={wake ? "1.00" : "0.00"}
      data-wake={wake ? "" : undefined}
    >
      <defs>
        {EYE_CENTERS.map((c, i) => (
          <clipPath key={i} id={`${id}-eye-${i}`}>
            <ellipse cx={c.x} cy={c.y} rx={12} ry={13} />
          </clipPath>
        ))}
      </defs>
      <motion.g style={{ y: hop }}>
        <motion.g
          whileHover={feedback && !reduced ? { scale: FEEDBACK.hover } : undefined}
          whileTap={feedback && !reduced ? { scale: FEEDBACK.press } : undefined}
          transition={{ duration: FEEDBACK.ms / 1000, ease: "easeOut" }}
        >
          {EYE_CENTERS.map((c, i) => (
            <Eye
              key={i}
              clipId={`${id}-eye-${i}`}
              cx={c.x}
              cy={c.y}
              pupil={pupils[i]}
              lid={lid}
              cheek={cheek}
            />
          ))}
        </motion.g>
      </motion.g>
    </svg>
  );
}

function Eye({
  clipId,
  cx,
  cy,
  pupil,
  lid,
  cheek,
}: {
  clipId: string;
  cx: number;
  cy: number;
  pupil: { x: MotionValue<number>; y: MotionValue<number> };
  lid: MotionValue<number>;
  cheek: MotionValue<number>;
}) {
  // The cheek (34x22, bottom 9 below the eye, as in the XAML) is cut out of the whole eye with a
  // mask rather than painted over it, so no thin outline of the eye shows under the smile.
  const maskId = `${clipId}-smile`;
  return (
    <g>
      <mask id={maskId} maskUnits="userSpaceOnUse" x={cx - 20} y={cy - 20} width={40} height={60}>
        <rect x={cx - 20} y={cy - 20} width={40} height={60} fill="white" />
        <motion.ellipse
          cx={cx}
          cy={cy + 11}
          rx={17}
          ry={11}
          fill="black"
          style={{ y: cheek }}
          data-part="cheek"
        />
      </mask>
      <g mask={`url(#${maskId})`}>
        <ellipse cx={cx} cy={cy} rx={12} ry={13} fill="var(--lunar-text)" />
        <g clipPath={`url(#${clipId})`}>
          <motion.g style={{ x: pupil.x, y: pupil.y }}>
            <circle cx={cx} cy={cy} r={6} fill="var(--lunar-bg)" />
            <circle cx={cx - 2} cy={cy - 2} r={2} fill="var(--lunar-text)" />
          </motion.g>
          <motion.rect
            x={cx - 12}
            y={cy - 13}
            width={24}
            height={26}
            fill="var(--lunar-surface)"
            style={{ scaleY: lid, originY: 0 }}
            data-part="lid"
          />
        </g>
      </g>
    </g>
  );
}
