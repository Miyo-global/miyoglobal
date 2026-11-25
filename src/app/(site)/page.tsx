import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fmtDate } from "@/components/post-card";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { latest } from "@/server/services/public";
import "./home.css";

const page: SitePage = {
  path: "/",
  title: "MIYO Global | Enterprise Staffing & Digital Solutions",
  description: "MIYO Global builds enterprise teams: GCC build-outs, technology staffing, executive search, and managed digital delivery from India and the UAE.",
  image: "/images/og/index.webp",
  imageAlt: "MIYO Global team collaborating on an enterprise staffing and delivery plan",
};

export const metadata: Metadata = pageMetadata(page);
export const revalidate = 300;

const S = "/staffing-solutions";
const D = "/digital-solutions";
const C = "/case-studies";

// [href, title, descriptor]
const staffing = [
  [`${S}#gcc`, "GCC & captive centres", "Talent mapping, leadership hiring and team build-outs in India"],
  [`${S}#technology`, "IT & technology staffing", "Software engineers, data scientists, cloud architects and product managers"],
  [`${S}#executive-search`, "Executive search", "CXOs and functional leaders"],
  [`${S}#high-volume`, "High-volume & lateral hiring", "Large funnels without losing quality or time-to-hire"],
  [`${S}#healthcare`, "Healthcare & clinical staffing", "Licensed physicians, NPs and PAs, medical coders and clinical reviewers"],
  [`${S}#surge`, "Surge & contract", "Flex capacity for launches, backlogs and overflow"],
];

const digital = [
  [`${D}#ai-data`, "AI data services", "Data labeling, multilingual collection, evaluation and red-teaming"],
  [`${D}#localization`, "Localization & multilingual", "Translation, review, LQA and subtitling across 120+ languages"],
  [`${D}#healthcare-ai`, "Trust & safety operations", "Policy and content moderation with escalation workflows"],
  [`${D}#healthcare-ai`, "Healthcare AI review", "Licensed clinicians reviewing AI health output for safety and accuracy"],
  [`${D}#localization`, "Quality & LQA programmes", "Human review at every step"],
  [`${D}#training`, "Corporate training", "Cohort programmes in AI, data, cloud and leadership, delivered by Prime Learning"],
];

const lines = [
  { title: "Staffing Solutions", text: "From a single hard-to-fill role to a complete capability centre, we source, vet and deploy teams that plug into your operations.", rows: staffing, href: S, cta: "Explore staffing solutions" },
  { title: "Digital Solutions", text: "Managed delivery for the digital work behind global products, run as managed services with measurable quality.", rows: digital, href: D, cta: "Explore digital solutions" },
];

const models = [
  ["Staff augmentation", "Vetted specialists embedded into your team, under your direction."],
  ["Managed teams", "A full pod with our PM and QA layer. We own SLAs and reporting."],
  ["White-label", "Behind the scenes, under your brand. Your client sees your team."],
  ["Build-Operate-Transfer", "We stand up and run your centre, then transfer to full ownership on plan."],
];

// [title, text, proof href, proof label]
const steps = [
  ["Source", "Targeted sourcing across specialist networks to find the right people, fast."],
  ["Vet", "Role-specific testing, technical screening and reference checks."],
  ["Deploy", "People work inside your tools, process and platform, under your brand.", `${C}#physician-review`, "2 weeks from request to live for 11 physicians"],
  ["Manage", "Human-in-the-loop QA, escalation paths and regular reporting.", `${C}#ai-data-labeling`, "95%+ accuracy held, with daily checks"],
];

const cases = [
  {
    href: `${C}#physician-review`,
    tag: "Healthcare & Life Sciences",
    num: "2 wks",
    unit: "request to live",
    ledger: "From request to live: 11 licensed US physicians reviewing AI-generated health answers.",
    title: "Licensed US physicians reviewing AI health answers",
    text: "Licensed US physicians vetted and deployed to review AI-generated health answers for safety and accuracy at a global AI services firm. The 10-day pilot was extended to three months on performance.",
    cap: "11 physicians · Pilot extended to 3 months",
    link: "Read the physician review case",
  },
  {
    href: `${C}#radiology`,
    tag: "Radiology · Imaging",
    num: "3,750",
    unit: "CT and MRI reports",
    ledger: "CT and MRI reports produced by 45 board-certified radiologists.",
    title: "Board-certified radiologists reporting CT and MRI studies",
    text: "Comprehensive reports in English, with full findings and impressions, delivered on the OneForma platform.",
    cap: "45 radiologists · 40 min average per report",
    link: "Read the radiology case",
  },
  {
    href: `${C}#ai-data-labeling`,
    tag: "AI Data Services",
    num: "95%+",
    unit: "accuracy held",
    ledger: "Accuracy held by 100+ native-speaker contributors labeling multilingual text in images.",
    title: "Native-speaker contributors labeling multilingual text in images",
    text: "100+ contributors sourced, trained and managed, held to a strict accuracy bar with daily checks.",
    cap: "100+ contributors · 4 label types",
    link: "Read the AI data case",
  },
];

