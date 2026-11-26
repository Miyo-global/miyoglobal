import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/client";
import { ReportModal } from "@/components/states";
import { BandChip, Icon, Meter, Ring, Sample, Verified } from "@/components/ui";
import { candidate } from "@/data/fixtures";
import { RequestMatch } from "./request";

export const metadata: Metadata = { title: "Candidate" };

export default async function CandidateDetail({ params }: { params: Promise<{ id: string }> }) {
  const c = candidate((await params).id);
  if (!c) notFound();
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <div className="row between">
        <Link href="/r/deck" className="btn btn-ghost"><Icon name="left" size={16} /> Back to deck</Link>
        <ReportModal who={c.blind} trigger={<><Icon name="flag" /> Report candidate</>} />
      </div>
      <header className="row" style={{ ["--gap" as string]: "24px" }}>
        <Ring value={c.fit} size={88} />
        <div className="stack" style={{ ["--gap" as string]: "8px" }}>
          <p className="eyebrow">Blind profile · identity masked</p>
          <h1>{c.blind}</h1>
          <p className="muted">{c.title} · {c.city} · {c.years} years · {c.available}</p>
        </div>
      </header>
      <div className="split" style={{ alignItems: "start" }}>
        <div className="stack" style={{ ["--gap" as string]: "24px" }}>
          <div className="dark card" style={{ padding: 16 }}>
            <VideoPlayer img={c.wide} alt={`Pitch from ${c.blind}`} transcript={c.transcript} watermark="NORTHBRIDGE SYSTEMS · KIRAN P." wide>
              <span className="chip chip-gold">{c.fit} FIT</span>
            </VideoPlayer>
          </div>
          <section className="card stack" aria-labelledby="crit">
            <h2 id="crit" className="label">Fit criteria · verified</h2>
            {c.criteria.map((cr) => (
              <div key={cr.label} className="stack" style={{ ["--gap" as string]: "6px" }}>
                <div className="row between small"><strong>{cr.label}</strong><span className="mono">{cr.score}%</span></div>
                <Meter value={cr.score} label={cr.label} />
                <p className="muted small">{cr.note}</p>
              </div>
            ))}
          </section>
          <section className="card stack" aria-labelledby="skc">
            <h2 id="skc" className="label">Skills and certificates</h2>
            <div className="row">{c.skills.map((s) => <span key={s.name} className={s.verified ? "chip chip-gold" : "chip"}>{s.verified && <Icon name="shield" size={12} />}{s.name}</span>)}</div>
            {c.certs.map((x) => <Verified key={x.name}>{x.name} · {x.issuer}</Verified>)}
          </section>
        </div>
        <aside className="stack" style={{ ["--gap" as string]: "16px" }}>
          <section className="card stack">
            <div className="row between"><span className="label">Pay band</span><BandChip band={c.band} /></div>
            <p className="muted small">Exact expectation is shown after a mutual match.</p>
            <RequestMatch name={c.blind} />
          </section>
          <section className="card card-sunk stack" aria-labelledby="locked">
            <h2 id="locked" className="label"><Icon name="lock" size={14} /> Locked until match</h2>
            <ul className="feature-list small">
              <li><Icon name="lock" size={16} /> Full name and photo details</li>
              <li><Icon name="lock" size={16} /> Email and mobile</li>
              <li><Icon name="lock" size={16} /> CV download</li>
              <li><Icon name="lock" size={16} /> Exact pay expectation</li>
            </ul>
            <p className="small">CV and contact unlock on match, uses 1 unlock.</p>
          </section>
          <section className="card stack small">
            <p className="label">Protected video</p>
            <p className="muted">This pitch is watermarked with your workspace name. Downloads and screen recordings are logged.</p>
          </section>
        </aside>
      </div>
      <Sample />
    </div>
  );
}
