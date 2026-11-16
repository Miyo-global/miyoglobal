import type { Metadata } from "next";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/editorial-policy",
  title: "Editorial Policy — MIYO Global",
  description: "How MIYO Global researches, writes, reviews, updates and corrects the articles published on its blog.",
  image: "/images/og/policy.webp",
  imageAlt: "Editorial team reviewing and fact-checking an article before publication",
  crumb: "Editorial Policy",
};

export const metadata: Metadata = pageMetadata(page);

export default function EditorialPolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / Editorial Policy</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}># Legal</span>
            <h1>Editorial <span className="g">Policy</span></h1><p>How the MIYO Global blog is researched, written, reviewed and corrected. Last updated: November 2026.</p></div></section>
      <section className="sec"><div className="wrap" style={{ maxWidth: "860px" }}>
        <div className="legal">
          <h2>1. Who writes for the blog</h2>
          <p>Articles are written by named MIYO Global staff and contributors. Every article shows its author, with a short biography and credentials on the author page. Where a second person has checked the content, the article also names the reviewer.</p>
          <h2>2. How we choose topics</h2>
          <p>We write about subjects our teams work on every day: building global capability centres, technology staffing, executive search and managed digital delivery. We aim to answer the question a hiring or delivery leader is actually asking, and to give the answer first.</p>
          <h2>3. Sources and accuracy</h2>
          <p>Claims that depend on data, regulation or third-party research cite their source in a &quot;Sources and further reading&quot; section. We prefer primary sources such as government publications, standards bodies and original research. Examples drawn from client work are anonymised.</p>
          <h2>4. Independence and disclosure</h2>
          <p>MIYO Global provides staffing and digital services. Articles may mention our services where relevant, and links to our own service pages are ordinary internal links. We do not publish paid placements and we do not accept payment to mention third parties.</p>
          <h2>5. Updates and corrections</h2>
          <p>Each article shows its published date and, when it changes materially, its updated date. If you find an error, email staffing@miyoglobal.com with the article address and the correction. We fix factual errors promptly and note significant corrections on the article.</p>
          <h2>6. Images</h2>
          <p>Cover and in-article images carry descriptive alternative text. We use images we have the right to publish.</p>
          <h2>7. Contact</h2>
          <p>Questions about this policy: <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a>. See also our <Link href="/privacy-policy">Privacy &amp; Cookie Policy</Link>.</p>
        </div>
      </div></section>
    </>
  );
}
