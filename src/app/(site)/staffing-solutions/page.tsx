import type { Metadata } from "next";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { staffing } from "@/views/solutions/content";
import { faqJsonLd } from "@/views/solutions/parts";
import { SolutionPage } from "@/views/solutions/solution-page";

const page: SitePage = {
  path: "/staffing-solutions",
  title: "GCC Build-Outs & IT Staffing in India | MIYO Global",
  description: "GCC and captive centre build-outs in India, IT and technology staffing, executive search, high-volume hiring and clinical staffing from India and the UAE.",
  image: "/images/og/staffing.webp",
  imageAlt: "Engineers and recruiters working together on a technology staffing programme",
  crumb: "Staffing Solutions",
};

export const metadata: Metadata = pageMetadata(page);

const jsonLd = pageJsonLd(page, [faqJsonLd(`${SITE_URL}${page.path}`, staffing.faq)]);

export default function StaffingSolutionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <SolutionPage s={staffing} />
    </>
  );
}
