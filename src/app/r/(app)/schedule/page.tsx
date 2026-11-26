import type { Metadata } from "next";
import { Scheduler } from "@/components/scheduler";
import { PageHead, Sample } from "@/components/ui";

export const metadata: Metadata = { title: "Interviews" };

const upcoming = [
  ["Wed 03 Dec 2026", "14:00 GST · 15:30 IST", "Mohammed Al Farsi", "DevOps Engineer"],
  ["Thu 04 Dec 2026", "11:30 IST · 10:00 GST", "Ananya Rao", "Senior React Developer"],
];

export default function RSchedule() {
  return (
    <div>
      <PageHead eyebrow="Interviews" title="Schedule and availability" lede="Pick days you're available. Candidates choose from your open slots." />
      <section className="card stack" style={{ marginBottom: 24 }} aria-labelledby="up">
        <h2 id="up" className="label">Upcoming</h2>
        <ul className="list">
          {upcoming.map(([d, t, n, r]) => (
            <li key={n} className="item">
              <span className="mono" style={{ minWidth: 140 }}>{d}</span>
              <span className="item-body"><strong>{n}</strong><span className="muted small" style={{ display: "block" }}>{r} · {t}</span></span>
              <span className="chip chip-navy">Confirmed</span>
            </li>
          ))}
        </ul>
      </section>
      <Scheduler recruiter with="Ananya Rao" />
      <Sample />
    </div>
  );
}
