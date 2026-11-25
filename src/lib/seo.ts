export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.miyoglobal.com").replace(/\/$/, "");
// Staging/beta set NEXT_PUBLIC_ENV; anything but "production" (or unset) keeps the site out of search engines.
export const NOINDEX = (process.env.NEXT_PUBLIC_ENV ?? "production") !== "production";
export const SITE_NAME = "MIYO Global";
/** The blog's one name: <title>, og:title, JSON-LD and the RSS channel all use it. */
export const BLOG_NAME = "MIYO Journal";
export const BLOG_TITLE = `${BLOG_NAME} | ${SITE_NAME}`;

export const FEED_CACHE = "public, s-maxage=60, must-revalidate";

/** Every @id and url derives from NEXT_PUBLIC_SITE_URL, so staging and beta graphs are self-consistent and production keeps www. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const ADDRESSES = [
  { "@type": "PostalAddress", streetAddress: "MIYO Global Office (Trendz Trinity), Plot No. 21, Madhapur, Gafoornagar", addressLocality: "Hyderabad", addressRegion: "Telangana", postalCode: "500081", addressCountry: "IN" },
  { "@type": "PostalAddress", streetAddress: "Office A, RAK DAO Business Centre, Al Riffa, Sheikh Mohammed Bin Zayed Road", addressLocality: "Ras Al Khaimah", addressCountry: "AE" },
];

/** Shared WebSite + Organization nodes; reference the org elsewhere via { "@id": ORG_ID }. */
export function siteGraph() {
  return [
    { "@type": "WebSite", "@id": WEBSITE_ID, url: `${SITE_URL}/`, name: SITE_NAME, publisher: { "@id": ORG_ID } },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      legalName: "Miyo Global Private Limited",
      url: `${SITE_URL}/`,
      // Real pixel size of public/images/logo-web.png.
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-web.png`, width: 356, height: 192 },
      sameAs: ["https://www.linkedin.com/company/miyo-global"],
      address: ADDRESSES,
      contactPoint: { "@type": "ContactPoint", contactType: "sales", email: "staffing@miyoglobal.com", areaServed: ["IN", "AE"], availableLanguage: "en" },
    },
  ];
}

export function absolute(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function titleFor(metaTitle: string, title: string): string {
  // Never cut a title mid-word: add the brand only when it fits in 60 characters, otherwise use the title as written.
  const base = (metaTitle || title).trim();
  if (base.includes("|")) return base;
  const branded = `${base} | ${SITE_NAME}`;
  return branded.length <= 60 ? branded : base;
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function parseCustomJsonLd(raw: string): { ok: true; value: unknown } | { ok: false; error: string } {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Custom JSON-LD is not valid JSON" };
  }
  const items = Array.isArray(value) ? value : [value];
  for (const item of items) {
    if (!item || typeof item !== "object") return { ok: false, error: "Custom JSON-LD must be an object or array of objects" };
    const type = (item as Record<string, unknown>)["@type"];
    const types = Array.isArray(type) ? type : [type];
    if (types.some((t) => typeof t !== "string")) return { ok: false, error: "Custom JSON-LD needs a string @type" };
    if (types.includes("Product") || types.includes("Offer")) return { ok: false, error: "Product schema is not allowed" };
  }
  return { ok: true, value };
}

export function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function xml(body: string, contentType = "application/xml"): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    headers: { "Content-Type": `${contentType}; charset=utf-8`, "Cache-Control": FEED_CACHE },
  });
}
