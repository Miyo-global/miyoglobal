import { ImageResponse } from "next/og";
import { BLOG_NAME } from "@/lib/seo";
import { raw } from "@/styles/tokens";

export const SHARE_SIZE = { width: 1200, height: 630 };

/** 1200×630 share card for journal listing pages (category, tag): the journal name, what the listing is, and its title. */
export function listingCard(kind: string, title: string, line: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: raw.navy, color: raw.white }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 26, letterSpacing: 4, textTransform: "uppercase" }}>
          <span style={{ color: raw.gold }}>{BLOG_NAME}</span>
          <span style={{ color: raw.ruleStrong }}>{kind}</span>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 40 ? 72 : 96, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${raw.gold}`, paddingTop: 28, fontSize: 24, color: raw.ruleStrong }}>
          <span>{line}</span>
          <span>miyoglobal.com/blog</span>
        </div>
      </div>
    ),
    SHARE_SIZE,
  );
}
