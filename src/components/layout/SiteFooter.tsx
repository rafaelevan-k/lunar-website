import Link from "next/link";
import { LunarPill } from "@/components/lunar/LunarPill";
import { DisplayPreferences } from "@/components/ui/DisplayPreferences";
import { LATEST_RELEASE_URL, LUNAR_REPO_URL, NAV_LINKS, TAGLINE } from "@/content/site";

const linkClass =
  "inline-flex min-h-11 items-center text-lunar-text-2 transition-colors hover:text-lunar-text";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-lunar-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-10 sm:px-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <LunarPill label={null} className="w-20" />
            <span className="font-display text-xl font-semibold tracking-tight">Lunar</span>
          </Link>
          <p className="mt-4 max-w-xs text-lunar-text-2">{TAGLINE}</p>
          <div className="mt-8">
            <DisplayPreferences />
          </div>
        </div>

        <nav aria-labelledby="footer-site">
          <h2 id="footer-site" className="text-sm font-semibold">
            On this site
          </h2>
          <ul className="mt-2">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-source">
          <h2 id="footer-source" className="text-sm font-semibold">
            On GitHub
          </h2>
          <ul className="mt-2">
            <li>
              <a href={LATEST_RELEASE_URL} className={linkClass}>
                Latest release
              </a>
            </li>
            <li>
              <a href={LUNAR_REPO_URL} className={linkClass}>
                Source code
              </a>
            </li>
            <li>
              <a href={`${LUNAR_REPO_URL}/blob/main/docs/PRIVACY.md`} className={linkClass}>
                Full privacy notice
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-10 text-sm text-lunar-text-2 sm:px-6 md:flex-row md:justify-between">
        <p>
          © 2026 Rafael Evan Kristanto. Lunar is free and open source under the Apache License 2.0.
        </p>
        <p>Not affiliated with Apple or Anthropic.</p>
      </div>
    </footer>
  );
}
