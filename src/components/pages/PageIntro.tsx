import type { ReactNode } from "react";

/** The top of an inner page: one big title and a short lead. */
export function PageIntro({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-16 pb-12">
      <h1 className="max-w-[18ch] text-5xl leading-[0.95] font-bold tracking-[-0.03em] font-stretch-[84%] sm:text-7xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-lunar-text-2 sm:text-xl">{lead}</p>
      {children}
    </header>
  );
}
