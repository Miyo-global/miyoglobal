import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/about",
  title: "About — MIYO Global",
  description: "MIYO Global: enterprise staffing and digital delivery from India and the UAE, led by veteran operators with a compliance-backed engagement model.",
  image: "/images/og/about.webp",
  imageAlt: "MIYO Global leadership and delivery team at work in a modern office",
  crumb: "About",
};

export const metadata: Metadata = pageMetadata(page);

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / About</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}># Who we are</span>
            <h1>Operators who have <span className="g">lived it at scale</span></h1><p>MIYO Global is an enterprise staffing and digital delivery company founded by veteran operators. We know the process because we have run it in leading organisations.</p></div></section>
      <section className="sec"><div className="wrap two">
        <div className="gfx reveal"><Image src="/images/about.jpg" alt="MIYO Global team" fill sizes="(max-width: 980px) 100vw, 50vw" /><span className="ring a"></span><span className="ring b"></span>
          <div className="glyph"><svg viewBox="0 0 24 24"><path d="M20 7 9 18l-5-5" /></svg></div>
          <span className="cap">Sourced · Vetted · Managed</span>
          <div className="badge"><div className="bn">India &amp; UAE</div><div className="bl">Delivery hubs</div></div></div>
        <div className="reveal"><span className="eyebrow">Our approach</span><h2>We carry the <span className="g">delivery</span></h2>
          <p className="lead">Enterprises and staffing partners hand us their hardest roles and their digital operations. We find the right people, prove them out, and put them to work inside your process. You keep the client and the brand.</p>
          <ul className="checks"><li>Vetted, domain-tested specialists</li><li>Deployed in about two weeks</li><li>Human-in-the-loop QA</li><li>Named delivery ownership</li><li>White-label by design</li><li>Compliance-backed engagement</li></ul></div>
      </div></section>
      <section className="sec alt"><div className="wrap"><div className="center reveal"><span className="eyebrow" style={{ justifyContent: "center" }}># Our presence</span><h2>Two delivery hubs, <span className="g">global reach</span></h2></div>
        <div className="grid g2" style={{ marginTop: "36px" }}>
          <div className="office reveal" style={{ transitionDelay: "0s" }}><div className="loc"><span className="ic"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg></span><div><div className="region">India · Operations HQ</div><div className="city">Hyderabad</div></div></div><address>MIYO Global Office (Trendz Trinity), Plot No. 21, Madhapur, Gafoornagar, Hyderabad, Telangana 500081. Delivery across Bangalore, Pune, Noida, and Chennai.</address></div>
          <div className="office reveal" style={{ transitionDelay: "0.08s" }}><div className="loc"><span className="ic"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg></span><div><div className="region">UAE</div><div className="city">Ras Al Khaimah</div></div></div><address>Prime Assets Education &amp; Training Ltd., Office A, RAK DAO Business Centre, Al Riffa, Sheikh Mohammed Bin Zayed Road.</address></div>
        </div></div></section>
      <section className="sec"><div className="wrap"><div className="center reveal"><span className="eyebrow" style={{ justifyContent: "center" }}># Leadership</span><h2>The people accountable for <span className="g">delivery</span></h2></div>
        <div className="grid g3" style={{ marginTop: "34px" }}>
          <div className="person reveal" style={{ transitionDelay: "0s" }}><div className="top"><div className="mono">PR</div><div><div className="nm">Prudvidhar Reddy</div><div className="rl">Managing Director</div></div></div><p>Runs enterprise strategy and day-to-day operations across MIYO Global and allied businesses in India and the UAE. Owns P&amp;L and operational governance.</p></div>
          <div className="person reveal" style={{ transitionDelay: "0.08s" }}><div className="top"><div className="mono">SR</div><div><div className="nm">Sudheer Reddy</div><div className="rl">Chief Executive Officer</div></div></div><p>Veteran operator who has built and led delivery at scale. Sets the bar for real outcomes and the standards for people, process, and quality.</p></div>
          <div className="person reveal" style={{ transitionDelay: "0.16s" }}><div className="top"><div className="mono">BS</div><div><div className="nm">Biswajit Sircar</div><div className="rl">Senior Director, HR</div></div></div><p>Talent-acquisition leader with over two decades building scalable hiring engines across cloud, AI, BFSI, and telecom, at volume across EMEA, APAC, and China.</p></div>
        </div>
        <div className="subhead reveal">Domain advisors</div>
        <div className="grid g2 reveal">
          <div className="person reveal" style={{ transitionDelay: "0s" }}><div className="top"><div className="mono">KR</div><div><div className="nm">Kalyan Reddy</div><div className="rl">Consultant · Digital Solutions</div></div></div><p>Over 16 years across top LSPs including Keywords Studios, Pactera EDGE, Centific, and Localsoft. Large-scale multilingual delivery and AI data operations.</p></div>
          <div className="person reveal" style={{ transitionDelay: "0.08s" }}><div className="top"><div className="mono">SR</div><div><div className="nm">Sushanth Reddy, MBBS</div><div className="rl">Consultant · Healthcare &amp; Life Sciences</div></div></div><p>MBBS-qualified, with deep expertise in clinical workflows, medical content review, and healthcare AI data operations.</p></div>
        </div></div></section>
      <section className="sec alt tight"><div className="wrap"><div className="strip reveal" style={{ marginTop: "0" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="m9 12 2 2 4-4" /></svg></div>
        <div><b>Full compliance shield.</b> <span>Contract Labour (R&amp;A) Act, EPF / ESI, Shop &amp; Establishment. India: Miyo Global Private Limited. UAE: Prime Assets Education &amp; Training Ltd., operating as Prime Learning.</span></div></div></div></section>
      <section className="sec tight"><div className="wrap reveal"><div className="navy-band"><span className="ring"></span>
        <div className="row"><div><h2>Ready to build your team?</h2>
        <p>Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.</p></div>
        <Link className="btn btn-gold" href="/contact">Let&apos;s Talk</Link></div></div></div></section>
    </>
  );
}
