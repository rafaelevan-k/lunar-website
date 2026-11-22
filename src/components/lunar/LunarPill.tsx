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
};

export function LunarPill({ className, label = "Lunar" }: LunarPillProps) {
  return (
    <div
      {...(label === null ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
      className={cn(
        "lunar-island flex aspect-[160/44] w-40 items-center justify-center rounded-full border border-lunar-border bg-lunar-bg",
        className,
      )}
    >
      <LunarEyes className="h-[45.45%]" />
    </div>
  );
}
