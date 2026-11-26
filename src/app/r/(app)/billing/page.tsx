import type { Metadata } from "next";
import Link from "next/link";
import { Modal } from "@/components/client";
import { Icon, Meter, PageHead, Sample, StatusChip } from "@/components/ui";
import { invoices } from "@/data/fixtures";

export const metadata: Metadata = { title: "Billing" };

export default function Billing() {
  return (
    <div>
      <PageHead eyebrow="Billing" title="Plan and usage">
        <Link href="/r/billing/upgrade" className="btn btn-gold">Change plan</Link>
      </PageHead>
      <div className="cols-3" style={{ marginBottom: 24 }}>
        <section className="card stack">
          <p className="label">Current plan</p>
          <p className="num">Free Trial</p>
          <p className="muted small">5 unlocks a month · 1 role · renews 01 Dec 2026</p>
        </section>
        <section className="card stack">
          <p className="label">Unlocks this month</p>
          <p className="num">2 <span className="muted small">of 5</span></p>
          <Meter value={2} max={5} gold label="Unlocks used" />
        </section>
        <section className="card stack">
          <p className="label">Payment method</p>
          <p className="row" style={{ flexWrap: "nowrap" }}><Icon name="card" /> UPI · northbridge@upi</p>
          <Modal trigger="Update method" title="Payment method">
            <form method="dialog" className="stack">
              <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
                <legend>Pay with</legend>
                {["UPI", "Debit or credit card", "Bank transfer (NEFT / RTGS / UAE local transfer)"].map((m, i) => (
                  <label key={m} className="check"><input type="radio" name="pm" defaultChecked={i === 0} /> {m}</label>
                ))}
              </fieldset>
              <div className="field"><label htmlFor="upi">UPI ID</label><input id="upi" defaultValue="northbridge@upi" /></div>
              <p className="hint">Beta: payments are simulated. Nothing is charged.</p>
              <button className="btn btn-primary">Save method</button>
            </form>
          </Modal>
        </section>
      </div>
      <section className="card stack" style={{ marginBottom: 24 }} aria-labelledby="bd">
        <h2 id="bd" className="label">Billing details</h2>
        <div className="cols-3 small">
          <div><p className="muted">Legal name</p><p>Northbridge Systems Pvt Ltd</p></div>
          <div><p className="muted">GSTIN</p><p className="mono">36AABCN1234F1Z5</p></div>
          <div><p className="muted">Billing address</p><p>Hitech City, Hyderabad, Telangana 500081</p></div>
        </div>
      </section>
      <section className="stack" aria-labelledby="inv">
        <h2 id="inv" style={{ fontSize: 24 }}>Invoices</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice</th><th>Date</th><th>Item</th><th>Amount</th><th>GST 18%</th><th>Status</th><th><span className="sr">Download</span></th></tr></thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td className="mono">{i.id}</td><td>{i.date}</td><td>{i.plan}</td><td>{i.amount}</td><td>{i.gst}</td><td><StatusChip status={i.status} /></td>
                  <td><a className="btn" download={`${i.id}.txt`} href={`data:text/plain,${encodeURIComponent(`MIYO Global tax invoice ${i.id}\nDate ${i.date}\n${i.plan} ${i.amount}\nGST ${i.gst}\nBeta sample`)}`}><Icon name="download" size={16} /> GST invoice</a></td>
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
