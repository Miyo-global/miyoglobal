import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { BLOG_NAME } from "@/lib/seo";
import { getPostBySlug } from "@/server/services/public";
import { raw } from "@/styles/tokens";

export const alt = `${BLOG_NAME} article from MIYO Global`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 300;

// ponytail: Satori's bundled sans, not Libre Caslon; load a TTF via `fonts` if the serif matters on share cards.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const data = await getPostBySlug((await params).slug);
  if (!data) notFound();
  const { title } = data.post;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: raw.navy, color: raw.white }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 26, letterSpacing: 4, textTransform: "uppercase" }}>
          <span style={{ color: raw.gold }}>{BLOG_NAME}</span>
          {data.categoryName && <span style={{ color: raw.ruleStrong }}>{data.categoryName}</span>}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 90 ? 48 : title.length > 55 ? 60 : 72, lineHeight: 1.1, letterSpacing: -1 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${raw.gold}`, paddingTop: 28, fontSize: 24, color: raw.ruleStrong }}>
          <span>MIYO Global</span>
          <span>miyoglobal.com/blog</span>
        </div>
      </div>
    ),
    size,
  );
}
