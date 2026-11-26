"use client";

import { useRef, useState } from "react";
import { Icon, StatusChip } from "@/components/ui";
import { adminUsers } from "@/data/fixtures";

export function UsersTable() {
  const [rows, setRows] = useState(adminUsers);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [sel, setSel] = useState<(typeof adminUsers)[number] | null>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const list = rows.filter((u) => (type === "All" || u.type === type) && (status === "All" || u.status === status) && `${u.name} ${u.email} ${u.id}`.toLowerCase().includes(q.toLowerCase()));
  const act = (id: string, s: string) => {
    setRows(rows.map((u) => (u.id === id ? { ...u, status: s } : u)));
    setSel((x) => (x && x.id === id ? { ...x, status: s } : x));
  };
  return (
    <div className="stack">
      <div className="row">
        <div className="field" style={{ flex: "1 1 240px" }}><label htmlFor="q" className="sr">Search users</label><input id="q" placeholder="Search name, email or ID" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="field"><label htmlFor="t" className="sr">Type</label><select id="t" value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Candidate</option><option>Recruiter</option></select></div>
        <div className="field"><label htmlFor="s" className="sr">Status</label><select id="s" value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Active</option><option>Pending review</option><option>Suspended</option></select></div>
      </div>
      <p className="mono small muted" aria-live="polite">{list.length} users</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>City</th><th>Joined</th><th>Status</th><th><span className="sr">Open</span></th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td className="mono">{u.id}</td>
                <td><strong>{u.name}</strong><br /><span className="muted small">{u.email}</span></td>
                <td>{u.type}</td><td>{u.city}</td><td>{u.joined}</td>
                <td><StatusChip status={u.status} /></td>
                <td><button className="btn" onClick={() => (setSel(u), drawer.current?.showModal())}>Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog ref={drawer} className="sheet" aria-label="User details">
        {sel && (
          <div className="dialog-body">
            <div className="row between"><span className="mono">{sel.id}</span><button className="btn btn-ghost btn-icon" aria-label="Close" onClick={() => drawer.current?.close()}><Icon name="x" /></button></div>
            <h2 style={{ fontSize: 32 }}>{sel.name}</h2>
            <StatusChip status={sel.status} />
            <dl className="stack small" style={{ margin: 0, ["--gap" as string]: "8px" }}>
              {[["Email", sel.email], ["Type", sel.type], ["City", sel.city], ["Joined", sel.joined], ["Last sign-in", "26 Nov 2026, 10:12 IST"], ["MFA", sel.type === "Recruiter" ? "Enabled" : "Not required"]].map(([k, v]) => (
                <div key={k} className="row between"><dt className="muted">{k}</dt><dd style={{ margin: 0 }}>{v}</dd></div>
              ))}
            </dl>
            <hr className="hr" />
            <div className="row">
              {sel.status === "Suspended" ? (
                <button className="btn btn-primary" onClick={() => act(sel.id, "Active")}><Icon name="undo" /> Restore</button>
              ) : (
                <button className="btn btn-danger" onClick={() => act(sel.id, "Suspended")}><Icon name="ban" /> Suspend</button>
              )}
              {sel.status === "Pending review" && <button className="btn" onClick={() => act(sel.id, "Active")}><Icon name="shield" /> Verify</button>}
            </div>
            <p className="hint">Actions are recorded in the audit log.</p>
          </div>
        )}
      </dialog>
    </div>
  );
}
