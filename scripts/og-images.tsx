/**
 * Renders the static 1200×630 share cards in public/images/og/ for pages that had none of their own (home, about, blog,
 * jobs, legal). Typographic, on the brand tokens. Run: pnpm og:images
 */
import { writeFileSync } from "node:fs";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { raw } from "../src/styles/tokens";

const CARDS: { file: string; kicker: string; title: string; foot: string }[] = [
  { file: "index", kicker: "MIYO Global", title: "Build teams that own outcomes.", foot: "Enterprise staffing and digital delivery, India and the UAE" },
  { file: "about", kicker: "About MIYO Global", title: "Operators who have lived delivery at scale.", foot: "Hyderabad, India  /  Ras Al Khaimah, UAE" },
  { file: "blog", kicker: "MIYO Journal", title: "Notes on staffing, GCCs and digital delivery.", foot: "Insights from MIYO Global" },
  { file: "jobs", kicker: "Open roles", title: "Live mandates, represented end to end.", foot: "Apply directly or refer for ₹15,000" },
  { file: "privacy", kicker: "Legal", title: "Privacy & Cookie Policy", foot: "MIYO Global" },
  { file: "terms", kicker: "Legal", title: "Terms of Use", foot: "MIYO Global" },
  { file: "disclosure", kicker: "Legal", title: "Disclosure", foot: "MIYO Global" },
  { file: "editorial", kicker: "Legal", title: "Editorial Policy", foot: "MIYO Global" },
];

/** Libre Caslon Display, the site's headline face, fetched once as TTF (Satori cannot read WOFF2). */
async function caslon(): Promise<ArrayBuffer> {
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Libre+Caslon+Display", { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30" } })).text();
  const url = /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/.exec(css)?.[1];
  if (!url) throw new Error("Could not find a TTF for Libre Caslon Display");
  return (await fetch(url)).arrayBuffer();
}

async function render({ kicker, title, foot }: (typeof CARDS)[number], display: ArrayBuffer) {
  const res = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: raw.navy, color: raw.white, padding: "72px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: raw.gold }}>
          <div style={{ width: 48, height: 2, background: raw.gold }} />
          {kicker}
        </div>
        <div style={{ fontSize: title.length > 34 ? 76 : 92, lineHeight: 1.05, maxWidth: 980, fontFamily: "Caslon" }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${raw.navy2}`, paddingTop: 28, fontSize: 26, color: raw.ruleStrong }}>
          <span>{foot}</span>
          <span style={{ color: raw.gold }}>miyoglobal.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: [{ name: "Caslon", data: display, weight: 400, style: "normal" }] },
  );
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const display = await caslon();
  for (const card of CARDS) {
    const png = await render(card, display);
    writeFileSync(`public/images/og/${card.file}.webp`, await sharp(png).webp({ quality: 88 }).toBuffer());
    console.log(`public/images/og/${card.file}.webp`);
  }
}

void main();
