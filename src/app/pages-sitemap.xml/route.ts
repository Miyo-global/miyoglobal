import { sitemapEntries } from "@/server/services/public";
import { sitemapUrls, urlset } from "../sitemap.xml/urls";

export const dynamic = "force-dynamic";

export async function GET() {
  return urlset(sitemapUrls(await sitemapEntries()).pages);
}