const principles = [
  ["Execution-first", "We stand up teams and run them. Outcomes, not slideware."],
  ["End-to-end accountability", "One partner, one named delivery lead. No handoffs between vendors."],
  ["White-label by design", "We work under your brand. Your client sees your team."],
  ["Managed quality", "Human-in-the-loop QA on every engagement, with daily checks."],
];

/** Single source for the visible FAQ and the FAQPage JSON-LD, so the two can never drift. */
const faqs = [
  ["What does MIYO Global do?", "MIYO Global is an enterprise staffing and digital delivery company with offices in India and the UAE. We build GCCs and captive centres, provide IT and technology staffing, executive search, high-volume hiring and healthcare staffing, and run managed digital delivery: AI data services, localization, trust & safety and corporate training."],
  ["Where do you build teams?", "Our operations headquarters is in Hyderabad, with delivery across Bangalore, Pune, Noida and Chennai. Our UAE office is in Ras Al Khaimah."],
  ["How quickly can a team be deployed?", "Specialist teams are deployed in about two weeks. In one healthcare engagement, 11 licensed US physicians went from request to live in two weeks."],
  ["Which engagement models do you offer?", "Four: staff augmentation, managed teams with our PM and QA layer, white-label delivery under your brand, and Build-Operate-Transfer, where we stand up and run your centre and then transfer it to your ownership on plan."],
  ["Can you work white-label for staffing partners?", "Yes. We are white-label by design. We work behind the scenes, under your brand, and your client sees your team."],
  ["How do you handle labour-law compliance in India?", "Staffing in India is 100% compliant with Indian labour law: the Contract Labour (R&A) Act, EPF / ESI, and Shop & Establishment. The contracting entity in India is Miyo Global Private Limited; in the UAE it is Prime Assets Education & Training Ltd., operating as Prime Learning."],
  ["How do you manage quality once a team is live?", "Every engagement has a named delivery lead, human-in-the-loop QA with daily checks, escalation paths and regular reporting."],
  ["How do we get started?", "Start with a pilot role, a managed pod, or a GCC conversation. Tell us the roles, volumes, timelines and target markets, and we come back with a plan and ramp-up timelines. Use the contact page or email staffing@miyoglobal.com."],
  ["Does MIYO Global charge candidates?", "No. MIYO Global never asks candidates for money, original documents, or cheques at any stage of hiring. If anyone requests these in our name, report it to staffing@miyoglobal.com."],
];

