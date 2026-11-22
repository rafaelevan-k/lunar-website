import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// next/font downloads the fonts at build time and serves them from this site, so visitors make no request to Google.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lunar — A Dynamic Island for Windows 11",
  description:
    "Lunar is a small pill at the top of your screen with a pair of eyes that watch over your desktop. Free, open source, private.",
};

// Theme (WEB-02) and locale routing (WEB-03) are not set up yet: the page is dark and English for now.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
