import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/server/services/public";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const data = await getPostBySlug((await ctx.params).slug);
  if (!data) return new Response(null, { status: 404 });
  const title = data.post.title.slice(0, 110);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0B192F", color: "#fff" }}>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, color: "#E0B458", fontWeight: 700 }}>MIYO GLOBAL</div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 56 : 68, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 30, color: "#94A3B8" }}>{data.categoryName ?? "Insights"} · miyoglobal.com/blog</div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
