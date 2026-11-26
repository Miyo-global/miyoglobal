import type { Metadata } from "next";
import { Icon } from "@/components/ui";
import { PricingPlans } from "./plans";

export const metadata: Metadata = { title: "Pricing" };

const rows: [string, string, string, string, string][] = [
  ["Unlocks per month", "5", "50", "250", "Custom"],
  ["Open roles", "1", "3", "10", "Unlimited"],
  ["Seats", "1", "2", "5", "Unlimited"],
  ["Blind swipe deck and fit score", "✓", "✓", "✓", "✓"],
  ["Async video questions", "—", "✓", "✓", "✓"],
  ["Expiring share links", "—", "✓", "✓", "✓"],
  ["Analytics", "—", "✓", "✓", "✓"],
  ["MIYO ATS sync", "—", "—", "✓", "✓"],
  ["Single sign-on (SSO)", "—", "—", "—", "✓"],
  ["Uptime SLA", "—", "—", "—", "99.9%"],
];

const faq = [
  ["What counts as an unlock?", "Requesting a match with a candidate uses one unlock. Watching pitches, passing and liking are free."],
  ["Can we change plans mid-month?", "Yes. Upgrades apply at once and are pro-rated. Downgrades take effect at the next billing date."],
  ["Do you issue GST invoices?", "Yes. Indian companies receive GST-ready invoices, and UAE companies receive VAT invoices in AED."],
  ["Which payment methods do you accept?", "UPI, debit or credit card, and bank transfer. Enterprise plans can pay by annual invoice."],
  ["What happens if we let a match expire?", "Nothing is charged, but your Reliability score drops. Candidates see that score before they reply."],
];

export default function Pricing() {
  return (
    <div className="wrap section stack" style={{ ["--gap" as string]: "64px" }}>
      <header className="stack" style={{ maxWidth: 720 }}>
        <p className="eyebrow">Pricing</p>
        <h1>Pay for matches, not for job posts.</h1>
        <p className="lede">Start with 5 free unlocks every month. Upgrade when you hire more often.</p>
        <p className="row" style={{ ["--gap" as string]: "8px" }}>
          <span className="gold"><Icon name="check" /></span>
          <strong>Candidates are always free.</strong>
        </p>
      </header>
      <PricingPlans />
      <section className="stack" aria-labelledby="cmp">
        <h2 id="cmp">Compare plans</h2>
        <div className="table-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Free Trial</th>
                <th scope="col">Growth</th>
                <th scope="col">Team</th>
                <th scope="col">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([f, ...v]) => (
                <tr key={f}>
                  <th scope="row" style={{ textTransform: "none", letterSpacing: 0, fontFamily: "inherit", fontSize: 14, color: "var(--ink)", fontWeight: 400 }}>{f}</th>
                  {v.map((x, i) => (
                    <td key={i}>{x === "✓" ? <span className="gold" aria-label="Included">✓</span> : x === "—" ? <span className="muted" aria-label="Not included">—</span> : x}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="cols-2" aria-labelledby="pfaq" style={{ ["--gap" as string]: "48px" }}>
        <h2 id="pfaq">Pricing questions</h2>
        <div>
          {faq.map(([q, a]) => (
            <details key={q} className="faq">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
