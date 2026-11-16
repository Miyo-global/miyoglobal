import type { Metadata } from "next";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/terms",
  title: "Terms of Use — MIYO Global",
  description: "The terms that apply when you use the MIYO Global website.",
  image: "/images/og/policy.webp",
  imageAlt: "Editorial team reviewing and fact-checking an article before publication",
  crumb: "Terms of Use",
};

export const metadata: Metadata = pageMetadata(page);

export default function TermsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / Terms of Use</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}># Legal</span>
            <h1>Terms of <span className="g">Use</span></h1><p>The terms that apply when you use this website. Last updated: November 2026.</p></div></section>
      <section className="sec"><div className="wrap" style={{ maxWidth: "860px" }}>
        <div className="legal">
          <h2>1. Using this site</h2>
          <p>This website gives general information about MIYO Global and its services. By using it you agree to these terms. If you do not agree, please do not use the site.</p>
          <h2>2. Information only</h2>
          <p>Content on this site, including blog articles, is general information and not professional, legal or financial advice. Services are governed by a separate written agreement.</p>
          <h2>3. Intellectual property</h2>
          <p>Text, images and branding on this site belong to MIYO Global or its licensors. You may share links to our pages; please ask before reusing content.</p>
          <h2>4. Acceptable use</h2>
          <p>Do not misuse the site, attempt to disrupt it, submit false information through its forms, or attempt to access areas that are not public.</p>
          <h2>5. External links</h2>
          <p>We link to other websites for reference. We do not control them and are not responsible for their content.</p>
          <h2>6. Changes and contact</h2>
          <p>We may update these terms and will change the date above when we do. Questions: <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a>.</p>
        </div>
      </div></section>
    </>
  );
}
