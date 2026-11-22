"use client";

import { PerspectiveCamera, View } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, type RefObject } from "react";
import type { WhyId } from "@/content/types";
import { IslandModel, type Pointer } from "./IslandModel";
import { StudioLight } from "./studio";

/*
 * One WebGL canvas for all "Why Lunar" cards (drei <View>), fixed over the page and transparent
 * to the pointer. Each card's 3D slot is tracked and drawn with scissoring, so there is one GL
 * context however many cards there are. Renders only on demand: on pointer movement, while a
 * model is still easing, and while the page scrolls (the slots move).
 * Loaded lazily (next/dynamic, no SSR) by WhyLunar when the section nears the screen.
 */

export type SceneItem = {
  id: WhyId;
  slot: RefObject<HTMLElement | null>;
  pointer: RefObject<Pointer>;
};

function RepaintOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [invalidate]);
  return null;
}

export default function WhyLunarScene({
  items,
  onReady,
}: {
  items: SceneItem[];
  onReady: (state: { invalidate: () => void }) => void;
}) {
  return (
    <Canvas
      aria-hidden="true"
      className="!pointer-events-none !fixed inset-0 z-40"
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={onReady}
    >
      <RepaintOnScroll />
      {items.map((item) => (
        <View key={item.id} track={item.slot as RefObject<HTMLElement>}>
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={30} />
          <StudioLight />
          <IslandModel id={item.id} pointer={item.pointer} />
        </View>
      ))}
    </Canvas>
  );
}
