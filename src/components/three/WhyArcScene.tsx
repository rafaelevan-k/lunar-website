"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { WhyId } from "@/content/types";
import { cardAt, wrapOffset, type ArcColors, type Hit, type Rig } from "./arc-rig";
import { faceShape, FACE_SIZE } from "./faces";
import { IslandModel, type Pointer } from "./IslandModel";
import { StudioLight } from "./studio";

/*
 * "Why Lunar" as an arc: the cards stand on a wide circle in front of the camera, the front one
 * nearest, the others turning and falling back on either side. Endless: the card after the last
 * is the first. Each card is a rounded panel (wallpaper on top, the card colour below) with
 * Lunar's island in 3D on the wallpaper.
 * - The card titles are HTML, not drawn here: every frame this scene places each title element over
 *   its card with a 2D matrix (WhyLunar renders them, aria-hidden, as copies of the real headings).
 * - WhyLunar owns the position ("rig"); this scene springs toward it and renders on demand only
 *   while something moves.
 * Loaded lazily (next/dynamic, no SSR) by WhyLunar, only with WebGL and full motion.
 */

/** Card size in scene units: the wallpaper is 16 : 8 like the flat cards, the title area below. */
const CARD_W = 3.2;
const WALL_H = CARD_W / 2;
const CAPTION_H = 0.72;
const CARD_H = WALL_H + CAPTION_H;
const RADIUS = 0.2;
/** Angle between neighbours, and a circle wide enough to leave a small gap between them. */
const STEP = 0.32;
const ARC_R = (CARD_W * 1.1) / (2 * Math.sin(STEP / 2));
/** Cards further than this many places from the front are hidden (they would face away). */
const MAX_D = 4.5;
const FOV = 30;

const STOPS = [0, 0.45, 0.8, 1];
/** Reused for projecting points; frames run one at a time. */
const SCRATCH = new THREE.Vector3();
const IDLE: Pointer = { x: 0, y: 0, active: false };

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

/** The panel's picture: the sample wallpaper (the CSS gradient at 165°) over the card colour. */
function panelCanvas(colors: ArcColors) {
  const px = 200;
  const w = Math.round(CARD_W * px);
  const h = Math.round(CARD_H * px);
  const wall = Math.round(WALL_H * px);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = colors.cardBg;
  ctx.fillRect(0, 0, w, h);
  // A CSS angle: 0° points up, clockwise; the line is long enough to reach every corner.
  const a = (165 * Math.PI) / 180;
  const dx = Math.sin(a);
  const dy = -Math.cos(a);
  const len = Math.abs(w * dx) + Math.abs(wall * dy);
  const g = ctx.createLinearGradient(
    w / 2 - (dx * len) / 2,
    wall / 2 - (dy * len) / 2,
    w / 2 + (dx * len) / 2,
    wall / 2 + (dy * len) / 2,
  );
  colors.wallpaper.forEach((color, i) => g.addColorStop(STOPS[i], color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, wall);
  // The 1 px border of the flat cards (transparent in the light theme).
  ctx.strokeStyle = colors.cardBorder;
  ctx.lineWidth = 3;
  const r = RADIUS * px;
  ctx.beginPath();
  ctx.roundRect(1.5, 1.5, w - 3, h - 3, r);
  ctx.stroke();
  return c;
}

function usePanel(colors: ArcColors) {
  const geometry = useMemo(() => {
    const g = new THREE.ShapeGeometry(roundedRect(CARD_W, CARD_H, RADIUS), 8);
    // ShapeGeometry's UVs are its x/y; stretch them to 0…1 over the card.
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, pos.getX(i) / CARD_W + 0.5, pos.getY(i) / CARD_H + 0.5);
    }
    return g;
  }, []);
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(panelCanvas(colors));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [colors]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => texture.dispose(), [texture]);
  return { geometry, texture };
}

