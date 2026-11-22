import { LunarPill } from "@/components/lunar/LunarPill";
import { LATEST_RELEASE_URL, TAGLINE } from "@/content/site";

// Starter page. The real home page is built in WEB-09 to WEB-12.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <LunarPill className="w-64 sm:w-80" />
      <h1 className="max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight font-stretch-[88%] sm:text-7xl">
        Lunar, a Dynamic Island for Windows 11
      </h1>
      <p className="max-w-xl text-lg text-lunar-text-2">{TAGLINE} The full site is on its way.</p>
      <a
        href={LATEST_RELEASE_URL}
        className="flex min-h-12 items-center rounded-full bg-lunar-accent px-6 font-medium text-lunar-on-accent"
      >
        Download Lunar for Windows 11
      </a>
    </div>
  );
}
