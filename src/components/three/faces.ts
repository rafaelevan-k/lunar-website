import type { WhyId } from "@/content/types";

/*
 * What the island shows on its face for each "Why Lunar" card, drawn with the 2D canvas API.
 * The same drawing is used as the texture of the 3D island and, without WebGL, on a flat canvas.
 * Coordinates are in the island's own units: 160 × 44 for the Pill (as in the app), 230 × 32
 * for the Notch. Colours are the island's (dark) tokens.
 */

export const FACE_SIZE = { pill: { w: 160, h: 44 }, notch: { w: 230, h: 32 } } as const;

const INK = "#f6f7fb";
const BG = "#0b0c10";
const SURFACE = "#181a22";
const SECONDARY = "#a8adbe";
const RECORDING = "#ff453a";

export function faceShape(id: WhyId): "pill" | "notch" {
  return id === "style" ? "notch" : "pill";
}

type Eyes = { look?: [number, number]; alpha?: number; closed?: boolean; smile?: boolean };

/** Lunar's eyes on the 62 × 26 grid of EyesView.xaml, 20 units high, centred at (cx, cy). */
function eyes(ctx: CanvasRenderingContext2D, cx: number, cy: number, o: Eyes = {}) {
  const s = 20 / 26;
  const [lx, ly] = o.look ?? [0, 0];
  ctx.save();
  ctx.globalAlpha = o.alpha ?? 1;
  for (const ex of [12, 50]) {
    const x = cx + (ex - 31) * s;
    const y = cy;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y, 12 * s, 13 * s, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = INK;
    ctx.fillRect(x - 13 * s, y - 14 * s, 26 * s, 28 * s);
    if (o.closed) {
      // The eyelid down: the eye becomes a dark slit.
      ctx.fillStyle = SURFACE;
      ctx.fillRect(x - 13 * s, y - 14 * s, 26 * s, 28 * s);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2 * s;
      ctx.beginPath();
      ctx.moveTo(x - 9 * s, y + 2 * s);
      ctx.quadraticCurveTo(x, y + 7 * s, x + 9 * s, y + 2 * s);
      ctx.stroke();
    } else {
      ctx.fillStyle = BG;
      ctx.beginPath();
      ctx.arc(x + lx * s, y + ly * s, 6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(x + (lx - 2) * s, y + (ly - 2) * s, 2 * s, 0, Math.PI * 2);
      ctx.fill();
      if (o.smile) {
        // The cheek rises and cuts the eye into an arch, as in the app.
        ctx.fillStyle = BG;
        ctx.beginPath();
        ctx.ellipse(x, y + 11 * s, 17 * s, 11 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  ctx.restore();
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color = INK,
) {
  ctx.fillStyle = color;
  ctx.font = `600 ${size}px "Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y);
}

function bars(
  ctx: CanvasRenderingContext2D,
  x: number,
  cy: number,
  levels: number[],
  h: number,
  color: string,
  gap: number,
) {
  ctx.fillStyle = color;
  levels.forEach((level, i) => {
    const bh = Math.max(3, level * h);
    const bx = x + i * gap;
    ctx.beginPath();
    ctx.roundRect(bx, cy - bh / 2, 3, bh, 1.5);
    ctx.fill();
  });
}

function round(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Draws the face for one card. The canvas is scaled so 1 unit = `scale` pixels. */
export function drawFace(ctx: CanvasRenderingContext2D, id: WhyId, scale: number) {
  const { w, h } = FACE_SIZE[faceShape(id)];
  ctx.save();
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;

  switch (id) {
    case "personality":
      eyes(ctx, cx, cy, { smile: true });
      break;
    case "invisible":
      // Still there for you, faint for everyone else.
      eyes(ctx, cx, cy, { alpha: 0.35 });
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = SECONDARY;
      ctx.lineWidth = 1.2;
      round(ctx, 6, 6, w - 12, h - 12, (h - 12) / 2);
      ctx.stroke();
      ctx.restore();
      break;
    case "focus":
      text(ctx, "24:13", cx, cy + 1, 20);
      break;
    case "recorder":
      round(ctx, 8, cy - 14, 28, 28, 14);
      ctx.fillStyle = SURFACE;
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.fillRect(18, cy - 5, 3, 10);
      ctx.fillRect(24, cy - 5, 3, 10);
      bars(
        ctx,
        44,
        cy,
        [0.3, 0.6, 0.9, 0.5, 0.8, 0.4, 0.7, 1, 0.5, 0.6, 0.3, 0.7, 0.45, 0.25],
        24,
        RECORDING,
        5.4,
      );
      text(ctx, "0:42", w - 18, cy + 1, 11);
      break;
    case "activity": {
      const art = ctx.createLinearGradient(16, cy - 14, 44, cy + 14);
      art.addColorStop(0, "#3a2f6b");
      art.addColorStop(0.55, "#121424");
      art.addColorStop(1, "#5b3a2e");
      round(ctx, 16, cy - 14, 28, 28, 7);
      ctx.fillStyle = art;
      ctx.fill();
      bars(ctx, w - 50, cy, [0.45, 0.8, 0.55, 1, 0.65, 0.35], 20, INK, 5.6);
      break;
    }
    case "style":
      eyes(ctx, cx, cy, {});
      break;
    case "translate":
      text(ctx, "A", cx - 28, cy + 1, 18);
      text(ctx, "→", cx, cy, 14, SECONDARY);
      text(ctx, "あ", cx + 28, cy + 1, 17);
      break;
    case "private":
      eyes(ctx, cx, cy, { closed: true });
      break;
    case "light":
      text(ctx, "0.04 %", cx, cy + 1, 17);
      break;
    case "updates":
      eyes(ctx, cx - 16, cy, { look: [0, 3] });
      round(ctx, cx + 30, cy - 11, 22, 22, 11);
      ctx.fillStyle = INK;
      ctx.fill();
      text(ctx, "↓", cx + 41, cy + 1, 14, BG);
      break;
    case "everyone":
      eyes(ctx, cx, cy, { look: [0, 0] });
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      round(ctx, 4, 4, w - 8, h - 8, (h - 8) / 2);
      ctx.stroke();
      break;
  }
  ctx.restore();
}

/** A canvas with the face drawn at `scale` pixels per unit (e.g. 8 for a crisp texture). */
export function faceCanvas(id: WhyId, scale: number) {
  const { w, h } = FACE_SIZE[faceShape(id)];
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (ctx) drawFace(ctx, id, scale);
  return canvas;
}
