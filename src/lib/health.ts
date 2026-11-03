import { collect, headingIds, nodeText, plainText, safeUrl, wordCount, type Doc } from "./content";

export type Issue = { level: "error" | "warn"; code: string; message: string };

export type HealthInput = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  quickAnswer: string;
  doc: Doc;
  coverAlt: string | null;
  hasCover: boolean;
};

export const SERVICE_PATHS = ["/staffing-solutions", "/digital-solutions", "/contact", "/referrals"];

export function internalLinks(doc: Doc): string[] {
  return collect(doc, "text")
    .flatMap((n) => n.marks ?? [])
    .filter((m) => m.type === "link")
    .map((m) => safeUrl(m.attrs?.href))
    .filter((h): h is string => !!h && h.startsWith("/") && !h.startsWith("//"));
}

export function externalLinks(doc: Doc): string[] {
  return collect(doc, "text")
    .flatMap((n) => n.marks ?? [])
    .filter((m) => m.type === "link")
    .map((m) => safeUrl(m.attrs?.href))
    .filter((h): h is string => !!h && /^https?:\/\//i.test(h));
}

export function checkHealth(i: HealthInput): Issue[] {
  const out: Issue[] = [];
  const add = (level: Issue["level"], code: string, message: string) => out.push({ level, code, message });
  const words = wordCount(i.doc);
  const toc = headingIds(i.doc);
  const images = collect(i.doc, "image");

  if (!i.title.trim()) add("error", "title", "Title is required");
  if (images.some((n) => !String(n.attrs?.alt ?? "").trim())) add("error", "alt", "An image in the body has no alt text");
  if (i.hasCover && !(i.coverAlt ?? "").trim()) add("error", "cover-alt", "Cover image has no alt text");
  if (!i.hasCover) add("warn", "cover", "No cover image");
  if (!toc.some((t) => t.level === 2)) add("warn", "h2", "No H2 headings");
  if (words < 600) add("warn", "thin", `Thin content: ${words} words (aim for 600+)`);
  if (!i.metaTitle.trim()) add("warn", "meta-title", "Meta title is empty");
  else if (i.metaTitle.length > 60) add("warn", "meta-title-len", `Meta title is ${i.metaTitle.length} characters (max 60)`);
  if (!i.metaDescription.trim()) add("warn", "meta-desc", "Meta description is empty");
  else if (i.metaDescription.length < 140 || i.metaDescription.length > 160)
    add("warn", "meta-desc-len", `Meta description is ${i.metaDescription.length} characters (aim for 140-160)`);
  if (!i.quickAnswer.trim()) add("warn", "quick-answer", "No quick answer / TL;DR");
  if (!i.focusKeyword.trim()) add("warn", "keyword", "No focus keyword");
  else {
    const k = i.focusKeyword.trim().toLowerCase();
    const has = (s: string) => s.toLowerCase().includes(k);
    const kSlug = k.replace(/[^a-z0-9]+/g, "-");
    if (!has(i.title)) add("warn", "kw-title", "Focus keyword is missing from the H1/title");
    if (!has(i.metaTitle)) add("warn", "kw-meta-title", "Focus keyword is missing from the meta title");
    if (!i.slug.includes(kSlug)) add("warn", "kw-slug", "Focus keyword is missing from the slug");
    const first100 = plainText(i.doc).split(/\s+/).slice(0, 100).join(" ");
    if (!has(first100)) add("warn", "kw-intro", "Focus keyword is missing from the first 100 words");
    if (!toc.some((t) => t.level === 2 && has(t.text))) add("warn", "kw-h2", "Focus keyword is missing from every H2");
    if (i.hasCover && !has(i.coverAlt ?? "")) add("warn", "kw-alt", "Focus keyword is missing from the cover alt text");
  }
  const internal = internalLinks(i.doc);
  if (internal.length < 3) add("warn", "internal", `Only ${internal.length} internal links (aim for 3+)`);
  if (!internal.some((h) => SERVICE_PATHS.some((p) => h === p || h.startsWith(`${p}#`) || h.startsWith(`${p}?`))))
    add("warn", "service-link", "No link to a service page (staffing, digital, contact)");
  collect(i.doc, "heading").forEach((h) => {
    if (!nodeText(h).trim()) add("error", "empty-heading", "A heading is empty");
  });
  return out;
}
