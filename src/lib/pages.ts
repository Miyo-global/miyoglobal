export const STATIC_PAGES = [
  "/",
  "/staffing-solutions",
  "/digital-solutions",
  "/case-studies",
  "/referrals",
  "/about",
  "/contact",
  "/privacy-policy",
  "/editorial-policy",
  "/terms",
  "/disclosure",
].map((path) => ({ path, file: `public/${path === "/" ? "index" : path.slice(1)}.html` }));

export const REWRITTEN_PAGES = STATIC_PAGES.map((p) => p.path.slice(1)).filter(Boolean);

/** Per-page lastmod (YYYY-MM-DD), read from each public/*.html mtime at build time by next.config.ts. */
export function staticLastmods(): Record<string, string> {
  try {
    return JSON.parse(process.env.STATIC_LASTMOD ?? "{}");
  } catch {
    return {};
  }
}
