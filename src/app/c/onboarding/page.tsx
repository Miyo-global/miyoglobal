import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui";

export const metadata: Metadata = { title: "Welcome" };

const steps: [string, string, IconName][] = [
  ["Profile basics", "Your role, city, notice period and pay expectation. About 2 minutes.", "user"],
  ["Skills and certificates", "Add up to 8 skills. We verify certificates for a badge.", "shield"],
  ["Pitch prompts", "Read the three 20-second prompts before you record.", "info"],
  ["Record", "One 60-second video. Retake as often as you like.", "video"],
  ["Review and submit", "Watch it back, check captions and send it for review.", "check"],
];

export default function Welcome() {
  return (
    <div className="wrap section" style={{ maxWidth: 760 }}>
      <div className="stack" style={{ ["--gap" as string]: "32px" }}>
        <header className="stack">
          <p className="eyebrow">Welcome, Ananya</p>
          <h1>Let&apos;s build your blind pitch.</h1>
          <p className="lede">Five short steps, about 10 minutes. Companies see your evidence first and your name only when you accept a match.</p>
        </header>
        <ol className="list card" style={{ padding: "0 24px" }}>
          {steps.map(([t, b, icon], i) => (
            <li key={t} className="item">
              <span className="mono gold">0{i + 1}</span>
              <span className="item-body">
                <strong>{t}</strong>
                <span className="muted small" style={{ display: "block" }}>{b}</span>
              </span>
              <Icon name={icon} />
            </li>
          ))}
        </ol>
        <section className="card card-sunk stack" aria-labelledby="next-h">
          <h2 id="next-h" style={{ fontSize: 24 }}>What happens next</h2>
          <ul className="feature-list">
            <li><Icon name="clock" /> Our desk reviews your video within 24 hours.</li>
            <li><Icon name="deck" /> Once approved, your blind card appears in matching company decks.</li>
            <li><Icon name="bell" /> You get a match request with a 48-hour timer when a company is interested.</li>
          </ul>
        </section>
        <div className="row">
          <Link href="/c/onboarding/basics" className="btn btn-primary">Start <Icon name="right" size={16} /></Link>
          <Link href="/c/home" className="btn btn-ghost">I&apos;ll do this later</Link>
        </div>
      </div>
    </div>
  );
}
