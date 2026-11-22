"use client";

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

const THEME_OPTIONS: Option<Theme>[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
];

const MOTION_OPTIONS: Option<Motion>[] = [
  { value: "system", label: "System" },
  { value: "reduce", label: "Reduced" },
  { value: "full", label: "Full" },
];

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
      <legend className="float-left mr-4 w-16 text-sm text-lunar-text-2">{legend}</legend>
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

  return (
    <div className="flex flex-col gap-3">
      <Segmented legend="Theme" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
      <Segmented legend="Motion" options={MOTION_OPTIONS} value={motion} onChange={setMotion} />
    </div>
  );
}
