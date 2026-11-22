/*
 * Timing and gaze rules of Lunar's eyes, ported from the app (src/Lunar.Desktop/Features/Eyes:
 * EyeAnimationOptions, EyeAnimationController, EyeGaze, EyesView.xaml.cs). Units are the eyes' own
 * 62x26 grid unless a name says ms.
 */

export const EYES_VIEWBOX = { width: 62, height: 26 } as const;
export const EYE_CENTERS = [
  { x: 12, y: 13 },
  { x: 50, y: 13 },
] as const;

export const BLINK = {
  intervalMs: [3000, 7000],
  durationMs: [120, 220],
  closeShare: 0.4,
  holdShare: 0.1,
  doubleChance: 0.15,
  doubleGapMs: [90, 160],
} as const;

export const SLEEP = { afterMs: 5 * 60 * 1000, closure: 0.55, inMs: 600, wakeMs: 200 } as const;

export const GAZE = {
  maxOffset: 5,
  // The app reaches the cap 70 DIP from the eye while the 26-unit grid is 20 DIP high: 91 units.
  radius: (70 * 26) / 20,
  followMs: 90,
  returnMs: 180,
} as const;

/** The site's own touch (not in the app): on the home page the eyes open once, like waking up. */
export const WAKE = { delayMs: 450, openMs: 320 } as const;

export const FEEDBACK = { hover: 1.08, press: 0.92, ms: 110 } as const;

export const SMILE = {
  hiddenY: 30, // the cheek waits below the eye
  inMs: 170,
  holdUntilMs: 1200,
  outMs: 220,
  // The hop: -4 DIP on a 20 DIP high view = -5.2 grid units.
  hopY: -5.2,
  hopUpMs: 130,
} as const;

export function between([min, max]: readonly [number, number]) {
  return min + (max - min) * Math.random();
}

/**
 * Pupil offset for a pointer (dx, dy) grid units from the eye centre: grows smoothly from zero to
 * GAZE.maxOffset at GAZE.radius and stays there, so the pupil never leaves the eye.
 */
export function gazeOffset(dx: number, dy: number): { x: number; y: number } {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return { x: 0, y: 0 };
  const distance = Math.hypot(dx, dy);
  if (distance < 1e-9) return { x: 0, y: 0 };
  const t = Math.min(distance / GAZE.radius, 1);
  const length = GAZE.maxOffset * t * t * (3 - 2 * t);
  return { x: (dx / distance) * length, y: (dy / distance) * length };
}
