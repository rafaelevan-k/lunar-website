"use client";

import { useRef, useState } from "react";
import type { LunarEyesHandle } from "@/components/lunar/LunarEyes";
import { LunarPill } from "@/components/lunar/LunarPill";

/*
 * The starter hero until the real one (WEB-09): the pill's eyes follow the pointer, smile while the
 * download button is hovered or focused, and celebrate when the pill is clicked.
 */
export function StarterHero({
  title,
  lead,
  download,
  downloadHref,
  pillAction,
}: {
  title: string;
  lead: string;
  download: string;
  downloadHref: string;
  pillAction: string;
}) {
  const eyes = useRef<LunarEyesHandle>(null);
  const [eager, setEager] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <LunarPill
        label={pillAction}
        onClick={() => eyes.current?.celebrate()}
        className="w-64 sm:w-80"
        eyes={{ ref: eyes, gaze: "page", smile: eager, feedback: true }}
      />
      <h1 className="max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight font-stretch-[88%] sm:text-7xl">
        {title}
      </h1>
      <p className="max-w-xl text-lg text-lunar-text-2">{lead}</p>
      <a
        href={downloadHref}
        onPointerEnter={() => setEager(true)}
        onPointerLeave={() => setEager(false)}
        onFocus={() => setEager(true)}
        onBlur={() => setEager(false)}
        className="flex min-h-12 items-center rounded-full bg-lunar-accent px-6 font-medium text-lunar-on-accent"
      >
        {download}
      </a>
    </div>
  );
}
