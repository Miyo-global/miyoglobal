import type { Metadata } from "next";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";
import { LegalPage } from "@/views/legal/legal-page";

const page: SitePage = {
  path: "/disclosure",
  title: "Disclosure of Commercial Relationships | MIYO Global",
  description: "How MIYO Global handles commercial relationships in its content: articles may mention our own staffing and digital services, and we take no paid placements.",
  image: "/images/og/disclosure.webp",
  imageAlt: "Editorial team reviewing and fact-checking an article before publication",
  crumb: "Disclosure",
};

export const metadata: Metadata = pageMetadata(page);

const sections = [
  { id: "we-sell-the-services-we-write-about", title: "1. We sell the services we write about", body: <p>MIYO Global provides staffing and digital delivery services. Blog articles may mention those services and link to our own service pages.</p> },
  { id: "no-paid-placements", title: "2. No paid placements", body: <p>We do not publish paid placements or accept payment to mention third parties in our articles.</p> },
  {
    id: "further-reading",
    title: "3. Further reading",
    body: (
      <p>
        See our <Link href="/editorial-policy">Editorial Policy</Link> for how articles are written, reviewed and corrected.
      </p>
    ),
  },
];

export default function DisclosurePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <LegalPage crumb="Disclosure" title="Our Disclosure" lead="How commercial relationships affect what we publish." updated="November 2026" sections={sections} />
    </>
  );
}
