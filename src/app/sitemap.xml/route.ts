import { SITE_URL, xml } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const { posts } = await sitemapEntries();
  const last = posts[0]?.updatedAt.toISOString();
  return xml(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${SITE_URL}/pages-sitemap.xml</loc>${last ? `<lastmod>${last}</lastmod>` : ""}</sitemap>\n  <sitemap><loc>${SITE_URL}/posts-sitemap.xml</loc>${last ? `<lastmod>${last}</lastmod>` : ""}</sitemap>\n</sitemapindex>`,
  );
}
