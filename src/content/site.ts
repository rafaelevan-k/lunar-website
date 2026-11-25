// Site-wide links. Labels are message keys in messages/*.json (namespace "Nav").

export const LUNAR_REPO_URL = "https://github.com/rafaelevan-k/lunar";
// The release page, not the .msi itself: the direct download with version and size comes in WEB-08.
export const LATEST_RELEASE_URL = `${LUNAR_REPO_URL}/releases/latest`;

export const NAV_LINKS = [
  { href: "/features", key: "features" },
  { href: "/privacy", key: "privacy" },
  { href: "/changelog", key: "changelog" },
] as const;

/**
 * Google Search Console ownership check (HTML tag method) for the old address, https://lunar-rafaelevank.vercel.app/.
 * The site now lives at https://lunar.rafaelevank.tech/, which is verified with a DNS record on rafaelevank.tech.
 * Public by design: Google reads it from the page. Keep it, or the site stops being verified.
 */
export const GOOGLE_SITE_VERIFICATION = "yCgjfIcrPtMnqUIbR7zWh411FYxo72Bo-7fU_0GCZX4";
