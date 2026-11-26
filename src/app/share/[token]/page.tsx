import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/client";
import { BandChip, Icon, Logo, Sample } from "@/components/ui";
import { candidates } from "@/data/fixtures";

export const metadata: Metadata = { title: "Shared shortlist" };

export default async function Share({ params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token;
  const m = token.match(/^shr-0412-(\d)d$/);
  const expired = token === "shr-expired";
  if (!m && !expired) notFound();
  const list = [candidates[0], candidates[2], candidates[6]];
  const crit = ["React and TypeScript depth", "Pay-band overlap", "Notice and relocation"];
  return (
    <>
      <header className="pub-head">
        <div className="wrap">
          <Logo />
          <span className="mono muted hide-sm">Shared by Northbridge Systems</span>
          <div className="pub-actions"><span className="chip chip-gold"><Icon name="clock" size={14} /> {expired ? "Expired" : `Expires ${m![1] === "1" ? "27 Nov" : m![1] === "3" ? "29 Nov" : "03 Dec"} 2026`}</span></div>
        </div>
      </header>
      <main id="main" className="wrap section stack" style={{ ["--gap" as string]: "32px" }}>
        {expired ? (
          <div className="stack" style={{ maxWidth: 640 }}>
            <p className="eyebrow">Link expired</p>
            <h1>This shortlist link has expired.</h1>
            <p className="lede">Ask the person who shared it for a new link.</p>
          </div>
        ) : (
          <>
            <header className="stack" style={{ maxWidth: 720 }}>
              <p className="eyebrow">MIYO-HYD-0412 · Read-only shortlist</p>
              <h1>Senior React Developer · 3 blind pitches</h1>
              <p className="lede">Shared for review. Names and contact details stay hidden. No sign-in needed.</p>
            </header>
            <div className="cols-3">
              {list.map((c) => (
                <article key={c.id} className="card stack">
                  <div className="dark" style={{ borderRadius: 4 }}>
                    <VideoPlayer img={c.img} alt={`Pitch from ${c.blind}`} transcript={c.transcript} watermark="SHARED · NORTHBRIDGE" />
                  </div>
                  <div className="row between"><h2 style={{ fontSize: 28 }}>{c.blind}</h2><span className="chip chip-gold">{c.fit} fit</span></div>
                  <p className="muted small">{c.title} · {c.city} · {c.notice} notice</p>
                  <BandChip band={c.band} />
                </article>
              ))}
            </div>
            <section className="stack" aria-labelledby="mx">
              <h2 id="mx">Criteria matrix</h2>
              <div className="table-wrap">
                <table className="matrix">
                  <thead><tr><th>Criterion</th>{list.map((c) => <th key={c.id}>{c.blind}</th>)}</tr></thead>
                  <tbody>
                    {crit.map((k, i) => (
                      <tr key={k}><td>{k}</td>{list.map((c) => <td key={c.id} className="mono">{c.criteria[i].score}%</td>)}</tr>
                    ))}
                    <tr><td>Pay band</td>{list.map((c) => <td key={c.id}><BandChip band={c.band} /></td>)}</tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        <p className="small muted">Views of this page are logged. <Link href="/legal/recruitment">Recruitment notice</Link></p>
        <Sample />
      </main>
    </>
  );
}
