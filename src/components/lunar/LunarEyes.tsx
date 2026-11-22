import { cn } from "@/lib/cn";

/*
 * Lunar's eyes, drawn on the same 62x26 grid as src/Lunar.Desktop/Features/Eyes/EyesView.xaml:
 * two 24x26 eyes (TextPrimary), a 12x12 pupil (Background) with a 4x4 highlight at its top left.
 * Static for now; blink, gaze, smile and celebrate come in WEB-05.
 */
const EYES = [{ cx: 12 }, { cx: 50 }] as const;

type LunarEyesProps = {
  className?: string;
};

export function LunarEyes({ className }: LunarEyesProps) {
  return (
    <svg
      viewBox="0 0 62 26"
      className={cn("h-full w-auto", className)}
      aria-hidden="true"
      focusable="false"
    >
      {EYES.map(({ cx }) => (
        <g key={cx}>
          <ellipse cx={cx} cy={13} rx={12} ry={13} fill="var(--lunar-text)" />
          <circle cx={cx} cy={13} r={6} fill="var(--lunar-bg)" />
          <circle cx={cx - 2} cy={11} r={2} fill="var(--lunar-text)" />
        </g>
      ))}
    </svg>
  );
}
