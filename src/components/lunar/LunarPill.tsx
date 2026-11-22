import { cn } from "@/lib/cn";
import { LunarEyes } from "./LunarEyes";

/*
 * The closed island: a 160x44 stadium in the Background color with a 1px Border edge, and the eyes
 * 20/44 of its height, as in src/Lunar.Desktop/Shell/IslandWindow.xaml and EyesView.xaml.
 * Scale it with the width; the ratio stays fixed.
 */
type LunarPillProps = {
  className?: string;
  label?: string;
};

export function LunarPill({ className, label = "Lunar" }: LunarPillProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex aspect-[160/44] w-40 items-center justify-center rounded-full border border-lunar-border bg-lunar-bg",
        className,
      )}
    >
      <LunarEyes className="h-[45.45%]" />
    </div>
  );
}
