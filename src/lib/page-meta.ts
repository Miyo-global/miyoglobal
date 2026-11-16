import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, siteGraph } from "./seo";

export type SitePage = { path: string; title: string; description: string; image: string; imageAlt: string; crumb?: string };

/** Metadata for a marketing page: same shape the blog uses (canonical, Open Graph, Twitter card). */
export function pageMetadata({ path, title, description, image, imageAlt }: SitePage): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: "website", url: path, siteName: SITE_NAME, images: [{ url: image, width: 1200, height: 630, alt: imageAlt, type: "image/webp" }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: imageAlt }] },
  };
}

const PAGE_TYPES: Record<string, string> = { "/about": "AboutPage", "/contact": "ContactPage" };

/** WebSite + Organization + the page itself, plus a BreadcrumbList on inner pages (those with a crumb). */
export function pageJsonLd({ path, title, description, crumb }: SitePage) {
  const home = path === "/";
  const url = home ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const [site, org] = siteGraph();
  return {
    "@context": "https://schema.org",
    "@graph": [
      site,
      home
        ? { ...org, alternateName: ["MiyoGlobal", "MIYO Global staffing", "MIYO"], description, contactPoint: { ...org.contactPoint, url: `${SITE_URL}/contact` } }
        : org,
      { "@type": PAGE_TYPES[path] ?? "WebPage", "@id": `${url}#webpage`, url, name: title, description, isPartOf: { "@id": site["@id"] }, publisher: { "@id": org["@id"] }, inLanguage: "en" },
      ...(crumb
        ? [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: crumb, item: url },
              ],
            },
          ]
        : []),
    ],
  };
}
