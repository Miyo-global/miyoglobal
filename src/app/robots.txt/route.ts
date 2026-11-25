import { SITE_URL } from "@/lib/seo";

const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];

// No blanket query-string rule: /_next/image?url=... must stay crawlable and canonicals already fold ?utm variants.
// /blog/search is an unbounded ?q= space, so robots.txt is its one crawl signal (the page's noindex is only a backstop).
const BLOCKED = ["/api/", "/blog/search", "/studio"];

export function GET() {
  const rules = (agent: string) => [`User-agent: ${agent}`, "Allow: /", ...BLOCKED.map((p) => `Disallow: ${p}`), ""].join("\n");
  const body = [rules("*"), ...AI_CRAWLERS.map(rules), `Sitemap: ${SITE_URL}/sitemap.xml`, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
}
