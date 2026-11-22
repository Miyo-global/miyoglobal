import { SITE_URL, contentLastmod, xml, xmlEscape } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const { posts } = await sitemapEntries();
  return xml(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${posts
      .map((p) => `  <url><loc>${xmlEscape(`${SITE_URL}/blog/${p.slug}`)}</loc><lastmod>${contentLastmod(p.updatedAt, p.publishedAt).toISOString()}</lastmod></url>`)
      .join("\n")}\n</urlset>`,
  );
}
