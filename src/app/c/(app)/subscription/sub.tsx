"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";

export function SubscriptionPanel() {
  const [cur, setCur] = useState<"INR" | "AED">("INR");
  const [plan, setPlan] = useState<"free" | "plus" | "cancelling">("plus");
  const [step, setStep] = useState(0);
  const price = cur === "INR" ? "₹299" : "AED 15";
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <div className="seg" role="group" aria-label="Currency" style={{ width: "fit-content" }}>
        {(["INR", "AED"] as const).map((c) => <button key={c} aria-pressed={cur === c} onClick={() => setCur(c)}>{c}</button>)}
      </div>
      <div className="cols-2">
        <article className="card stack" aria-current={plan === "free" ? "true" : undefined}>
          <div className="row between"><h3>Free</h3>{plan === "free" && <span className="chip chip-navy">Current</span>}</div>
          <p className="price">{cur === "INR" ? "₹0" : "AED 0"}</p>
          <ul className="feature-list">
            <li><Icon name="check" size={16} /> Blind video profile</li>
            <li><Icon name="check" size={16} /> Unlimited match requests</li>
            <li><Icon name="check" size={16} /> Chat and interview booking</li>
          </ul>
          <p className="muted small">Candidates never pay to be seen or hired.</p>
        </article>
        <article className="card card-top stack">
          <div className="row between"><h3>Candidate Plus</h3>{plan !== "free" && <span className="chip chip-gold">{plan === "cancelling" ? "Ends 26 Dec 2026" : "Current"}</span>}</div>
          <p><span className="price">{price}</span> <span className="muted small">/ month</span></p>
          <ul className="feature-list">
            <li><Icon name="check" size={16} /> See which companies viewed your pitch</li>
            <li><Icon name="check" size={16} /> Pitch coaching notes from our desk</li>
            <li><Icon name="check" size={16} /> Record up to 3 pitches for different roles</li>
          </ul>
          {plan === "free" ? (
            <button className="btn btn-gold" onClick={() => setPlan("plus")}>Upgrade for {price}</button>
          ) : plan === "plus" ? (
            <button className="btn" onClick={() => setStep(1)}>Cancel Candidate Plus</button>
          ) : (
            <button className="btn" onClick={() => setPlan("plus")}>Keep Candidate Plus</button>
          )}
        </article>
      </div>
      {step === 1 && (
        <section className="card stack" aria-labelledby="cancel-h" role="region">
          <h2 id="cancel-h" style={{ fontSize: 24 }}>Before you go</h2>
          <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
            <legend>Why are you cancelling? (optional)</legend>
            {["I found a job", "It's too expensive", "I don't use the insights", "Something else"].map((r) => (
              <label key={r} className="check"><input type="radio" name="why" /> {r}</label>
            ))}
          </fieldset>
          <p className="muted small">You keep Candidate Plus until 26 Dec 2026. Your profile stays free and live after that.</p>
          <div className="row">
            <button className="btn" onClick={() => setStep(0)}>Keep my plan</button>
            <button className="btn btn-danger" onClick={() => (setPlan("cancelling"), setStep(0))}>Confirm cancellation</button>
          </div>
        </section>
      )}
    </div>
  );
}
