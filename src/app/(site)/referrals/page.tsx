import type { Metadata } from "next";
import { BoardHead, RoleRow } from "@/components/jobs/role-row";
import { ReferralForm } from "@/components/referral-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeader } from "@/components/ui/section-header";
import { toCard } from "@/lib/jobs";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { getRoles } from "@/server/jobs";

export const revalidate = 600;

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

const n = (v: string) => <span className="num">{v}</span>;

// Cards Almanac: the policy terms, exactly as the Referral Policy 2026 states them.
const TERMS: [term: string, value: React.ReactNode, note: string][] = [
  ["Reward", n("₹15,000"), "Per hire, subject to TDS"],
  ["Profile validity", <>{n("90")} days</>, "From the date you submit"],
  ["Payout", <>{n("45")} days</>, "At most, from the candidate's joining date"],
  ["Payment method", "NEFT or IMPS", "Bank transfer to the referrer"],
  ["Approval", "Hiring manager", "Signs off before the payout"],
  ["Submission window", <>{n("30")} days</>, "From the candidate coming under consideration"],
];

// Numeral Steps: a real sequence, so the numbers carry meaning.
const STEPS: [title: string, text: React.ReactNode][] = [
  ["Submit", "Send your details, the candidate's details and their CV against an open role."],
  ["Screen", "The candidate goes through our standard evaluation. A referral never skips a step."],
  ["Join", "Your candidate is hired and joins. The hiring manager approves the payout."],
  ["Get paid", <>{n("₹15,000")} by NEFT or IMPS within {n("45")} days of joining, subject to TDS.</>],
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
  const newest = [...roles].sort((a, b) => (b.posted ?? "").localeCompare(a.posted ?? "") || Number(/\d+/.exec(b.ref)?.[0] ?? 0) - Number(/\d+/.exec(a.ref)?.[0] ?? 0)).slice(0, 5).map(toCard);
  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/referrals#faq`,
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(pageJsonLd(page, [faq])) }} />

      <section className="border-b border-rule pb-16 pt-12 md:pt-16">
        <div className="frame">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Referrals" }]} />
          <div className="grid-12 mt-8 gap-y-12">
            <div className="col-span-4 md:col-span-7">
              <h1 className="text-h1 max-w-heading">Know someone good? Refer them, earn {n("₹15,000")}.</h1>
              <p className="lead mt-6">
                Put a candidate forward for one of our {roles.length ? <>{n(String(roles.length))} </> : ""}open roles. When they are hired and join, the reward is yours, paid by
                bank transfer under a published policy.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="#refer">Refer a candidate</ButtonLink>
                <ButtonLink href={POLICY} variant="secondary" external>
                  Read the policy (PDF)
                </ButtonLink>
              </div>
            </div>
            <div className="on-ink col-span-4 rounded-card bg-ink p-8 text-on-ink md:col-span-4 md:col-start-9 md:self-end">
              <Eyebrow onInk>Reward per hire</Eyebrow>
              <p className="num mt-4 text-h1 text-accent">₹15,000</p>
              <p className="mt-4 border-t border-on-ink-rule pt-4 text-small text-on-ink-muted">
                Paid within {n("45")} days of joining, subject to TDS
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section" aria-labelledby="terms-h">
        <div className="frame">
          <SectionHeader
            id="terms-h"
            eyebrow="Policy terms"
            title="The policy at a glance"
            lead={
              <>
                Every referral runs on the same{" "}
                <a href={POLICY} target="_blank" rel="noopener" className="link text-ink">
                  Referral Policy 2026
                </a>
                . These are the terms that decide your reward.
              </>
            }
          />
          <dl className="mt-12 grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {TERMS.map(([term, value, note]) => (
              <Card key={term}>
                <dt className="meta text-accent-text">{term}</dt>
                <dd className="mt-4">
                  <span className="block text-h3 text-ink">{value}</span>
                  <span className="mt-2 block text-small text-muted">{note}</span>
                </dd>
              </Card>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-rule bg-ground-cool py-section" aria-labelledby="how-h">
        <div className="frame">
          <SectionHeader id="how-h" eyebrow="How it works" title="From referral to reward" />
          <ol className="grid-12 mt-12 gap-y-8">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="col-span-4 border-t border-rule-strong pt-6 md:col-span-6 lg:col-span-3">
                <span className="num block text-h2 text-accent-text" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-h3">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {newest.length > 0 && (
        <section className="py-section" aria-labelledby="roles-h">
          <div className="frame">
            <SectionHeader
              id="roles-h"
              eyebrow="Open now"
              title="Newest open roles"
              action={
                <ButtonLink href="/jobs" variant="ghost">
                  See all {n(String(roles.length))} roles
                </ButtonLink>
              }
            />
            <div className="mt-12">
              <BoardHead />
              <ul>
                {newest.map((r) => (
                  <RoleRow key={r.slug} role={r} />
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section id="refer" className="border-t border-rule bg-ground-cool py-section" aria-labelledby="refer-h">
        <div className="frame grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-4">
            <Eyebrow className="mb-6">Refer</Eyebrow>
            <h2 id="refer-h" className="text-h2">
              Refer a candidate
            </h2>
            <p className="mt-4 text-muted">Every field is required. The role list is the live jobs board, so you always refer against an open role.</p>
          </div>
          <div className="col-span-4 md:col-span-7 md:col-start-6">
            <ReferralForm roles={options} />
          </div>
        </div>
      </section>

      <section className="py-section" aria-labelledby="faq-h">
        <div className="frame grid-12 gap-y-8">
          <div className="col-span-4 md:col-span-4">
            <h2 id="faq-h" className="text-h2">
              Questions referrers ask
            </h2>
          </div>
          <div className="col-span-4 border-b border-rule-strong md:col-span-7 md:col-start-6">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group border-t border-rule-strong">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-ink">
                  {q}
                  <span aria-hidden="true" className="num text-accent-text group-open:hidden">
                    +
                  </span>
                  <span aria-hidden="true" className="num hidden text-accent-text group-open:inline">
                    −
                  </span>
                </summary>
                <p className="max-w-measure pb-6 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
