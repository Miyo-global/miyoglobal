import { SERVICES, STATIC_PAGES } from "@/lib/pages";
import { FEED_CACHE, SITE_URL } from "@/lib/seo";
import { sitemapEntries } from "@/server/services/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const { posts } = await sitemapEntries();
  const pages = (legal: boolean) => STATIC_PAGES.filter((p) => !!p.legal === legal).map((p) => `- [${p.label}](${SITE_URL}${p.path}): ${p.summary}`);
  const body = [
    "# MIYO Global",
    "",
    "> Enterprise staffing and digital delivery from India and the UAE: GCC build-outs, technology staffing, executive search and managed digital services.",
    "",
    "MIYO Global sources, vets and deploys teams for enterprises, from a single role to a full capability centre, and runs managed digital services. Engagement models: staff augmentation, managed teams, white-label and Build-Operate-Transfer.",
    "",
    "## Pages",
    ...pages(false),
    ...(posts.length ? [`- [Blog](${SITE_URL}/blog): Practical guides on GCC build-outs, technology staffing and digital delivery.`] : []),
    "",
    "## Services",
    ...SERVICES.map(([page, id, name, line]) => `- [${name}](${SITE_URL}${page}#${id}): ${line}`),
    "",
    "## Contact",
    "- Email: staffing@miyoglobal.com",
    `- Enquiry form: ${SITE_URL}/contact`,
    "- India (operations HQ): Hyderabad, Telangana",
    "- UAE: Ras Al Khaimah",
    "",
    ...(posts.length ? ["## Latest articles", ...posts.slice(0, 20).map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ""}`), ""] : []),
    "## Optional",
    ...pages(true),
    `- [RSS feed](${SITE_URL}/feed.xml)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": FEED_CACHE } });
}
