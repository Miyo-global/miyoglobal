import { BLOG_NAME, SITE_URL, xml, xmlEscape } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const { posts } = await sitemapEntries();
  const items = posts.slice(0, 30).map(
    (p) =>
      `    <item><title>${xmlEscape(p.title)}</title><link>${SITE_URL}/blog/${p.slug}</link><guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid><pubDate>${(p.publishedAt ?? p.updatedAt).toUTCString()}</pubDate><description>${xmlEscape(p.excerpt)}</description></item>`,
  );
  return xml(
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${BLOG_NAME}</title>\n    <link>${SITE_URL}/blog</link>\n    <description>Practical guides on GCC build-outs, technology staffing and digital delivery.</description>\n    <language>en</language>\n    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>\n${items.join("\n")}\n  </channel>\n</rss>`,
    "application/rss+xml",
  );
}
