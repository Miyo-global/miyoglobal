import { STATIC_PAGES } from "@/lib/pages";
import { SITE_URL, xml, xmlEscape } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const { posts, categories, tags, authors } = await sitemapEntries();
  const last = posts[0]?.updatedAt.toISOString().slice(0, 10);
  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: p.path, lastmod: p.lastmod })),
    { loc: "/blog", lastmod: last },
    ...categories.map((c) => ({ loc: `/blog/category/${c.slug}`, lastmod: last })),
    ...tags.map((t) => ({ loc: `/blog/tag/${t.slug}`, lastmod: last })),
    ...authors.map((a) => ({ loc: `/blog/author/${a.slug}`, lastmod: last })),
  ];
  return xml(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${xmlEscape(SITE_URL + (u.loc === "/" ? "/" : u.loc))}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
      .join("\n")}\n</urlset>`,
  );
}
