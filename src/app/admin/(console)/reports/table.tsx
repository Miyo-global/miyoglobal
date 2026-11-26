"use client";

import { useState } from "react";
import { StatusChip } from "@/components/ui";
import { reports } from "@/data/fixtures";

export function ReportsTable() {
  const [rows, setRows] = useState(reports);
  const [tab, setTab] = useState("Open");
  const list = rows.filter((r) => tab === "All" || r.status === tab);
  const set = (id: string, status: string) => setRows(rows.map((r) => (r.id === id ? { ...r, status } : r)));
  return (
    <div className="stack">
      <div className="tabs" role="tablist">
        {["Open", "Reviewing", "Resolved", "All"].map((t) => <button key={t} role="tab" className="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t} <span className="mono small">{t === "All" ? rows.length : rows.filter((r) => r.status === t).length}</span></button>)}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Target</th><th>Reason</th><th>Reported by</th><th>Date</th><th>Severity</th><th>Status</th><th><span className="sr">Actions</span></th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.id}</td>
                <td><strong>{r.target}</strong><br /><span className="muted small">{r.kind}</span></td>
                <td>{r.reason}</td><td>{r.by}</td><td>{r.when}</td>
                <td><StatusChip status={r.severity} /></td>
                <td><StatusChip status={r.status} /></td>
                <td>
                  <span className="row" style={{ flexWrap: "nowrap" }}>
                    {r.status === "Open" && <button className="btn" onClick={() => set(r.id, "Reviewing")}>Review</button>}
                    {r.status !== "Resolved" && <button className="btn btn-primary" onClick={() => set(r.id, "Resolved")}>Resolve</button>}
                  </span>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={8} className="muted" style={{ textAlign: "center", padding: 32 }}>All clear. No reports in this view.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
