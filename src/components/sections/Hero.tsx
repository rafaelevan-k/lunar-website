"use client";

import { Check } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { LunarEyesHandle } from "@/components/lunar/LunarEyes";
import { LunarPill } from "@/components/lunar/LunarPill";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { DownloadButton, type DownloadButtonText } from "@/components/ui/DownloadButton";

/*
 * The hero is Lunar itself: a big pill with living eyes, in a soft moonlight.
 * - On load the eyes open, as if Lunar wakes up (the one page-load moment).
 * - As you scroll, the pill shrinks while the page carries it up under the header island, and
 *   fades there: Lunar going back to the top of the screen, where it lives.
 * - The eyes follow the pointer, smile while the download button is hovered or focused, and
 *   celebrate when the pill is clicked.
 * With reduced motion nothing moves on its own.
 */

/** Where the header island's middle sits, in px from the top of the window. */
const HEADER_MIDDLE = 40;
const LAG = 0.3;

export function Hero({
  title,
  lead,
  facts,
  downloadHref,
  downloadText,
  pillAction,
}: {
  title: string;
  lead: string;
  facts: string[];
  downloadHref: string;
  downloadText: DownloadButtonText;
  pillAction: string;
}) {
  const reduced = useReducedMotion();
  const eyes = useRef<LunarEyesHandle>(null);
  const pill = useRef<HTMLDivElement>(null);
  const [eager, setEager] = useState(false);
  // The scroll distance at which the pill's middle reaches the header's middle.
  const [arrive, setArrive] = useState(600);

  useEffect(() => {
    const measure = () => {
      const box = pill.current?.getBoundingClientRect();
      if (box) setArrive(Math.max(1, box.top + window.scrollY + box.height / 2 - HEADER_MIDDLE));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // The pill rises a little slower than the page (LAG), so the trip to the header lasts longer;
  // small enough that the title below never catches up with it.
  const travel = arrive / (1 - LAG);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, travel], [0, travel * LAG], { clamp: true });
  const scale = useTransform(scrollY, [0, travel], [1, 0.32], { clamp: true });
  const opacity = useTransform(scrollY, [travel * 0.75, travel], [1, 0], { clamp: true });
  const haloOpacity = useTransform(scrollY, [0, travel * 0.6], [1, 0], { clamp: true });

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center overflow-x-clip px-4 pt-2 pb-20 text-center"
    >
      {/* Measured for the scroll trip; it is never transformed itself, so the numbers stay true. */}
      <div ref={pill} className="relative">
        {/* Keyed on `reduced`: the server renders the moving version, and Motion doesn't detach
            or attach scroll-linked styles later, so these mount again if the setting differs. */}
        <motion.div
          key={`halo-${reduced}`}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-[2/1] w-[min(140vw,64rem)] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,var(--hero-halo),transparent)]"
          style={reduced ? undefined : { opacity: haloOpacity }}
        />
        <motion.div key={`pill-${reduced}`} style={reduced ? undefined : { y, scale, opacity }}>
          <LunarPill
            label={pillAction}
            onClick={() => eyes.current?.celebrate()}
            className="w-72 sm:w-96"
            eyes={{ ref: eyes, gaze: "page", smile: eager, feedback: true, wake: true }}
          />
        </motion.div>
      </div>

      <h1
        id="hero-title"
        className="mt-10 max-w-[14ch] text-[clamp(2.75rem,8.5vw,6.25rem)] leading-[0.95] font-bold tracking-[-0.035em] font-stretch-[84%]"
      >
        {title}
      </h1>
      <p className="mt-5 max-w-[38rem] text-lg leading-relaxed text-lunar-text-2 sm:text-xl">
        {lead}
      </p>

      <DownloadButton
        className="mt-8"
        href={downloadHref}
        text={downloadText}
        onIntent={setEager}
      />

      <ul className="mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-lunar-text-2">
        {facts.map((fact) => (
          <li key={fact} className="flex items-center gap-1.5">
            <Check className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
            {fact}
          </li>
        ))}
      </ul>
    </section>
  );
}
