import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/contact",
  title: "Contact Us: Staffing Enquiries, India & UAE | MIYO Global",
  description: "Talk to MIYO Global about a role, a pod, a GCC or a digital programme. Email staffing@miyoglobal.com or reach our Hyderabad and Ras Al Khaimah offices.",
  image: "/images/og/contact.webp",
  imageAlt: "Colleagues across India and the UAE discussing a staffing enquiry",
  crumb: "Contact",
};

export const metadata: Metadata = pageMetadata(page);

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / Contact</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}>Get in touch</span>
            <h1>Let’s build your <span className="g">team</span></h1><p>Tell us what you need, a role, a pod, a GCC, or a digital program, and we will come back with a plan and ramp-up timelines.</p></div></section>
      <section className="sec"><div className="wrap contact-2">
        <ContactForm />
        <div className="cinfo reveal">
          <div className="office"><div className="loc"><span className="ic"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></svg></span><div><div className="region">Email</div><div className="city" style={{ fontSize: "1.02rem" }}><a href="mailto:staffing@miyoglobal.com" className="g">staffing@miyoglobal.com</a></div></div></div></div>
          <div className="office"><div className="loc"><span className="ic"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg></span><div><div className="region">India · Operations HQ</div><div className="city">Hyderabad</div></div></div><address>MIYO Global Office (Trendz Trinity), Plot No. 21, Madhapur, Gafoornagar, Hyderabad, Telangana 500081</address></div>
          <div className="office"><div className="loc"><span className="ic"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg></span><div><div className="region">UAE</div><div className="city">Ras Al Khaimah</div></div></div><address>Prime Assets Education &amp; Training Ltd., Office A, RAK DAO Business Centre, Al Riffa, Sheikh Mohammed Bin Zayed Road</address></div>
        </div>
      </div></section>
    </>
  );
}
