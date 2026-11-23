"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cn } from "@/lib/cn";

/*
 * The hero's facts on one line, typed out one at a time, erased, and the next one typed (owner
 * request, 2026-11-23).
 * - Screen readers get every fact at once in a plain list; the typed line is aria-hidden.
 * - The server HTML (and so the page without JavaScript) shows the first fact in full.
 * - With reduced motion (the system setting or the site's own switch, which is how the typing can
 *   be stopped) nothing is typed: all facts are shown together.
 * - The typing waits while the line is off screen or the tab is hidden; its timers are cleared
 *   on unmount.
 */

const TYPE_MS = 55;
const ERASE_MS = 28;
const HOLD_MS = 1800;
const GAP_MS = 350;

type Phase = "hold" | "erase" | "type";

export function TypedFacts({ facts, className }: { facts: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const line = useRef<HTMLParagraphElement>(null);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(facts[0]?.length ?? 0);
  const [phase, setPhase] = useState<Phase>("hold");
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const el = line.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !inView || !pageVisible || facts.length < 2) return;
    const text = facts[index];
    let delay: number;
    let step: () => void;
    if (phase === "hold") {
      delay = HOLD_MS;
      step = () => setPhase("erase");
    } else if (phase === "erase") {
      if (shown > 0) {
        delay = ERASE_MS;
        step = () => setShown(shown - 1);
      } else {
        delay = GAP_MS;
        step = () => {
          setIndex((index + 1) % facts.length);
          setPhase("type");
        };
      }
    } else if (shown < text.length) {
      delay = TYPE_MS;
      step = () => setShown(shown + 1);
    } else {
      delay = 0;
      step = () => setPhase("hold");
    }
    const timer = setTimeout(step, delay);
    return () => clearTimeout(timer);
  }, [reduced, inView, pageVisible, facts, index, shown, phase]);

  return (
    <div className={className}>
      <ul className="sr-only">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      {reduced ? (
        <p
          aria-hidden="true"
          className="flex flex-wrap justify-center gap-x-5 gap-y-1 lg:justify-start"
        >
          {facts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </p>
      ) : (
        <p ref={line} aria-hidden="true" data-typed-fact className="whitespace-nowrap">
          {facts[index]?.slice(0, shown)}
          <span
            className={cn(
              "ml-0.5 inline-block h-[1.05em] w-0.5 translate-y-[0.15em] bg-current",
              phase === "hold" && "opacity-60",
            )}
          />
        </p>
      )}
    </div>
  );
}
