import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BoardHead, RoleRow } from "@/components/jobs/role-row";
import { ReferralForm } from "@/components/referral-form";
import { toCard } from "@/lib/jobs";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { getRoles } from "@/server/jobs";

export const revalidate = 300;

const POLICY = "/documents/MIYO_Global_Referral_Policy_2026.pdf";

const page: SitePage = {
  path: "/referrals",
  title: "Refer a Candidate, Earn ₹15,000 | MIYO Global Referrals",
  description: "Refer a candidate for an open MIYO Global role and earn ₹15,000 when they join. Profiles stay valid for 90 days and rewards are paid within 45 days.",
  image: "/images/og/referrals.webp",
  imageAlt: "MIYO Global referral programme: refer a candidate and earn ₹15,000",
  crumb: "Referrals",
};

export const metadata: Metadata = pageMetadata(page);

const TERMS: [term: string, value: React.ReactNode][] = [
  ["Reward", <><span className="num">₹15,000</span> per hire, subject to TDS</>],
  ["Profile validity", <><span className="num">90</span> days from the date you submit</>],
  ["Payout", <>Within <span className="num">45</span> days of the candidate joining</>],
  ["Payment method", "NEFT or IMPS bank transfer"],
  ["Approval", "The hiring manager signs off before payout"],
  ["Submission window", <>Within <span className="num">30</span> days of the candidate coming under consideration</>],
];

const FAQ: [q: string, a: string][] = [
  ["How much do I earn for a successful referral?", "₹15,000 for each referred candidate who is hired and joins, subject to TDS. It is paid by NEFT or IMPS bank transfer."],
  ["When is the referral reward paid?", "Within 45 days of your candidate's joining date, once the hiring manager has approved the payout."],
  ["How long does my referral stay valid?", "A referred profile is valid for 90 days from the date you submit it. Referrals must be made within 30 days of the candidate coming under consideration."],
  ["Does a referred candidate skip any interview steps?", "No. Every referral goes through our standard evaluation. Being referred does not skip a step or guarantee selection."],
  ["Who can I refer?", "Anyone suited to one of our open roles who has agreed to be referred. Refer them against a specific role on the jobs board."],
];

export default async function ReferralsPage() {
  const roles = await getRoles();
  const options = roles.map(({ ref, title, slug }) => ({ ref, title, slug }));
  const latest = [...roles].sort((a, b) => Number(/\d+/.exec(b.ref)?.[0] ?? 0) - Number(/\d+/.exec(a.ref)?.[0] ?? 0)).slice(0, 5).map(toCard);
  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/referrals#faq`,
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page, [faq])) }} />
      <section className="rf-hero">
        <div className="ed-wrap">
          <nav className="ed-crumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">Referrals</li>
            </ol>
          </nav>
          <div className="rf-hero-grid">
            <div>
              <h1>Know someone good? Refer them, earn ₹15,000.</h1>
              <p className="lede">
                Put a candidate forward for one of our {roles.length ? roles.length : ""} open roles. When they are hired and join, the reward is yours,
                paid by bank transfer under a published policy.
              </p>
              <div className="jp-actions">
                <a className="ed-btn primary" href="#refer">
                  Refer a candidate
                </a>
                <a className="ed-btn quiet" href={POLICY} target="_blank" rel="noopener">
                  Read the policy (PDF)
                </a>
              </div>
            </div>
            <figure className="rf-figure">
              <Image
                src="/images/process.jpg"
                alt="Hands on a laptop with a network of candidate profiles connected around an idea"
                width={1920}
                height={1281}
                sizes="(max-width: 900px) 100vw, 45vw"
                priority
              />
              <figcaption className="rf-ticket">
                <small>Reward per hire</small>
                <b>₹15,000</b>
                <span>Paid within 45 days of joining</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="rf-sec" aria-labelledby="terms-h">
        <div className="ed-wrap rf-split">
          <div className="rf-aside">
            <h2 id="terms-h">The policy at a glance</h2>
            <p>Every referral runs on the same Referral Policy 2026. These are the terms that decide your reward.</p>
          </div>
          <div>
            <dl className="terms">
              {TERMS.map(([t, v]) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="terms-foot">
              The full terms are in the{" "}
              <a href={POLICY} target="_blank" rel="noopener">
                Referral Policy 2026
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="rf-sec" aria-labelledby="how-h">
        <div className="ed-wrap">
          <h2 id="how-h">From referral to reward</h2>
          <ol className="steps">
            <li>
              <h3>Submit</h3>
              <p>Send your details, the candidate&apos;s details and their CV against an open role.</p>
            </li>
            <li>
              <h3>Screen</h3>
              <p>The candidate goes through our standard evaluation. A referral never skips a step.</p>
            </li>
            <li>
              <h3>Join</h3>
              <p>Your candidate is hired and joins. The hiring manager approves the payout.</p>
            </li>
            <li>
              <h3>Get paid</h3>
              <p>₹15,000 by NEFT or IMPS within 45 days of joining, subject to TDS.</p>
            </li>
          </ol>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="rf-sec" aria-labelledby="roles-h">
          <div className="ed-wrap">
            <div className="similar-head">
              <h2 id="roles-h">Newest open roles</h2>
              <Link href="/jobs">See all {roles.length} roles</Link>
            </div>
            <div className="rf-roles">
              <BoardHead />
              <ul className="board">
                {latest.map((r) => (
                  <RoleRow key={r.slug} role={r} />
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="rf-sec rf-form-wrap" id="refer" aria-labelledby="refer-h">
        <div className="ed-wrap rf-split">
          <div className="rf-aside">
            <h2 id="refer-h">Refer a candidate</h2>
            <p>Every field is required. The role list is the live jobs board, so you always refer against an open role.</p>
          </div>
          <ReferralForm roles={options} />
        </div>
      </section>

      <section className="rf-sec" aria-labelledby="faq-h">
        <div className="ed-wrap rf-split">
          <div className="rf-aside">
            <h2 id="faq-h">Questions referrers ask</h2>
          </div>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="rf-cta" aria-labelledby="cta-h">
        <div className="ed-wrap">
          <div>
            <h2 id="cta-h">Hiring for your own team?</h2>
            <p>We build teams the way we reward referrals: sourced, vetted and managed, with one named delivery lead.</p>
          </div>
          <Link className="ed-btn primary" href="/contact">
            Talk to our team
          </Link>
        </div>
      </section>
    </>
  );
}
