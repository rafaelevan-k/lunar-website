"use client";

import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type ReactNode } from "react";
import { CollapsedIsland } from "@/components/lunar/island/CollapsedIsland";
import {
  notchBottomRadius,
  SIZES,
  PANEL_RADIUS,
  type IslandStyle,
} from "@/components/lunar/island/geometry";
import { IslandPanel } from "@/components/lunar/island/IslandPanel";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cn } from "@/lib/cn";

/*
 * "Meet the island": the story of the open island, told by scrolling.
 * The section is four screens tall and its content stays pinned. First the closed island at the top
 * of a sample desktop opens into the panel (its outline grows, the eyes fade), then each sixth of
 * the remaining scroll shows the next page, with its name and description beside it. Picking a page
 * on the panel scrolls to it, so the scroll position and the page always agree.
 * With reduced motion (and before JavaScript runs) it is a plain section: the panel works by click
 * and the six pages are listed in full.
 */

type Page = { id: string; name: string; body: string };

const PAGES = 6;
/** The first part of the scroll opens the island; the rest walks through the pages. */
const OPEN_END = 0.12;

function pageAt(progress: number) {
  const share = (progress - OPEN_END) / (1 - OPEN_END);
  return Math.max(0, Math.min(PAGES - 1, Math.floor(share * PAGES)));
}

