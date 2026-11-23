"use client";

import { IslandPanel } from "@/components/lunar/island/IslandPanel";
import { PAGE_IDS } from "@/components/lunar/island/pages";

/**
 * The open island showing one page. Picking another page on it (tabs, dots, arrows) jumps to that
 * page's section of the features page, so the panel works as a map of the page.
 */
export function FeaturePanel({ page }: { page: (typeof PAGE_IDS)[number] }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-(image:--sample-wallpaper) px-2 pt-3 pb-8">
      <IslandPanel
        islandStyle="pill"
        index={PAGE_IDS.indexOf(page)}
        onIndexChange={(i) =>
          document.getElementById(`feature-${PAGE_IDS[i]}`)?.scrollIntoView({ block: "start" })
        }
      />
    </div>
  );
}
