import { useTranslations } from "next-intl";
import { LunarPill } from "@/components/lunar/LunarPill";
import { DisplayPreferences } from "@/components/ui/DisplayPreferences";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { LATEST_RELEASE_URL, LUNAR_REPO_URL, NAV_LINKS } from "@/content/site";
import { Link } from "@/i18n/navigation";

const linkClass =
  "inline-flex min-h-11 items-center text-lunar-text-2 transition-colors hover:text-lunar-text";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const common = useTranslations("Common");
  return (
    <footer className="mt-auto border-t border-lunar-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-10 sm:px-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <LunarPill label={null} className="w-20" />
            <span className="font-display text-xl font-semibold tracking-tight">Lunar</span>
          </Link>
          <p className="mt-4 max-w-xs text-lunar-text-2">{common("tagline")}</p>
          <div className="mt-8">
            <DisplayPreferences />
            <LocaleSwitcher variant="list" className="mt-3" />
          </div>
        </div>

        <nav aria-labelledby="footer-site">
          <h2 id="footer-site" className="text-sm font-semibold">
            {t("onThisSite")}
          </h2>
          <ul className="mt-2">
            {NAV_LINKS.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {nav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-source">
          <h2 id="footer-source" className="text-sm font-semibold">
            {t("onGitHub")}
          </h2>
          <ul className="mt-2">
            <li>
              <a rel="noopener noreferrer" href={LATEST_RELEASE_URL} className={linkClass}>
                {t("latestRelease")}
              </a>
            </li>
            <li>
              <a rel="noopener noreferrer" href={LUNAR_REPO_URL} className={linkClass}>
                {t("sourceCode")}
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href={`${LUNAR_REPO_URL}/blob/main/docs/PRIVACY.md`}
                className={linkClass}
              >
                {t("privacyNotice")}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-10 text-sm text-lunar-text-2 sm:px-6 md:flex-row md:justify-between">
        <p>{t("copyright")}</p>
        <p>{t("notAffiliated")}</p>
      </div>
    </footer>
  );
}
