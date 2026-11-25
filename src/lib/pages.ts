/**
 * Marketing pages. All are App Router pages under src/app/(site) except /referrals, which is still served from public/referrals.html.
 *
 * `updated` (YYYY-MM-DD) is the sitemap lastmod and the WebPage dateModified. Bump it by hand when a page's visible content changes.
 * It is committed rather than read from git at build time: Vercel builds from a shallow clone, where git dates and file mtimes are
 * both the deploy date. `legal` pages are listed apart from the service pages in llms.txt.
 */
export const STATIC_PAGES: { path: string; label: string; summary: string; updated: string; legal?: true }[] = [
  { path: "/", label: "Home", summary: "GCC build-outs, technology staffing, executive search, and managed digital delivery from India and the UAE.", updated: "2026-11-16" },
  {
    path: "/staffing-solutions",
    label: "Staffing Solutions",
    summary: "GCC and captive centre build-outs, IT and technology staffing, executive search, high-volume hiring, and clinical staffing across India and the UAE.",
    updated: "2026-11-16",
  },
  {
    path: "/digital-solutions",
    label: "Digital Solutions",
    summary: "Managed digital delivery: AI data services, localization in 120+ languages, trust and safety operations, and enterprise training.",
    updated: "2026-11-16",
  },
  { path: "/case-studies", label: "Case Studies", summary: "Specialist teams deployed fast and held to measurable quality across healthcare, radiology, and AI data.", updated: "2026-11-16" },
  { path: "/referrals", label: "Referrals", summary: "Refer a candidate for an open MIYO Global mandate.", updated: "2026-11-03" },
  { path: "/about", label: "About", summary: "Enterprise staffing and digital delivery led by veteran operators with a compliance-backed engagement model.", updated: "2026-11-16" },
  { path: "/contact", label: "Contact", summary: "Talk to MIYO Global about staffing solutions, GCC build-outs, or managed digital delivery.", updated: "2026-11-16" },
  { path: "/privacy-policy", label: "Privacy & Cookie Policy", summary: "How this website collects, uses, and protects information, including cookie practices.", updated: "2026-11-16", legal: true },
  { path: "/editorial-policy", label: "Editorial Policy", summary: "How blog articles are researched, written, reviewed, updated and corrected.", updated: "2026-11-16", legal: true },
  { path: "/terms", label: "Terms of Use", summary: "The terms that apply when you use the MIYO Global website.", updated: "2026-11-16", legal: true },
  { path: "/disclosure", label: "Disclosure", summary: "How commercial relationships are handled in published content.", updated: "2026-11-16", legal: true },
];

/**
 * Service lines as printed on /staffing-solutions and /digital-solutions: page, anchor id on that page, name, description.
 * They feed llms.txt and the Service JSON-LD (pageJsonLd), so update them when that copy changes.
 */
export const SERVICES: [page: string, id: string, name: string, line: string][] = [
  ["/staffing-solutions", "gcc", "GCC & Captive Centres", "Talent mapping, leadership hiring, and team build-outs for capability centres across Hyderabad, Bangalore, Pune, Noida, and Chennai."],
  ["/staffing-solutions", "technology", "IT & Technology Staffing", "Software engineers, data scientists, cloud architects, and product managers, screened with role-specific technical evaluation."],
  ["/staffing-solutions", "executive-search", "Executive Search", "CXOs and functional leaders who understand local operations and global standards."],
  ["/staffing-solutions", "high-volume", "High-Volume & Lateral", "Recruitment for large funnels, without losing quality or time-to-hire."],
  ["/staffing-solutions", "healthcare", "Healthcare & Clinical", "Licensed physicians, NPs and PAs, medical coders, and clinical reviewers, vetted and credentialed."],
  ["/staffing-solutions", "surge", "Surge & Contract", "Flex capacity for launches, backlogs, and overflow from your own pipeline."],
  ["/digital-solutions", "ai-data", "AI Data Services", "Native speakers and trained annotators collect, label, and validate multilingual training data."],
  ["/digital-solutions", "localization", "Localization & Multilingual", "Localization pipelines across 120+ languages: translation, review, LQA, terminology, and subtitling."],
  ["/digital-solutions", "healthcare-ai", "Healthcare AI & Trust & Safety", "Licensed clinicians review AI health output; trained analysts run trust and safety operations across languages."],
  ["/digital-solutions", "training", "Corporate Training", "Expert-led cohort programmes in AI, data, cloud, and leadership, delivered by Prime Learning."],
];

/** Pages still served as static HTML through a clean-URL rewrite in next.config.ts. */
export const REWRITTEN_PAGES = ["referrals"];

/** Every page name that ever had a public .html URL: /<name>.html redirects to /<name>. */
export const HTML_PAGE_NAMES = STATIC_PAGES.map((p) => p.path.slice(1)).filter(Boolean);
