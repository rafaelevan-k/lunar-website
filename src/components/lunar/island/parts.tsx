import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Small pieces of Lunar's controls, redrawn as pictures (they don't respond; the page around them
 * says what each one does). Sizes from src/Lunar.Desktop/Controls/ControlStyles.xaml and the pages.
 */

/** Card: Surface, 1 px Border, radius 16, padding 8×6. */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-lunar-border bg-lunar-surface px-2 py-1.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** The accent tile that holds a card's icon: 22×22, radius 9. */
export function IconTile({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-[22px] place-items-center rounded-[9px] bg-lunar-accent text-lunar-on-accent [&_svg]:size-[13px]">
      {children}
    </span>
  );
}

/** Round icon button (28 by default; "primary" is the accent fill). */
export function IconButton({
  children,
  size = 28,
  primary = false,
}: {
  children: ReactNode;
  size?: number;
  primary?: boolean;
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full border [&_svg]:size-[14px]",
        primary
          ? "border-lunar-accent bg-lunar-accent text-lunar-on-accent"
          : "border-lunar-border bg-lunar-surface text-lunar-text",
      )}
    >
      {children}
    </span>
  );
}

/** Slider: 6 px track (TextDisabled at 55 %), accent fill, 20 px accent knob with a 2 px ring. */
export function Slider({ value }: { value: number }) {
  return (
    <span className="relative flex h-6 flex-1 items-center">
      <span className="absolute inset-x-0 h-1.5 rounded-full bg-lunar-text-disabled opacity-55" />
      <span
        className="absolute left-0 h-1.5 rounded-full bg-lunar-accent"
        style={{ width: `${value}%` }}
      />
      <span
        className="absolute size-5 -translate-x-1/2 rounded-full border-2 border-lunar-on-accent bg-lunar-accent"
        style={{ left: `${value}%` }}
      />
    </span>
  );
}

/** Switch: 40×22, on = accent track with an OnAccent knob at the right. */
export function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-block h-[22px] w-10 rounded-full border",
        on ? "border-lunar-accent bg-lunar-accent" : "border-lunar-text-2 bg-transparent",
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full",
          on ? "right-1 bg-lunar-on-accent" : "left-1 bg-lunar-text-2",
        )}
      />
    </span>
  );
}

/** Status chip: a small rounded label with a dot. */
export function StatusChip({ children, ok = false }: { children: ReactNode; ok?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-lunar-border px-2 py-px text-[11px] text-lunar-text-2">
      <span className={cn("size-1.5 rounded-full", ok ? "bg-lunar-success" : "bg-lunar-text-2")} />
      {children}
    </span>
  );
}
