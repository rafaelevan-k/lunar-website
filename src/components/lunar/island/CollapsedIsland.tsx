"use client";

import { Music, Pause, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { LunarEyes } from "../LunarEyes";
import { PlaybackBars, VoiceLevels } from "./activity";
import { notchPath, SIZES, type Activity, type IslandStyle } from "./geometry";
import { IconButton } from "./parts";

/*
 * The closed island at its real size for each activity and style (Shell/IslandLayout.cs):
 * eyes, music playing (Media/MediaPillView.xaml), recording (Recorder/RecordingPillView.xaml) or a
 * focus session (Pomodoro/FocusPillView.xaml). A picture with a name; nothing in it is clickable.
 */
export function CollapsedIsland({
  islandStyle,
  activity,
  className,
}: {
  islandStyle: IslandStyle;
  activity: Activity;
  className?: string;
}) {
  const t = useTranslations("Island.activity");
  const width = SIZES[islandStyle].idleWidth[activity];
  const height = SIZES[islandStyle].idleHeight;
  const notch = islandStyle === "notch";
  const label = activity === "eyes" ? "Lunar" : activity === "focus" ? t("focus") : t(activity);

  return (
    <div
      role="img"
      aria-label={label}
      data-activity={activity}
      className={cn("lunar-island relative shrink-0", className)}
      style={{ width, height }}
    >
      {notch ? (
        <svg className="absolute inset-0" width={width} height={height} aria-hidden="true">
          <path d={notchPath(width, height)} fill="var(--lunar-bg)" />
        </svg>
      ) : (
        <div className="absolute inset-0 rounded-full border border-lunar-border bg-lunar-bg" />
      )}
      <div
        aria-hidden="true"
        className={cn("relative flex h-full items-center", notch ? "px-2" : "")}
      >
        {activity === "eyes" && (
          <div className="flex h-5 w-full justify-center">
            <LunarEyes />
          </div>
        )}
        {activity === "media" && (
          <div className="flex w-full items-center justify-between pr-[18px] pl-4">
            <span className="grid size-7 place-items-center overflow-hidden rounded-[7px] bg-(image:--sample-artwork) [&_svg]:size-3.5">
              <Music />
            </span>
            <PlaybackBars />
          </div>
        )}
        {activity === "recording" && (
          <div className="flex w-full items-center pr-4 pl-2">
            <span className="mr-1">
              <IconButton>
                <Pause />
              </IconButton>
            </span>
            <IconButton>
              <Square className="fill-current" />
            </IconButton>
            <VoiceLevels className="mx-2.5 flex-1" />
            <span className="min-w-10 text-right text-sm tabular-nums">0:42</span>
          </div>
        )}
        {activity === "focus" && (
          <span className="w-full text-center font-display text-xl font-semibold tabular-nums">
            24:13
          </span>
        )}
      </div>
    </div>
  );
}
