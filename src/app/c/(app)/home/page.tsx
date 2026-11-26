import type { Metadata } from "next";
import Link from "next/link";
import { BandChip, Icon, Ring, Sample, Verified } from "@/components/ui";
import { company, matches, me } from "@/data/fixtures";

export const metadata: Metadata = { title: "Home" };

export default function Home() {
  const req = matches[0];
  const co = company(req.company)!;
  return (
    <div className="stack" style={{ ["--gap" as string]: "32px", maxWidth: 960 }}>
      <header className="stack" style={{ ["--gap" as string]: "8px" }}>
        <p className="eyebrow">{me.city} · {me.title}</p>
        <h1>Good afternoon, {me.blind}</h1>
      </header>
      <div className="cols-2">
        <section className="card stack" aria-labelledby="ps">
          <div className="row between">
            <h2 id="ps" className="label">Profile strength</h2>
            <strong>92% complete</strong>
          </div>
          <div className="segs" aria-hidden="true"><span className="on" /><span className="on" /><span className="on" /><span className="on" /><span className="now" /></div>
          <div className="row between">
            <Verified>Verified skills 4 of 4</Verified>
            <span className="label">Pitch live</span>
          </div>
        </section>
        <section className="card card-sunk row" style={{ flexWrap: "nowrap" }}>
          <span className="num" style={{ background: "var(--navy)", color: "#fff", padding: "12px 16px", borderRadius: 4 }}>14</span>
          <p className="item-body">companies viewed your blind pitch this week</p>
          <span className="chip"><Icon name="eyeOff" size={14} /> Masked</span>
        </section>
      </div>

      <section className="stack" aria-labelledby="pending">
        <div className="row between">
          <h2 id="pending" className="label">Pending 48h match requests</h2>
          <Link href="/c/matches" className="mono gold" style={{ textDecoration: "none" }}>2 active</Link>
        </div>
        <article className="card stack">
          <div className="row between" style={{ alignItems: "flex-start" }}>
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <img src={co.img} alt="" className="thumb" width={56} height={56} />
              <div>
                <h3>{co.name}</h3>
                <p className="muted small">{co.city} · Hybrid · Reliability {co.reliability}</p>
              </div>
            </div>
            <span className="chip chip-gold"><Icon name="clock" size={14} /> {req.hoursLeft}h 12m left</span>
          </div>
          <p><strong>{req.role}</strong> <span className="mono muted small">{req.roleId}</span></p>
          <div className="row"><BandChip band={req.band} /><span className="small muted">Exact pay shared after you accept</span></div>
          <div className="row">
            <Link href={`/c/matches/${req.id}`} className="btn btn-primary"><Icon name="check" /> Review and accept</Link>
            <Link href={`/c/matches/${req.id}?decline=1`} className="btn"><Icon name="x" /> Decline</Link>
          </div>
        </article>
      </section>

      <section className="stack" aria-labelledby="top">
        <div className="row between">
          <h2 id="top" className="label">Top matches</h2>
          <Link href="/c/matches" className="mono" style={{ textDecoration: "none" }}>View all →</Link>
        </div>
        <div className="cols-3">
          {matches.slice(1).map((m) => {
            const c = company(m.company)!;
            return (
              <Link key={m.id} href={`/c/matches/${m.id}`} className="card stack" style={{ textDecoration: "none" }}>
                <div className="row between">
                  <img src={c.img} alt="" className="thumb" width={56} height={56} />
                  <Ring value={m.fit} size={52} />
                </div>
                <div>
                  <strong>{m.role}</strong>
                  <p className="muted small">{c.name} · {c.city}</p>
                </div>
                <BandChip band={m.band} />
              </Link>
            );
          })}
        </div>
      </section>
      <Sample />
    </div>
  );
}
