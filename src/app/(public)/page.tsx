import Link from "next/link";
import { BandChip, Icon, Ring, Verified, type IconName } from "@/components/ui";
import { RoleChoiceModal } from "@/components/role-choice";
import { candidates } from "@/data/fixtures";

const steps: [string, string, string, IconName][] = [
  ["01", "Record", "Candidates answer three prompts in one 60-second video. No CV upload, no cover letter.", "video"],
  ["02", "Match", "Companies swipe blind pitches with a fit score and a pay-band chip. Names and photos stay masked.", "deck"],
  ["03", "Meet", "Both sides opt in, identities reveal, and a 48-hour reply timer starts. Then you book the call.", "calendar"],
];

const features: [string, string, IconName][] = [
  ["Blind first card", "Only a first initial and the role show until both sides opt in. Contact details stay locked.", "eyeOff"],
  ["Fit score, explained", "A 0–100 score built from three verified criteria, so you see why someone fits.", "chart"],
  ["Pay bands, not guesswork", "Every card says In-Band, Stretch or Out-of-Band. Exact numbers appear after a match.", "card"],
  ["Anti-ghosting", "Every match carries a 48-hour timer, and companies earn a public Reliability score.", "clock"],
  ["Protected videos", "Pitches are watermarked with the viewer's workspace. No CV download before a match.", "shield"],
  ["Verified skills", "Certificates and skills are checked by our desk and marked with a badge.", "check"],
];

const faq = [
  ["Why a 60-second video instead of a CV?", "A short pitch shows how someone thinks and communicates. It takes a minute to record and a minute to watch, and it removes keyword games from screening."],
  ["What does blind first mean?", "The first card shows a first initial, the role and the evidence. Surname, photo details and contact information stay hidden until the candidate and the company both opt in."],
  ["What is an unlock?", "An unlock lets a company request a match with a candidate. Companies get 5 free unlocks each month; paid plans include more."],
  ["How does the 48-hour reply rule work?", "When a match is made, both sides have 48 hours to reply. Companies that let matches expire lose Reliability score, which candidates can see."],
  ["Is MIYO free for candidates?", "Yes. Candidates never pay to be seen or matched. An optional Candidate Plus plan adds profile insights."],
  ["Where do you operate?", "Our desks are in Hyderabad and Ras Al Khaimah. We focus on hiring between India and the UAE."],
];

