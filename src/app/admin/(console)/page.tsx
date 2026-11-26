import type { Metadata } from "next";
import Link from "next/link";
import { Icon, PageHead, Sample, StatusChip } from "@/components/ui";
import { audit, reports } from "@/data/fixtures";

export const metadata: Metadata = { title: "Admin dashboard" };

const kpis = [
  ["Candidates", "1,284", "+96 this week"],
  ["Verified companies", "212", "4 pending"],
  ["Matches (7 days)", "341", "61% reply within 48h"],
  ["Revenue (Nov)", "₹8,42,000", "AED 21,400 in UAE"],
] as const;

const queues = [
  ["/admin/videos", "Videos to review", "3", "video"],
  ["/admin/companies", "Companies to verify", "1", "building"],
  ["/admin/reports", "Open reports", "2", "flag"],
  ["/admin/plans", "Failed payments", "2", "card"],
] as const;

export default function Dashboard() {
  return (
    <div>
      <PageHead eyebrow="Global admin" title="Good afternoon, Meera" lede="Thursday 26 Nov 2026 · 15:10 IST · 13:40 GST" />
      <div className="cols-4" style={{ marginBottom: 24 }}>
        {kpis.map(([l, v, n]) => (
          <section key={l} className="card kpi">
            <span className="label">{l}</span>
            <p className="num">{v}</p>
            <p className="muted small">{n}</p>
          </section>
        ))}
      </div>
      <div className="cols-4" style={{ marginBottom: 24 }}>
        {queues.map(([href, l, n, i]) => (
          <Link key={href} href={href} className="card row between" style={{ textDecoration: "none", flexWrap: "nowrap" }}>
            <span className="row" style={{ flexWrap: "nowrap" }}><span className="gold"><Icon name={i} /></span>{l}</span>
            <span className="badge">{n}</span>
          </Link>
        ))}
      </div>
      <div className="cols-2">
        <section className="card stack" aria-labelledby="rr">
          <h2 id="rr" className="label">Latest reports</h2>
          <ul className="list">
            {reports.slice(0, 3).map((r) => (
              <li key={r.id} className="item"><span className="mono small">{r.id}</span><span className="item-body small">{r.target} · {r.reason}</span><StatusChip status={r.severity} /></li>
            ))}
          </ul>
        </section>
        <section className="card stack" aria-labelledby="ra">
          <h2 id="ra" className="label">Recent admin activity</h2>
          <ul className="list">
            {audit.slice(0, 4).map((a) => (
              <li key={a.at} className="item"><span className="mono small" style={{ minWidth: 120 }}>{a.at.split(",")[1]}</span><span className="item-body small">{a.actor} · <span className="mono">{a.action}</span> · {a.target}</span></li>
            ))}
          </ul>
        </section>
      </div>
      <Sample />
    </div>
  );
}
