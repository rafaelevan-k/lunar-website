/** True when the browser can draw WebGL (checked once, in the browser only). */
let cached: boolean | undefined;

export function canUseWebGL() {
  if (cached !== undefined) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    cached = Boolean(gl);
    // Give the test context back at once; browsers allow only a few at a time.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
