"use client";

import Link from "next/link";
import { useState } from "react";
import { Success } from "@/components/states";
import { Icon } from "@/components/ui";

export function RoleWizard({ initial }: { initial: number }) {
  const [step, setStep] = useState(initial);
  const [r, setR] = useState({
    title: "Senior Platform Engineer",
    city: "Hyderabad",
    mode: "Hybrid",
    cur: "INR",
    min: "35",
    max: "45",
    notice: "60 days or less",
    skills: ["Go", "Kubernetes", "PostgreSQL"],
    criteria: ["Has run services at scale in production", "Pay expectation inside the band", "Can join within 60 days"],
    prompts: ["Walk us through a system you designed end to end.", "What would you change in your current platform?"],
  });
  const [skill, setSkill] = useState("");
  const set = (k: keyof typeof r, v: unknown) => setR({ ...r, [k]: v });
  const band = r.cur === "INR" ? `₹${r.min}–${r.max} LPA` : `AED ${r.min},000–${r.max},000 / mo`;

  if (step === 4)
    return (
      <Success icon="briefcase" title="Role published" body={`MIYO-HYD-0420 · ${r.title} is live. Matching pitches will appear in your deck within the hour.`}>
        <Link href="/r/deck" className="btn btn-gold">Open the deck</Link>
        <Link href="/r/roles" className="btn">All roles</Link>
      </Success>
    );

  return (
    <div className="stack" style={{ ["--gap" as string]: "24px", maxWidth: 840 }}>
      <ol className="steps" aria-label="Steps">
        {["Role and pay", "Stack and prompts", "Review and publish"].map((s, i) => (
          <li key={s} className={i + 1 < step ? "on" : i + 1 === step ? "now" : ""} aria-current={i + 1 === step ? "step" : undefined}>{i + 1}. {s}</li>
        ))}
      </ol>
      {step === 1 && (
        <section className="card stack" aria-label="Role and pay">
          <div className="field"><label htmlFor="t">Role title</label><input id="t" value={r.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div className="cols-2">
            <div className="field"><label htmlFor="c">Location</label><select id="c" value={r.city} onChange={(e) => set("city", e.target.value)}><option>Hyderabad</option><option>Ras Al Khaimah</option><option>Dubai</option></select></div>
            <div className="field"><label htmlFor="m">Work mode</label><select id="m" value={r.mode} onChange={(e) => set("mode", e.target.value)}><option>Hybrid</option><option>On-site</option><option>Remote</option></select></div>
          </div>
          <fieldset className="stack" style={{ ["--gap" as string]: "8px" }}>
            <legend>Pay band</legend>
            <div className="seg" role="group" aria-label="Currency" style={{ width: "fit-content" }}>
              {["INR", "AED"].map((c) => <button type="button" key={c} aria-pressed={r.cur === c} onClick={() => set("cur", c)}>{c}</button>)}
            </div>
            <div className="cols-2">
              <div className="field"><label htmlFor="min">Minimum ({r.cur === "INR" ? "lakh per year" : "thousand per month"})</label><input id="min" inputMode="numeric" value={r.min} onChange={(e) => set("min", e.target.value)} /></div>
              <div className="field"><label htmlFor="max">Maximum ({r.cur === "INR" ? "lakh per year" : "thousand per month"})</label><input id="max" inputMode="numeric" value={r.max} onChange={(e) => set("max", e.target.value)} /></div>
            </div>
            <p className="hint">Candidates see In-Band, Stretch or Out-of-Band against this band. Exact numbers are shared only after a match.</p>
          </fieldset>
          <div className="field"><label htmlFor="n">Notice period</label><select id="n" value={r.notice} onChange={(e) => set("notice", e.target.value)}><option>Immediate</option><option>30 days or less</option><option>60 days or less</option><option>90 days or less</option></select></div>
        </section>
      )}
      {step === 2 && (
        <section className="card stack" aria-label="Stack and prompts">
          <div className="field">
            <label htmlFor="sk">Required skills</label>
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <input id="sk" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Add a skill" />
              <button type="button" className="btn" onClick={() => (skill.trim() && set("skills", [...r.skills, skill.trim()]), setSkill(""))}><Icon name="plus" /> Add</button>
            </div>
            <div className="row">{r.skills.map((s) => (
              <button type="button" key={s} className="chip" aria-label={`Remove ${s}`} onClick={() => set("skills", r.skills.filter((x) => x !== s))}>{s} <Icon name="x" size={12} /></button>
            ))}</div>
          </div>
          <fieldset className="stack" style={{ ["--gap" as string]: "8px" }}>
            <legend>Three fit criteria</legend>
            <p className="hint">These make up the fit score candidates are ranked by.</p>
            {r.criteria.map((c, i) => (
              <div key={i} className="field"><label htmlFor={`cr${i}`} className="mono muted">Criterion {i + 1}</label><input id={`cr${i}`} value={c} onChange={(e) => set("criteria", r.criteria.map((x, n) => (n === i ? e.target.value : x)))} /></div>
            ))}
          </fieldset>
          <fieldset className="stack" style={{ ["--gap" as string]: "8px" }}>
            <legend>Role-specific pitch prompts</legend>
            {r.prompts.map((c, i) => (
              <div key={i} className="field"><label htmlFor={`pr${i}`} className="mono muted">Prompt {i + 1} · 20 seconds</label><input id={`pr${i}`} value={c} onChange={(e) => set("prompts", r.prompts.map((x, n) => (n === i ? e.target.value : x)))} /></div>
            ))}
          </fieldset>
        </section>
      )}
      {step === 3 && (
        <section className="card stack" aria-label="Review">
          <div className="row between"><p className="label">Role ID on publish</p><span className="mono gold">MIYO-HYD-0420</span></div>
          <h2 style={{ fontSize: 32 }}>{r.title}</h2>
          <dl className="stack small" style={{ margin: 0, ["--gap" as string]: "8px" }}>
            {[["Location", `${r.city} · ${r.mode}`], ["Pay band", band], ["Notice", r.notice], ["Skills", r.skills.join(", ")], ["Criteria", r.criteria.join(" · ")], ["Prompts", r.prompts.join(" · ")]].map(([k, v]) => (
              <div key={k} className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}><dt className="muted" style={{ minWidth: 96 }}>{k}</dt><dd style={{ margin: 0 }}>{v}</dd></div>
            ))}
          </dl>
          <div className="banner"><Icon name="info" /><span>Publishing is free. Each match request you send uses 1 unlock. You have 3 free unlocks left this month.</span></div>
          <label className="check small"><input type="checkbox" defaultChecked /> I confirm this role follows the MIYO equal-opportunity policy.</label>
        </section>
      )}
      <div className="row between">
        {step > 1 ? <button className="btn btn-ghost" onClick={() => setStep(step - 1)}><Icon name="left" size={16} /> Back</button> : <Link href="/r/roles" className="btn btn-ghost">Cancel</Link>}
        <div className="row">
          {step === 3 && <Link href="/r/roles" className="btn">Save as draft</Link>}
          <button className={step === 3 ? "btn btn-gold" : "btn btn-primary"} onClick={() => setStep(step + 1)}>{step === 3 ? "Publish role" : "Continue"}</button>
        </div>
      </div>
    </div>
  );
}
