import type { Transition } from "motion/react";

/*
 * Shared motion presets. Lunar's island glides between shapes rather than snapping, so the
 * default is a soft spring with almost no overshoot.
 */
export const islandSpring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 38,
  mass: 0.9,
};

export const fade: Transition = { duration: 0.18, ease: "easeOut" };
