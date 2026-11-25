import type { Metadata } from "next";
import { SERVICES, STATIC_PAGES } from "./pages";
import { absolute, BLOG_NAME, SITE_NAME, SITE_URL, siteGraph } from "./seo";

export type SitePage = { path: string; title: string; description: string; image: string; imageAlt: string; crumb?: string };

/** RSS autodiscovery. A page that sets a canonical replaces the whole `alternates` key, so it is set per page, not in a layout. */
export const FEED_ALTERNATE = { "application/rss+xml": [{ url: "/feed.xml", title: BLOG_NAME }] };

/** One English edition serves India and the UAE. Open Graph has no en_AE and en_IN would mark the site India-only, so the neutral default is declared. */
export const OG_LOCALE = "en_US";

/** Metadata for a marketing page: same shape the blog uses (canonical, Open Graph, Twitter card). */
export function pageMetadata({ path, title, description, image, imageAlt }: SitePage): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, types: FEED_ALTERNATE },
    openGraph: { title, description, type: "website", url: path, siteName: SITE_NAME, locale: OG_LOCALE, images: [{ url: image, width: 1200, height: 630, alt: imageAlt, type: "image/webp" }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: imageAlt }] },
  };
}

/** Blog index and listing pages (page N, category, tag, author): the same metadata with the shared blog share image. */
export const blogListingMetadata = (path: string, title: string, description: string) =>
  pageMetadata({ path, title, description, image: "/images/og/blog.webp", imageAlt: "MIYO Global team collaborating on an enterprise staffing and delivery plan" });

/**
 * Journal listing pages (category, tag): the same metadata without explicit share images, so the route's generated
 * opengraph-image.tsx is used and every listing has its own card.
 */
export function listingMetadata(path: string, title: string, description: string): Metadata {
  const m = blogListingMetadata(path, title, description);
  const { images: _og, ...openGraph } = m.openGraph ?? {};
  const { images: _tw, ...twitter } = (m.twitter ?? {}) as Record<string, unknown>;
  return { ...m, openGraph, twitter };
}

/** JSON-LD for a journal listing: WebSite, Organization, the CollectionPage and Home > Insights > listing breadcrumbs. */
export function listingJsonLd(path: string, name: string, description: string) {
  const url = `${SITE_URL}${path}`;
  const [site, org] = siteGraph();
  return {
    "@context": "https://schema.org",
    "@graph": [
      site,
      org,
      { "@type": "CollectionPage", "@id": `${url}#webpage`, url, name, description, isPartOf: { "@id": site["@id"] }, inLanguage: "en", breadcrumb: { "@id": `${url}#breadcrumb` } },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  };
}

const PAGE_TYPES: Record<string, string> = { "/about": "AboutPage", "/contact": "ContactPage", "/case-studies": "CollectionPage" };

/**
 * WebSite + Organization + the page itself, plus a BreadcrumbList on inner pages (those with a crumb) and, on a page that has
 * SERVICES lines, a Service whose offer catalogue lists them. `extra` nodes (ItemList, Person, FAQPage) join the same graph.
 */
export function pageJsonLd({ path, title, description, image, crumb }: SitePage, extra: Record<string, unknown>[] = []) {
  const home = path === "/";
  const url = home ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const [site, org] = siteGraph();
  const services = SERVICES.filter(([page]) => page === path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      site,
      home
        ? { ...org, alternateName: ["MiyoGlobal", "MIYO Global staffing", "MIYO"], description, contactPoint: { ...org.contactPoint, url: `${SITE_URL}/contact` } }
        : org,
      {
        "@type": PAGE_TYPES[path] ?? "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": site["@id"] },
        publisher: { "@id": org["@id"] },
        inLanguage: "en",
        primaryImageOfPage: { "@type": "ImageObject", url: absolute(image) },
        dateModified: STATIC_PAGES.find((p) => p.path === path)?.updated,
        breadcrumb: crumb ? { "@id": `${url}#breadcrumb` } : undefined,
      },
      ...(crumb
        ? [
            {
              "@type": "BreadcrumbList",
              "@id": `${url}#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: crumb, item: url },
              ],
            },
          ]
        : []),
      ...(services.length
        ? [
            {
              "@type": "Service",
              "@id": `${url}#service`,
              name: crumb,
              description,
              url,
              mainEntityOfPage: { "@id": `${url}#webpage` },
              provider: { "@id": org["@id"] },
              areaServed: org.contactPoint?.areaServed,
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: crumb,
                itemListElement: services.map(([, id, name, line]) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, description: line, url: `${url}#${id}` } })),
              },
            },
          ]
        : []),
      ...extra,
    ],
  };
}
