"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { readReducedMotion, subscribePreferences } from "@/lib/preferences";

const ReducedMotionContext = createContext(false);

// The server can't know the visitor's setting, so it renders the moving version, which most
// visitors get. Nothing moves before hydration anyway (Motion animates from JavaScript, and CSS
// animations follow the setting through globals.css). Rendering "reduced" first made React re-render
// the whole page right after hydrating it, the biggest cost on phones. Visitors who want less motion
// get that re-render instead, once.
const getServerSnapshot = () => false;

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribePreferences, readReducedMotion, getServerSnapshot);
  return (
    <ReducedMotionContext.Provider value={reduced}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
    </ReducedMotionContext.Provider>
  );
}

/** True when the site's own motion setting or the system asks for less animation. */
export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}
