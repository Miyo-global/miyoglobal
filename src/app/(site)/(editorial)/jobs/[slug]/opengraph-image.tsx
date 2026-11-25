import { ImageResponse } from "next/og";
import { getRole } from "@/server/jobs";

export const alt = "Open role at MIYO Global";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 300;

/** 1200×630 share card per role: navy board, gold ref code, the title, and the facts the sheet states. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const role = await getRole((await params).slug);
  const title = role?.title ?? "Open roles at MIYO Global";
  const facts = role ? [role.cities[0] ?? role.workMode ?? null, role.experience, role.ctc].filter(Boolean).join("   /   ") : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0B192F", padding: "64px 72px", color: "#fff", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, fontFamily: "monospace" }}>
          <span style={{ color: "#E0B458", letterSpacing: 2 }}>{role?.ref ?? "MIYO GLOBAL"}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12, color: "#7FD1A8", fontSize: 24 }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: "#7FD1A8" }} />
            Open
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 60 ? 58 : 72, lineHeight: 1.08, maxWidth: 1000 }}>{title}</div>
          {facts && <div style={{ fontSize: 28, color: "#C3CDDC", fontFamily: "monospace" }}>{facts}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px dashed #24395A", paddingTop: 28, fontSize: 26, color: "#C3CDDC", fontFamily: "sans-serif" }}>
          <span>MIYO Global careers</span>
          <span style={{ color: "#E0B458" }}>Apply or refer for ₹15,000</span>
        </div>
      </div>
    ),
    size,
  );
}
