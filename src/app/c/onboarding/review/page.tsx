import type { Metadata } from "next";
import Link from "next/link";
import { Icon, Meter, Verified } from "@/components/ui";

export const metadata: Metadata = { title: "Profile in review" };

const checklist: [string, boolean][] = [
  ["Profile basics", true],
  ["4 skills, 2 certificates", true],
  ["60-second pitch with captions", true],
  ["Video review by MIYO desk", false],
  ["Add a portfolio URL (optional)", false],
];

export default function Review() {
  return (
    <div className="wrap section" style={{ maxWidth: 760 }}>
      <div className="stack" style={{ ["--gap" as string]: "32px" }}>
        <header className="stack">
          <span className="chip chip-gold" style={{ justifySelf: "start", width: "fit-content" }}><Icon name="clock" size={14} /> In review</span>
          <h1>Your profile is in review.</h1>
          <p className="lede">Review takes up to 24 hours. We&apos;ll notify you the moment your blind card goes live.</p>
        </header>
        <section className="card stack" aria-labelledby="pc">
          <div className="row between">
            <h2 id="pc" className="label">Profile completeness</h2>
            <span className="num">92%</span>
          </div>
          <Meter value={92} label="Profile completeness" />
          <ul className="list">
            {checklist.map(([t, ok]) => (
              <li key={t} className="item" style={{ minHeight: 48, padding: "12px 0" }}>
                <span className={ok ? "gold" : "muted"}><Icon name={ok ? "check" : "clock"} /></span>
                <span className="item-body">{t}</span>
                <span className="sr">{ok ? "done" : "to do"}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card card-sunk stack">
          <Verified>Your identity stays masked</Verified>
          <p className="muted small">Companies will see &ldquo;Ananya R.&rdquo;, your role, city, fit score and pay-band chip. Your surname, contact details and photo details unlock only when you accept a match.</p>
        </section>
        <div className="row">
          <Link href="/c/home" className="btn btn-primary">Go to home</Link>
          <Link href="/c/onboarding/preview" className="btn">Edit my pitch</Link>
        </div>
      </div>
    </div>
  );
}
