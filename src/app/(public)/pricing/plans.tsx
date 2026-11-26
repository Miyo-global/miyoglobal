"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui";
import { aed, inr, plans, usd } from "@/data/fixtures";

type Cur = "INR" | "AED" | "USD";
const fmt = (c: Cur, v: number) => (c === "INR" ? inr(v) : c === "AED" ? aed(v) : usd(v));
const addon: Record<Cur, string> = { INR: "₹350", AED: "AED 15", USD: "$4" };

export function PricingPlans() {
  const [cur, setCur] = useState<Cur>("INR");
  return (
    <div className="stack" style={{ ["--gap" as string]: "32px" }}>
      <div className="row between">
        <div className="seg" role="group" aria-label="Currency">
          {(["INR", "AED", "USD"] as Cur[]).map((c) => (
            <button key={c} aria-pressed={cur === c} onClick={() => setCur(c)}>
              {c}
            </button>
          ))}
        </div>
        <p className="small muted">Prices per company, per month. GST or VAT added at checkout.</p>
      </div>
      <div className="cols-4">
        {plans.map((p) => {
          const v = cur === "INR" ? p.inr : cur === "AED" ? p.aed : p.usd;
          return (
            <article key={p.id} className={p.featured ? "card card-top stack" : "card stack"} style={{ display: "grid", alignContent: "start" }}>
              <div className="row between">
                <h3>{p.name}</h3>
                {p.featured && <span className="chip chip-gold">Most chosen</span>}
              </div>
              <p className="muted small">{p.blurb}</p>
              <p>
                <span className="price">{v === null ? "Custom" : fmt(cur, v)}</span>
                {v !== null && <span className="muted small"> / month</span>}
              </p>
              <ul className="feature-list">
                <li><Icon name="check" size={16} /> {p.unlocks}</li>
                <li><Icon name="check" size={16} /> {p.roles}</li>
                <li><Icon name="check" size={16} /> {p.seats}</li>
                {p.extras.map((e) => (
                  <li key={e}><Icon name="check" size={16} /> {e}</li>
                ))}
              </ul>
              <Link
                href={p.id === "enterprise" ? "mailto:beta@miyoglobal.com" : "/auth/sign-up?as=company"}
                className={p.featured ? "btn btn-gold btn-block" : "btn btn-block"}
              >
                {p.id === "enterprise" ? "Talk to us" : p.id === "free" ? "Start free" : `Choose ${p.name}`}
              </Link>
            </article>
          );
        })}
      </div>
      <div className="banner">
        <Icon name="plus" />
        <span>
          <strong>Extra unlock {addon[cur]}</strong> each, on any plan. Unused plan unlocks don&apos;t roll over.
        </span>
      </div>
    </div>
  );
}
