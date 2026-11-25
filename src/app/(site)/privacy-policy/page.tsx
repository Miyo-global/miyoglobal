import type { Metadata } from "next";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";
import { LegalPage } from "@/views/legal/legal-page";

const page: SitePage = {
  path: "/privacy-policy",
  title: "Privacy & Cookie Policy for miyoglobal.com | MIYO Global",
  description: "How MIYO Global collects, uses and protects what you submit through this website's contact form, how cookies and local storage are used, and your data rights.",
  image: "/images/og/privacy.webp",
  imageAlt: "Healthcare and compliance professionals reviewing data protection documents",
  crumb: "Privacy & Cookies",
};

export const metadata: Metadata = pageMetadata(page);

const mail = <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a>;

const sections = [
  {
    id: "who-we-are",
    title: "1. Who we are",
    body: (
      <p>
        This website is operated by Miyo Global Private Limited (India) and Prime Assets Education &amp; Training Ltd. (UAE), operating as Prime Learning (&quot;MIYO Global&quot;, &quot;we&quot;). Registered offices: MIYO Global Office (Trendz Trinity), Plot No. 21, Madhapur, Gafoornagar, Hyderabad, Telangana 500081, India; and Office A, RAK DAO Business Centre, Al Riffa, Ras Al Khaimah, UAE. Contact: {mail}.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    title: "2. What we collect",
    body: (
      <p>
        The only personal data this website collects is what you submit through the contact form: your name, work email, and optionally company, phone, and message. We also use Google Analytics, through a Google tag, to measure how visitors use the site (described below). We do not run advertising scripts on this site.
      </p>
    ),
  },
  {
    id: "how-we-use-it",
    title: "3. How we use it",
    body: (
      <p>
        Contact form submissions are emailed to our staffing team and used solely to respond to your enquiry and, where relevant, to discuss a potential engagement. We do not sell personal data, and we do not use it for marketing without your consent.
      </p>
    ),
  },
  {
    id: "legal-basis-and-retention",
    title: "4. Legal basis and retention",
    body: (
      <p>
        We process enquiry data on the basis of legitimate interest (responding to a business enquiry you initiated) or, where applicable, consent. Enquiry emails are retained for as long as needed to handle the enquiry and any resulting engagement, after which they are deleted in the normal course.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "5. Sharing",
    body: <p>Enquiry data is shared only within the MIYO Global group entities named above and with the email infrastructure that delivers it. We do not share it with advertisers or data brokers.</p>,
  },
  {
    id: "cookies-and-local-storage",
    title: "6. Cookies and local storage",
    body: (
      <p>
        Google Analytics sets first-party cookies (such as &quot;_ga&quot;) to tell visits apart and measure page views. This site does not set advertising cookies. We use one item of browser local storage (&quot;miyo-consent&quot;) to remember that you dismissed the cookie notice. Our contact form uses standard session handling on submission. That is all.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "7. Third parties",
    body: (
      <p>
        Fonts are served from our own domain; your browser makes no requests to Google Fonts. Google Analytics, loaded through Google Tag Manager, receives page views and standard request data (such as your IP address, browser and device type) under Google&apos;s privacy policy. No other third-party resources load on this site.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your rights",
    body: (
      <p>
        Depending on your location, you may have rights under India&apos;s Digital Personal Data Protection Act (DPDP), the EU/UK GDPR, or similar laws, including access, correction, and deletion of your personal data. To exercise them, email {mail} and we will respond within a reasonable period.
      </p>
    ),
  },
  {
    id: "security",
    title: "9. Security",
    body: (
      <p>
        Form submissions are validated and filtered before processing, and this site is served over HTTPS. No system is perfectly secure; if we become aware of a breach affecting your data, we will notify you as required by law.
      </p>
    ),
  },
  {
    id: "candidates",
    title: "10. Candidates",
    body: (
      <p>
        If you apply for a role through us, additional recruitment-specific privacy terms may be provided during the process. Note: MIYO Global never asks candidates for money, original documents, or cheques at any stage of hiring.
      </p>
    ),
  },
  {
    id: "changes",
    title: "11. Changes",
    body: <p>We may update this policy from time to time. The date above reflects the latest revision.</p>,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <LegalPage crumb="Privacy & Cookies" title="Privacy & Cookie Policy" lead="How MIYO Global collects, uses, and protects information on this website." updated="November 2026" sections={sections} />
    </>
  );
}
