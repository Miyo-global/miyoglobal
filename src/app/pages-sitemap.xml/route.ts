import { NOINDEX } from "@/lib/seo";
import { getRoles } from "@/server/jobs";
import { sitemapEntries } from "@/server/services/public";
import { sitemapUrls, urlset } from "../sitemap.xml/urls";

export const dynamic = "force-dynamic";

export async function GET() {
  if (NOINDEX) return new Response(null, { status: 404 });
  const [entries, roles] = await Promise.all([sitemapEntries(), getRoles()]);
  // One URL per open role; lastmod only when the sheet records a posting date.
  return urlset([...sitemapUrls(entries).pages, ...roles.map((r) => ({ loc: `/jobs/${r.slug}`, lastmod: r.posted ?? undefined }))]);
}
