"use client";

import { useState } from "react";
import { StatusChip } from "@/components/ui";
import { companies } from "@/data/fixtures";

export function CompaniesTable() {
  const [rows, setRows] = useState(companies.map((c) => ({ ...c, reason: c.status === "Rejected" ? "Domain doesn't match trade licence" : "" })));
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState("Domain doesn't match registration documents");
  const set = (id: string, status: "Verified" | "Rejected" | "Pending", why = "") => setRows(rows.map((r) => (r.id === id ? { ...r, status, reason: why } : r)));
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Company</th><th>Domain</th><th>City</th><th>Reliability</th><th>Status</th><th><span className="sr">Actions</span></th></tr></thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td><span className="row" style={{ flexWrap: "nowrap" }}><img src={c.img} alt="" className="avatar" width={40} height={40} /><strong>{c.name}</strong></span></td>
              <td className="mono">{c.domain}</td>
              <td>{c.city}</td>
              <td className="mono">{c.reliability}</td>
              <td><StatusChip status={c.status} />{c.reason && <p className="muted small">{c.reason}</p>}</td>
              <td>
                {rejecting === c.id ? (
                  <form className="row" style={{ flexWrap: "nowrap" }} onSubmit={(e) => (e.preventDefault(), set(c.id, "Rejected", reason), setRejecting(null))}>
                    <label className="sr" htmlFor={`why-${c.id}`}>Reason</label>
                    <input id={`why-${c.id}`} className="input" style={{ minHeight: 36, padding: "4px 8px", minWidth: 220 }} value={reason} onChange={(e) => setReason(e.target.value)} />
                    <button className="btn btn-danger">Reject</button>
                    <button type="button" className="btn" onClick={() => setRejecting(null)}>Cancel</button>
                  </form>
                ) : (
                  <span className="row" style={{ flexWrap: "nowrap" }}>
                    {c.status !== "Verified" && <button className="btn btn-primary" onClick={() => set(c.id, "Verified")}>Verify</button>}
                    {c.status !== "Rejected" && <button className="btn" onClick={() => setRejecting(c.id)}>Reject</button>}
                    {c.status === "Rejected" && <button className="btn" onClick={() => set(c.id, "Pending")}>Reopen</button>}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
