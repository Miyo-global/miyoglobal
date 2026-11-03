export const STATIC_PAGES = [
  { path: "/", lastmod: "2026-07-03" },
  { path: "/staffing-solutions", lastmod: "2026-07-03" },
  { path: "/digital-solutions", lastmod: "2026-07-03" },
  { path: "/case-studies", lastmod: "2026-07-03" },
  { path: "/referrals", lastmod: "2026-08-13" },
  { path: "/about", lastmod: "2026-07-03" },
  { path: "/contact", lastmod: "2026-07-03" },
  { path: "/privacy-policy", lastmod: "2026-07-03" },
  { path: "/editorial-policy", lastmod: "2026-11-03" },
] as const;

export const REWRITTEN_PAGES = STATIC_PAGES.map((p) => p.path.slice(1)).filter(Boolean);
