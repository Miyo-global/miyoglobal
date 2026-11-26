import type { Metadata } from "next";
import Link from "next/link";
import { BandChip, Empty, Icon, PageHead, Ring, Sample } from "@/components/ui";
import { company, matches } from "@/data/fixtures";

export const metadata: Metadata = { title: "Matches" };

const tabs = [
  ["all", "All"],
  ["new", "New"],
  ["expiring", "Expiring"],
  ["none", "Empty state"],
];

export default async function Matches({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const tab = (await searchParams).tab ?? "all";
  const list = tab === "new" ? matches.filter((m) => m.isNew) : tab === "expiring" ? matches.filter((m) => m.hoursLeft <= 12) : tab === "none" ? [] : matches;
  const requests = matches.filter((m) => m.status === "Request");
  return (
    <div style={{ maxWidth: 960 }}>
      <PageHead eyebrow="Matches" title="Your matches" lede="Every request carries a 48-hour timer. Accepting reveals your name to that company only." />
      {tab === "all" && (
        <section className="stack" aria-labelledby="req" style={{ marginBottom: 32 }}>
          <h2 id="req" className="label">Match requests · {requests.length}</h2>
          <div className="cols-2">
            {requests.map((m) => {
              const c = company(m.company)!;
              return (
                <article key={m.id} className="card stack">
                  <div className="row between">
                    <strong>{c.name}</strong>
                    <span className="chip chip-gold"><Icon name="clock" size={14} /> {m.hoursLeft}h left</span>
                  </div>
                  <p className="small">{m.role} · <span className="muted">{c.city}</span></p>
                  <div className="row"><BandChip band={m.band} /><span className="chip">Fit {m.fit}</span><span className="chip">Reliability {c.reliability}</span></div>
                  <div className="row">
                    <Link href={`/c/matches/${m.id}`} className="btn btn-primary">Review</Link>
                    <Link href={`/c/matches/${m.id}?decline=1`} className="btn">Decline</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
      <nav className="tabs" aria-label="Filter matches">
        {tabs.map(([k, l]) => (
          <Link key={k} href={`/c/matches?tab=${k}`} className="tab" aria-current={tab === k ? "page" : undefined}>{l}</Link>
        ))}
      </nav>
      {list.length === 0 ? (
        <div style={{ marginTop: 24 }}>
          <Empty icon="match" title="No matches yet" body="When a company requests a match, it appears here with a 48-hour timer. Keep your pitch fresh to stay near the top of decks.">
            <Link href="/c/onboarding/preview" className="btn">Update my pitch</Link>
          </Empty>
        </div>
      ) : (
        <ul className="list">
          {list.map((m) => {
            const c = company(m.company)!;
            return (
              <li key={m.id}>
                <Link href={`/c/matches/${m.id}`} className="item">
                  <img src={c.img} alt="" className="thumb" width={56} height={56} />
                  <span className="item-body">
                    <strong className="truncate" style={{ display: "block" }}>{m.role}</strong>
                    <span className="muted small">{c.name} · {m.status === "Matched" ? "Matched" : "Request"} · {m.when}</span>
                  </span>
                  {m.hoursLeft <= 12 ? <span className="chip chip-gold">{m.hoursLeft}h left</span> : m.isNew ? <span className="chip chip-navy">New</span> : null}
                  <Ring value={m.fit} size={44} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Sample />
    </div>
  );
}
