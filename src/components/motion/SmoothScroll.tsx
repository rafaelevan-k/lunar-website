"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "./ReducedMotionProvider";

/*
 * Smooth scrolling for mouse wheels with Lenis, on the page itself (no wrapper element).
 * - Off with reduced motion: the page then scrolls exactly as the browser does.
 * - Touch keeps the phone's own scrolling (syncTouch off).
 * - Anchor links and the keyboard keep their native behaviour (anchors off), so the skip link
 *   still moves focus and find-in-page still works.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.12, smoothWheel: true, syncTouch: false, anchors: false }}>
      {children}
    </ReactLenis>
  );
}
