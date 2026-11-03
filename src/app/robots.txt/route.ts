import { SITE_URL } from "@/lib/seo";

const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];

const BLOCKED = ["/api/", "/blog/search", "/studio", "/uploads/", "/*?*"];

export function GET() {
  const rules = (agent: string) => [`User-agent: ${agent}`, "Allow: /", ...BLOCKED.map((p) => `Disallow: ${p}`), ""].join("\n");
  const body = [rules("*"), ...AI_CRAWLERS.map(rules), `Sitemap: ${SITE_URL}/sitemap.xml`, `Sitemap: ${SITE_URL}/pages-sitemap.xml`, `Sitemap: ${SITE_URL}/posts-sitemap.xml`, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
}
