import type { Metadata } from "next";
import Link from "next/link";
import { Empty, Icon, Meter, PageHead, Sample, StatusChip } from "@/components/ui";
import { roles } from "@/data/fixtures";

export const metadata: Metadata = { title: "Open roles" };

export default async function Roles({ searchParams }: { searchParams: Promise<{ empty?: string }> }) {
  const list = (await searchParams).empty ? [] : roles;
  return (
    <div>
      <PageHead eyebrow="Roles" title="Open roles" lede="Each role has its own deck, pay band and two pitch prompts.">
        <Link href="/r/roles/new" className="btn btn-primary"><Icon name="plus" /> Create role</Link>
      </PageHead>
      <section className="card stack" style={{ marginBottom: 24 }} aria-labelledby="ul">
        <div className="row between">
          <h2 id="ul" className="label">Unlocks this month</h2>
          <span className="mono"><span className="gold">3 of 5</span> free unlocks left</span>
        </div>
        <Meter value={2} max={5} gold label="Unlocks used" />
        <p className="small muted">Resets 01 Dec 2026. <Link href="/r/billing/upgrade">Need more?</Link></p>
      </section>
      {list.length === 0 ? (
        <Empty icon="briefcase" title="No open roles" body="Create your first role to start receiving blind pitches.">
          <Link href="/r/roles/new" className="btn btn-primary">Create role</Link>
        </Empty>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Role ID</th><th>Title</th><th>Location</th><th>Pay band</th><th>In deck</th><th>Liked</th><th>Matched</th><th>Status</th><th><span className="sr">Actions</span></th></tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.id}</td>
                  <td><strong>{r.title}</strong><br /><span className="muted small">Posted {r.posted}</span></td>
                  <td>{r.city} · {r.mode}</td>
                  <td>{r.band}</td>
                  <td className="mono">{r.inDeck}</td>
                  <td className="mono">{r.liked}</td>
                  <td className="mono">{r.matched}</td>
                  <td><StatusChip status={r.status} /></td>
                  <td><Link href={r.status === "Draft" ? "/r/roles/new?step=3" : "/r/deck"} className="btn">{r.status === "Draft" ? "Finish" : "Open deck"}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="small" style={{ marginTop: 16 }}><Link href="/r/roles?empty=1">Preview the empty state</Link></p>
      <Sample />
    </div>
  );
}
