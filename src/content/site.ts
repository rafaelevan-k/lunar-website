// Site-wide links. English only until next-intl arrives (WEB-03); the labels then move to messages/*.json.

export const LUNAR_REPO_URL = "https://github.com/rafaelevan-k/lunar";
// The release page, not the .msi itself: the direct download with version and size comes in WEB-08.
export const LATEST_RELEASE_URL = `${LUNAR_REPO_URL}/releases/latest`;

export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/privacy", label: "Privacy" },
  { href: "/changelog", label: "Changelog" },
] as const;

export const TAGLINE =
  "A Dynamic Island for Windows 11, with a pair of eyes that watch over your desktop.";
