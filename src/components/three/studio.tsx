"use client";

import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * The light the glossy island reflects: three.js's built-in RoomEnvironment, prefiltered once per
 * WebGL renderer and shared by every island drawn with it. Generated here; nothing is downloaded.
 */
const cache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();

export function useStudioEnvMap() {
  const gl = useThree((s) => s.gl);
  let texture = cache.get(gl);
  if (!texture) {
    const pmrem = new THREE.PMREMGenerator(gl);
    texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    cache.set(gl, texture);
  }
  return texture;
}

export function StudioLight() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
    </>
  );
}
