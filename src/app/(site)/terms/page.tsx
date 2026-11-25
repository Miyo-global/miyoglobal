import type { Metadata } from "next";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";
import { LegalPage } from "@/views/legal/legal-page";

const page: SitePage = {
  path: "/terms",
  title: "Website Terms of Use for miyoglobal.com | MIYO Global",
  description: "The terms that apply when you use the MIYO Global website: information-only content, intellectual property, acceptable use and external links.",
  image: "/images/og/terms.webp",
  imageAlt: "Editorial team reviewing and fact-checking an article before publication",
  crumb: "Terms of Use",
};

export const metadata: Metadata = pageMetadata(page);

const sections = [
  { id: "using-this-site", title: "1. Using this site", body: <p>This website gives general information about MIYO Global and its services. By using it you agree to these terms. If you do not agree, please do not use the site.</p> },
  { id: "information-only", title: "2. Information only", body: <p>Content on this site, including blog articles, is general information and not professional, legal or financial advice. Services are governed by a separate written agreement.</p> },
  { id: "intellectual-property", title: "3. Intellectual property", body: <p>Text, images and branding on this site belong to MIYO Global or its licensors. You may share links to our pages; please ask before reusing content.</p> },
  { id: "acceptable-use", title: "4. Acceptable use", body: <p>Do not misuse the site, attempt to disrupt it, submit false information through its forms, or attempt to access areas that are not public.</p> },
  { id: "external-links", title: "5. External links", body: <p>We link to other websites for reference. We do not control them and are not responsible for their content.</p> },
  {
    id: "changes-and-contact",
    title: "6. Changes and contact",
    body: (
      <p>
        We may update these terms and will change the date above when we do. Questions: <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <LegalPage crumb="Terms of Use" title="Terms of Use" lead="The terms that apply when you use this website." updated="November 2026" sections={sections} />
    </>
  );
}
