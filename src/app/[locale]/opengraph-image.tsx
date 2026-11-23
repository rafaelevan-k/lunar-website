import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { routing, type Locale } from "@/i18n/routing";
import en from "../../../messages/en.json";

/*
 * The share card for every page of a language: Lunar's closed island at the top of a dark screen,
 * as on a real desktop, with the name and the one-line description below it. Drawn at build time.
 * Colors are the island's dark tokens (src/styles/tokens.css); CSS variables don't exist here.
 */

const COLOR = {
  bg: "#0b0c10",
  text: "#f6f7fb",
  text2: "#a8adbe",
  border: "#3a3e52",
};
const SIZE = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "node_modules/@fontsource/bricolage-grotesque/files");
const bold = await readFile(join(fontDir, "bricolage-grotesque-latin-700-normal.woff"));
const regular = await readFile(join(fontDir, "bricolage-grotesque-latin-400-normal.woff"));

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// The alt text per language is set where the image is named, in lib/metadata.ts.
export const alt = en.Metadata.title;
export const size = SIZE;
export const contentType = "image/png";

/** One eye on the 62x26 grid of EyesView.xaml, scaled by `unit` px per grid unit. */
function Eye({ unit }: { unit: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24 * unit,
        height: 26 * unit,
        borderRadius: "50%",
        background: COLOR.text,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 12 * unit,
          height: 12 * unit,
          borderRadius: "50%",
          background: COLOR.bg,
          paddingLeft: 2 * unit,
          paddingTop: 2 * unit,
        }}
      >
        <div
          style={{ width: 4 * unit, height: 4 * unit, borderRadius: "50%", background: COLOR.text }}
        />
      </div>
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const content = getContent(locale);
  // The pill is 160x44; the eyes are 20/44 of its height, as in the app.
  const pill = { width: 440, height: 121 };
  const unit = (pill.height * (20 / 44)) / 26;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: COLOR.bg,
        color: COLOR.text,
        fontFamily: "Bricolage",
        padding: "0 80px 72px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14 * unit,
            width: pill.width,
            height: pill.height,
            borderRadius: pill.height / 2,
            border: `2px solid ${COLOR.border}`,
            background: COLOR.bg,
          }}
        >
          <Eye unit={unit} />
          <Eye unit={unit} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <div style={{ fontSize: 148, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>
          Lunar
        </div>
        <div style={{ marginTop: 20, fontSize: 52, fontWeight: 400, color: COLOR.text2 }}>
          {content.hero.title}
        </div>
      </div>
    </div>,
    {
      ...SIZE,
      fonts: [
        { name: "Bricolage", data: bold, weight: 700, style: "normal" },
        { name: "Bricolage", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
