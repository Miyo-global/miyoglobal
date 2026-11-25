"use client";

import Link from "next/link";
import { useState } from "react";
import { RESUME_ACCEPT, resumeProblem } from "@/lib/resume";
import { Button } from "../ui/button";
import { Check, Field, Select, TextArea } from "../ui/field";

type State = { kind: "idle" | "sending" | "err" | "done"; text: string };

const NOTICE = ["Immediately available", "15 days or less", "30 days", "60 days", "90 days"];

/** Direct application for one role: multipart POST to /api/apply (same-origin, honeypot, rate limited). */
export function ApplyForm({ refCode, title }: { refCode: string; title: string }) {
  const [state, setState] = useState<State>({ kind: "idle", text: "" });
  const [file, setFile] = useState<File | null>(null);
  const cvError = state.kind === "err" && resumeProblem(file) ? state.text : undefined;

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
      <div className="rounded-card border border-ok bg-surface p-6 md:p-8" role="status">
        <h3 className="text-h3">Application received</h3>
        <p className="mt-2 text-muted">
          Your application for {title} (<span className="num">{refCode}</span>) is with our talent desk. We reply within <span className="num">2</span> working days.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-6 md:grid-cols-2" onSubmit={onSubmit} aria-describedby="ap-status">
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="ref" value={refCode} />
      <input type="hidden" name="title" value={title} />

      <Field id="ap-name" name="name" label="Full name" type="text" autoComplete="name" maxLength={120} />
      <Field id="ap-email" name="email" label="Email" type="email" autoComplete="email" maxLength={160} />
      <Field id="ap-phone" name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" minLength={7} maxLength={20} pattern="[0-9+()\- ]{7,20}" />
      <Field id="ap-li" name="linkedin" label="LinkedIn profile" optional type="url" inputMode="url" placeholder="https://www.linkedin.com/in/…" maxLength={200} />
      <Select id="ap-notice" name="notice" label="Notice period" defaultValue="">
        <option value="" disabled>
          Choose one
        </option>
        {NOTICE.map((n) => (
          <option key={n}>{n}</option>
        ))}
      </Select>
      <Field id="ap-ctc" name="ctc" label="Current CTC" optional hint="For example 18 LPA" type="text" maxLength={40} />
      <Field
        id="ap-cv"
        name="cv"
        label="CV"
        type="file"
        accept={RESUME_ACCEPT}
        hint="PDF or DOCX, up to 3 MB"
        error={cvError}
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setState({ kind: "idle", text: "" });
        }}
        className="md:col-span-2"
      />
      <TextArea id="ap-note-field" name="note" label="Anything we should know?" optional rows={4} maxLength={2000} placeholder="Preferred location, relevant projects, availability for a call" className="md:col-span-2" />
      <Check id="ap-consent" name="consent" value="yes" required className="md:col-span-2">
        I agree that MIYO Global may store and process my details to assess me for this and similar roles, under the{" "}
        <Link href="/privacy-policy" className="link">
          Privacy Policy
        </Link>{" "}
        (GDPR and India&apos;s DPDP Act). My details go to a client only with my consent.
      </Check>
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <Button type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : "Send application"}
        </Button>
        <p id="ap-status" className={state.kind === "err" ? "text-small text-error" : "text-small text-muted"} role="status" aria-live="polite">
          {state.kind === "err" && cvError ? "" : state.text}
        </p>
      </div>
    </form>
  );
}
