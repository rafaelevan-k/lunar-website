"use client";

import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cardAt, wrapOffset, type ArcColors, type Hit, type Rig } from "@/components/three/arc-rig";
import { drawFace, faceShape, FACE_SIZE } from "@/components/three/faces";
import type { Pointer } from "@/components/three/IslandModel";
import type { WhyId } from "@/content/types";
import { cn } from "@/lib/cn";
import { canUseWebGL } from "@/lib/webgl";

/*
 * "Why Lunar": eleven reasons on an endless 3D arc (owner request, 2026-11-23).
 * - The front card is the current reason; its title and text are shown below the arc. The arc
 *   turns by drag or swipe, the arrow buttons, the arrow keys, and on its own every 2.5 s. It stops
 *   turning on its own while the mouse is over the arc or keyboard focus is inside, while a detail view is open, off screen, or after
 *   Pause.
 * - Clicking a side card brings it to the front; clicking the front card opens its detail view,
 *   with a large island that follows the pointer.
 * - Three.js is loaded only when the section nears the screen, and only with WebGL and full
 *   motion. Otherwise (and without JavaScript) the reasons are a flat row of cards that scrolls
 *   sideways, each with the island drawn in 2D.
 * All text is HTML; the 3D drawing is decorative.
 */

const WhyArcScene = dynamic(() => import("@/components/three/WhyArcScene"), { ssr: false });
const IslandViewer = dynamic(() => import("@/components/three/IslandViewer"), { ssr: false });

/** How long each card stays at the front while the arc turns on its own. */
const AUTO_MS = 2500;

type Item = { id: WhyId; title: string; body: string };

/** The same face, drawn flat: the fallback without WebGL and the picture until 3D is ready. */
function FlatIsland({
  id,
  draw: active,
  className,
}: {
  id: WhyId;
  draw: boolean;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const shape = faceShape(id);
  const { w, h } = FACE_SIZE[shape];

  // Drawn once the section is near the screen (not while the page loads), and again whenever the
  // canvas gets a new size (it can be 0 wide on the first pass). The box keeps its size meanwhile.
  useEffect(() => {
    if (!active) return;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const draw = () => {
      if (el.clientWidth === 0) return;
      const scale = (el.clientWidth / w) * window.devicePixelRatio;
      el.width = Math.round(w * scale);
      el.height = Math.round(h * scale);
      drawFace(ctx, id, scale);
    };
    const observer = new ResizeObserver(draw);
    observer.observe(el);
    draw();
    return () => observer.disconnect();
  }, [active, id, w, h]);

  return (
    <div
      className={cn(
        "lunar-island border border-lunar-border bg-lunar-bg",
        shape === "pill" ? "rounded-full" : "rounded-b-[10px] border-t-0",
        className,
      )}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <canvas ref={canvas} aria-hidden="true" className="h-full w-full" />
    </div>
  );
}

function pointerFrom(event: React.PointerEvent, el: HTMLElement | null, into: Pointer) {
  if (!el || event.pointerType === "touch") return false;
  const r = el.getBoundingClientRect();
  into.x = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1));
  into.y = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1));
  into.active = true;
  return true;
}

/** The card colours from the CSS tokens, read again when the theme changes. */
function useArcColors(el: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [colors, setColors] = useState<ArcColors | null>(null);
  useEffect(() => {
    if (!enabled || !el.current) return;
    const section = el.current;
    const read = () => {
      const css = getComputedStyle(section);
      const v = (name: string) => css.getPropertyValue(name).trim();
      setColors({
        cardBg: v("--why-card-bg"),
        cardBorder: v("--why-card-border") || "transparent",
        wallpaper: [1, 2, 3, 4].map((i) => v(`--sample-wallpaper-${i}`)),
      });
    };
    read();
    const themes = new MutationObserver(read);
    themes.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const system = matchMedia("(prefers-color-scheme: light)");
    system.addEventListener("change", read);
    return () => {
      themes.disconnect();
      system.removeEventListener("change", read);
    };
  }, [el, enabled]);
  return colors;
}

type Drag = {
  x: number;
  startPos: number;
  moved: boolean;
  lastX: number;
  lastT: number;
  v: number;
};

