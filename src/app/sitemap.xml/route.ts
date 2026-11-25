import { NOINDEX, SITE_URL, xml } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";
import { newest, sitemapUrls } from "./urls";

export const dynamic = "force-dynamic";

export async function GET() {
  if (NOINDEX) return new Response(null, { status: 404 });
  const sets = sitemapUrls(await sitemapEntries());
  // A child sitemap is listed only when it has URLs (posts-sitemap.xml is empty until the first post is published).
  const children = (["pages", "posts"] as const).filter((name) => sets[name].length);
  return xml(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children
      .map((name) => {
        const last = newest(sets[name]);
        return `  <sitemap><loc>${SITE_URL}/${name}-sitemap.xml</loc>${last ? `<lastmod>${last}</lastmod>` : ""}</sitemap>`;
      })
      .join("\n")}\n</sitemapindex>`,
  );
}
