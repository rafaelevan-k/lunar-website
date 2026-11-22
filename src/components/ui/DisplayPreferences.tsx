"use client";

import { useTranslations } from "next-intl";
import { useId, useSyncExternalStore } from "react";
import {
  DEFAULT_MOTION,
  DEFAULT_THEME,
  readMotion,
  readTheme,
  setMotion,
  setTheme,
  subscribePreferences,
  type Motion,
  type Theme,
} from "@/lib/preferences";

type Option<T extends string> = { value: T; label: string };

const THEME_ORDER: Theme[] = ["dark", "light", "system"];
const MOTION_ORDER: Motion[] = ["system", "reduce", "full"];

function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {/* The legend names the group for screen readers; the visible label is a fixed-width column so
          Theme, Motion and Language line up. */}
      <legend className="sr-only">{legend}</legend>
      <span aria-hidden="true" className="w-24 shrink-0 text-sm text-lunar-text-2">
        {legend}
      </span>
      <div className="flex rounded-full border border-lunar-border p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative grid min-h-9 cursor-pointer place-items-center rounded-full px-3.5 text-sm text-lunar-text-2 transition-colors has-checked:bg-(--toggle-on-bg) has-checked:text-(--toggle-on-text) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-lunar-focus"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function DisplayPreferences() {
  const theme = useSyncExternalStore(subscribePreferences, readTheme, () => DEFAULT_THEME);
  const motion = useSyncExternalStore(subscribePreferences, readMotion, () => DEFAULT_MOTION);
  const themeText = useTranslations("Theme");
  const motionText = useTranslations("Motion");
  const themeOptions = THEME_ORDER.map((value) => ({ value, label: themeText(value) }));
  const motionOptions = MOTION_ORDER.map((value) => ({ value, label: motionText(value) }));

  return (
    <div className="flex flex-col gap-3">
      <Segmented
        legend={themeText("legend")}
        options={themeOptions}
        value={theme}
        onChange={setTheme}
      />
      <Segmented
        legend={motionText("legend")}
        options={motionOptions}
        value={motion}
        onChange={setMotion}
      />
    </div>
  );
}
