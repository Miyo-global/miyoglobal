// Relative imports: vitest resolves no "@/" alias.
import { STATIC_PAGES } from "../../lib/pages";
import { absolute, SITE_URL, xml, xmlEscape } from "../../lib/seo";
import type { sitemapEntries } from "@/server/services/public";

type Url = { loc: string; lastmod?: string; image?: string | null };

const day = (d: Date | null) => d?.toISOString().slice(0, 10);

/** URL sets of the two child sitemaps. /blog and its listings appear only once there are indexable posts under them. */
export function sitemapUrls({ posts, categories, tags, authors }: Awaited<ReturnType<typeof sitemapEntries>>): { pages: Url[]; posts: Url[] } {
  const listing = (kind: string) => (l: { slug: string; updatedAt: Date | null }) => ({ loc: `/blog/${kind}/${l.slug}`, lastmod: day(l.updatedAt) });
  const postUrls = posts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updatedAt.toISOString(), image: p.coverUrl }));
  return {
    pages: [
      ...STATIC_PAGES.map((p) => ({ loc: p.path, lastmod: p.updated })),
      ...(posts.length ? [{ loc: "/blog", lastmod: newest(postUrls)?.slice(0, 10) }] : []),
      ...categories.map(listing("category")),
      ...tags.map(listing("tag")),
      ...authors.map(listing("author")),
    ],
    posts: postUrls,
  };
}

/** Latest lastmod in a set; every lastmod in one set has the same ISO shape, so string order is date order. */
export const newest = (urls: Url[]) => urls.map((u) => u.lastmod ?? "").sort().at(-1) || undefined;

export function urlset(urls: Url[]) {
  const row = (u: Url) =>
    `  <url><loc>${xmlEscape(SITE_URL + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}${u.image ? `<image:image><image:loc>${xmlEscape(absolute(u.image))}</image:loc></image:image>` : ""}</url>`;
  return xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.map(row).join("\n")}\n</urlset>`);
}
