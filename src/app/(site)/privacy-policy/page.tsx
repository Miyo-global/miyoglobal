import type { Metadata } from "next";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/privacy-policy",
  title: "Privacy & Cookie Policy — MIYO Global",
  description: "How MIYO Global collects, uses, and protects information on this website, including our cookie practices.",
  image: "/images/og/policy.webp",
  imageAlt: "Healthcare and compliance professionals reviewing data protection documents",
  crumb: "Privacy & Cookies",
};

export const metadata: Metadata = pageMetadata(page);

export default function PrivacyPolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / Privacy &amp; Cookies</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}># Legal</span>
            <h1>Privacy &amp; <span className="g">Cookie Policy</span></h1><p>How MIYO Global collects, uses, and protects information on this website. Last updated: July 2026.</p></div></section>
      <section className="sec"><div className="wrap" style={{ maxWidth: "860px" }}>
        <div className="legal">
          <h2>1. Who we are</h2>
          <p>This website is operated by Miyo Global Private Limited (India) and Prime Assets Education &amp; Training Ltd. (UAE), operating as Prime Learning (&quot;MIYO Global&quot;, &quot;we&quot;). Registered offices: MIYO Global Office (Trendz Trinity), Plot No. 21, Madhapur, Gafoornagar, Hyderabad, Telangana 500081, India; and Office A, RAK DAO Business Centre, Al Riffa, Ras Al Khaimah, UAE. Contact: <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a>.</p>
          <h2>2. What we collect</h2>
          <p>The only personal data this website collects is what you submit through the contact form: your name, work email, and optionally company, phone, and message. We do not run analytics, advertising, or tracking scripts on this site.</p>
          <h2>3. How we use it</h2>
          <p>Contact form submissions are emailed to our staffing team and used solely to respond to your enquiry and, where relevant, to discuss a potential engagement. We do not sell personal data, and we do not use it for marketing without your consent.</p>
          <h2>4. Legal basis and retention</h2>
          <p>We process enquiry data on the basis of legitimate interest (responding to a business enquiry you initiated) or, where applicable, consent. Enquiry emails are retained for as long as needed to handle the enquiry and any resulting engagement, after which they are deleted in the normal course.</p>
          <h2>5. Sharing</h2>
          <p>Enquiry data is shared only within the MIYO Global group entities named above and with the email infrastructure that delivers it. We do not share it with advertisers or data brokers.</p>
          <h2>6. Cookies and local storage</h2>
          <p>This site does not set tracking or advertising cookies. We use one item of browser local storage (&quot;miyo-consent&quot;) to remember that you dismissed the cookie notice. Our contact form uses standard session handling on submission. That is all.</p>
          <h2>7. Third parties</h2>
          <p>Fonts are loaded from Google Fonts, which means your browser requests font files from Google servers and Google may log standard request data (such as your IP address) under its own privacy policy. No other third-party resources load on this site.</p>
          <h2>8. Your rights</h2>
          <p>Depending on your location, you may have rights under India&apos;s Digital Personal Data Protection Act (DPDP), the EU/UK GDPR, or similar laws, including access, correction, and deletion of your personal data. To exercise them, email <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a> and we will respond within a reasonable period.</p>
          <h2>9. Security</h2>
          <p>Form submissions are validated and filtered before processing, and this site is served over HTTPS. No system is perfectly secure; if we become aware of a breach affecting your data, we will notify you as required by law.</p>
          <h2>10. Candidates</h2>
          <p>If you apply for a role through us, additional recruitment-specific privacy terms may be provided during the process. Note: MIYO Global never asks candidates for money, original documents, or cheques at any stage of hiring.</p>
          <h2>11. Changes</h2>
          <p>We may update this policy from time to time. The date above reflects the latest revision.</p>
        </div>
      </div></section>
    </>
  );
}
