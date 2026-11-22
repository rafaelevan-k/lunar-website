"use client";

import { Download, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
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

// The user-agent string is enough here: "Windows NT" covers Windows 10 and 11 desktops, and a
// wrong guess only shows or hides a note; the download always works.
function isWindowsDesktop() {
  return /Windows NT/.test(navigator.userAgent);
}

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
  // Rendered as Windows on the server, so the button never jumps for most visitors.
  const [windows, setWindows] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reads the browser, so it can only run after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWindows(isWindowsDesktop());
  }, []);

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
      {!windows && (
        <div
          data-testid="not-windows"
          className="flex max-w-sm flex-col items-center gap-2 text-center text-sm text-lunar-text-2"
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
      )}
    </div>
  );
}
