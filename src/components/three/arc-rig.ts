/*
 * What WhyLunar and the arc scene share. Kept apart from WhyArcScene so WhyLunar can import it
 * without pulling Three.js into the page's first load.
 */

/** Where the arc is (in cards) and where it is heading. */
export type Rig = {
  /** Card index the arc settles on; any integer (the arc is endless). */
  target: number;
  /** Current position, in cards. */
  pos: number;
  vel: number;
  /** While dragged, the position follows dragPos directly. */
  dragging: boolean;
  dragPos: number;
};

/** A card's box on the stage, in CSS pixels, written every frame for hit testing. */
export type Hit = { left: number; top: number; right: number; bottom: number; d: number } | null;

/** The card colours, read from the CSS tokens (they change with the theme). */
export type ArcColors = { cardBg: string; cardBorder: string; wallpaper: string[] };

/** How far card i is from position pos, wrapped into −n/2 … n/2 (the arc is endless). */
export function wrapOffset(i: number, pos: number, n: number) {
  return ((((i - pos) % n) + n + n / 2) % n) - n / 2;
}

/** The card index at an (unbounded) position. */
export function cardAt(pos: number, n: number) {
  return ((Math.round(pos) % n) + n) % n;
}
