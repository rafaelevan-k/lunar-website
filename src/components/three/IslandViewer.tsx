"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { RefObject } from "react";
import type { WhyId } from "@/content/types";
import { IslandModel, type Pointer } from "./IslandModel";
import { StudioLight } from "./studio";

/** The large island in a card's detail view. Its own small canvas, rendered on demand. */
export default function IslandViewer({
  id,
  pointer,
  onReady,
}: {
  id: WhyId;
  pointer: RefObject<Pointer>;
  onReady: (state: { invalidate: () => void }) => void;
}) {
  return (
    <Canvas
      aria-hidden="true"
      className="!absolute inset-0"
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={onReady}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6.2]} fov={30} />
      <StudioLight />
      <IslandModel id={id} pointer={pointer} maxTilt={0.55} hoverScale={1.04} />
    </Canvas>
  );
}
