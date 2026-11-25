import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript } from "@/lib/seo";

const page: SitePage = {
  path: "/digital-solutions",
  title: "AI Data, Localization & Trust and Safety | MIYO Global",
  description: "Managed digital delivery from India and the UAE: AI data services, localization in 120+ languages, healthcare AI review, trust and safety, and training.",
  image: "/images/og/digital.webp",
  imageAlt: "Data and AI delivery team reviewing a managed digital solution",
  crumb: "Digital Solutions",
};

export const metadata: Metadata = pageMetadata(page);

export default function DigitalSolutionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page)) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / Digital Solutions</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}>Digital Solutions</span>
            <h1>Managed delivery for your <span className="g">digital operations</span></h1><p>Beyond seats, we deliver the work: AI data operations, multilingual localization, trust &amp; safety, and enterprise training, run as managed services with measurable quality.</p></div></section>
      <section className="sec"><div className="wrap">
        <div className="frow reveal" id="ai-data">
          <div className="fx gfx"><Image src="/images/ai-data.jpg" alt="Man in a suit and glasses facing a glowing wireframe humanoid figure" fill sizes="(max-width: 980px) 100vw, 50vw" /><span className="ring a"></span><span className="ring b"></span>
            <div className="glyph"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg></div>
            <span className="cap">Model-ready data</span></div>
          <div><div className="tag">AI Data Services</div>
            <h2>Data your models can learn from</h2>
            <p>Native speakers and trained annotators collect, label, and validate multilingual training data inside your platform, held to strict accuracy with daily checks.</p>
            <ul className="roles"><li>Data labeling &amp; annotation</li><li>Multilingual data collection</li><li>Prompt &amp; response evaluation</li><li>RLHF / preference rating</li><li>Red-teaming &amp; safety review</li><li>Data operations leads</li></ul></div>
        </div>
        <div className="frow rev reveal" id="localization">
          <div className="fx gfx"><Image src="/images/localization.jpg" alt="Glass globe showing the continents, resting on a wet reflective surface" fill sizes="(max-width: 980px) 100vw, 50vw" /><span className="ring a"></span><span className="ring b"></span>
            <div className="glyph"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" /></svg></div>
            <span className="cap">120+ languages</span></div>
          <div><div className="tag">Localization &amp; Multilingual</div>
            <h2>Products that read native in every market</h2>
            <p>Full localization pipelines across 120+ languages, translation, review, LQA, terminology, and subtitling, with human review at every step and consistency built in.</p>
            <ul className="roles"><li>Translation &amp; transcreation</li><li>Review &amp; proofreading</li><li>Localization QA (LQA)</li><li>Terminology management</li><li>Subtitling &amp; OST / OCR</li><li>Localization program management</li></ul></div>
        </div>
        <div className="frow reveal" id="healthcare-ai">
          <div className="fx gfx"><Image src="/images/healthcare.jpg" alt="Clinician in a surgical cap, mask and gloves using a tablet behind a translucent diagnostic display" fill sizes="(max-width: 980px) 100vw, 50vw" /><span className="ring a"></span><span className="ring b"></span>
            <div className="glyph"><svg viewBox="0 0 24 24"><path d="M3 12h4l2 5 4-10 2 5h6" /></svg></div>
            <span className="cap">Clinician-led</span></div>
          <div><div className="tag">Healthcare AI &amp; Trust &amp; Safety</div>
            <h2>High-stakes content, expertly reviewed</h2>
            <p>Licensed clinicians review AI health output for safety and accuracy, and trained analysts run trust &amp; safety operations across languages with clear policy playbooks.</p>
            <ul className="roles"><li>Medical AI review &amp; safety checks</li><li>Health data structuring &amp; QA</li><li>Policy &amp; content moderation</li><li>Escalation workflows &amp; reporting</li></ul></div>
        </div>
      </div></section>
      <section className="sec alt" id="training"><div className="wrap reveal">
        <div className="navy-band"><span className="ring"></span><div className="row">
          <div><span className="eyebrow" style={{ color: "#F2D184" }}>Corporate Training · Prime Learning</span>
            <h2 style={{ marginTop: "8px" }}>Upskill the teams behind the work</h2>
            <p>Outcomes-driven, expert-led cohort programmes in AI, data, cloud, and leadership, delivered by Prime Learning across India, the UAE, and global markets.</p></div>
          <a className="btn btn-gold" href="https://primelearning.ae" target="_blank" rel="noopener">Visit Prime Learning →</a>
        </div></div>
      </div></section>
      <section className="sec tight"><div className="wrap reveal"><div className="navy-band"><span className="ring"></span>
        <div className="row"><div><h2>Ready to build your team?</h2>
        <p>Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.</p></div>
        <Link className="btn btn-gold" href="/contact">Let&apos;s Talk</Link></div></div></div></section>
    </>
  );
}
