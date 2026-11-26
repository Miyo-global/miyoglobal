"use client";

import Link from "next/link";
import { useState } from "react";
import { ErrorPanel, Success } from "@/components/states";
import { Icon } from "@/components/ui";
import { inr, plans } from "@/data/fixtures";
import { setUnlocks, useUnlocks } from "../../unlocks";

export function Checkout({ plan: initialPlan }: { plan?: string }) {
  const [plan, setPlan] = useState(initialPlan ?? "");
  const [state, setState] = useState<"choose" | "pay" | "ok" | "fail">(initialPlan ? "pay" : "choose");
  const [method, setMethod] = useState("UPI");
  const { used } = useUnlocks();
  const p = plans.find((x) => x.id === plan);
  const total = plan === "addon" ? 350 : p?.inr ?? 0;
  const gst = Math.round(total * 0.18);

  if (state === "ok")
    return (
      <Success icon="card" title="Payment received" body={`${plan === "addon" ? "1 extra unlock" : `${p?.name} plan`} is active now. Receipt ${inr(total + gst)} including GST sent to kiran@northbridge.demo.`}>
        <Link href="/r/deck" className="btn btn-gold">Back to the deck</Link>
        <Link href="/r/billing" className="btn">View invoices</Link>
      </Success>
    );
  if (state === "fail")
    return (
      <ErrorPanel icon="card" title="Payment failed" body={`Your ${method} payment was declined by the bank. You haven't been charged. Try again or use another method.`}>
        <button className="btn btn-primary" onClick={() => setState("pay")}>Try again</button>
        <Link href="/r/deck" className="btn">Maybe later</Link>
      </ErrorPanel>
    );

  return (
    <div className="split" style={{ alignItems: "start" }}>
      <div className="stack" style={{ ["--gap" as string]: "16px" }}>
        <div className="cols-2">
          {plans.filter((x) => x.id === "growth" || x.id === "team").map((x) => (
            <button key={x.id} className={x.id === "growth" ? "card card-top stack" : "card stack"} style={{ textAlign: "left", cursor: "pointer", outline: plan === x.id ? "2px solid var(--gold-deep)" : undefined }} aria-pressed={plan === x.id} onClick={() => (setPlan(x.id), setState("pay"))}>
              <div className="row between"><h3>{x.name}</h3>{plan === x.id && <Icon name="check" />}</div>
              <span className="price">{inr(x.inr!)}</span>
              <span className="muted small">{x.unlocks} · {x.roles} · {x.seats}</span>
            </button>
          ))}
        </div>
        <button className="card row between" style={{ cursor: "pointer", outline: plan === "addon" ? "2px solid var(--gold-deep)" : undefined }} aria-pressed={plan === "addon"} onClick={() => (setPlan("addon"), setState("pay"))}>
          <span><strong>Just one more unlock</strong><span className="muted small" style={{ display: "block" }}>Add-on, no plan change</span></span>
          <span className="mono">₹350 / AED 15</span>
        </button>
        <Link href="/r/deck" className="btn btn-ghost" style={{ width: "fit-content" }}>Maybe later</Link>
      </div>
      <aside className="card stack" aria-label="Checkout">
        <h2 className="label">Checkout</h2>
        {state === "choose" ? (
          <p className="muted small">Choose a plan or add-on to continue.</p>
        ) : (
          <>
            <div className="row between"><span>{plan === "addon" ? "Extra unlock × 1" : `${p?.name} · monthly`}</span><span>{inr(total)}</span></div>
            <div className="row between muted small"><span>GST 18%</span><span>{inr(gst)}</span></div>
            <hr className="hr" />
            <div className="row between"><strong>Total</strong><strong>{inr(total + gst)}</strong></div>
            <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
              <legend>Pay with</legend>
              {["UPI", "Card", "Bank transfer"].map((m) => (
                <label key={m} className="check"><input type="radio" name="m" checked={method === m} onChange={() => setMethod(m)} /> {m}</label>
              ))}
            </fieldset>
            <button className="btn btn-gold btn-block" onClick={() => {
              setState("ok");
              setUnlocks(plan === "addon" ? used : 0, plan === "addon" ? 6 : plan === "team" ? 250 : 50);
            }}>Pay {inr(total + gst)}</button>
            <button className="btn-link small" onClick={() => setState("fail")}>Simulate a failed payment</button>
            <p className="hint">Beta: payments are simulated. Nothing is charged.</p>
          </>
        )}
      </aside>
    </div>
  );
}
