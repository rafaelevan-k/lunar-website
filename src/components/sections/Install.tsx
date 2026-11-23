"use client";

import { ShieldAlert } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

/*
 * "Install in a minute": the three steps; a simplified, clearly labelled drawing of the SmartScreen
 * warning where "More info" reveals "Run anyway" (what the visitor will really have to click); and
 * the PowerShell check with a copy button and the expected SHA-256 from the build.
 */
export function Install({
  steps,
  smartScreen,
  verify,
  verifyCommand,
  requirements,
  updating,
  removing,
  version,
  sha256,
}: {
  steps: string[];
  smartScreen: string;
  verify: string;
  verifyCommand: string;
  requirements: string;
  updating: string;
  removing: string;
  version: string;
  sha256: string | null;
}) {
  const t = useTranslations("Sections.install");
  const [more, setMore] = useState(false);

  return (
    <section aria-labelledby="install" className="mx-auto w-full max-w-6xl px-4 py-24">
      <h2 id="install" className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={i} className="border-t border-lunar-border pt-5">
            <span className="font-display text-3xl font-bold text-lunar-text-2 tabular-nums">
              {i + 1}
            </span>
            <p className="mt-2">{step}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-lunar-text-2">{requirements}</p>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold">{t("smartTitle")}</h3>
          <p className="mt-2 text-lunar-text-2">{smartScreen}</p>
          {/* Not the real window: a simple drawing of what to click. */}
          <figure className="mt-6">
            <div className="rounded-2xl bg-(--sample-smartscreen) p-6 text-white" lang="en">
              <ShieldAlert className="size-6" aria-hidden="true" />
              <p className="mt-3 text-xl font-semibold">{t("smartDialog")}</p>
              <p className="mt-2 text-sm text-white/85">{t("smartBody")}</p>
              {!more && (
                <button
                  type="button"
                  onClick={() => setMore(true)}
                  className="mt-3 text-sm underline underline-offset-4"
                >
                  {t("moreInfo")}
                </button>
              )}
              <AnimatePresence>
                {more && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-white/85"
                  >
                    App: Lunar.msi
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-6 flex justify-end gap-2">
                {more && (
                  <button
                    type="button"
                    onClick={() => setMore(false)}
                    className="rounded border border-white/70 px-4 py-1.5 text-sm"
                  >
                    {t("runAnyway")}
                  </button>
                )}
                <span className="rounded bg-white/15 px-4 py-1.5 text-sm">Don&apos;t run</span>
              </div>
            </div>
            <figcaption className="mt-2 text-xs text-lunar-text-2">{t("illustration")}</figcaption>
          </figure>
        </div>

        <div>
          <h3 className="text-xl font-semibold">PowerShell</h3>
          <p className="mt-2 text-lunar-text-2">{verify}</p>
          <div className="lunar-island mt-6 flex items-center justify-between gap-3 rounded-2xl border border-lunar-border bg-lunar-bg p-3 pl-5">
            <code className="font-mono text-sm text-lunar-text">{verifyCommand}</code>
            <CopyButton value={verifyCommand} label={t("copy")} copiedLabel={t("copied")} />
          </div>
          {sha256 && (
            <div className="mt-4">
              <p className="text-sm text-lunar-text-2">{t("checksum", { version })}</p>
              <p className="mt-1 font-mono text-xs break-all">{sha256}</p>
            </div>
          )}
          <div className="mt-10 grid gap-4 text-lunar-text-2">
            <p>{updating}</p>
            <p>{removing}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
