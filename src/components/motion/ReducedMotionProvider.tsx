"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { readReducedMotion, subscribePreferences } from "@/lib/preferences";

const ReducedMotionContext = createContext(false);

// The server can't know the visitor's setting. Render as reduced until the browser says otherwise,
// so nothing starts moving before we know it may.
const getServerSnapshot = () => true;

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
