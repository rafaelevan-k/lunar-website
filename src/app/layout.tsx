import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { DEFAULT_MOTION, DEFAULT_THEME, PREFERENCE_SCRIPT } from "@/lib/preferences";
import "./globals.css";

// Headings only. Body text uses Segoe UI Variable, the font of the Lunar app itself, which Windows
// already has. next/font downloads Bricolage at build time and serves it from this site.
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lunar — A Dynamic Island for Windows 11",
  description:
    "Lunar is a small pill at the top of your screen with a pair of eyes that watch over your desktop. Free, open source, private.",
};

// Locale routing (WEB-03) is not set up yet: the page is English for now.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      data-motion={DEFAULT_MOTION}
      className={`${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCE_SCRIPT }} />
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body>; don't treat that as a mismatch. */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-lunar-accent px-5 py-3 font-medium text-lunar-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <ReducedMotionProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col pt-24 outline-none">
            {children}
          </main>
          <SiteFooter />
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
