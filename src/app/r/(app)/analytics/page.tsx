import type { Metadata } from "next";
import { Icon, PageHead, Sample } from "@/components/ui";

export const metadata: Metadata = { title: "Analytics" };

const weeks = [["02 Nov", 38], ["09 Nov", 52], ["16 Nov", 47], ["23 Nov", 71]] as const;
const funnel = [["Pitches viewed", 412], ["Liked", 64], ["Match requested", 18], ["Matched", 11], ["Interviewed", 6], ["Offers", 2]] as const;
const kpis = [
  ["Reliability score", "97", "Top 10% of companies", "shield"],
  ["Median reply time", "6h 40m", "Target under 48h", "clock"],
  ["Match rate", "61%", "11 of 18 requests", "match"],
  ["Time to interview", "4.2 days", "Down 1.1 days", "calendar"],
] as const;

export default function Analytics() {
  const max = Math.max(...weeks.map((w) => w[1]));
  return (
    <div>
      <PageHead eyebrow="Analytics" title="Hiring health" lede="Last 30 days · 01 Nov–26 Nov 2026 · all roles" />
      <div className="cols-4" style={{ marginBottom: 24 }}>
        {kpis.map(([l, v, n, i]) => (
          <section key={l} className="card kpi">
            <div className="row between"><span className="label">{l}</span><span className="gold"><Icon name={i} /></span></div>
            <p className="num">{v}</p>
            <p className="muted small">{n}</p>
          </section>
        ))}
      </div>
      <div className="cols-2">
        <section className="card stack" aria-labelledby="pv">
          <h2 id="pv" className="label">Pitches viewed per week</h2>
          <div className="bars" role="img" aria-label={weeks.map(([w, v]) => `${w}: ${v}`).join(", ")}>
            {weeks.map(([w, v], i) => (
              <div key={w}>
                <span className="mono small">{v}</span>
                <span className={i === weeks.length - 1 ? "hi" : ""} style={{ height: `${(v / max) * 120}px` }} />
                <span className="mono muted" style={{ fontSize: 11 }}>{w}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card stack" aria-labelledby="fn">
          <h2 id="fn" className="label">Funnel</h2>
          {funnel.map(([l, v]) => (
            <div key={l} className="stack" style={{ ["--gap" as string]: "6px" }}>
              <div className="row between small"><span>{l}</span><span className="mono">{v}</span></div>
              <div className="meter"><span style={{ width: `${(v / funnel[0][1]) * 100}%` }} /></div>
            </div>
          ))}
        </section>
      </div>
      <section className="card stack" style={{ marginTop: 24 }} aria-labelledby="rel">
        <h2 id="rel" className="label">Reliability breakdown</h2>
        <div className="cols-3 small">
          <div><p className="num">100%</p><p className="muted">Matches answered within 48h</p></div>
          <div><p className="num">0</p><p className="muted">Matches expired without reply</p></div>
          <div><p className="num">4.8</p><p className="muted">Candidate rating out of 5</p></div>
        </div>
      </section>
      <Sample />
    </div>
  );
}
