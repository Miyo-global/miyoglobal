import { ImageResponse } from "next/og";
import { getRole } from "@/server/jobs";
import { raw } from "@/styles/tokens";

export const alt = "Open role at MIYO Global";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 600;

/** 1200×630 share card per role: navy board, gold ref code, the title, and only the facts the sheet states. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const role = await getRole((await params).slug);
  const title = role?.title ?? "Open roles at MIYO Global";
  const facts = role ? [role.cities[0] ?? role.workMode ?? null, role.experience, role.ctc].filter(Boolean).join("   /   ") : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: raw.navy, padding: "64px 72px", color: raw.white, fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, fontFamily: "monospace" }}>
          <span style={{ color: raw.gold, letterSpacing: 2 }}>{role?.ref ?? "MIYO GLOBAL"}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12, color: raw.ruleStrong, fontSize: 24, border: `1px solid ${raw.ruleStrong}`, padding: "6px 16px" }}>Open</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 60 ? 58 : 72, lineHeight: 1.08, maxWidth: 1000 }}>{title}</div>
          {facts && <div style={{ fontSize: 28, color: raw.ruleStrong, fontFamily: "monospace" }}>{facts}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `1px solid ${raw.goldDeep}`, paddingTop: 28, fontSize: 26, color: raw.ruleStrong, fontFamily: "sans-serif" }}>
          <span>MIYO Global careers</span>
          <span style={{ color: raw.gold }}>Apply or refer for ₹15,000</span>
        </div>
      </div>
    ),
    size,
  );
}