export function WhyLunar({ items }: { items: Item[] }) {
  const t = useTranslations("Why");
  const reduced = useReducedMotion();
  const n = items.length;
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [target, setTarget] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const rig = useRef<Rig>({ target: 0, pos: 0, vel: 0, dragging: false, dragPos: 0 });
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });
  const labels = useRef<(HTMLElement | null)[]>([]);
  const hits = useRef<Hit[]>([]);
  const openers = useRef<(HTMLButtonElement | null)[]>([]);
  const repaint = useRef<() => void>(() => {});
  const drag = useRef<Drag | null>(null);

  // Nothing happens until the section is close to the screen: then check for WebGL (creating a
  // test context is not free) and load the 3D, or draw the flat faces.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setWebgl(canUseWebGL());
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const use3D = near && webgl && !reduced;
  const show3D = use3D && ready;
  const active = cardAt(target, n);
  const colors = useArcColors(section, use3D);

  // The arc turns on its own only while someone could be watching it and isn't using it.
  useEffect(() => {
    if (!use3D) return;
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [use3D]);

  const auto =
    show3D && !paused && !hover && !dragging && !focusIn && open === null && inView && pageVisible;

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setTarget((x) => x + 1), AUTO_MS);
    return () => clearTimeout(timer);
  }, [auto, target]);

  useEffect(() => {
    rig.current.target = target;
    repaint.current();
  }, [target]);

  // The card titles mount with the 3D; draw once more so the scene places them.
  useEffect(() => {
    if (show3D) repaint.current();
  }, [show3D]);

  const go = (step: number) => setTarget((x) => x + step);
  const bringToFront = (i: number) => setTarget((x) => x + Math.round(wrapOffset(i, x, n)));

  const scrollRow = (dir: number) => {
    const el = row.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: reduced ? "auto" : "smooth" });
  };

  /** Pixels of drag that move the arc by one card: about one front card's width. */
  const pxPerCard = () => {
    const h = hits.current[cardAt(rig.current.pos, n)];
    return h ? Math.max((h.right - h.left) * 1.1, 80) : 300;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!show3D || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    drag.current = {
      x: e.clientX,
      startPos: rig.current.pos,
      moved: false,
      lastX: e.clientX,
      lastT: e.timeStamp,
      v: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!show3D) return;
    const d = drag.current;
    if (d) {
      const dx = e.clientX - d.x;
      if (!d.moved && Math.abs(dx) > 6) {
        d.moved = true;
        rig.current.dragging = true;
        pointer.current.active = false;
      }
      if (d.moved) {
        const dt = Math.max(e.timeStamp - d.lastT, 8);
        d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v;
        d.lastX = e.clientX;
        d.lastT = e.timeStamp;
        rig.current.dragPos = d.startPos - dx / pxPerCard();
        repaint.current();
      }
      return;
    }
    // The front island leans toward the mouse while it is over the front card.
    const h = hits.current[active];
    const box = stage.current?.getBoundingClientRect();
    if (!h || !box || e.pointerType !== "mouse") return;
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const inside = x >= h.left && x <= h.right && y >= h.top && y <= h.bottom;
    pointer.current.active = inside;
    if (inside) {
      pointer.current.x = ((x - h.left) / (h.right - h.left)) * 2 - 1;
      pointer.current.y = ((y - h.top) / (h.bottom - h.top)) * 2 - 1;
    }
    repaint.current();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    if (d.moved) {
      // Let a flick carry on a little (px/ms → cards/s), at most one card past where it was let go.
      const vCards = Math.max(-6, Math.min(6, (-d.v / pxPerCard()) * 1000));
      const pos = rig.current.pos;
      const settle = Math.max(
        Math.floor(pos) - 1,
        Math.min(Math.ceil(pos) + 1, Math.round(pos + vCards * 0.15)),
      );
      rig.current.dragging = false;
      rig.current.vel = vCards;
      rig.current.target = settle;
      setTarget(settle);
      repaint.current();
      return;
    }
    if (cancelled) return;
    // A click: the nearest card under the pointer.
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    let picked = -1;
    hits.current.forEach((h, i) => {
      if (!h || x < h.left || x > h.right || y < h.top || y > h.bottom) return;
      if (picked < 0 || Math.abs(h.d) < Math.abs(hits.current[picked]!.d)) picked = i;
    });
    if (picked < 0) return;
    if (picked === active) setOpen(active);
    else bringToFront(picked);
  };

  const controlButton =
    "inline-grid size-11 place-items-center rounded-full border border-lunar-border text-lunar-text hover:bg-lunar-surface";

  return (
    <section
      ref={section}
      aria-labelledby="why-lunar"
      className="mx-auto w-full max-w-6xl px-4 py-24"
      data-why={show3D ? "3d" : "flat"}
    >
      <h2 id="why-lunar" className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h2>

      <div
        role="region"
        aria-roledescription={t("carousel")}
        aria-labelledby="why-lunar"
        className="mt-10"
        // Only keyboard focus stops the turning (WAI-ARIA carousel pattern). Focus left on a button
        // after a mouse click, or put back on "Read more" after the dialog closes, does not.
        onFocus={(e) => setFocusIn(e.target.matches(":focus-visible"))}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusIn(false);
        }}
        onKeyDown={(e) => {
          if (!use3D || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
          e.preventDefault();
          go(e.key === "ArrowLeft" ? -1 : 1);
        }}
      >
        {use3D && (
          <div
            ref={stage}
            aria-hidden="true"
            data-why-stage
            className="relative -mx-4 h-[260px] cursor-grab touch-pan-y overflow-hidden mask-x-from-90% select-none active:cursor-grabbing sm:mx-0 sm:h-[380px] lg:h-[440px]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endDrag(e, false)}
            onPointerCancel={(e) => endDrag(e, true)}
            // Hovering the arc itself (not the text below it) holds it still.
            onPointerEnter={(e) => setHover(e.pointerType === "mouse")}
            onPointerLeave={() => {
              setHover(false);
              pointer.current.active = false;
              repaint.current();
            }}
          >
            {!show3D && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="lunar-island grid aspect-[16/8] w-[min(80%,22rem)] place-items-center rounded-[24px] bg-(image:--sample-wallpaper)">
                  <FlatIsland id={items[active].id} draw className="w-[62%]" />
                </div>
              </div>
            )}
            {colors && (
              <WhyArcScene
                ids={items.map((item) => item.id)}
                colors={colors}
                rigRef={rig}
                pointerRef={pointer}
                labelsRef={labels}
                hitsRef={hits}
                onReady={(state) => {
                  repaint.current = state.invalidate;
                  setReady(true);
                }}
              />
            )}
            {/* The titles on the cards: copies of the headings below, placed by the scene. */}
            {show3D &&
              items.map((item, i) => (
                <p
                  key={item.id}
                  ref={(el) => {
                    labels.current[i] = el;
                  }}
                  className="lunar-island invisible absolute top-0 left-0 line-clamp-2 w-[280px] origin-top-left font-display text-[20px] leading-tight font-semibold text-lunar-text will-change-transform"
                >
                  {item.title}
                </p>
              ))}
          </div>
        )}

        <div
          className={cn(
            use3D && "mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between",
          )}
        >
          <div
            ref={row}
            aria-live={use3D ? (auto ? "off" : "polite") : undefined}
            className={cn(
              use3D
                ? "min-h-44 md:max-w-2xl"
                : "-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4",
            )}
          >
            {items.map((item, i) =>
              use3D ? (
                <div
                  key={item.id}
                  data-why-card={item.id}
                  role="group"
                  aria-roledescription={t("slide")}
                  aria-label={t("position", { n: i + 1, total: n })}
                  hidden={i !== active}
                >
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-lg text-lunar-text-2">{item.body}</p>
                  <button
                    ref={(el) => {
                      openers.current[i] = el;
                    }}
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={t("open", { title: item.title })}
                    onClick={() => setOpen(i)}
                    className="mt-5 inline-flex min-h-11 items-center rounded-full border border-lunar-border px-5 font-medium hover:bg-lunar-surface"
                  >
                    {t("more")}
                  </button>
                </div>
              ) : (
                <div
                  key={item.id}
                  data-why-card={item.id}
                  role="group"
                  aria-roledescription={t("slide")}
                  aria-label={t("position", { n: i + 1, total: n })}
                  className="lunar-island relative flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-(--why-card-border) bg-(--why-card-bg) sm:w-[calc(50%-8px)] lg:w-[calc((100%-32px)/3)]"
                >
                  <div className="grid aspect-[16/8] place-items-center bg-(image:--sample-wallpaper)">
                    <FlatIsland id={item.id} draw={near} className="w-[64%]" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-(--why-card-text-2)">{item.body}</p>
                  </div>
                  <button
                    ref={(el) => {
                      openers.current[i] = el;
                    }}
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={t("open", { title: item.title })}
                    className="absolute inset-0 cursor-pointer rounded-[24px] focus-visible:outline-2 focus-visible:-outline-offset-2"
                    onClick={() => setOpen(i)}
                  />
                </div>
              ),
            )}
          </div>

          <div
            className={cn(
              "flex shrink-0 items-center justify-end gap-2",
              use3D ? "md:pt-1" : "mt-6",
            )}
          >
            <button
              type="button"
              aria-label={t("previous")}
              className={controlButton}
              onClick={() => (use3D ? go(-1) : scrollRow(-1))}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            {use3D && (
              <span
                aria-hidden="true"
                data-why-counter
                className="min-w-14 text-center text-lunar-text-2 tabular-nums"
              >
                {active + 1} / {n}
              </span>
            )}
            <button
              type="button"
              aria-label={t("next")}
              className={controlButton}
              onClick={() => (use3D ? go(1) : scrollRow(1))}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            {use3D && (
              <button
                type="button"
                aria-label={paused ? t("play") : t("pause")}
                className={cn(controlButton, "ml-2")}
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? (
                  <Play className="size-4" aria-hidden="true" />
                ) : (
                  <Pause className="size-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {open !== null && (
        <DetailDialog
          item={items[open]}
          use3D={use3D}
          closeLabel={t("close")}
          onClose={() => {
            const opener = openers.current[open];
            setOpen(null);
            opener?.focus();
          }}
        />
      )}
    </section>
  );
}

