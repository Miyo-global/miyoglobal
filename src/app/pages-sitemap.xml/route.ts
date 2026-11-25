import { NOINDEX } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";
import { sitemapUrls, urlset } from "../sitemap.xml/urls";

export const dynamic = "force-dynamic";

export async function GET() {
  if (NOINDEX) return new Response(null, { status: 404 });
  return urlset(sitemapUrls(await sitemapEntries()).pages);
}