function StyleSwitch({
  value,
  onChange,
}: {
  value: IslandStyle;
  onChange: (value: IslandStyle) => void;
}) {
  const t = useTranslations("Island");
  const name = useId();
  return (
    <fieldset className="flex items-center gap-4">
      <legend className="float-left mr-4 text-sm text-lunar-text-2">{t("styleLegend")}</legend>
      <div className="flex rounded-full border border-lunar-border p-1">
        {(["pill", "notch"] as const).map((style) => (
          <label
            key={style}
            className="relative grid min-h-9 cursor-pointer place-items-center rounded-full px-4 text-sm text-lunar-text-2 has-checked:bg-(--toggle-on-bg) has-checked:text-(--toggle-on-text) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-lunar-focus"
          >
            <input
              type="radio"
              name={name}
              value={style}
              checked={value === style}
              onChange={() => onChange(style)}
              className="sr-only"
            />
            {t(style)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A sample desktop: the Pill floats a little below the top edge, the Notch hangs from it. */
function Desktop({ islandStyle, children }: { islandStyle: IslandStyle; children: ReactNode }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] bg-(image:--sample-wallpaper) px-2 pb-10",
        islandStyle === "pill" ? "pt-3" : "pt-0",
      )}
    >
      {children}
    </div>
  );
}

/** The outline of the island while it opens, as a clip-path in percentages of the scaled panel. */
function useOpeningClip(open: MotionValue<number>, style: IslandStyle) {
  const { idleWidth, idleHeight, expanded } = SIZES[style];
  const w = idleWidth.eyes;
  const { width: W, height: H } = expanded;
  return useTransform(open, (p) => {
    const side = ((W - w) / 2 / W) * 100 * (1 - p);
    const bottom = ((H - idleHeight) / H) * 100 * (1 - p);
    const height = idleHeight + (H - idleHeight) * p;
    if (style === "notch") {
      const r = notchBottomRadius(height);
      return `inset(0% ${side}% ${bottom}% ${side}% round 0 0 ${r}px ${r}px)`;
    }
    const r = idleHeight / 2 + (PANEL_RADIUS - idleHeight / 2) * p;
    return `inset(0% ${side}% ${bottom}% ${side}% round ${r}px)`;
  });
}

export function MeetTheIsland({ title, pages }: { title: string; pages: Page[] }) {
  const reduced = useReducedMotion();
  const [islandStyle, setIslandStyle] = useState<IslandStyle>("pill");
  // Keyed on `reduced`: the first render is always the plain version (the server can't know the
  // visitor's setting); the pinned version mounts fresh once the browser says motion is fine.
  return reduced ? (
    <PlainTour
      key="plain"
      title={title}
      pages={pages}
      islandStyle={islandStyle}
      setIslandStyle={setIslandStyle}
    />
  ) : (
    <PinnedTour
      key="pinned"
      title={title}
      pages={pages}
      islandStyle={islandStyle}
      setIslandStyle={setIslandStyle}
    />
  );
}

type TourProps = {
  title: string;
  pages: Page[];
  islandStyle: IslandStyle;
  setIslandStyle: (style: IslandStyle) => void;
};

function Intro({ title, islandStyle, setIslandStyle }: Omit<TourProps, "pages">) {
  const t = useTranslations("Island");
  return (
    <>
      <h2 id="meet-the-island" className="text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-lunar-text-2">{t("tour.lead")}</p>
      <div className="mt-6">
        <StyleSwitch value={islandStyle} onChange={setIslandStyle} />
      </div>
    </>
  );
}

function PlainTour({ title, pages, islandStyle, setIslandStyle }: TourProps) {
  return (
    <section
      aria-labelledby="meet-the-island"
      className="mx-auto w-full max-w-6xl px-4 py-24"
      data-tour="plain"
    >
      <Intro title={title} islandStyle={islandStyle} setIslandStyle={setIslandStyle} />
      <div className="mt-10">
        <Desktop islandStyle={islandStyle}>
          <IslandPanel key={islandStyle} islandStyle={islandStyle} />
        </Desktop>
      </div>
      <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page, i) => (
          <li key={page.id}>
            <h3 className="text-lg font-semibold">
              <span className="mr-2 text-lunar-text-2 tabular-nums">{i + 1}</span>
              {page.name}
            </h3>
            <p className="mt-2 text-lunar-text-2">{page.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PinnedTour({ title, pages, islandStyle, setIslandStyle }: TourProps) {
  const t = useTranslations("Island.tour");
  const section = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const open = useTransform(scrollYProgress, [0.02, OPEN_END], [0, 1], { clamp: true });
  const eyesOpacity = useTransform(open, [0, 0.45], [1, 0]);
  // The panel fades in as it opens, so the closed island shows only itself: the Notch's curved
  // shoulders are transparent, and the panel behind them must not show through.
  const bodyOpacity = useTransform(open, [0.08, 0.5], [0, 1]);
  const clipPath = useOpeningClip(open, islandStyle);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = pageAt(p);
    if (next !== index) setIndex(next);
  });

  // Picking a page on the panel scrolls to the middle of that page's share of the section.
  const scrollToPage = (page: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const y = top + (OPEN_END + ((page + 0.5) / PAGES) * (1 - OPEN_END)) * range;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y });
  };

  const page = pages[index];

  return (
    <section aria-labelledby="meet-the-island" data-tour="pinned" data-page={index}>
      {/* The heading, lead and style switch scroll normally; only the panel and the page text stay pinned. */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-24">
        <a
          href="#after-the-island"
          className="mb-4 inline-flex min-h-11 items-center text-sm text-lunar-text-2 underline underline-offset-4 hover:text-lunar-text"
        >
          {t("skip")}
        </a>
        <Intro title={title} islandStyle={islandStyle} setIslandStyle={setIslandStyle} />
      </div>
      <div ref={section} className="relative h-[400svh]" data-tour-pin>
        {/* Sticks 5rem down, clear of the header, and is only as tall as its content: a full-height box
            left large empty gaps above (content centred) or below it (content at the top) on tall screens.
            The scroll distance comes from the 400svh parent, so the motion is unchanged. */}
        <div className="sticky top-20 pt-6 pb-6">
          {/* minmax(0, …) lets the panel scale down instead of widening the column. */}
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] items-start gap-6 px-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-14">
            <div className="order-2 md:order-1">
              <div className="min-h-40">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <p className="text-sm text-lunar-text-2 tabular-nums">
                      {t("step", { n: index + 1, total: PAGES })}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">{page.name}</h3>
                    <p className="mt-2 max-w-md text-lunar-text-2">{page.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <Desktop islandStyle={islandStyle}>
                <IslandPanel
                  key={islandStyle}
                  islandStyle={islandStyle}
                  index={index}
                  onIndexChange={scrollToPage}
                  frameStyle={{ clipPath }}
                  bodyStyle={{ opacity: bodyOpacity }}
                  overlay={
                    <motion.div aria-hidden="true" style={{ opacity: eyesOpacity }}>
                      <CollapsedIsland islandStyle={islandStyle} activity="eyes" />
                    </motion.div>
                  }
                />
              </Desktop>
            </div>
          </div>
        </div>
      </div>
      <div id="after-the-island" tabIndex={-1} className="outline-none" />
    </section>
  );
}
