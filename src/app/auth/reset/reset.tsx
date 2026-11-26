"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui";

export function ResetForm() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const rules = [
    [a.length >= 8, "At least 8 characters"],
    [/\d/.test(a), "One number"],
    [/[A-Z]/.test(a), "One capital letter"],
  ] as const;
  const mismatch = tried && a !== b;
  if (done)
    return (
      <div className="stack" style={{ textAlign: "center", display: "grid", justifyItems: "center" }} role="status">
        <span className="ico" style={{ borderColor: "var(--gold)" }}><Icon name="check" size={24} /></span>
        <h1>Password updated</h1>
        <p className="muted">Sign in with your new password.</p>
        <Link href="/auth/log-in" className="btn btn-primary btn-block">Sign in</Link>
      </div>
    );
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (a === b && rules.every(([ok]) => ok)) setDone(true);
      }}
    >
      <header className="stack" style={{ ["--gap" as string]: "8px", textAlign: "center" }}>
        <h1>Choose a new password</h1>
        <p className="muted">For ananya@demo.miyoglobal.com</p>
      </header>
      <div className="field">
        <label htmlFor="new">New password</label>
        <input id="new" type="password" autoComplete="new-password" value={a} onChange={(e) => setA(e.target.value)} aria-describedby="rules" />
      </div>
      <ul id="rules" className="feature-list small">
        {rules.map(([ok, label]) => (
          <li key={label} className={ok ? "" : "muted"}>
            <Icon name={ok ? "check" : "x"} size={16} /> {label} <span className="sr">{ok ? "met" : "not met"}</span>
          </li>
        ))}
      </ul>
      <div className="field">
        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" type="password" autoComplete="new-password" value={b} onChange={(e) => setB(e.target.value)} aria-invalid={mismatch || undefined} aria-describedby={mismatch ? "confirm-err" : undefined} />
        {mismatch && <p id="confirm-err" className="field-error">The passwords don&apos;t match.</p>}
      </div>
      <button className="btn btn-primary btn-block">Update password</button>
    </form>
  );
}
