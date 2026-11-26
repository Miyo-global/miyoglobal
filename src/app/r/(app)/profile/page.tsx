import type { Metadata } from "next";
import { Flash } from "@/components/client";
import { Icon, Initials, PageHead, Sample } from "@/components/ui";
import { companies, team } from "@/data/fixtures";

export const metadata: Metadata = { title: "Company profile" };

export default function CompanyProfile() {
  const c = companies[0];
  return (
    <div>
      <PageHead eyebrow="Company profile" title={c.name} lede="This is what candidates see after a match request.">
        <span className="chip chip-navy"><Icon name="shield" size={14} /> Verified</span>
      </PageHead>
      <div className="split" style={{ alignItems: "start" }}>
        <form className="stack" style={{ ["--gap" as string]: "24px" }}>
          <section className="card stack">
            <h2 className="label">Brand</h2>
            <div className="row">
              <img src={c.img} alt="" className="thumb" width={56} height={56} />
              <label className="btn" style={{ cursor: "pointer" }}><Icon name="upload" /> Replace logo<input type="file" accept="image/png,image/jpeg,image/webp" className="sr" /></label>
            </div>
            <div className="field"><label htmlFor="about">About</label><textarea id="about" defaultValue={c.about} /></div>
            <div className="field"><label htmlFor="tags">Culture tags</label><input id="tags" defaultValue={c.tags.join(", ")} aria-describedby="tags-h" /><p id="tags-h" className="hint">Comma separated, up to 6.</p></div>
          </section>
          <section className="card stack">
            <h2 className="label">Locations</h2>
            {[["Hyderabad", "Hitech City · HQ · 320 people"], ["Ras Al Khaimah", "Al Hamra · Gulf operations · 60 people"], ["Dubai", "Business Bay · Sales · 40 people"]].map(([city, d]) => (
              <div key={city} className="row between" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                <span><strong>{city}</strong><span className="muted small" style={{ display: "block" }}>{d}</span></span>
                <Icon name="building" />
              </div>
            ))}
          </section>
          <Flash><button type="button" className="btn btn-primary" style={{ width: "fit-content" }}>Save profile</button></Flash>
        </form>
        <aside className="stack" style={{ ["--gap" as string]: "16px" }}>
          <section className="card card-flush">
            <img src={c.img} alt={`${c.name} office`} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
            <div className="stack" style={{ padding: 16 }}>
              <p className="label">Candidate preview</p>
              <strong>{c.name}</strong>
              <p className="muted small">{c.size} · Reliability {c.reliability}</p>
              <div className="row">{c.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </div>
          </section>
          <section className="card stack">
            <h2 className="label">Hiring team</h2>
            {team.slice(0, 3).map((m) => (
              <div key={m.email} className="row" style={{ flexWrap: "nowrap" }}><Initials name={m.name} /><span><strong className="small">{m.name}</strong><span className="muted small" style={{ display: "block" }}>{m.role}</span></span></div>
            ))}
          </section>
        </aside>
      </div>
      <Sample />
    </div>
  );
}
