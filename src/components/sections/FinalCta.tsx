"use client";

import { useRef, useState } from "react";
import type { LunarEyesHandle } from "@/components/lunar/LunarEyes";
import { LunarPill } from "@/components/lunar/LunarPill";
import { DownloadButton, type DownloadButtonText } from "@/components/ui/DownloadButton";

/** The last word: the pill again, its eyes on the download button, smiling when you go for it. */
export function FinalCta({
  title,
  lead,
  downloadHref,
  downloadText,
  pillAction,
}: {
  title: string;
  lead: string;
  downloadHref: string;
  downloadText: DownloadButtonText;
  pillAction: string;
}) {
  const eyes = useRef<LunarEyesHandle>(null);
  const [eager, setEager] = useState(false);
  return (
    <section
      aria-labelledby="final-cta"
      className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-32 text-center"
    >
      <LunarPill
        label={pillAction}
        onClick={() => eyes.current?.celebrate()}
        className="w-56 sm:w-72"
        eyes={{ ref: eyes, gaze: "page", smile: eager, feedback: true }}
      />
      <h2
        id="final-cta"
        className="mt-10 max-w-[16ch] text-5xl leading-[0.95] font-bold tracking-[-0.03em] font-stretch-[84%] sm:text-6xl"
      >
        {title}
      </h2>
      <p className="mt-4 max-w-md text-lg text-lunar-text-2">{lead}</p>
      <DownloadButton
        className="mt-10"
        href={downloadHref}
        text={downloadText}
        onIntent={setEager}
      />
    </section>
  );
}
