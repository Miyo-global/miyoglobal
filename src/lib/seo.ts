export const SITE_URL = (process.env.SITE_URL ?? "https://miyoglobal.com").replace(/\/$/, "");
export const SITE_NAME = "MIYO Global";

export function absolute(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function titleFor(metaTitle: string, title: string): string {
  const base = (metaTitle || title).trim();
  return base.length > 60 ? base.slice(0, 57).trimEnd() + "..." : base;
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
    headers: { "Content-Type": `${contentType}; charset=utf-8`, "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
