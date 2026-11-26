import type { Metadata } from "next";
import { PageHead, Sample, StatusChip } from "@/components/ui";
import { SubscriptionPanel } from "./sub";

export const metadata: Metadata = { title: "Subscription" };

const history = [
  ["26 Nov 2026", "Candidate Plus · monthly", "₹299", "UPI", "Paid"],
  ["26 Oct 2026", "Candidate Plus · monthly", "₹299", "UPI", "Paid"],
  ["26 Sep 2026", "Candidate Plus · monthly", "₹299", "Card", "Failed"],
];

export default function Subscription() {
  return (
    <div style={{ maxWidth: 1080 }} className="stack">
      <PageHead eyebrow="Subscription" title="Free, with an optional upgrade" lede="MIYO is free for candidates. Candidate Plus adds insights and coaching." />
      <SubscriptionPanel />
      <section className="stack" aria-labelledby="hist" style={{ marginTop: 32 }}>
        <h2 id="hist" style={{ fontSize: 24 }}>Billing history</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Item</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {history.map((r) => (
                <tr key={r[0]}>
                  <td className="mono">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><StatusChip status={r[4]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Sample />
    </div>
  );
}
