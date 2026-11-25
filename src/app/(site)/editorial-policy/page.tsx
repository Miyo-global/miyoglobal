import type { Metadata } from "next";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";
import { LegalPage } from "@/views/legal/legal-page";

const page: SitePage = {
  path: "/editorial-policy",
  title: "Editorial Policy: How Articles Are Reviewed | MIYO Global",
  description: "How MIYO Global researches, writes, reviews, updates and corrects its blog articles: named authors, cited sources, no paid placements and prompt corrections.",
  image: "/images/og/editorial.webp",
  imageAlt: "Editorial team reviewing and fact-checking an article before publication",
  crumb: "Editorial Policy",
};

export const metadata: Metadata = pageMetadata(page);

const sections = [
  {
    id: "who-writes-for-the-blog",
    title: "1. Who writes for the blog",
    body: (
      <p>
        Articles are written by named MIYO Global staff and contributors. Every article shows its author, with a short biography and credentials on the author page. Where a second person has checked the content, the article also names the reviewer.
      </p>
    ),
  },
  {
    id: "how-we-choose-topics",
    title: "2. How we choose topics",
    body: (
      <p>
        We write about subjects our teams work on every day: building global capability centres, technology staffing, executive search and managed digital delivery. We aim to answer the question a hiring or delivery leader is actually asking, and to give the answer first.
      </p>
    ),
  },
  {
    id: "sources-and-accuracy",
    title: "3. Sources and accuracy",
    body: (
      <p>
        Claims that depend on data, regulation or third-party research cite their source in a &quot;Sources and further reading&quot; section. We prefer primary sources such as government publications, standards bodies and original research. Examples drawn from client work are anonymised.
      </p>
    ),
  },
  {
    id: "independence-and-disclosure",
    title: "4. Independence and disclosure",
    body: (
      <p>
        MIYO Global provides staffing and digital services. Articles may mention our services where relevant, and links to our own service pages are ordinary internal links. We do not publish paid placements and we do not accept payment to mention third parties.
      </p>
    ),
  },
  {
    id: "updates-and-corrections",
    title: "5. Updates and corrections",
    body: (
      <p>
        Each article shows its published date and, when it changes materially, its updated date. If you find an error, email staffing@miyoglobal.com with the article address and the correction. We fix factual errors promptly and note significant corrections on the article.
      </p>
    ),
  },
  { id: "images", title: "6. Images", body: <p>Cover and in-article images carry descriptive alternative text. We use images we have the right to publish.</p> },
  {
    id: "contact",
    title: "7. Contact",
    body: (
      <p>
        Questions about this policy: <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a>. See also our <Link href="/privacy-policy">Privacy &amp; Cookie Policy</Link>.
      </p>
    ),
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <LegalPage crumb="Editorial Policy" title="Editorial Policy" lead="How the MIYO Global blog is researched, written, reviewed and corrected." updated="November 2026" sections={sections} />
    </>
  );
}
