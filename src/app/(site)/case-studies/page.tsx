import type { Metadata } from "next";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { CaseStudiesView } from "@/views/case-studies/case-studies-view";
import { dossiers } from "@/views/case-studies/content";

const page: SitePage = {
  path: "/case-studies",
  title: "Case Studies: Healthcare, Radiology & AI Data | MIYO Global",
  description: "Case studies: 11 licensed US physicians live in two weeks, 45 radiologists producing 3,750 CT and MRI reports, and 100+ AI data contributors at 95%+ accuracy.",
  image: "/images/og/cases.webp",
  imageAlt: "Global capability centre team celebrating a completed build-out engagement",
  crumb: "Case studies",
};

export const metadata: Metadata = pageMetadata(page);

const url = `${SITE_URL}${page.path}`;
const jsonLd = pageJsonLd(page, [
  {
    "@type": "ItemList",
    "@id": `${url}#cases`,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    itemListElement: dossiers.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `${d.sector}: ${d.title}`, url: `${url}#${d.id}` })),
  },
]);

export default function CaseStudiesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <CaseStudiesView />
    </>
  );
}
