import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";
import { BLOG_NAME, BLOG_TITLE, jsonLdScript, siteGraph, SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: BLOG_TITLE },
  description: "Practical guides on GCC build-outs, technology staffing and digital delivery from the MIYO Global team.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { title: BLOG_TITLE, description: "Practical guides on GCC build-outs, technology staffing and digital delivery.", type: "website", url: "/blog", siteName: SITE_NAME, images: [{ url: "/images/og/blog.webp", width: 1200, height: 630, alt: "MIYO Global team collaborating on an enterprise staffing and delivery plan" }] },
  twitter: { card: "summary_large_image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    ...siteGraph(),
    {
      "@type": ["CollectionPage", "Blog"],
      "@id": `${SITE_URL}/blog#blog`,
      url: `${SITE_URL}/blog`,
      name: BLOG_NAME,
      description: "Practical guides on GCC build-outs, technology staffing and digital delivery from the MIYO Global team.",
      isPartOf: { "@id": "https://www.miyoglobal.com/#website" },
      publisher: { "@id": "https://www.miyoglobal.com/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.miyoglobal.com/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      ],
    },
  ],
};

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <BlogIndex page={1} />
    </>
  );
}
