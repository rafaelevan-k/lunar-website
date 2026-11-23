"use client";

import { animateSingleValue, useInView } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/*
 * "Light as a feather": the two numbers from the README count up once when they come into view
 * (shown at their final value straight away with reduced motion or without JavaScript).
 */

function CountUp({ to, decimals, suffix }: { to: number; decimals: number; suffix: string }) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const format = (v: number) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(v) + suffix;
  const [text, setText] = useState(format(to));

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animateSingleValue(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setText(format(v)),
    });
    return () => controls.stop();
    // format depends only on locale, decimals and suffix, which don't change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}

export function Lightweight({ title, body }: { title: string; body: string }) {
  const t = useTranslations("Sections.light");
  return (
    <section aria-labelledby="lightweight" className="mx-auto w-full max-w-6xl px-4 py-24">
      <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 id="lightweight" className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-lunar-text-2">{body}</p>
        </div>
        <div>
          <dl className="grid grid-cols-2 gap-6">
            <div>
              <dt className="text-sm text-lunar-text-2">{t("cpu")}</dt>
              <dd className="mt-1 font-display text-6xl font-bold tracking-tight font-stretch-[84%] sm:text-7xl">
                <CountUp to={0.04} decimals={2} suffix=" %" />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-lunar-text-2">{t("memory")}</dt>
              <dd className="mt-1 font-display text-6xl font-bold tracking-tight font-stretch-[84%] sm:text-7xl">
                <CountUp to={95} decimals={0} suffix=" MB" />
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-lunar-text-2">{t("source")}</p>
        </div>
      </div>
    </section>
  );
}
