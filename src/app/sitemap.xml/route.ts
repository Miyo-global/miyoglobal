import { SITE_URL, xml } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const { posts } = await sitemapEntries();
  const last = posts[0]?.updatedAt.toISOString();
  const lastmod = last ? `<lastmod>${last}</lastmod>` : "";
  const children = posts.length ? ["pages", "posts"] : ["pages"];
  return xml(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children
      .map((name) => `  <sitemap><loc>${SITE_URL}/${name}-sitemap.xml</loc>${lastmod}</sitemap>`)
      .join("\n")}\n</sitemapindex>`,
  );
}
