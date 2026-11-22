"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Draws its child at the app's real size (width × height in DIPs) and scales it down to fit the
 * space it gets, so a 680-wide Notch panel still fits a phone. Never scales up.
 */
export function IslandScaler({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = outer.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(Math.min(1, entry.contentRect.width / width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={outer} className="flex w-full justify-center overflow-hidden">
      <div style={{ width: width * scale, height: height * scale }}>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
