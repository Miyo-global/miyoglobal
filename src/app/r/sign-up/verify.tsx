"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui";

type S = "form" | "pending" | "verified" | "rejected";

export function Verify({ initial }: { initial: S }) {
  const [s, setS] = useState<S>(initial);
  const [domain, setDomain] = useState("northbridge.demo");
  const steps = ["Work email", "Domain check", "Company details", "Approved"];
  const at = s === "form" ? 1 : s === "pending" ? 2 : s === "verified" ? 4 : 2;
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <ol className="steps" aria-label="Verification progress">
        {steps.map((x, i) => <li key={x} className={i < at ? "on" : i === at ? "now" : ""}>{x}</li>)}
      </ol>
      {s === "form" && (
        <form className="stack" onSubmit={(e) => (e.preventDefault(), setS(domain.endsWith(".demo") ? "pending" : "rejected"))}>
          <header className="stack" style={{ ["--gap" as string]: "8px" }}>
            <h1>Verify your company</h1>
            <p className="muted">Candidates only see verified companies. We check your work domain and registration.</p>
          </header>
          <div className="field">
            <label htmlFor="co">Registered company name</label>
            <input id="co" defaultValue="Northbridge Systems Pvt Ltd" />
          </div>
          <div className="field">
            <label htmlFor="domain">Work domain</label>
            <input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} aria-describedby="domain-h" />
            <p id="domain-h" className="hint">Must match your sign-up email. Free email domains aren&apos;t accepted. Try any domain without .demo to see a rejection.</p>
          </div>
          <div className="cols-2">
            <div className="field">
              <label htmlFor="reg">GSTIN or UAE trade licence number</label>
              <input id="reg" defaultValue="36AABCN1234F1Z5" />
            </div>
            <div className="field">
              <label htmlFor="hq">Headquarters</label>
              <select id="hq" defaultValue="Hyderabad"><option>Hyderabad</option><option>Ras Al Khaimah</option><option>Dubai</option></select>
            </div>
          </div>
          <label className="dropzone" style={{ cursor: "pointer" }}>
            <Icon name="upload" />
            <strong>Upload registration certificate</strong>
            <span className="hint">PDF, up to 10 MB.</span>
            <input type="file" accept=".pdf" className="sr" />
          </label>
          <button className="btn btn-primary">Submit for verification</button>
        </form>
      )}
      {s === "pending" && (
        <div className="card stack" role="status">
          <span className="chip chip-gold" style={{ width: "fit-content" }}><Icon name="clock" size={14} /> Pending</span>
          <h1>We&apos;re checking {domain}</h1>
          <p className="muted">DNS ownership confirmed. A reviewer is checking your registration documents, usually within 4 working hours (09:00–18:00 IST / GST).</p>
          <p className="muted small">You can set up your company profile and draft roles while you wait. Roles go live once you&apos;re verified.</p>
          <div className="row">
            <Link href="/r/profile" className="btn btn-primary">Set up company profile</Link>
            <button className="btn" onClick={() => setS("verified")}>Simulate approval</button>
          </div>
        </div>
      )}
      {s === "verified" && (
        <div className="card stack" role="status">
          <span className="chip chip-navy" style={{ width: "fit-content" }}><Icon name="shield" size={14} /> Verified</span>
          <h1>Northbridge Systems is verified</h1>
          <p className="muted">Your badge now shows on every role and chat. You have 5 free unlocks this month.</p>
          <div className="row">
            <Link href="/r/roles/new" className="btn btn-gold">Create your first role</Link>
            <Link href="/r/deck" className="btn">Go to the deck</Link>
          </div>
        </div>
      )}
      {s === "rejected" && (
        <div className="card stack" style={{ borderLeft: "2px solid var(--error)" }} role="alert">
          <span className="chip chip-err" style={{ width: "fit-content" }}><Icon name="x" size={14} /> Not verified</span>
          <h1>We couldn&apos;t verify {domain}</h1>
          <p><strong>Reason:</strong> the domain doesn&apos;t match the company on your registration certificate, and we found no DNS record for it.</p>
          <p className="muted small">Use your company&apos;s own email domain, or upload a letter on company letterhead confirming the domain.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => setS("form")}>Fix and resubmit</button>
            <a className="btn" href="mailto:verify@miyoglobal.com">Contact the desk</a>
          </div>
        </div>
      )}
    </div>
  );
}
