import { describe, expect, it } from "vitest";
import { STATIC_PAGES } from "../../lib/pages";
import { SITE_URL } from "../../lib/seo";
import { newest, sitemapUrls, urlset } from "./urls";

const at = (iso: string) => new Date(iso);
const post = (slug: string, updated: string, coverUrl: string | null = null) => ({ slug, updatedAt: at(updated), publishedAt: at(updated), title: slug, excerpt: "", coverUrl });

describe("sitemap urls", () => {
  it("gives every static page a real committed lastmod", () => {
    for (const p of STATIC_PAGES) expect(new Date(p.updated).toISOString().slice(0, 10), p.path).toBe(p.updated);
  });

  it("leaves /blog and the posts sitemap out while nothing is published", () => {
    const { pages, posts } = sitemapUrls({ posts: [], categories: [], tags: [], authors: [] });
    expect(posts).toEqual([]);
    expect(pages.map((u) => u.loc)).toEqual(STATIC_PAGES.map((p) => p.path));
  });

  it("dates /blog and each listing from the posts under them", async () => {
    const sets = sitemapUrls({
      posts: [post("old", "2026-01-05T10:00:00Z"), post("new", "2026-03-09T08:30:00Z", "/media/c.webp")],
      categories: [{ slug: "staffing", updatedAt: at("2026-01-05T10:00:00Z") }],
      tags: [],
      authors: [{ slug: "a", updatedAt: null }],
    });
    const byLoc = Object.fromEntries(sets.pages.map((u) => [u.loc, u.lastmod]));
    expect(byLoc["/blog"]).toBe("2026-03-09");
    expect(byLoc["/blog/category/staffing"]).toBe("2026-01-05");
    expect(newest(sets.posts)).toBe("2026-03-09T08:30:00.000Z");
    const body = await urlset(sets.posts).text();
    expect(body).toContain(`<image:loc>${SITE_URL}/media/c.webp</image:loc>`);
    expect(body.match(/<image:image>/g)).toHaveLength(1);
  });
});
