"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { CollapsedIsland } from "@/components/lunar/island/CollapsedIsland";
import type { Activity, IslandStyle } from "@/components/lunar/island/geometry";
import { IslandPanel } from "@/components/lunar/island/IslandPanel";
import { cn } from "@/lib/cn";

const ACTIVITIES: Activity[] = ["eyes", "media", "recording", "focus"];

/**
 * A simple look at the island components until the scroll story (WEB-10) uses them: the open panel,
 * the Pill/Notch switch and the closed island for each activity.
 */
export function IslandPreview() {
  const t = useTranslations("Island");
  const [islandStyle, setIslandStyle] = useState<IslandStyle>("pill");
  const name = useId();

  return (
    <section aria-labelledby="island-preview" className="mx-auto w-full max-w-5xl px-4 pb-24">
      <h2 id="island-preview" className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t("preview.title")}
      </h2>
      <p className="mt-3 max-w-xl text-lunar-text-2">{t("preview.lead")}</p>

      <fieldset className="mt-6 flex items-center gap-4">
        <legend className="float-left mr-4 text-sm text-lunar-text-2">{t("styleLegend")}</legend>
        <div className="flex rounded-full border border-lunar-border p-1">
          {(["pill", "notch"] as const).map((value) => (
            <label
              key={value}
              className="relative grid min-h-9 cursor-pointer place-items-center rounded-full px-4 text-sm text-lunar-text-2 has-checked:bg-(--toggle-on-bg) has-checked:text-(--toggle-on-text) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-lunar-focus"
            >
              <input
                type="radio"
                name={name}
                value={value}
                checked={islandStyle === value}
                onChange={() => setIslandStyle(value)}
                className="sr-only"
              />
              {t(value)}
            </label>
          ))}
        </div>
      </fieldset>

      {/* A sample desktop: the Pill floats a little below the top edge, the Notch hangs from it. */}
      <div
        className={cn(
          "mt-8 overflow-hidden rounded-[28px] bg-(image:--sample-wallpaper) px-2 pb-10",
          islandStyle === "pill" ? "pt-3" : "pt-0",
        )}
      >
        <IslandPanel key={islandStyle} islandStyle={islandStyle} />
      </div>

      <h3 className="mt-16 text-xl font-semibold">{t("preview.activitiesTitle")}</h3>
      <p className="mt-2 max-w-xl text-lunar-text-2">{t("preview.activitiesLead")}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {ACTIVITIES.map((activity) => (
          <li
            key={activity}
            className={cn(
              "flex justify-center overflow-hidden rounded-[20px] bg-(image:--sample-wallpaper) pb-8",
              islandStyle === "pill" ? "pt-3" : "pt-0",
            )}
          >
            <CollapsedIsland islandStyle={islandStyle} activity={activity} />
          </li>
        ))}
      </ul>
    </section>
  );
}
