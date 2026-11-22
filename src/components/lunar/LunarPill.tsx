import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { LunarEyes } from "./LunarEyes";

/*
 * The closed island: a 160x44 stadium in the Background color with a 1px Border edge, and the eyes
 * 20/44 of its height, as in src/Lunar.Desktop/Shell/IslandWindow.xaml and EyesView.xaml.
 * Scale it with the width; the ratio stays fixed. It always uses the dark island colors (.lunar-island).
 */
type LunarPillProps = {
  className?: string;
  /** Accessible name. Pass null when the pill is decorative, e.g. next to the word "Lunar". */
  label?: string | null;
  /** Makes the pill a button with this action (label then names the action). */
  onClick?: () => void;
  eyes?: Omit<ComponentProps<typeof LunarEyes>, "className">;
};

const pillClass =
  "lunar-island flex aspect-[160/44] w-40 items-center justify-center rounded-full border border-lunar-border bg-lunar-bg";

export function LunarPill({ className, label = "Lunar", onClick, eyes }: LunarPillProps) {
  const content = <LunarEyes className="h-[45.45%]" {...eyes} />;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label ?? undefined}
        className={cn(pillClass, "cursor-pointer", className)}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      {...(label === null ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
      className={cn(pillClass, className)}
    >
      {content}
    </div>
  );
}
