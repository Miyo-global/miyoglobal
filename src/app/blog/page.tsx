import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";
import { blogListingMetadata } from "@/lib/page-meta";
import { BLOG_NAME, BLOG_TITLE, jsonLdScript, ORG_ID, siteGraph, SITE_URL, WEBSITE_ID } from "@/lib/seo";
import { countLive } from "@/server/services/public";

export const revalidate = 300;

const description = "Practical guides on GCC build-outs, technology staffing, executive search and digital delivery in India and the UAE, from the MIYO Global team.";

export async function generateMetadata(): Promise<Metadata> {
  // With nothing published the page is an empty shell: keep it out of the index until the first post (publishing revalidates /blog).
  return { ...blogListingMetadata("/blog", `${BLOG_NAME}: Staffing & GCC Insights | MIYO Global`, description), ...((await countLive()) ? {} : { robots: { index: false, follow: true } }) };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    ...siteGraph(),
    {
      "@type": ["CollectionPage", "Blog"],
      "@id": `${SITE_URL}/blog#blog`,
      url: `${SITE_URL}/blog`,
      name: BLOG_NAME,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
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
