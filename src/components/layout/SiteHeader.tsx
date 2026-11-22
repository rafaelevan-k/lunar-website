"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LunarEyes } from "@/components/lunar/LunarEyes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LATEST_RELEASE_URL, NAV_LINKS } from "@/content/site";
import { cn } from "@/lib/cn";
import { fade, islandSpring } from "@/lib/motion";

/*
 * The header is Lunar's island: a stadium at the top center of the screen, like the app on the
 * desktop. On small screens it opens into a panel with a 24 px radius, the way the island expands.
 * Closed radius = half the 56 px height, as in the app (StadiumRadiusConverter).
 */
const CLOSED_RADIUS = 28;
const OPEN_RADIUS = 24;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const islandRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!islandRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const navLink = (href: string, label: string, large = false) => {
    const current = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        aria-current={current ? "page" : undefined}
        onClick={() => setOpen(false)}
        className={cn(
          "rounded-full transition-colors hover:text-lunar-text",
          current ? "text-lunar-text" : "text-lunar-text-2",
          large
            ? "flex min-h-12 items-center px-1 font-display text-2xl font-medium"
            : "flex h-11 items-center px-3.5 text-sm hover:bg-lunar-surface",
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <motion.div
        ref={islandRef}
        layout
        transition={islandSpring}
        style={{ borderRadius: open ? OPEN_RADIUS : CLOSED_RADIUS }}
        className={cn(
          "lunar-island pointer-events-auto overflow-hidden border border-lunar-border bg-lunar-bg shadow-[0_12px_40px_-16px_rgb(0_0_0/0.6)]",
          open ? "w-full max-w-md md:w-auto md:max-w-none" : "w-auto",
        )}
      >
        <motion.div layout="position" className="flex h-14 items-center gap-1 pr-1.5 pl-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="mr-auto flex h-11 items-center gap-2.5 rounded-full pr-3"
          >
            <LunarEyes className="h-4" />
            <span className="font-display text-lg font-semibold tracking-tight">Lunar</span>
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>{navLink(href, label)}</li>
              ))}
            </ul>
          </nav>

          <ThemeToggle className="hidden md:grid" />

          <a
            href={LATEST_RELEASE_URL}
            className="ml-1 flex h-11 items-center rounded-full bg-lunar-accent px-5 text-sm font-medium text-lunar-on-accent transition-[filter] hover:brightness-110"
          >
            Download
          </a>

          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full text-lunar-text-2 hover:text-lunar-text md:hidden"
          >
            {open ? (
              <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              id="site-menu"
              aria-label="Main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ...fade, delay: 0.08 } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              className="px-5 pt-2 pb-5 md:hidden"
            >
              <ul className="flex flex-col">
                <li>{navLink("/", "Home", true)}</li>
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>{navLink(href, label, true)}</li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-lunar-border pt-3">
                <span className="text-sm text-lunar-text-2">Theme</span>
                <ThemeToggle />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
