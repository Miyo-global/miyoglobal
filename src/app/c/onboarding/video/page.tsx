import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { pitchPrompts as prompts } from "@/data/fixtures";

export const metadata: Metadata = { title: "Your video pitch" };


export default function VideoIntro() {
  return (
    <div className="wrap section stack" style={{ maxWidth: 760, ["--gap" as string]: "32px" }}>
      <header className="stack">
        <p className="eyebrow">Step 3 of 5</p>
        <h1>Your 60-second pitch</h1>
        <p className="lede">Three prompts, 20 seconds each. The prompt appears on screen while you record.</p>
      </header>
      <ol className="list card" style={{ padding: "0 24px" }}>
        {prompts.map(([time, q, hint]) => (
          <li key={q} className="item" style={{ alignItems: "flex-start" }}>
            <span className="mono gold" style={{ minWidth: 112 }}>{time}</span>
            <span className="item-body">
              <strong>{q}</strong>
              <span className="muted small" style={{ display: "block" }}>{hint}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="cols-3">
        {[
          ["eye", "Face the light", "A window in front of you works best."],
          ["mic", "Quiet room", "Captions are generated from your audio."],
          ["eyeOff", "Stay blind", "Don't say your surname or employer's name."],
        ].map(([icon, t, b]) => (
          <div key={t} className="card stack" style={{ ["--gap" as string]: "8px" }}>
            <span className="gold"><Icon name={icon as "eye"} /></span>
            <strong>{t}</strong>
            <p className="muted small">{b}</p>
          </div>
        ))}
      </div>
      <div className="row between" style={{ borderTop: "1px solid var(--line)", paddingTop: 24 }}>
        <Link href="/c/onboarding/skills" className="btn btn-ghost"><Icon name="left" size={16} /> Back</Link>
        <div className="row">
          <Link href="/c/onboarding/preview?upload=1" className="btn"><Icon name="upload" /> Upload instead</Link>
          <Link href="/c/onboarding/record" className="btn btn-primary"><Icon name="video" /> Open camera</Link>
        </div>
      </div>
    </div>
  );
}
