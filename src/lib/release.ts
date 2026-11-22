import generated from "@/content/release.generated.json";

/*
 * The latest Lunar release, as read from GitHub by scripts/fetch-release.mjs when the site was
 * built (or the checked-in fallback). The page never asks GitHub itself.
 */

export type Release = {
  version: string;
  publishedAt: string;
  sizeBytes: number;
  /** Lowercase hex, or null when the release has no Lunar.msi.sha256. */
  sha256: string | null;
  releaseUrl: string;
  source: "github" | "fallback";
};

/** Always the newest installer, even if the site was built before a new release came out. */
export const DOWNLOAD_URL =
  "https://github.com/rafaelevan-k/lunar/releases/latest/download/Lunar.msi";
export const CHECKSUM_URL =
  "https://github.com/rafaelevan-k/lunar/releases/latest/download/Lunar.msi.sha256";

function isRelease(value: unknown): value is Release {
  const r = value as Release;
  return (
    typeof r?.version === "string" &&
    /^\d+\.\d+\.\d+$/.test(r.version) &&
    !Number.isNaN(Date.parse(r.publishedAt)) &&
    Number.isInteger(r.sizeBytes) &&
    r.sizeBytes > 0 &&
    (r.sha256 === null || /^[a-f0-9]{64}$/.test(r.sha256)) &&
    typeof r.releaseUrl === "string" &&
    r.releaseUrl.startsWith("https://github.com/rafaelevan-k/lunar/releases/") &&
    (r.source === "github" || r.source === "fallback")
  );
}

export function getRelease(): Release {
  if (!isRelease(generated)) {
    throw new Error(
      "src/content/release.generated.json is not a valid release; run npm run release:fetch",
    );
  }
  return generated;
}

/** Size as Windows shows it (1 MB = 1024 × 1024 bytes), e.g. "66.9 MB" or "66,9 MB". */
export function formatSize(bytes: number, locale: string) {
  const mb = bytes / (1024 * 1024);
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(mb)} MB`;
}

export function formatReleaseDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(iso),
  );
}
