import type { Metadata } from "next";
import Link from "next/link";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";

const page: SitePage = {
  path: "/case-studies",
  title: "Case Studies: Healthcare, Radiology & AI Data | MIYO Global",
  description: "Case studies: 11 licensed US physicians live in two weeks, 45 radiologists producing 3,750 CT and MRI reports, and 100+ AI data contributors at 95%+ accuracy.",
  image: "/images/og/cases.webp",
  imageAlt: "Global capability centre team celebrating a completed build-out engagement",
  crumb: "Case studies",
};

export const metadata: Metadata = pageMetadata(page);

const url = `${SITE_URL}${page.path}`;
// The three cases below: anchor id and the sector label printed on each card.
const jsonLd = pageJsonLd(page, [
  {
    "@type": "ItemList",
    "@id": `${url}#cases`,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    itemListElement: [["physician-review", "Healthcare & Life Sciences"], ["radiology", "Radiology · Imaging"], ["ai-data-labeling", "AI Data Services"]].map(([id, name], i) => ({ "@type": "ListItem", position: i + 1, name, url: `${url}#${id}` })),
  },
]);

export default function CaseStudiesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <section className="phero"><span className="rbg"></span><span className="rbg two"></span>
            <div className="wrap"><div className="crumb"><Link href="/">Home</Link> / Case studies</div>
            <span className="eyebrow" style={{ marginTop: "10px" }}>Proof</span>
            <h1>Delivered, <span className="g">not promised</span></h1><p>Specialist teams stood up fast, held to measurable quality. A sample of engagements delivered by our practice teams.</p></div></section>
      <section className="sec"><div className="wrap"><div className="grid g3">
        <div className="case reveal" id="physician-review"><div className="tag"><span className="mini"><svg viewBox="0 0 24 24"><path d="M3 12h4l2 5 4-10 2 5h6" /></svg></span>Healthcare &amp; Life Sciences</div>
          <p>Vetted and deployed licensed US physicians to review AI-generated health answers for safety and accuracy at a global AI services firm. A 10-day pilot extended to three months on performance.</p>
          <div className="metrics"><div><div className="num">11</div><div className="lab">Physicians</div></div><div><div className="num">2 wks</div><div className="lab">Request to live</div></div><div><div className="num">3 mo</div><div className="lab">Pilot extended</div></div></div></div>
        <div className="case reveal" id="radiology"><div className="tag"><span className="mini"><svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18" /></svg></span>Radiology · Imaging</div>
          <p>Board-certified radiologists producing comprehensive CT and MRI reports in English, with full findings and impressions, delivered on the OneForma platform.</p>
          <div className="metrics"><div><div className="num">45</div><div className="lab">Radiologists</div></div><div><div className="num">3,750</div><div className="lab">CT &amp; MRI reports</div></div><div><div className="num">40 min</div><div className="lab">Avg per report</div></div></div></div>
        <div className="case reveal" id="ai-data-labeling"><div className="tag"><span className="mini"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg></span>AI Data Services</div>
          <p>Sourced, trained, and managed 100+ native-speaker contributors labeling multilingual text in images, held to a strict accuracy bar with daily checks.</p>
          <div className="metrics"><div><div className="num">100+</div><div className="lab">Contributors</div></div><div><div className="num">95%+</div><div className="lab">Accuracy held</div></div><div><div className="num">4</div><div className="lab">Label types</div></div></div></div>
      </div><p className="note reveal">Delivered by our practice teams, led by the domain consultants on the About page.</p></div></section>
      <section className="sec tight"><div className="wrap reveal"><div className="navy-band"><span className="ring"></span>
        <div className="row"><div><h2>Ready to build your team?</h2>
        <p>Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.</p></div>
        <Link className="btn btn-gold" href="/contact">Let&apos;s Talk</Link></div></div></div></section>
    </>
  );
}