function DetailDialog({
  item,
  use3D,
  closeLabel,
  onClose,
}: {
  item: Item;
  use3D: boolean;
  closeLabel: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });
  const repaint = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);

  // A native modal dialog: focus stays inside, Escape closes it, the page behind is inert.
  // No close() on cleanup: its "close" event would call onClose and unmount the dialog again when
  // React runs effects twice in development. Removing the element on unmount is enough.
  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="why-detail-title"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(44rem,calc(100vw-2rem))] max-w-none overflow-y-auto rounded-[28px] bg-transparent p-0 text-lunar-text backdrop:bg-black/60"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="lunar-island overflow-hidden rounded-[28px] border border-(--why-card-border) bg-(--why-card-bg)"
      >
        <div
          ref={stage}
          className="lunar-island relative grid aspect-[16/8] place-items-center bg-(image:--sample-wallpaper)"
          onPointerMove={(e) => {
            if (pointerFrom(e, stage.current, pointer.current)) repaint.current();
          }}
          onPointerLeave={() => {
            pointer.current.active = false;
            repaint.current();
          }}
        >
          {use3D && (
            <IslandViewer
              id={item.id}
              pointer={pointer}
              onReady={(state) => {
                repaint.current = state.invalidate;
                setReady(true);
              }}
            />
          )}
          {!(use3D && ready) && <FlatIsland id={item.id} draw className="w-[62%]" />}
        </div>
        <div className="p-8">
          <h2 id="why-detail-title" className="text-3xl font-bold tracking-tight">
            {item.title}
          </h2>
          <p className="mt-3 text-lg text-(--why-card-text-2)">{item.body}</p>
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-lunar-border px-5 font-medium hover:bg-lunar-bg"
          >
            <X className="size-4" aria-hidden="true" />
            {closeLabel}
          </button>
        </div>
      </motion.div>
    </dialog>
  );
}
