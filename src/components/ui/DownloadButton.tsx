"use client";

import { Download, Monitor } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

/*
 * The main download: one button straight to the newest Lunar.msi, and one quiet sentence with the
 * version, size and date read at build time. On a phone, a Mac or Linux it still downloads, but
 * says that Lunar is for Windows 11 and offers to copy the link for later.
 */

export type DownloadButtonText = {
  button: string;
  /** e.g. "Lunar 1.1.1, 66.9 MB, released November 18, 2026." */
  details: string;
  notWindows: string;
  copy: string;
  copied: string;
};

export function DownloadButton({
  href,
  text,
  onIntent,
  className,
}: {
  href: string;
  text: DownloadButtonText;
  /** Called with true while the button is hovered or focused (the eyes smile). */
  onIntent?: (active: boolean) => void;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <a
        rel="noopener noreferrer"
        href={href}
        onPointerEnter={() => onIntent?.(true)}
        onPointerLeave={() => onIntent?.(false)}
        onFocus={() => onIntent?.(true)}
        onBlur={() => onIntent?.(false)}
        className="inline-flex min-h-13 items-center gap-2.5 rounded-full bg-lunar-accent px-7 text-base font-semibold text-lunar-on-accent transition-transform hover:-translate-y-px active:translate-y-0"
      >
        <Download className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
        {text.button}
      </a>
      <p className="text-sm text-lunar-text-2">{text.details}</p>
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
