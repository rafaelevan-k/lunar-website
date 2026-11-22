/*
 * Island sizes and the Notch outline, in the app's device-independent units (1 DIP = 1 CSS px at
 * scale 1). Ported from src/Lunar.Desktop/Shell/IslandLayout.cs and IslandOutline.cs (v1.1.1).
 */

export type IslandStyle = "pill" | "notch";
export type Activity = "eyes" | "media" | "recording" | "focus";

export const PANEL_RADIUS = 24;

export const SIZES = {
  pill: {
    idleHeight: 44,
    idleWidth: { eyes: 160, media: 160, recording: 232, focus: 160 },
    expanded: { width: 380, height: 320 },
  },
  notch: {
    idleHeight: 32,
    idleWidth: { eyes: 230, media: 280, recording: 300, focus: 230 },
    expanded: { width: 680, height: 310 },
  },
} as const;

/** Each top corner of the Notch has a small outward shoulder that blends into the screen edge. */
export const NOTCH_SHOULDER = 8;
const NOTCH_MAX_BOTTOM_RADIUS = 28;

export function notchBottomRadius(height: number) {
  return Number.isFinite(height) && height > 0
    ? Math.min(height * 0.3, NOTCH_MAX_BOTTOM_RADIUS)
    : 0;
}

/**
 * The Notch outline as an SVG path: square on top, concave shoulders at both top corners, rounded
 * bottom corners. The shoulders are carved out of the width, as in the app.
 */
export function notchPath(width: number, height: number, shoulders = true) {
  if (!(width > 2 && height > 2)) return "";
  const s = shoulders ? Math.min(NOTCH_SHOULDER, width / 4, height / 2) : 0;
  const r = Math.max(0, Math.min(notchBottomRadius(height), height - s, (width - 2 * s) / 2));
  const d = [`M 0 0`, `L ${width} 0`];
  if (s > 0) d.push(`A ${s} ${s} 0 0 0 ${width - s} ${s}`);
  d.push(`L ${width - s} ${height - r}`);
  if (r > 0) d.push(`A ${r} ${r} 0 0 1 ${width - s - r} ${height}`);
  d.push(`L ${s + r} ${height}`);
  if (r > 0) d.push(`A ${r} ${r} 0 0 1 ${s} ${height - r}`);
  d.push(`L ${s} ${s}`);
  if (s > 0) d.push(`A ${s} ${s} 0 0 0 0 0`);
  d.push("Z");
  return d.join(" ");
}