// [label, href], every term as printed on the two service pages
const az = [
  ["AI data services", `${D}#ai-data`],
  ["Build-Operate-Transfer", `${S}#models`],
  ["Clinical staffing", `${S}#healthcare`],
  ["Cloud, data, AI and platform engineering", `${S}#technology`],
  ["Content moderation", `${D}#healthcare-ai`],
  ["Contract, contract-to-hire and direct hire", `${S}#technology`],
  ["Corporate training", `${D}#training`],
  ["Data labeling & annotation", `${D}#ai-data`],
  ["Executive search", `${S}#executive-search`],
  ["GCC & captive centres", `${S}#gcc`],
  ["Health data structuring & QA", `${D}#healthcare-ai`],
  ["Healthcare AI review", `${D}#healthcare-ai`],
  ["High-volume & lateral hiring", `${S}#high-volume`],
  ["IT & technology staffing", `${S}#technology`],
  ["Leadership hiring", `${S}#gcc`],
  ["Localization program management", `${D}#localization`],
  ["Localization QA (LQA)", `${D}#localization`],
  ["Managed teams", `${S}#models`],
  ["Multilingual data collection", `${D}#ai-data`],
  ["Prompt & response evaluation", `${D}#ai-data`],
  ["Red-teaming & safety review", `${D}#ai-data`],
  ["Review & proofreading", `${D}#localization`],
  ["RLHF / preference rating", `${D}#ai-data`],
  ["Staff augmentation", `${S}#models`],
  ["Subtitling & OST / OCR", `${D}#localization`],
  ["Surge & contract staffing", `${S}#surge`],
  ["Talent mapping & location strategy", `${S}#gcc`],
  ["Terminology management", `${D}#localization`],
  ["Translation & transcreation", `${D}#localization`],
  ["Trust & safety operations", `${D}#healthcare-ai`],
  ["White-label delivery", `${S}#models`],
];

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof latest>> = [];
  try {
    posts = await latest(3);
  } catch {
    // The journal row is optional: the page still renders when the database is unreachable.
  }
  const jsonLd = pageJsonLd(page, [
    { "@type": "FAQPage", "@id": `${SITE_URL}/#faq`, mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ]);
  return (
    <div className="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      <section className="h-hero"><div className="wrap">
        <div className="h-grid">
          <div>
            <span className="eyebrow">Enterprise staffing and managed delivery · India &amp; the UAE</span>
            <h1>Build teams that <span className="g">own outcomes</span></h1>
            <p className="h-sub">MIYO Global builds capability centres, places technology, leadership and clinical talent, and runs AI data, localization and trust &amp; safety work as managed services. Under your brand, inside your process.</p>
            <div className="h-cta">
              <Link className="btn btn-gold" href="/contact">Let&apos;s Talk</Link>
              <Link className="tl" href={S}>Staffing solutions</Link>
              <Link className="tl" href={D}>Digital solutions</Link>
            </div>
          </div>
          <aside className="ledger" aria-labelledby="ledger-t">
            <h2 id="ledger-t" className="micro">Delivery record</h2>
            <ul>
              {cases.map((c) => (
                <li key={c.href}><Link href={c.href}><span className="num">{c.num}</span><span className="d">{c.ledger}<span className="micro">{c.tag}</span></span></Link></li>
              ))}
            </ul>
            <Link className="tl" href={C}>Read the case studies</Link>
          </aside>
        </div>
        <ul className="facts">
          <li>Offices in Hyderabad and Ras Al Khaimah</li>
          <li>Delivery across Bangalore, Pune, Noida and Chennai</li>
          <li>120+ languages in digital delivery</li>
          <li>Four engagement models</li>
        </ul>
      </div></section>

      <section className="hs" id="services"><div className="wrap">
        <div className="reveal">
          <span className="eyebrow">What we do</span>
          <h2>Two service lines, one accountable partner</h2>
          <p className="lead">Staffing solutions to build and scale your teams, backed by managed digital delivery when you need the work done, not just seats filled.</p>
        </div>
        <div className="lines reveal">
          {lines.map((line, i) => (
            <div className="line" key={line.href}>
              <span className="micro">{`0${i + 1}`}</span>
              <h3>{line.title}</h3>
              <p>{line.text}</p>
              <ul className="rows">
                {line.rows.map(([href, title, text]) => (
                  <li key={title}><Link href={href}><b>{title}</b><span>{text}</span></Link></li>
                ))}
              </ul>
              <Link className="tl" href={line.href}>{line.cta}</Link>
            </div>
          ))}
        </div>
      </div></section>

      <section className="hs hs--rule" id="models"><div className="wrap split">
        <div className="split-head">
          <span className="eyebrow">Engagement models</span>
          <h2>Four ways to work with us</h2>
          <p className="lead">Start with a pilot role, a managed pod, or a GCC conversation.</p>
        </div>
        <div>
          <dl className="models reveal">
            {models.map(([term, text]) => (
              <div key={term}><dt>{term}</dt><dd>{text}</dd></div>
            ))}
          </dl>
          <p>
            <Link className="tl" href={`${S}#models`}>See the engagement models</Link>
            <Link className="tl" href="/contact">Tell us what you need</Link>
          </p>
        </div>
      </div></section>

      <section className="hs hs--rule" id="delivery"><div className="wrap deliver">
        <div>
          <span className="eyebrow">How we deliver</span>
          <h2>Sourced, vetted, deployed, managed</h2>
          <figure className="reveal"><Image src="/images/hero.jpg" alt="Overhead view of a team working around a meeting table" fill sizes="(max-width: 980px) 100vw, 40vw" /></figure>
        </div>
        <ol className="h-steps reveal">
          {steps.map(([title, text, proofHref, proof], i) => (
            <li key={title}>
              <span className="num" aria-hidden="true">{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
                {proofHref && <Link className="micro pl" href={proofHref}>{proof}</Link>}
              </div>
            </li>
          ))}
        </ol>
      </div></section>

      <section className="hs hs--rule" id="proof"><div className="wrap">
        <div className="h-row">
          <div><span className="eyebrow">Proof</span><h2>Delivered, not promised</h2></div>
          <Link className="tl" href={C}>See all case studies</Link>
        </div>
        <div className="cases reveal">
          {cases.map((c) => (
            <article key={c.href}>
              <span className="micro">{c.tag}</span>
              <p className="fig"><span className="num">{c.num}</span><span className="micro">{c.unit}</span></p>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <p className="cap">{c.cap}</p>
              <Link className="tl" href={c.href}>{c.link}</Link>
            </article>
          ))}
        </div>
        <p className="h-note">Delivered by our practice teams, led by the domain consultants on <Link href="/about#leadership">the About page</Link>.</p>
      </div></section>

      <section className="hs hs--rule" id="why"><div className="wrap">
        <span className="eyebrow">Why MIYO</span>
        <h2>Execution-first, not advisory-heavy</h2>
        <p className="lead">We own delivery, not just recommendations. Built by operators who have run this at scale.</p>
        <div className="why">
          <div className="principles reveal">
            {principles.map(([title, text]) => (
              <div key={title}><h3>{title}</h3><p>{text}</p></div>
            ))}
          </div>
          <aside className="shield reveal">
            <h3>Full compliance shield</h3>
            <p>100% compliant with Indian labour law.</p>
            <ul>
              {["Contract Labour (R&A) Act", "EPF / ESI", "Shop & Establishment"].map((law) => (
                <li key={law}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>{law}</li>
              ))}
            </ul>
            <p className="micro">Contracting entities</p>
            <dl>
              <dt className="micro">India</dt><dd>Miyo Global Private Limited</dd>
              <dt className="micro">UAE</dt><dd>Prime Assets Education &amp; Training Ltd., operating as Prime Learning</dd>
            </dl>
            <Link className="tl" href="/about">About MIYO Global</Link>
          </aside>
        </div>
      </div></section>

      <section className="hs hs--paper" id="faq"><div className="wrap split">
        <div className="split-head">
          <span className="eyebrow">Questions</span>
          <h2>Common questions</h2>
          <p className="lead">Not covered here? Email <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a> or <Link href="/contact">tell us what you need</Link>.</p>
        </div>
        <div className="faq">
          {faqs.map(([q, a], i) => (
            <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </div></section>

      {posts.length > 0 && (
        <section className="hs" id="journal"><div className="wrap">
          <div className="h-row">
            <div>
              <span className="eyebrow">MIYO Journal</span>
              <h2>From the journal</h2>
              <p className="lead">Practical guides on GCC build-outs, technology staffing and digital delivery.</p>
            </div>
            <Link className="tl" href="/blog">All articles</Link>
          </div>
          <ul className="posts reveal">
            {posts.map((p) => (
              <li key={p.id}>
                <span className="micro"><time dateTime={p.publishedAt?.toISOString()}>{fmtDate(p.publishedAt)}</time>{p.categoryName && ` · ${p.categoryName}`}</span>
                <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
                {p.readingMinutes > 0 && <span className="rt">{p.readingMinutes} min read</span>}
              </li>
            ))}
          </ul>
        </div></section>
      )}

      <section className="hs hs--rule" id="index"><div className="wrap">
        <span className="eyebrow">Index</span>
        <h2>Capabilities, A to Z</h2>
        <nav aria-label="Capabilities A to Z">
          <ul className="az">
            {az.map(([label, href]) => (
              <li key={label}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </nav>
      </div></section>

      <section className="sec tight"><div className="wrap reveal"><div className="navy-band"><span className="ring"></span>
        <div className="row"><div><h2>Ready to build your team?</h2>
        <p>Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.</p>
        <p className="mail">Or email <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a></p></div>
        <Link className="btn btn-gold" href="/contact">Let&apos;s Talk</Link></div></div></div></section>
    </div>
  );
}
