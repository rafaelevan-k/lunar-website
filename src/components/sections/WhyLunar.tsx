"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { createRef, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { drawFace, faceShape, FACE_SIZE } from "@/components/three/faces";
import type { Pointer } from "@/components/three/IslandModel";
import type { WhyId } from "@/content/types";
import { cn } from "@/lib/cn";
import { canUseWebGL } from "@/lib/webgl";

/*
 * "Why Lunar": eleven cards, each with Lunar's island in 3D showing that feature on its face.
 * - The island tilts toward the mouse and comes a little closer while the card is hovered.
 * - Click or Enter opens the card as a detail view with a large island that follows the pointer.
 * - Three.js is loaded only when the section nears the screen, and only with WebGL and full
 *   motion. Otherwise (and until it is ready) each card shows the same face on a flat 2D canvas.
 * Text is always HTML; the 3D drawings are decorative.
 */

const WhyLunarScene = dynamic(() => import("@/components/three/WhyLunarScene"), { ssr: false });
const IslandViewer = dynamic(() => import("@/components/three/IslandViewer"), { ssr: false });

type Item = { id: WhyId; title: string; body: string };

/** The same face, drawn flat: the fallback without WebGL and the picture until 3D is ready. */
function FlatIsland({ id, className }: { id: WhyId; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const shape = faceShape(id);
  const { w, h } = FACE_SIZE[shape];

  // Drawn whenever the canvas gets its size (it can be 0 wide on the first pass).
  useEffect(() => {
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
  }, [id, w, h]);

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

export function WhyLunar({ items }: { items: Item[] }) {
  const t = useTranslations("Why");
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const repaint = useRef<() => void>(() => {});

  const refs = useMemo(
    () =>
      items.map(() => ({
        slot: createRef<HTMLDivElement>(),
        pointer: { current: { x: 0, y: 0, active: false } } as RefObject<Pointer>,
        opener: createRef<HTMLButtonElement>(),
      })),
    [items],
  );

  // Load the 3D only when the section is close to the screen.
  useEffect(() => {
    // Reads the browser, so it can only run after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(canUseWebGL());
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), {
      rootMargin: "600px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const use3D = near && webgl && !reduced;
  const show3D = use3D && ready;

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

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const r = refs[i];
          return (
            <li
              key={item.id}
              data-why-card={item.id}
              className={cn(
                // lunar-island: the cards keep the dark look in both themes, like the island itself.
                "lunar-island relative flex flex-col overflow-hidden rounded-[24px] border border-(--why-card-border) bg-(--why-card-bg)",
                i === 0 && "sm:col-span-2",
              )}
            >
              <div
                ref={r.slot}
                className={cn(
                  "lunar-island grid place-items-center bg-(image:--sample-wallpaper)",
                  i === 0 ? "aspect-[16/6]" : "aspect-[16/8]",
                )}
              >
                {!show3D && <FlatIsland id={item.id} className={i === 0 ? "w-[42%]" : "w-[64%]"} />}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-(--why-card-text-2)">{item.body}</p>
              </div>
              <button
                ref={r.opener}
                type="button"
                aria-haspopup="dialog"
                aria-label={t("open", { title: item.title })}
                className="absolute inset-0 cursor-pointer rounded-[24px] focus-visible:outline-2 focus-visible:-outline-offset-2"
                onClick={() => setOpen(i)}
                onPointerMove={(e) => {
                  if (show3D && pointerFrom(e, r.slot.current, r.pointer.current))
                    repaint.current();
                }}
                onPointerLeave={() => {
                  r.pointer.current.active = false;
                  repaint.current();
                }}
              />
            </li>
          );
        })}
      </ul>

      {use3D && (
        <WhyLunarScene
          items={items.map((item, i) => ({
            id: item.id,
            slot: refs[i].slot,
            pointer: refs[i].pointer,
          }))}
          onReady={(state) => {
            repaint.current = state.invalidate;
            setReady(true);
          }}
        />
      )}

      {open !== null && (
        <DetailDialog
          item={items[open]}
          use3D={use3D}
          closeLabel={t("close")}
          onClose={() => {
            const opener = refs[open].opener.current;
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
          {!(use3D && ready) && <FlatIsland id={item.id} className="w-[62%]" />}
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
