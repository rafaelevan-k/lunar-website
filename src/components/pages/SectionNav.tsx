"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A sticky list of the page's sections that marks the one being read (aria-current). Plain anchor
 * links, so it works without JavaScript; the marking is added once the page runs.
 */
export function SectionNav({
  label,
  items,
}: {
  label: string;
  items: { id: string; name: string }[];
}) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = items.find((i) => seen.get(i.id));
        if (first) setCurrent(first.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="sticky top-28">
      <p className="text-sm text-lunar-text-2">{label}</p>
      <ul className="mt-3 border-l border-lunar-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current === item.id ? "location" : undefined}
              className={cn(
                "-ml-px flex min-h-10 items-center border-l-2 pl-4 text-sm transition-colors",
                current === item.id
                  ? "border-lunar-text font-semibold text-lunar-text"
                  : "border-transparent text-lunar-text-2 hover:text-lunar-text",
              )}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
