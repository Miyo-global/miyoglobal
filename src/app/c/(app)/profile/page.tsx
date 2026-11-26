import type { Metadata } from "next";
import Link from "next/link";
import { VideoPlayer } from "@/components/client";
import { BandChip, Icon, PageHead, Ring, Sample, Verified } from "@/components/ui";
import { me } from "@/data/fixtures";

export const metadata: Metadata = { title: "My profile" };

export default function Profile() {
  return (
    <div style={{ maxWidth: 1080 }}>
      <PageHead eyebrow="How companies see you" title={me.blind} lede={`${me.title} · ${me.city} · ${me.years} years · ${me.notice} notice`}>
        <Link href="/c/onboarding/preview" className="btn"><Icon name="edit" /> Edit pitch</Link>
        <Link href="/c/settings" className="btn btn-ghost"><Icon name="settings" /> Settings</Link>
      </PageHead>
      <div className="split" style={{ alignItems: "start" }}>
        <div className="stack" style={{ ["--gap" as string]: "24px" }}>
          <div className="row" style={{ alignItems: "flex-start", ["--gap" as string]: "24px" }}>
            <div style={{ width: "min(100%, 320px)" }}>
              <VideoPlayer img={me.img} alt="Your pitch" transcript={me.transcript} watermark="PREVIEW · ANANYA R." />
            </div>
            <div className="stack" style={{ flex: 1, minWidth: 240 }}>
              <div className="row"><Ring value={me.fit} /><div><p className="label">Typical fit</p><p className="small muted">Across 3 open roles that match you</p></div></div>
              <BandChip band={me.band} />
              <blockquote className="display" style={{ fontSize: 24, margin: 0 }}>&ldquo;{me.quote}&rdquo;</blockquote>
            </div>
          </div>
          <section className="card stack" aria-labelledby="sk">
            <h2 id="sk" className="label">Skills</h2>
            <div className="row">{me.skills.map((s) => <span key={s.name} className={s.verified ? "chip chip-gold" : "chip"}>{s.verified && <Icon name="shield" size={12} />} {s.name}</span>)}</div>
            <h2 className="label">Certificates</h2>
            {me.certs.map((c) => <Verified key={c.name}>{c.name}</Verified>)}
          </section>
        </div>
        <aside className="card stack">
          <h2 className="label">Hidden until you accept</h2>
          <ul className="feature-list">
            <li><Icon name="lock" size={16} /> Surname: Rao</li>
            <li><Icon name="lock" size={16} /> Email and mobile</li>
            <li><Icon name="lock" size={16} /> CV and portfolio URL</li>
            <li><Icon name="lock" size={16} /> Exact pay: {me.pay}</li>
          </ul>
          <Link href="/c/subscription" className="btn">Subscription</Link>
        </aside>
      </div>
      <Sample />
    </div>
  );
}
