"use client";

import Link from "next/link";
import { useState } from "react";
import { RESUME_ACCEPT, resumeProblem } from "@/lib/resume";

type State = { kind: "idle" | "sending" | "err" | "done"; text: string };

const NOTICE = ["Immediately available", "15 days or less", "30 days", "60 days", "90 days"];

/** Direct application for one role: multipart POST to /api/apply (same-origin, honeypot, rate limited). */
export function ApplyForm({ refCode, title }: { refCode: string; title: string }) {
  const [state, setState] = useState<State>({ kind: "idle", text: "" });
  const [file, setFile] = useState<File | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const problem = resumeProblem(file);
    if (problem) {
      setState({ kind: "err", text: problem });
      form.querySelector<HTMLInputElement>("#ap-cv")?.focus();
      return;
    }
    setState({ kind: "sending", text: "Sending your application…" });
    try {
      const res = await fetch("/api/apply", { method: "POST", body: new FormData(form) });
      const json: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (res.ok && json.ok) setState({ kind: "done", text: "" });
      else setState({ kind: "err", text: json.error || "Your application did not go through. Email it to staffing@miyoglobal.com instead." });
    } catch {
      setState({ kind: "err", text: "No connection. Check your network and send the application again." });
    }
  }

  if (state.kind === "done") {
    return (
      <div className="ed-done" role="status">
        <h3>Application received</h3>
        <p>
          Your application for {title} (<span className="num">{refCode}</span>) is with our talent desk. We reply within two working days.
        </p>
      </div>
    );
  }

  return (
    <form className="ed-form" onSubmit={onSubmit} noValidate={false} aria-describedby="ap-note">
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="ref" value={refCode} />
      <input type="hidden" name="title" value={title} />

      <div className="ed-field">
        <label htmlFor="ap-name">Full name</label>
        <input id="ap-name" name="name" type="text" autoComplete="name" required maxLength={120} />
      </div>
      <div className="ed-field">
        <label htmlFor="ap-email">Email</label>
        <input id="ap-email" name="email" type="email" autoComplete="email" required maxLength={160} />
      </div>
      <div className="ed-field">
        <label htmlFor="ap-phone">Phone</label>
        <input id="ap-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required minLength={7} maxLength={20} pattern="[0-9+()\- ]{7,20}" />
      </div>
      <div className="ed-field">
        <label htmlFor="ap-li">
          LinkedIn profile <span className="hint">(optional)</span>
        </label>
        <input id="ap-li" name="linkedin" type="url" inputMode="url" placeholder="https://www.linkedin.com/in/…" maxLength={200} />
      </div>
      <div className="ed-field">
        <label htmlFor="ap-notice">Notice period</label>
        <select id="ap-notice" name="notice" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {NOTICE.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className="ed-field">
        <label htmlFor="ap-ctc">
          Current CTC <span className="hint">(optional, e.g. 18 LPA)</span>
        </label>
        <input id="ap-ctc" name="ctc" type="text" maxLength={40} />
      </div>
      <div className="ed-field full">
        <span className="ed-legend" id="ap-cv-label">
          CV
        </span>
        <label className="ed-file">
          <input id="ap-cv" name="cv" type="file" accept={RESUME_ACCEPT} required aria-labelledby="ap-cv-label ap-cv-name" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5M12 17v-6M9 14l3-3 3 3" /></svg>
          <span id="ap-cv-name">
            <b>{file ? file.name : "Choose a file or drop it here"}</b>
            <span>PDF or DOCX, up to 3 MB</span>
          </span>
        </label>
      </div>
      <div className="ed-field full">
        <label htmlFor="ap-note-field">
          Anything we should know? <span className="hint">(optional)</span>
        </label>
        <textarea id="ap-note-field" name="note" rows={4} maxLength={2000} placeholder="Preferred location, relevant projects, availability for a call…" />
      </div>
      <label className="ed-consent full">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          I agree that MIYO Global may store and process my details to assess me for this and similar roles, under the{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> (GDPR and India&apos;s DPDP Act). My details go to a client only with my consent.
        </span>
      </label>
      <div className="ed-submit full">
        <button className="ed-btn dark" type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : "Send application"}
        </button>
        <p id="ap-note" className={`ed-note${state.kind === "err" ? " err" : ""}`} role="status" aria-live="polite">
          {state.text}
        </p>
      </div>
    </form>
  );
}
