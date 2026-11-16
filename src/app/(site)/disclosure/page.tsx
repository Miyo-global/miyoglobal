import type { Metadata } from "next";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/disclosure",
  title: "Disclosure — MIYO Global",
  description: "How MIYO Global handles commercial relationships in the content it publishes.",
  image: "/images/og/policy.webp",
  imageAlt: "Editorial team reviewing and fact-checking an article before publication",
  crumb: "Disclosure",
};

export const metadata: Metadata = pageMetadata(page);

export default function DisclosurePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / Disclosure</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}># Legal</span>
            <h1>Our <span className="g">Disclosure</span></h1><p>How commercial relationships affect what we publish. Last updated: November 2026.</p></div></section>
      <section className="sec"><div className="wrap" style={{ maxWidth: "860px" }}>
        <div className="legal">
          <h2>1. We sell the services we write about</h2>
          <p>MIYO Global provides staffing and digital delivery services. Blog articles may mention those services and link to our own service pages.</p>
          <h2>2. No paid placements</h2>
          <p>We do not publish paid placements or accept payment to mention third parties in our articles.</p>
          <h2>3. Further reading</h2>
          <p>See our <Link href="/editorial-policy">Editorial Policy</Link> for how articles are written, reviewed and corrected.</p>
        </div>
      </div></section>
    </>
  );
}