function Card({
  id,
  index,
  count,
  rigRef,
  frontRef,
  pointerRef,
  labelsRef,
  hitsRef,
  panel,
}: {
  id: WhyId;
  index: number;
  count: number;
  rigRef: RefObject<Rig>;
  frontRef: RefObject<number>;
  pointerRef: RefObject<Pointer>;
  labelsRef: RefObject<(HTMLElement | null)[]>;
  hitsRef: RefObject<Hit[]>;
  panel: { geometry: THREE.BufferGeometry; texture: THREE.Texture };
}) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const shape = faceShape(id);
  const islandScale = (0.62 * CARD_W) / (FACE_SIZE[shape].w / 40);
  // The island tilts toward the pointer only on the front card.
  const cardPointer = useMemo(
    () => ({
      get current() {
        return frontRef.current === index ? pointerRef.current : IDLE;
      },
    }),
    [frontRef, index, pointerRef],
  );

  useFrame(({ camera, size }) => {
    const g = group.current;
    if (!g) return;
    const d = wrapOffset(index, rigRef.current.pos, count);
    const el = labelsRef.current[index];
    const visible = Math.abs(d) < MAX_D;
    g.visible = visible;
    if (!visible) {
      hitsRef.current[index] = null;
      if (el) el.style.visibility = "hidden";
      return;
    }
    const theta = d * STEP;
    g.position.set(ARC_R * Math.sin(theta), 0, ARC_R * (Math.cos(theta) - 1));
    g.rotation.set(0, theta, 0);
    g.updateMatrixWorld();
    // Cards further back fade toward the page a little.
    const shade = 1 - 0.38 * Math.min(Math.abs(d) / 3, 1);
    material.current?.color.setScalar(shade);

    const toScreen = (x: number, y: number) => {
      SCRATCH.set(x, y, 0.001).applyMatrix4(g.matrixWorld).project(camera);
      return [((SCRATCH.x + 1) / 2) * size.width, ((1 - SCRATCH.y) / 2) * size.height] as const;
    };

    // The box the card covers, for clicks and the drag speed.
    const corners = [
      toScreen(-CARD_W / 2, CARD_H / 2),
      toScreen(CARD_W / 2, CARD_H / 2),
      toScreen(-CARD_W / 2, -CARD_H / 2),
      toScreen(CARD_W / 2, -CARD_H / 2),
    ];
    hitsRef.current[index] = {
      left: Math.min(...corners.map((c) => c[0])),
      right: Math.max(...corners.map((c) => c[0])),
      top: Math.min(...corners.map((c) => c[1])),
      bottom: Math.max(...corners.map((c) => c[1])),
      d,
    };

    // The title: its element's top-left, top-right and bottom-left corners go to the projected
    // corners of the card's title area. A 2D matrix only (no CSS 3D); close enough for the slant.
    if (el) {
      const opacity = Math.max(0, Math.min(1, (1.7 - Math.abs(d)) / 0.7));
      el.style.visibility = opacity > 0 ? "visible" : "hidden";
      if (opacity > 0) {
        const lw = el.offsetWidth || 1;
        const lh = el.offsetHeight || 1;
        const inset = 0.22;
        const left = -CARD_W / 2 + inset;
        const width = CARD_W - inset * 2;
        const top = CARD_H / 2 - WALL_H - 0.15;
        const height = (lh / lw) * width;
        const [ax, ay] = toScreen(left, top);
        const [bx, by] = toScreen(left + width, top);
        const [cx, cy] = toScreen(left, top - height);
        el.style.transform = `matrix(${(bx - ax) / lw},${(by - ay) / lw},${(cx - ax) / lh},${(cy - ay) / lh},${ax},${ay})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(10 - Math.round(Math.abs(d) * 2));
      }
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={panel.geometry}>
        <meshBasicMaterial ref={material} map={panel.texture} toneMapped={false} />
      </mesh>
      <group position={[0, CARD_H / 2 - WALL_H / 2, 0.16]} scale={islandScale}>
        <IslandModel id={id} pointer={cardPointer} maxTilt={0.3} hoverScale={1.05} />
      </group>
    </group>
  );
}

/** Moves the camera back far enough for the front card's share of the width, per screen size. */
function Rigging({
  rigRef,
  frontRef,
  count,
}: {
  rigRef: RefObject<Rig>;
  frontRef: RefObject<number>;
  count: number;
}) {
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const share = size.width < 640 ? 0.8 : size.width < 1024 ? 0.42 : 0.3;
    const t = 2 * Math.tan((FOV * Math.PI) / 360);
    const dist = Math.max(CARD_W / (share * t * aspect), (CARD_H * 1.25) / t);
    camera.position.set(0, 0, dist);
    camera.updateProjectionMatrix();
    invalidate();
  }, [size, camera, invalidate]);

  // A critically damped spring toward the target; frames are asked for only while it moves.
  useFrame((state, delta) => {
    const r = rigRef.current;
    if (r.dragging) {
      r.pos = r.dragPos;
      r.vel = 0;
    } else {
      const dt = Math.min(delta, 1 / 30);
      const k = 90;
      r.vel += (k * (r.target - r.pos) - 2 * Math.sqrt(k) * r.vel) * dt;
      r.pos += r.vel * dt;
      if (Math.abs(r.target - r.pos) < 0.0005 && Math.abs(r.vel) < 0.0005) {
        r.pos = r.target;
        r.vel = 0;
      } else {
        state.invalidate();
      }
    }
    frontRef.current = cardAt(r.pos, count);
  }, -1);

  return null;
}

export default function WhyArcScene({
  ids,
  colors,
  rigRef,
  pointerRef,
  labelsRef,
  hitsRef,
  onReady,
}: {
  ids: WhyId[];
  colors: ArcColors;
  rigRef: RefObject<Rig>;
  pointerRef: RefObject<Pointer>;
  labelsRef: RefObject<(HTMLElement | null)[]>;
  hitsRef: RefObject<Hit[]>;
  onReady: (state: { invalidate: () => void }) => void;
}) {
  const frontRef = useRef(0);
  return (
    <Canvas
      aria-hidden="true"
      className="!absolute inset-0"
      style={{ pointerEvents: "none" }}
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={onReady}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={FOV} />
      <StudioLight />
      <Rigging rigRef={rigRef} frontRef={frontRef} count={ids.length} />
      <Panels
        ids={ids}
        colors={colors}
        rigRef={rigRef}
        frontRef={frontRef}
        pointerRef={pointerRef}
        labelsRef={labelsRef}
        hitsRef={hitsRef}
      />
    </Canvas>
  );
}

function Panels({
  ids,
  colors,
  ...shared
}: {
  ids: WhyId[];
  colors: ArcColors;
  rigRef: RefObject<Rig>;
  frontRef: RefObject<number>;
  pointerRef: RefObject<Pointer>;
  labelsRef: RefObject<(HTMLElement | null)[]>;
  hitsRef: RefObject<Hit[]>;
}) {
  const panel = usePanel(colors);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [panel, invalidate]);
  return ids.map((id, i) => (
    <Card key={id} id={id} index={i} count={ids.length} panel={panel} {...shared} />
  ));
}
