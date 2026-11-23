/*
 * The visitor's display preferences: theme and motion. They live on <html> as data-theme and
 * data-motion, and are kept in localStorage (never a cookie). PREFERENCE_SCRIPT applies the saved
 * values before the first paint, so the page never flashes the wrong theme. It also marks a
 * visitor who is not on a Windows desktop (data-platform="other"), so the download note can show
 * from the first paint instead of pushing the page down later.
 */

export const THEMES = ["system", "dark", "light"] as const;
export const MOTIONS = ["system", "reduce", "full"] as const;

export type Theme = (typeof THEMES)[number];
export type Motion = (typeof MOTIONS)[number];

export const DEFAULT_THEME: Theme = "dark";
export const DEFAULT_MOTION: Motion = "system";

const KEYS = { theme: "lunar-theme", motion: "lunar-motion" } as const;
const CHANGE_EVENT = "lunar:preferences";

// Kept as a fixed string (no interpolation) so a CSP hash can allow it later (WEB-04).
export const PREFERENCE_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem("lunar-theme"),m=localStorage.getItem("lunar-motion");if(t==="system"||t==="dark"||t==="light")d.setAttribute("data-theme",t);if(m==="system"||m==="reduce"||m==="full")d.setAttribute("data-motion",m);if(!/Windows NT/.test(navigator.userAgent))d.setAttribute("data-platform","other")}catch(e){}})()`;

function isTheme(value: string | null): value is Theme {
  return (THEMES as readonly string[]).includes(value ?? "");
}

function isMotion(value: string | null): value is Motion {
  return (MOTIONS as readonly string[]).includes(value ?? "");
}

export function readTheme(): Theme {
  const value = document.documentElement.getAttribute("data-theme");
  return isTheme(value) ? value : DEFAULT_THEME;
}

export function readMotion(): Motion {
  const value = document.documentElement.getAttribute("data-motion");
  return isMotion(value) ? value : DEFAULT_MOTION;
}

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private window, site data off). The choice still applies to this page.
  }
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  save(KEYS.theme, theme);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function setMotion(motion: Motion) {
  document.documentElement.setAttribute("data-motion", motion);
  save(KEYS.motion, motion);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const DARK_QUERY = "(prefers-color-scheme: dark)";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/** Calls back when a preference changes here, in another tab, or in the system settings. */
export function subscribePreferences(callback: () => void) {
  const dark = window.matchMedia(DARK_QUERY);
  const reduce = window.matchMedia(REDUCE_QUERY);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEYS.theme && isTheme(event.newValue)) {
      document.documentElement.setAttribute("data-theme", event.newValue);
    }
    if (event.key === KEYS.motion && isMotion(event.newValue)) {
      document.documentElement.setAttribute("data-motion", event.newValue);
    }
    callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  dark.addEventListener("change", callback);
  reduce.addEventListener("change", callback);
  // Read once right after subscribing: the inline script may have applied a saved choice that the
  // server-rendered markup (dark, system) doesn't show yet.
  queueMicrotask(callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
    dark.removeEventListener("change", callback);
    reduce.removeEventListener("change", callback);
  };
}

/** The theme actually showing: "system" resolved to dark or light. */
export function readResolvedTheme(): "dark" | "light" {
  const theme = readTheme();
  if (theme !== "system") return theme;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** True when animation should be kept to a minimum: chosen on the site, or asked for by the system. */
export function readReducedMotion(): boolean {
  const motion = readMotion();
  if (motion !== "system") return motion === "reduce";
  return window.matchMedia(REDUCE_QUERY).matches;
}
