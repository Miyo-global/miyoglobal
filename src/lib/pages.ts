/** Marketing pages. All are App Router pages under src/app/(site) except /referrals, which is still served from public/referrals.html. */
const PAGE_PATHS = [
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
];

/** Pages still served as static HTML through a clean-URL rewrite in next.config.ts. */
export const REWRITTEN_PAGES = ["referrals"];

export const STATIC_PAGES = PAGE_PATHS.map((path) => {
  const name = path.slice(1);
  return { path, file: REWRITTEN_PAGES.includes(name) ? `public/${name}.html` : `src/app/(site)${path === "/" ? "" : path}/page.tsx` };
});

/** Every page name that ever had a public .html URL: /<name>.html redirects to /<name>. */
export const HTML_PAGE_NAMES = PAGE_PATHS.map((p) => p.slice(1)).filter(Boolean);

/** Per-page lastmod (YYYY-MM-DD), last git commit date of each page's source file (mtime fallback), computed at build time by next.config.ts. */
export function staticLastmods(): Record<string, string> {
  try {
    return JSON.parse(process.env.STATIC_LASTMOD ?? "{}");
  } catch {
    return {};
  }
}
