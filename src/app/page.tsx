import { LunarPill } from "@/components/lunar/LunarPill";

// Starter page from the WEB-01 scaffold. The real home page is built in WEB-09 to WEB-12.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <LunarPill className="w-64 sm:w-80" />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
        A Dynamic Island for Windows 11
      </h1>
      <p className="max-w-xl text-lg text-lunar-text-2">
        With a pair of eyes that watch over your desktop. The full site is on its way.
      </p>
      <a
        href="https://github.com/rafaelevan-k/lunar/releases/latest"
        className="rounded-full bg-lunar-accent px-6 py-3 font-medium text-lunar-on-accent"
        rel="noopener noreferrer"
      >
        Download Lunar for Windows 11
      </a>
    </main>
  );
}
