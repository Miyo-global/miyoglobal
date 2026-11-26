import type { Metadata } from "next";
import { Flash, Modal, Toggle } from "@/components/client";
import { PageHead, Sample } from "@/components/ui";

export const metadata: Metadata = { title: "Admin settings" };

const perms = ["Review videos", "Verify companies", "Suspend users", "Issue refunds", "Edit plans", "Edit feature flags"];
const staff: [string, string, boolean[]][] = [
  ["Super admin", "Meera D.", [true, true, true, true, true, true]],
  ["Support", "Imran S.", [true, true, true, true, false, false]],
  ["Moderator", "2 people", [true, false, false, false, false, false]],
];
const templates = [
  ["Match request", "You have a new match request from {company}. It expires in 48 hours."],
  ["Video approved", "Your pitch passed review and is now live in company decks."],
  ["Company verified", "{company} is verified. You have 5 free unlocks this month."],
];

export default function AdminSettings() {
  return (
    <div style={{ maxWidth: 1080 }}>
      <PageHead eyebrow="Platform" title="Admin settings" />
      <div className="stack" style={{ ["--gap" as string]: "24px" }}>
        <section className="card stack" aria-labelledby="rp">
          <h2 id="rp" style={{ fontSize: 24 }}>Roles and permissions</h2>
          <div className="table-wrap">
            <table className="matrix">
              <thead><tr><th>Role</th>{perms.map((p) => <th key={p}>{p}</th>)}</tr></thead>
              <tbody>
                {staff.map(([r, who, ok]) => (
                  <tr key={r}>
                    <td><strong>{r}</strong><br /><span className="muted small">{who}</span></td>
                    {ok.map((v, i) => (
                      <td key={i}><input type="checkbox" defaultChecked={v} aria-label={`${r}: ${perms[i]}`} style={{ width: 20, height: 20, accentColor: "var(--navy)" }} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card stack" aria-labelledby="ff">
          <h2 id="ff" style={{ fontSize: 24 }}>Feature flags</h2>
          <div className="row between" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
            <label htmlFor="free">Free company unlocks per month</label>
            <input id="free" type="number" className="input" defaultValue={5} min={0} max={50} style={{ width: 96 }} />
          </div>
          <div className="row between" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
            <label htmlFor="ttl">Match reply window (hours)</label>
            <input id="ttl" type="number" className="input" defaultValue={48} style={{ width: 96 }} />
          </div>
          <Toggle label="Super-like" on />
          <Toggle label="Async video questions" on />
          <Toggle label="Candidate Plus" on />
          <Toggle label="Arabic interface" hint="Right-to-left layout, in testing." />
          <Flash><button className="btn btn-primary" style={{ width: "fit-content" }}>Save flags</button></Flash>
        </section>
        <section className="card stack" aria-labelledby="et">
          <h2 id="et" style={{ fontSize: 24 }}>Email templates</h2>
          <ul className="list">
            {templates.map(([n, body]) => (
              <li key={n} className="item">
                <span className="item-body"><strong>{n}</strong><span className="muted small truncate" style={{ display: "block" }}>{body}</span></span>
                <Modal trigger="Edit" title={`Edit: ${n}`}>
                  <form method="dialog" className="stack">
                    <div className="field"><label htmlFor={`s-${n}`}>Subject</label><input id={`s-${n}`} defaultValue={n} /></div>
                    <div className="field"><label htmlFor={`b-${n}`}>Body</label><textarea id={`b-${n}`} defaultValue={body} /></div>
                    <p className="hint">Variables: {"{company}"}, {"{candidate}"}, {"{role}"}.</p>
                    <button className="btn btn-primary">Save template</button>
                  </form>
                </Modal>
              </li>
            ))}
          </ul>
        </section>
        <section className="card stack" aria-labelledby="sec">
          <h2 id="sec" style={{ fontSize: 24 }}>Security</h2>
          <Toggle label="Require passkey or authenticator for all staff" on />
          <Toggle label="Restrict admin sign-in to office networks" hint="Hyderabad and Ras Al Khaimah IP ranges." on />
          <Toggle label="Alert on bulk exports" on />
          <div className="row between"><span>Session length</span><span className="mono">8 HOURS</span></div>
        </section>
      </div>
      <Sample />
    </div>
  );
}
