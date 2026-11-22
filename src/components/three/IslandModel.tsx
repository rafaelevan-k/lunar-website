"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { WhyId } from "@/content/types";
import { faceCanvas, faceShape, FACE_SIZE } from "./faces";
import { useStudioEnvMap } from "./studio";

/*
 * Lunar's closed island in 3D: a glossy dark slab in the Pill's 160 × 44 stadium (or the Notch's
 * 230 × 32, flat on top with rounded bottom corners), with the card's face drawn on its front.
 * 1 scene unit = 40 island units, so the Pill is 4 × 1.1.
 */

const UNIT = 1 / 40;
const DEPTH = 0.32;
const BEVEL = 0.06;

function outline(shape: "pill" | "notch") {
  const { w, h } = FACE_SIZE[shape];
  const W = w * UNIT;
  const H = h * UNIT;
  const s = new THREE.Shape();
  if (shape === "pill") {
    const r = H / 2;
    s.moveTo(-W / 2 + r, -H / 2);
    s.lineTo(W / 2 - r, -H / 2);
    s.absarc(W / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2, false);
    s.lineTo(-W / 2 + r, H / 2);
    s.absarc(-W / 2 + r, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false);
  } else {
    const r = Math.min(h * 0.3, 28) * UNIT;
    s.moveTo(-W / 2, H / 2);
    s.lineTo(W / 2, H / 2);
    s.lineTo(W / 2, -H / 2 + r);
    s.absarc(W / 2 - r, -H / 2 + r, r, 0, -Math.PI / 2, true);
    s.lineTo(-W / 2 + r, -H / 2);
    s.absarc(-W / 2 + r, -H / 2 + r, r, -Math.PI / 2, -Math.PI, true);
    s.lineTo(-W / 2, H / 2);
  }
  return s;
}

/** Where the pointer is over the card (−1…1 on each axis) and whether it is there at all. */
export type Pointer = { x: number; y: number; active: boolean };

export function IslandModel({
  id,
  pointer,
  maxTilt = 0.38,
  hoverScale = 1.06,
}: {
  id: WhyId;
  /** Read every frame; the card writes into it on pointer move. */
  pointer: { current: Pointer };
  maxTilt?: number;
  hoverScale?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const envMap = useStudioEnvMap();
  const shape = faceShape(id);
  const { w, h } = FACE_SIZE[shape];

  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(outline(shape), {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 6,
      curveSegments: 40,
    });
    g.translate(0, 0, -DEPTH / 2);
    return g;
  }, [shape]);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(faceCanvas(id, 8));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [id]);

  useEffect(
    () => () => {
      geometry.dispose();
      texture.dispose();
    },
    [geometry, texture],
  );

  // Ease toward the pointer; ask for another frame only while still moving (frameloop "demand").
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = pointer.current;
    const targetY = p.active ? p.x * maxTilt : 0;
    const targetX = p.active ? -p.y * maxTilt * 0.8 : 0;
    const targetS = p.active ? hoverScale : 1;
    const k = 1 - Math.exp(-delta * 9);
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    const s = g.scale.x + (targetS - g.scale.x) * k;
    g.scale.setScalar(s);
    const moving =
      Math.abs(targetY - g.rotation.y) > 0.001 ||
      Math.abs(targetX - g.rotation.x) > 0.001 ||
      Math.abs(targetS - s) > 0.001;
    if (moving) state.invalidate();
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#0b0c10"
          roughness={0.32}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.15}
          envMap={envMap}
          envMapIntensity={0.22}
        />
      </mesh>
      <mesh position={[0, 0, DEPTH / 2 + BEVEL + 0.002]}>
        <planeGeometry args={[w * UNIT, h * UNIT]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}
