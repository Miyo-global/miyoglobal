import { STATIC_PAGES } from "@/lib/pages";
import { SITE_URL } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const { posts } = await sitemapEntries();
  const body = [
    "# MIYO Global",
    "",
    "> Enterprise staffing and digital delivery from India and the UAE: GCC build-outs, technology staffing, executive search and managed digital services.",
    "",
    "## Pages",
    ...STATIC_PAGES.filter((p) => p.path !== "/").map((p) => `- [${p.path.slice(1).replace(/-/g, " ")}](${SITE_URL}${p.path})`),
    "",
    "## Latest articles",
    ...posts.slice(0, 20).map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ""}`),
    "",
    `## Feeds`,
    `- [RSS](${SITE_URL}/feed.xml)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } });
}
