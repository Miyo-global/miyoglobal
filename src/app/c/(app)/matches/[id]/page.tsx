import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockCompany, ReportModal } from "@/components/states";
import { BandChip, Icon, Meter, Ring, Sample } from "@/components/ui";
import { company, match, me } from "@/data/fixtures";
import { MatchActions } from "./actions";

export const metadata: Metadata = { title: "Match detail" };

export default async function MatchDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ decline?: string }> }) {
  const m = match((await params).id);
  if (!m) notFound();
  const c = company(m.company)!;
  const decline = (await searchParams).decline === "1";
  const matched = m.status === "Matched";
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px", maxWidth: 1080 }}>
      <Link href="/c/matches" className="btn btn-ghost" style={{ width: "fit-content" }}><Icon name="left" size={16} /> Matches</Link>
      <div className="split">
        <div className="stack" style={{ ["--gap" as string]: "24px" }}>
          <section className="card card-flush">
            <img src={c.img} alt={`${c.name} office`} style={{ width: "100%", aspectRatio: "16 / 7", objectFit: "cover" }} width={512} height={224} />
            <div className="stack" style={{ padding: 24 }}>
              <div className="row between">
                <p className="eyebrow">{c.status === "Verified" ? "Verified company" : "Verification pending"} · {c.city}</p>
                <span className="chip chip-gold"><Icon name="clock" size={14} /> {m.hoursLeft}h left</span>
              </div>
              <h1>{c.name}</h1>
              <p className="measure">{c.about}</p>
              <div className="row">{c.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </div>
          </section>
          <section className="card stack" aria-labelledby="role-h">
            <div className="row between">
              <div>
                <p className="label">{m.roleId}</p>
                <h2 id="role-h" style={{ fontSize: 28 }}>{m.role}</h2>
              </div>
              <Ring value={m.fit} />
            </div>
            <div className="row"><BandChip band={m.band} /><span className="small muted">{matched ? `Pay band: ${m.pay}` : "Exact pay appears once you both opt in."}</span></div>
            <hr className="hr" />
            <h3 className="label">Why you fit</h3>
            {me.criteria.map((cr) => (
              <div key={cr.label} className="stack" style={{ ["--gap" as string]: "8px" }}>
                <div className="row between small"><strong>{cr.label}</strong><span className="mono">{cr.score}%</span></div>
                <Meter value={cr.score} label={cr.label} />
                <p className="muted small">{cr.note}</p>
              </div>
            ))}
          </section>
        </div>
        <aside className="stack" style={{ ["--gap" as string]: "16px" }}>
          <MatchActions company={c.name} matched={matched} chat={m.company === "meridian" ? "/c/chat/t-1" : "/c/chat/t-2"} decline={decline} />
          <section className="card stack" aria-labelledby="rel">
            <h2 id="rel" className="label">Reliability</h2>
            <p className="num">{c.reliability}<span className="muted small"> / 100</span></p>
            <p className="muted small">Replies to 96% of matches within 48 hours. Based on the last 90 days.</p>
          </section>
          <section className="card stack" aria-labelledby="facts">
            <h2 id="facts" className="label">Company facts</h2>
            <dl className="stack small" style={{ ["--gap" as string]: "8px", margin: 0 }}>
              <div className="row between"><dt className="muted">Size</dt><dd style={{ margin: 0 }}>{c.size}</dd></div>
              <div className="row between"><dt className="muted">Offices</dt><dd style={{ margin: 0 }}>{c.city}</dd></div>
              <div className="row between"><dt className="muted">Requested</dt><dd style={{ margin: 0 }}>{m.when}</dd></div>
            </dl>
          </section>
          <div className="row">
            <BlockCompany name={c.name} />
            <ReportModal who={c.name} trigger={<><Icon name="flag" /> Report</>} />
          </div>
        </aside>
      </div>
      <Sample />
    </div>
  );
}
