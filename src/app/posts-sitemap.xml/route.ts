import { SITE_URL, xml, xmlEscape } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const { posts } = await sitemapEntries();
  return xml(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${posts
      .map((p) => `  <url><loc>${xmlEscape(`${SITE_URL}/blog/${p.slug}`)}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod></url>`)
      .join("\n")}\n</urlset>`,
  );
}
