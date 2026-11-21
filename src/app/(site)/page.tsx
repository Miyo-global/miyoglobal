import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HighlightSlider } from "@/components/highlight-slider";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/",
  title: "MIYO Global — Enterprise Staffing & Digital Solutions",
  description: "MIYO Global builds enterprise teams: GCC build-outs, technology staffing, executive search, and managed digital delivery from India and the UAE.",
  image: "/images/og/index.webp",
  imageAlt: "MIYO Global team collaborating on an enterprise staffing and delivery plan",
};

export const metadata: Metadata = pageMetadata(page);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="hero"><div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Enterprise Staffing · India &amp; the UAE</span>
          <h1>Build teams that <span className="g">own outcomes</span></h1>
          <p className="sub">MIYO Global helps enterprises and staffing partners stand up capability, from GCC build-outs and technology talent to managed digital delivery, under your brand and inside your process.</p>
          <div className="hero-cta"><Link className="btn btn-navy" href="/contact">Get started</Link><Link className="btn btn-ghost" href="/staffing-solutions">Explore staffing solutions</Link></div>
        </div>
        <div className="gfx"><Image src="/images/hero.jpg" alt="Enterprise teams collaborating" fill sizes="(max-width: 980px) 100vw, 50vw" priority /><span className="ring a"></span><span className="ring b"></span>
          <div className="glyph"><svg viewBox="0 0 24 24"><path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18M6 22h12M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /></svg></div>
          <span className="cap">Talent · Delivery · Capability</span>
          <div className="badge"><div className="bn">India &amp; UAE</div><div className="bl">Delivery hubs</div></div>
        </div>
      </div>
      <div className="wrap"><div className="counters reveal">
        <div className="c reveal" style={{ transitionDelay: "0s" }}><div className="n" data-count="5">5</div><div className="l">India tech hubs</div></div>
        <div className="c reveal" style={{ transitionDelay: "0.08s" }}><div className="n" data-count="4">4</div><div className="l">Engagement models</div></div>
        <div className="c reveal" style={{ transitionDelay: "0.16s" }}><div className="n" data-count="120" data-suffix="+">120+</div><div className="l">Languages in digital delivery</div></div>
        <div className="c reveal" style={{ transitionDelay: "0.24s" }}><div className="n" data-count="2">2</div><div className="l">Delivery regions</div></div>
      </div></div></section>

      <section className="marquee-sec"><div className="wrap"><div className="mq-label">Capabilities we build</div></div>
      <div className="marquee"><div className="mq-track" id="mq">
        <span className="pill"><b>GCC &amp; Captive Centres</b></span><span className="pill">IT &amp; Technology Staffing</span>{" "}
        <span className="pill">Executive Search</span><span className="pill">High-Volume Hiring</span>{" "}
        <span className="pill">Healthcare &amp; Clinical Staffing</span><span className="pill"><b>AI Data Services</b></span>{" "}
        <span className="pill">Localization</span><span className="pill">Trust &amp; Safety</span><span className="pill">Corporate Training</span>

        <span className="pill" aria-hidden="true"><b>GCC &amp; Captive Centres</b></span><span className="pill" aria-hidden="true">IT &amp; Technology Staffing</span>{" "}
        <span className="pill" aria-hidden="true">Executive Search</span><span className="pill" aria-hidden="true">High-Volume Hiring</span>{" "}
        <span className="pill" aria-hidden="true">Healthcare &amp; Clinical Staffing</span><span className="pill" aria-hidden="true"><b>AI Data Services</b></span>{" "}
        <span className="pill" aria-hidden="true">Localization</span><span className="pill" aria-hidden="true">Trust &amp; Safety</span><span className="pill" aria-hidden="true">Corporate Training</span>
      </div></div></section>

      <section className="sec" id="lines"><div className="wrap">
        <div className="center reveal"><span className="eyebrow" style={{ justifyContent: "center" }}>What we do</span>
          <h2>Two service lines, <span className="g">one accountable partner</span></h2>
          <p className="lead">Staffing solutions to build and scale your teams, backed by managed digital delivery when you need work done, not just seats filled.</p></div>
        <div className="grid g2" style={{ marginTop: "38px" }}>
          <div className="card reveal" style={{ transitionDelay: "0s" }}>
            <div className="ic"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M18 8v6M15 11h6" /></svg></div>
            <h3 style={{ fontSize: "1.5rem" }}>Staffing Solutions</h3>
            <p>From single specialists to full GCC build-outs, we source, vet, and deploy teams that plug into your operations.</p>
            <ul className="roles"><li>GCC &amp; Captive Centres</li><li>IT &amp; Technology Staffing</li><li>Executive Search</li><li>High-Volume &amp; Lateral</li><li>Healthcare &amp; Clinical Staffing</li><li>Surge &amp; Contract</li></ul>
            <div style={{ marginTop: "22px" }}><Link className="btn btn-navy" href="/staffing-solutions">Explore staffing →</Link></div>
          </div>
          <div className="card reveal" style={{ transitionDelay: "0.08s" }}>
            <div className="ic"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9zM4 10h2M4 14h2M18 10h2M18 14h2M10 4v2M14 4v2M10 18v2M14 18v2" /></svg></div>
            <h3 style={{ fontSize: "1.5rem" }}>Digital Solutions</h3>
            <p>Managed delivery for the digital work behind global products: AI data, multilingual localization, trust &amp; safety, and enterprise training.</p>
            <ul className="roles"><li>AI Data Services</li><li>Localization &amp; Multilingual</li><li>Trust &amp; Safety Operations</li><li>Healthcare AI Data</li><li>Corporate Training</li><li>Quality &amp; LQA Programs</li></ul>
            <div style={{ marginTop: "22px" }}><Link className="btn btn-ghost" href="/digital-solutions">Explore digital →</Link></div>
          </div>
        </div>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <div className="center reveal"><span className="eyebrow" style={{ justifyContent: "center" }}>Why MIYO</span>
          <h2>Execution-first, <span className="g">not advisory-heavy</span></h2>
          <p className="lead">We own delivery, not just recommendations. Built by operators who have run this at scale.</p></div>
        <div className="grid g4" style={{ marginTop: "38px" }}>
          <div className="card reveal" style={{ transitionDelay: "0s" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>Execution-first</h3><p>We stand up teams and run them. Outcomes, not slideware.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.08s" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>End-to-end accountability</h3><p>One partner, one named delivery lead. No handoffs between vendors.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.16s" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><path d="m4 4 16 16" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>White-label by design</h3><p>We work under your brand. Your client sees your team.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.24s" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="m9 12 2 2 4-4" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>Compliance shield</h3><p>Contract Labour (R&amp;A) Act, EPF / ESI, and Shop &amp; Establishment compliant.</p></div>
        </div>
      </div></section>

      <section className="sec tight"><div className="wrap center reveal">
        <span className="eyebrow" style={{ justifyContent: "center" }}>What partners get</span>
        <HighlightSlider />
      </div></section>

      <section className="sec" id="work"><div className="wrap">
        <div className="center reveal"><span className="eyebrow" style={{ justifyContent: "center" }}>How we deliver</span>
          <h2>Sourced, vetted, deployed, <span className="g">managed</span></h2></div>
        <div className="proc">
          <div className="steps reveal">
            <div className="step reveal" style={{ transitionDelay: "0s" }}><div className="num">1</div><div><h3>Source</h3><p>Targeted sourcing across specialist networks to find the right people, fast.</p></div></div>
            <div className="step reveal" style={{ transitionDelay: "0.08s" }}><div className="num">2</div><div><h3>Vet</h3><p>Role-specific testing, technical screening, and reference checks.</p></div></div>
            <div className="step reveal" style={{ transitionDelay: "0.16s" }}><div className="num">3</div><div><h3>Deploy</h3><p>People work inside your tools, process, and platform, under your brand.</p></div></div>
            <div className="step reveal" style={{ transitionDelay: "0.24s" }}><div className="num">4</div><div><h3>Manage</h3><p>Human-in-the-loop QA, escalation paths, and regular reporting.</p></div></div>
          </div>
          <div className="gfx reveal"><Image src="/images/process.jpg" alt="Delivery and QA" fill sizes="(max-width: 980px) 100vw, 50vw" /><span className="ring a"></span><span className="ring b"></span>
            <div className="glyph"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg></div>
            <span className="cap">Named delivery ownership</span></div>
        </div>
      </div></section>

      <section className="sec alt" id="proof"><div className="wrap">
        <div className="center reveal"><span className="eyebrow" style={{ justifyContent: "center" }}>Proof</span>
          <h2>Delivered, <span className="g">not promised</span></h2></div>
        <div className="grid g3" style={{ marginTop: "38px" }}>
          <div className="case reveal" style={{ transitionDelay: "0s" }}><div className="tag"><span className="mini"><svg viewBox="0 0 24 24"><path d="M3 12h4l2 5 4-10 2 5h6" /></svg></span>Healthcare &amp; Life Sciences</div>
            <p>Licensed US physicians deployed to review AI-generated health answers. A 10-day pilot extended to three months on performance.</p>
            <div className="metrics"><div><div className="num">11</div><div className="lab">Physicians</div></div><div><div className="num">2 wks</div><div className="lab">Request to live</div></div><div><div className="num">3 mo</div><div className="lab">Pilot extended</div></div></div></div>
          <div className="case reveal" style={{ transitionDelay: "0.08s" }}><div className="tag"><span className="mini"><svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18" /></svg></span>Radiology · Imaging</div>
            <p>Board-certified radiologists producing comprehensive CT and MRI reports in English on the OneForma platform.</p>
            <div className="metrics"><div><div className="num">45</div><div className="lab">Radiologists</div></div><div><div className="num">3,750</div><div className="lab">CT &amp; MRI reports</div></div><div><div className="num">40 min</div><div className="lab">Avg per report</div></div></div></div>
          <div className="case reveal" style={{ transitionDelay: "0.16s" }}><div className="tag"><span className="mini"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg></span>AI Data Services</div>
            <p>100+ native-speaker contributors labeling multilingual text in images, held to a strict accuracy bar with daily checks.</p>
            <div className="metrics"><div><div className="num">100+</div><div className="lab">Contributors</div></div><div><div className="num">95%+</div><div className="lab">Accuracy held</div></div><div><div className="num">4</div><div className="lab">Label types</div></div></div></div>
        </div>
        <div className="center" style={{ marginTop: "26px" }}><Link className="btn btn-ghost" href="/case-studies">See all case studies</Link></div>
      </div></section>
      <section className="sec tight"><div className="wrap reveal"><div className="navy-band"><span className="ring"></span>
        <div className="row"><div><h2>Ready to build your team?</h2>
        <p>Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.</p></div>
        <Link className="btn btn-gold" href="/contact">Let&apos;s Talk</Link></div></div></div></section>
    </>
  );
}
