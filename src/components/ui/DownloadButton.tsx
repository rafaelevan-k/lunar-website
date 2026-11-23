"use client";

import { Download, Monitor } from "lucide-react";
import { useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cn } from "@/lib/cn";

/*
 * The main download, as a spiral-bound notepad (owner request, 2026-11-23): the top sheet says
 * "Download Lunar for Windows 11" and is a plain link straight to the newest Lunar.msi. A yellow
 * sticky note stuck on its corner carries the version, size and date read at build time.
 * - Hover or focus lifts the top sheet a little (a CSS transition; the hero's eyes smile); a click
 *   flips it up over the rings while the download starts, and a fresh sheet comes back (the
 *   browser's own Web Animations, so the button adds no animation library to the first load).
 *   No motion with reduced motion; without JavaScript it is the same link, lifting on hover.
 * - On a phone, a Mac or Linux it still downloads, but says that Lunar is for Windows 11 and
 *   offers to copy the link for later.
 */

export type DownloadButtonText = {
  button: string;
  /** e.g. "Lunar 1.1.1, 66.9 MB, released November 18, 2026." */
  details: string;
  notWindows: string;
  copy: string;
  copied: string;
};

const RINGS = 11;

export function DownloadButton({
  href,
  text,
  onIntent,
  tilt = false,
  className,
}: {
  href: string;
  text: DownloadButtonText;
  /** Called with true while the button is hovered or focused (the eyes smile). */
  onIntent?: (active: boolean) => void;
  /** Lay the notepad down at a slight angle on wide screens (the hero). */
  tilt?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const sheet = useRef<HTMLSpanElement>(null);
  const flipping = useRef(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  // The browser starts the download on its own; the flip only plays alongside it.
  const flip = async () => {
    const el = sheet.current;
    if (reduced || flipping.current || !el || typeof el.animate !== "function") return;
    flipping.current = true;
    try {
      await el.animate(
        [
          { transform: getComputedStyle(el).transform, opacity: 1 },
          { transform: "perspective(700px) rotateX(-120deg)", opacity: 1, offset: 0.7 },
          { transform: "perspective(700px) rotateX(-178deg)", opacity: 0 },
        ],
        { duration: 550, easing: "cubic-bezier(0.45, 0, 0.2, 1)" },
      ).finished;
      await el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: "ease-out" })
        .finished;
    } catch {
      // Cancelled (the page went away): nothing to put back.
    } finally {
      flipping.current = false;
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Room at the bottom right for the sticky note. */}
      <div className={cn("relative pr-5 pb-16", tilt && "lg:-rotate-3")}>
        <a
          rel="noopener noreferrer"
          href={href}
          onPointerEnter={() => onIntent?.(true)}
          onPointerLeave={() => onIntent?.(false)}
          onFocus={() => onIntent?.(true)}
          onBlur={() => onIntent?.(false)}
          onClick={flip}
          className="group relative block w-[min(19rem,calc(100vw-4.5rem))] rounded-[16px] pt-3 text-left focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {/* The pad under the top sheet: a dark back and two more sheets. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-3 -bottom-2.5 rounded-[18px] bg-(--notepad-back) shadow-[0_22px_34px_-16px_var(--notepad-shadow)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-1 top-3 -bottom-1.5 rounded-[16px] bg-(--notepad-page-3)"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0.5 top-3 -bottom-[3px] rounded-[16px] bg-(--notepad-page-2)"
          />
          <span
            ref={sheet}
            style={{ transformOrigin: "50% 0%" }}
            className="relative flex min-h-28 [transform:perspective(700px)_rotateX(0deg)] items-center gap-4 rounded-[16px] bg-(--notepad-page) px-5 pt-8 pb-9 text-(--notepad-ink) transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:[transform:perspective(700px)_translateY(-2px)_rotateX(-10deg)] group-focus-visible:[transform:perspective(700px)_translateY(-2px)_rotateX(-10deg)]"
          >
            <span aria-hidden="true" className="absolute inset-x-6 top-2.5 flex justify-between">
              {Array.from({ length: RINGS }, (_, i) => (
                <span key={i} className="size-2 rounded-full bg-(--notepad-hole)" />
              ))}
            </span>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-(--notepad-ink) text-(--notepad-page)">
              <Download className="size-5" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="font-display text-xl leading-tight font-semibold tracking-tight">
              {text.button}
            </span>
          </span>
          {/* The spiral, over the top edge, into the holes. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-0 flex justify-between"
          >
            {Array.from({ length: RINGS }, (_, i) => (
              <span
                key={i}
                className="h-[23px] w-2 rounded-full bg-[linear-gradient(90deg,var(--notepad-ring-dark),var(--notepad-ring-light)_45%,var(--notepad-ring-dark))]"
              />
            ))}
          </span>
        </a>

        <p className="absolute -right-3 bottom-0 w-40 rotate-[5deg] bg-(--sticky-note) px-4 pt-5 pb-4 text-left text-sm leading-snug text-(--sticky-note-ink) shadow-[0_10px_18px_-10px_var(--notepad-shadow)]">
          <span
            aria-hidden="true"
            className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-3 bg-(--sticky-tape)"
          />
          {text.details}
        </p>
      </div>

      {/* Hidden on Windows desktops. The head script marks everyone else before the first paint
          ("Windows NT" in the user agent covers Windows 10 and 11); a wrong guess only shows or
          hides this note, the download always works. */}
      <div
        data-testid="not-windows"
        className="hidden max-w-sm flex-col items-center gap-2 text-center text-sm text-lunar-text-2 in-data-[platform=other]:flex"
      >
        <p className="flex items-start gap-2 text-left">
          <Monitor className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {text.notWindows}
        </p>
        <button
          type="button"
          onClick={copy}
          className="min-h-11 rounded-full border border-lunar-border px-4 font-medium text-lunar-text hover:bg-lunar-surface"
        >
          {copied ? text.copied : text.copy}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? text.copied : ""}
        </span>
      </div>
    </div>
  );
}
