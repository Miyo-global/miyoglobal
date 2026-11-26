"use client";

import { useRef, useState } from "react";
import { StatusChip } from "@/components/ui";
import { aed, inr, plans, transactions } from "@/data/fixtures";

export function PlansAdmin() {
  const [rows, setRows] = useState(transactions);
  const [tab, setTab] = useState("All");
  const [refund, setRefund] = useState<(typeof transactions)[number] | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const list = rows.filter((t) => tab === "All" || t.status === tab);
  return (
    <div className="stack" style={{ ["--gap" as string]: "32px" }}>
      <section className="stack" aria-labelledby="pl">
        <h2 id="pl" style={{ fontSize: 24 }}>Plans</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Plan</th><th>INR / month</th><th>AED / month</th><th>Unlock allowance</th><th>Roles</th><th>Seats</th></tr></thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>
                    <label className="sr" htmlFor={`inr-${p.id}`}>{p.name} INR price</label>
                    <input id={`inr-${p.id}`} className="input" style={{ minHeight: 36, padding: "4px 8px", width: 120 }} defaultValue={p.inr === null ? "Custom" : inr(p.inr)} />
                  </td>
                  <td>
                    <label className="sr" htmlFor={`aed-${p.id}`}>{p.name} AED price</label>
                    <input id={`aed-${p.id}`} className="input" style={{ minHeight: 36, padding: "4px 8px", width: 120 }} defaultValue={p.aed === null ? "Custom" : aed(p.aed)} />
                  </td>
                  <td>{p.unlocks}</td><td>{p.roles}</td><td>{p.seats}</td>
                </tr>
              ))}
              <tr><td><strong>Extra unlock</strong></td><td>₹350</td><td>AED 15</td><td>1 unlock</td><td>—</td><td>—</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="stack" aria-labelledby="tx">
        <div className="row between">
          <h2 id="tx" style={{ fontSize: 24 }}>Transactions</h2>
          <div className="seg" role="group" aria-label="Filter">
            {["All", "Paid", "Failed", "Refunded"].map((t) => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Company</th><th>Item</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th><span className="sr">Actions</span></th></tr></thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td className="mono">{t.id}</td><td>{t.company}</td><td>{t.plan}</td><td>{t.amount}</td><td>{t.method}</td><td>{t.date}</td>
                  <td><StatusChip status={t.status} /></td>
                  <td>
                    {t.status === "Paid" && <button className="btn" onClick={() => (setRefund(t), dlg.current?.showModal())}>Refund</button>}
                    {t.status === "Failed" && <button className="btn" onClick={() => setRows(rows.map((r) => (r.id === t.id ? { ...r, status: "Paid" } : r)))}>Retry charge</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <dialog ref={dlg} aria-label="Issue refund">
        {refund && (
          <form method="dialog" className="dialog-body" onSubmit={() => setRows(rows.map((r) => (r.id === refund.id ? { ...r, status: "Refunded" } : r)))}>
            <h2 style={{ fontSize: 28 }}>Refund {refund.id}?</h2>
            <p className="muted">{refund.amount} to {refund.company} via {refund.method}. Refunds take 5–7 working days and can&apos;t be reversed.</p>
            <div className="field">
              <label htmlFor="why">Reason</label>
              <select id="why"><option>Duplicate payment</option><option>Service issue</option><option>Goodwill</option></select>
            </div>
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button type="button" className="btn" onClick={() => dlg.current?.close()}>Cancel</button>
              <button className="btn btn-danger">Issue refund</button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
