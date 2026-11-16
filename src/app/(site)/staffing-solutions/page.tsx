import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/staffing-solutions",
  title: "Staffing Solutions — MIYO Global",
  description: "GCC and captive centre build-outs, IT and technology staffing, executive search, high-volume hiring, and clinical staffing across India and the UAE.",
  image: "/images/og/staffing.webp",
  imageAlt: "Engineers and recruiters working together on a technology staffing programme",
  crumb: "Staffing Solutions",
};

export const metadata: Metadata = pageMetadata(page);

export default function StaffingSolutionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / Staffing Solutions</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}># Staffing Solutions</span>
            <h1>Build teams with precision and <span className="g">full ownership</span></h1><p>From a single hard-to-fill role to a complete capability centre, we source, vet, and deploy teams that plug into your operations and own outcomes.</p></div></section>
      <section className="sec"><div className="wrap">
        <div className="frow reveal">
          <div className="fx gfx"><Image src="/images/gcc.jpg" alt="GCC build-out" fill sizes="(max-width: 980px) 100vw, 50vw" /><span className="ring a"></span><span className="ring b"></span>
            <div className="glyph"><svg viewBox="0 0 24 24"><path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18M6 22h12M9 7h1M14 7h1M9 11h1M14 11h1" /></svg></div>
            <span className="cap">Plan · Stand up · Scale</span></div>
          <div><div className="tag">GCC &amp; Captive Centres</div>
            <h2>Stand up your capability centre in India</h2>
            <p>Turnkey talent mapping, leadership hiring, and team build-outs across Hyderabad, Bangalore, Pune, Noida, and Chennai, with a structured path from first hires to a scaled, independent centre.</p>
            <ul className="checks" style={{ gridTemplateColumns: "1fr" }}><li>Talent mapping and location strategy</li><li>Leadership and anchor hires first</li><li>Ramp plans with clear milestones</li><li>Transfer to your ownership, planned from day one</li></ul></div>
        </div>
        <div className="frow rev reveal">
          <div className="fx gfx"><Image src="/images/tech.jpg" alt="Technology teams" fill sizes="(max-width: 980px) 100vw, 50vw" /><span className="ring a"></span><span className="ring b"></span>
            <div className="glyph"><svg viewBox="0 0 24 24"><path d="m8 9-3 3 3 3M16 9l3 3-3 3M13 6l-2 12" /></svg></div>
            <span className="cap">Rigorously screened</span></div>
          <div><div className="tag">IT &amp; Technology Staffing</div>
            <h2>Engineering talent that clears your bar</h2>
            <p>Software engineers, data scientists, cloud architects, and product managers across modern stacks, screened with role-specific technical evaluation before you ever see a profile.</p>
            <ul className="checks" style={{ gridTemplateColumns: "1fr" }}><li>Cloud, data, AI, and platform engineering</li><li>Contract, contract-to-hire, and direct hire</li><li>Technical screening before submission</li><li>Backout management with pre-screened alternates</li></ul></div>
        </div>
      </div></section>
      <section className="sec alt"><div className="wrap">
        <div className="center reveal"><span className="eyebrow" style={{ justifyContent: "center" }}>More specialisms</span><h2>The full staffing <span className="g">engine</span></h2></div>
        <div className="grid g4" style={{ marginTop: "36px" }}>
          <div className="card reveal" style={{ transitionDelay: "0s" }}><div className="ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M6 21v-1a6 6 0 0 1 12 0v1" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>Executive Search</h3><p>CXOs and functional leaders who understand local operations and global standards.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.08s" }}><div className="ic"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 6a3 3 0 0 1 0 6M17 20c0-2 1-3.5 5-3.5" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>High-Volume &amp; Lateral</h3><p>Recruitment machinery for large funnels, without losing quality or time-to-hire.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.16s" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M3 12h4l2 5 4-10 2 5h6" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>Healthcare &amp; Clinical</h3><p>Licensed physicians, NPs and PAs, medical coders, and clinical reviewers, vetted and credentialed.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.24s" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M3 7h13l-3-3M21 17H8l3 3M4 12h16" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>Surge &amp; Contract</h3><p>Flex capacity for launches, backlogs, and overflow from your own pipeline.</p></div>
        </div>
        <div className="strip reveal"><div className="ic"><svg viewBox="0 0 24 24"><path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="m9 12 2 2 4-4" /></svg></div>
          <div><b>Full compliance shield.</b> <span>100% compliant with Indian labour law: Contract Labour (R&amp;A) Act, EPF / ESI, and Shop &amp; Establishment.</span></div></div>
        <div className="strip reveal" style={{ marginTop: "14px" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5" /></svg></div>
          <div><b>Staff augmentation, group-wide.</b> <span>Our India staff augmentation practice also operates under Prime Learning. See <a href="https://primelearning.ae/staffing" target="_blank" rel="noopener" style={{ color: "var(--gold-deep)", fontWeight: "700", textDecoration: "underline" }}>Prime Learning Staff Augmentation →</a></span></div></div>
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="center reveal"><span className="eyebrow" style={{ justifyContent: "center" }}>Engagement models</span><h2>Models that fit <span className="g">how you operate</span></h2></div>
        <div className="grid g4" style={{ marginTop: "36px" }}>
          <div className="card reveal" style={{ transitionDelay: "0s" }}><div className="ic"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M18 8v6M15 11h6" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>Staff augmentation</h3><p>Vetted specialists embedded into your team, under your direction.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.08s" }}><div className="ic"><svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M2 19c0-3 2.7-5 6-5s6 2 6 5" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>Managed teams</h3><p>A full pod with our PM and QA layer. We own SLAs and reporting.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.16s" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><path d="m4 4 16 16" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>White-label</h3><p>Behind the scenes, under your brand. Your client sees your team.</p></div>
          <div className="card reveal" style={{ transitionDelay: "0.24s" }}><div className="ic"><svg viewBox="0 0 24 24"><path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18" /></svg></div><h3 style={{ fontSize: "1.08rem" }}>Build-Operate-Transfer</h3><p>We stand up and run your centre, then transfer to full ownership on plan.</p></div>
        </div>
      </div></section>
      <section className="sec tight"><div className="wrap reveal"><div className="navy-band"><span className="ring"></span>
        <div className="row"><div><h2>Ready to build your team?</h2>
        <p>Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.</p></div>
        <Link className="btn btn-gold" href="/contact">Let&apos;s Talk</Link></div></div></div></section>
    </>
  );
}
