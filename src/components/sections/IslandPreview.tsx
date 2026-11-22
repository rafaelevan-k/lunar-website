"use client";

import { useTranslations } from "next-intl";
import { CollapsedIsland } from "@/components/lunar/island/CollapsedIsland";
import type { Activity } from "@/components/lunar/island/geometry";

const ACTIVITIES: Activity[] = ["eyes", "media", "recording", "focus"];

/**
 * The closed island for each activity, until the "live activities" section is built: the music,
 * the recording and the focus timer, each on a sample desktop.
 */
export function IslandPreview() {
  const t = useTranslations("Island");

  return (
    <section aria-labelledby="island-activities" className="mx-auto w-full max-w-5xl px-4 pb-24">
      <h2 id="island-activities" className="text-2xl font-semibold">
        {t("preview.activitiesTitle")}
      </h2>
      <p className="mt-2 max-w-xl text-lunar-text-2">{t("preview.activitiesLead")}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {ACTIVITIES.map((activity) => (
          <li
            key={activity}
            className="flex justify-center overflow-hidden rounded-[20px] bg-(image:--sample-wallpaper) pt-3 pb-8"
          >
            <CollapsedIsland islandStyle="pill" activity={activity} />
          </li>
        ))}
      </ul>
    </section>
  );
}