export default function Landing() {
  const fan = [candidates[2], candidates[0], candidates[1]];
  return (
    <>
      <section className="wrap hero">
        <div className="stack" style={{ ["--gap" as string]: "24px" }}>
          <p className="eyebrow">Video-first hiring for India and the UAE</p>
          <h1>Hiring, shown not told.</h1>
          <p className="lede">
            Candidates record a 60-second pitch. Companies swipe blind cards with a fit score and a pay band. Identities reveal only when both sides say yes.
          </p>
          <div className="row">
            <Link href="/auth/sign-up?as=company" className="btn btn-primary">
              I&apos;m hiring <Icon name="right" size={16} />
            </Link>
            <Link href="/auth/sign-up?as=candidate" className="btn">
              I&apos;m a candidate
            </Link>
          </div>
          <div className="row small muted" style={{ ["--gap" as string]: "24px" }}>
            <span className="row" style={{ ["--gap" as string]: "8px" }}>
              <span className="dot" /> Desks in Hyderabad and Ras Al Khaimah
            </span>
            <span>Free for candidates</span>
          </div>
        </div>
        <div className="hero-cards" aria-label="Sample blind video cards">
          {fan.map((c) => (
            <article key={c.id} className="video">
              <img src={c.img} alt={`Blind pitch still of ${c.blind}, ${c.title}`} width={286} height={512} fetchPriority={c.id === "c-ananya" ? "high" : undefined} />
              <div className="video-top">
                <span className="chip">0:60</span>
                <span className="chip chip-gold">{c.fit} fit</span>
              </div>
              <div className="video-bottom">
                <div>
                  <p className="display">{c.blind}</p>
                  <p className="small" style={{ opacity: 0.8 }}>{c.title} · {c.city}</p>
                </div>
                <BandChip band={c.band} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="section" style={{ background: "var(--white)", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap stack" style={{ ["--gap" as string]: "48px" }}>
          <div className="stack">
            <p className="eyebrow">How it works</p>
            <h2>Record. Match. Meet.</h2>
          </div>
          <ol className="process list">
            {steps.map(([n, title, body, icon]) => (
              <li key={n}>
                <div className="row between">
                  <span className="step-no">{n}</span>
                  <Icon name={icon} />
                </div>
                <h3>{title}</h3>
                <p className="muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="companies" className="section">
        <div className="wrap stack" style={{ ["--gap" as string]: "48px" }}>
          <div className="row between" style={{ alignItems: "flex-end" }}>
            <div className="stack">
              <p className="eyebrow">For companies</p>
              <h2 className="measure">Evidence on the first card, not on the fifth call.</h2>
            </div>
            <Link href="/pricing" className="btn">See pricing</Link>
          </div>
          <div className="feature-board">
            {features.map(([title, body, icon]) => (
              <article key={title}>
                <span className="ico" aria-hidden="true"><Icon name={icon} size={18} /></span>
                <div className="stack" style={{ ["--gap" as string]: "6px" }}>
                  <h3>{title}</h3>
                  <p className="muted">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark" aria-labelledby="deck-h">
        <div className="wrap stack" style={{ ["--gap" as string]: "48px" }}>
          <div className="stack">
            <p className="eyebrow">Deck preview</p>
            <h2 id="deck-h">This week&apos;s blind deck.</h2>
            <p className="lede">Three sample pitches from the beta. Names, photos and contact details unlock only after both sides opt in.</p>
          </div>
          <div className="cols-3">
            {[candidates[1], candidates[5], candidates[2]].map((c) => (
              <article key={c.id} className="card stack">
                <div className="video video-wide">
                  <img src={c.wide} alt={`Blind pitch still of ${c.blind}`} loading="lazy" width={512} height={279} />
                  <span className="watermark">MIYO · SAMPLE</span>
                  <div className="video-top">
                    <span className="chip">0:60</span>
                  </div>
                </div>
                <div className="row between">
                  <div>
                    <p className="display" style={{ fontSize: 28 }}>{c.blind}</p>
                    <p className="muted small">{c.title} · {c.city}</p>
                  </div>
                  <Ring value={c.fit} size={56} />
                </div>
                <p className="small">&ldquo;{c.quote}&rdquo;</p>
                <div className="row">
                  <BandChip band={c.band} />
                  <span className="chip">{c.notice} notice</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="candidates" className="section">
        <div className="wrap cols-2" style={{ ["--gap" as string]: "48px", alignItems: "center" }}>
          <div className="stack" style={{ ["--gap" as string]: "24px" }}>
            <p className="eyebrow">For candidates</p>
            <h2>Be judged on what you can do. Reveal yourself when you&apos;re ready.</h2>
            <ul className="feature-list">
              <li><Icon name="check" /> Always free. No paid boosts, no pay-to-apply.</li>
              <li><Icon name="check" /> Your name and photo stay masked until you accept a match.</li>
              <li><Icon name="check" /> See each company&apos;s Reliability score before you reply.</li>
              <li><Icon name="check" /> Captions are on by default, and every pitch has a transcript.</li>
            </ul>
            <div className="row">
              <Link href="/auth/sign-up?as=candidate" className="btn btn-primary">Record my pitch</Link>
            </div>
          </div>
          <div className="card stack">
            <div className="row between">
              <span className="label">Profile strength</span>
              <strong>92%</strong>
            </div>
            <div className="segs"><span className="on" /><span className="on" /><span className="on" /><span className="on" /><span className="now" /></div>
            <Verified>4 of 4 skills verified</Verified>
            <hr className="hr" />
            <div className="row between">
              <div>
                <p className="label">Match request</p>
                <strong>Northbridge Systems</strong>
                <p className="muted small">Senior React Developer · Hyderabad</p>
              </div>
              <span className="chip chip-gold">38H LEFT</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--white)", borderTop: "1px solid var(--line)" }} aria-labelledby="faq-h">
        <div className="wrap cols-2" style={{ ["--gap" as string]: "48px" }}>
          <div className="stack">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-h">Questions, answered.</h2>
            <p className="muted">Still curious? Email the beta desk at beta@miyoglobal.com.</p>
          </div>
          <div>
            {faq.map(([q, a]) => (
              <details key={q} className="faq">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap stack" style={{ textAlign: "center", justifyItems: "center", display: "grid" }}>
          <p className="eyebrow">Beta cohort · December 2026</p>
          <h2>Show us what you can do.</h2>
          <p className="lede" style={{ marginInline: "auto" }}>Join the beta as a candidate or a company. It takes two minutes.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <RoleChoiceModal />
            <Link href="/pricing" className="btn btn-ghost" style={{ color: "inherit" }}>View pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
