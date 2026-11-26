import type { Metadata } from "next";
import { Modal } from "@/components/client";
import { ConfirmDestructive } from "@/components/states";
import { Icon, Initials, Meter, PageHead, Sample, StatusChip } from "@/components/ui";
import { team } from "@/data/fixtures";

export const metadata: Metadata = { title: "Team and seats" };

const rolesHelp = [
  ["Admin", "Manages billing, seats and every role."],
  ["Recruiter", "Swipes, requests matches and chats."],
  ["Viewer", "Watches pitches and comments. Can't use unlocks."],
];

export default function Team() {
  return (
    <div>
      <PageHead eyebrow="Team" title="Team and seats">
        <Modal trigger={<><Icon name="plus" /> Invite teammate</>} triggerClass="btn btn-primary" title="Invite a teammate">
          <form method="dialog" className="stack">
            <div className="field"><label htmlFor="ie">Work email</label><input id="ie" type="email" placeholder="name@northbridge.demo" required /></div>
            <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
              <legend>Role</legend>
              {rolesHelp.map(([r, h], i) => (
                <label key={r} className="check"><input type="radio" name="r" defaultChecked={i === 1} /><span><strong>{r}</strong><span className="hint" style={{ display: "block" }}>{h}</span></span></label>
              ))}
            </fieldset>
            <p className="hint">Uses 1 of your 3 remaining seats. Invites expire after 7 days.</p>
            <button className="btn btn-primary">Send invite</button>
          </form>
        </Modal>
      </PageHead>
      <section className="card stack" style={{ marginBottom: 24 }}>
        <div className="row between"><span className="label">Seats</span><span className="mono">4 of 5 used</span></div>
        <Meter value={4} max={5} label="Seats used" />
        <p className="small muted">Team plan includes 5 seats. Viewers don&apos;t count towards seats on Growth and above.</p>
      </section>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Last active</th><th><span className="sr">Actions</span></th></tr></thead>
          <tbody>
            {team.map((m) => (
              <tr key={m.email}>
                <td><span className="row" style={{ flexWrap: "nowrap" }}><Initials name={m.name} /> {m.name}</span></td>
                <td>{m.email}</td>
                <td>
                  <label className="sr" htmlFor={`r-${m.email}`}>Role for {m.name}</label>
                  <select id={`r-${m.email}`} className="input" defaultValue={m.role} style={{ minHeight: 36, padding: "4px 8px", width: "auto" }}>
                    <option>Admin</option><option>Recruiter</option><option>Viewer</option>
                  </select>
                </td>
                <td>{m.last === "Invited" ? <StatusChip status="Pending" /> : m.last}</td>
                <td>{m.role !== "Admin" && <ConfirmDestructive trigger="Remove" title={`Remove ${m.name}?`} body={`${m.name} loses access straight away. Their chats move to you.`} confirm="Remove" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Sample />
    </div>
  );
}
