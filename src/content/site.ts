// Site-wide links. Labels are message keys in messages/*.json (namespace "Nav").

export const LUNAR_REPO_URL = "https://github.com/rafaelevan-k/lunar";
// The release page, not the .msi itself: the direct download with version and size comes in WEB-08.
export const LATEST_RELEASE_URL = `${LUNAR_REPO_URL}/releases/latest`;

export const NAV_LINKS = [
  { href: "/features", key: "features" },
  { href: "/privacy", key: "privacy" },
  { href: "/changelog", key: "changelog" },
] as const;
