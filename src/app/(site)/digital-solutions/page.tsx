import type { Metadata } from "next";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { digital } from "@/views/solutions/content";
import { faqJsonLd } from "@/views/solutions/parts";
import { SolutionPage } from "@/views/solutions/solution-page";

const page: SitePage = {
  path: "/digital-solutions",
  title: "AI Data, Localization & Trust and Safety | MIYO Global",
  description: "Managed digital delivery from India and the UAE: AI data services, localization in 120+ languages, healthcare AI review, trust and safety, and training.",
  image: "/images/og/digital.webp",
  imageAlt: "Data and AI delivery team reviewing a managed digital solution",
  crumb: "Digital Solutions",
};

export const metadata: Metadata = pageMetadata(page);

const jsonLd = pageJsonLd(page, [faqJsonLd(`${SITE_URL}${page.path}`, digital.faq)]);

export default function DigitalSolutionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <SolutionPage s={digital} />
    </>
  );
}
