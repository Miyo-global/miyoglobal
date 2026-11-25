"use client";

import Link from "next/link";
import { useState } from "react";
import { RESUME_ACCEPT, RESUME_TYPES, resumeProblem } from "@/lib/resume";
import { useSearch } from "@/lib/use-search";
import { Button } from "./ui/button";
import { Check, Field, Select } from "./ui/field";

type Option = { ref: string; title: string; slug: string };
type State = { kind: "idle" | "sending" | "err" | "done"; text: string };

const POLICY = "/documents/MIYO_Global_Referral_Policy_2026.pdf";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function Group({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-rule-strong pt-6 md:col-span-2">
      <h3 className="text-h3">{title}</h3>
      <p className="mt-1 text-small text-muted">{text}</p>
    </div>
  );
}

/**
 * Referral form: the same JSON contract /api/referral has always taken (base64 resume, honeypot `website`, rate limited).
 * ?jobId=<ref> (or the older ?job=<ref>) preselects a role, which is how "Refer for ₹15,000" on each job page links here.
 * The role picker is a filter box over a native select, so it stays keyboard and screen-reader friendly with 100+ roles.
 */
export function ReferralForm({ roles }: { roles: Option[] }) {
  const [state, setState] = useState<State>({ kind: "idle", text: "" });
  const [file, setFile] = useState<File | null>(null);
  const [picked, setJob] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const search = useSearch();
  const fromUrl = (search.get("jobId") ?? search.get("job") ?? "").toUpperCase();
  const job = picked ?? (roles.some((r) => r.ref === fromUrl) ? fromUrl : "");

  const words = filter.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = (r: Option) => words.every((w) => `${r.ref} ${r.title}`.toLowerCase().includes(w));
  const matching = roles.filter(hit).length;
  // The chosen role stays in the list while filtering, so the select never loses its value.
  const visible = roles.filter((r) => hit(r) || r.ref === job);
  const cvError = state.kind === "err" && resumeProblem(file) ? state.text : undefined;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const problem = resumeProblem(file);
    if (problem || !file) {
      setState({ kind: "err", text: problem ?? "Attach the candidate's CV." });
      form.querySelector<HTMLInputElement>("#rf-cv")?.focus();
      return;
    }
    const data = new FormData(form);
    const v = (k: string) => String(data.get(k) ?? "").trim();
    const role = roles.find((r) => r.ref === v("jobId"));
    setState({ kind: "sending", text: "Sending your referral…" });
    try {
      const ext = file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "docx";
      const payload = {
        referrerName: v("referrerName"),
        referrerContact: v("referrerContact"),
        referrerPhone: v("referrerPhone"),
        candidateName: v("candidateName"),
        candidateEmail: v("candidateEmail"),
        candidatePhone: v("candidatePhone"),
        jobApplied: role?.title ?? "",
        jobId: v("jobId"),
        jobDescription: role ? `${window.location.origin}/jobs/${role.slug}` : "",
        resumeBase64: await toBase64(file),
        resumeMimeType: RESUME_TYPES[ext],
        resumeFileName: file.name,
        website: v("website"),
      };
      const res = await fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json: { status?: string; message?: string } = await res.json().catch(() => ({}));
      if (res.ok && json.status === "success") setState({ kind: "done", text: role ? `${role.title} (${role.ref})` : "" });
      else setState({ kind: "err", text: json.message ? `${json.message}.` : "The referral did not go through. Email it to staffing@miyoglobal.com instead." });
    } catch {
      setState({ kind: "err", text: "No connection. Check your network and send the referral again." });
    }
  }

  if (state.kind === "done") {
    return (
      <div className="rounded-card border border-ok bg-surface p-6 md:p-8" role="status">
        <h3 className="text-h3">Referral received</h3>
        <p className="mt-2 text-muted">
          Thank you. Your candidate is logged against {state.text || "the role you chose"}. We screen every referral the same way and will email you when their
          status changes.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-6 md:grid-cols-2" onSubmit={onSubmit} aria-describedby="rf-status">
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <Group title="Your details" text="You are the referrer. The reward is paid to you." />
      <Field id="rf-rn" name="referrerName" label="Your name" type="text" autoComplete="name" maxLength={120} />
      <Field id="rf-re" name="referrerContact" label="Your email" type="email" autoComplete="email" maxLength={160} />
      <Field id="rf-rp" name="referrerPhone" label="Your phone" hint="10 digits" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[0-9]{10}" maxLength={10} />

      <Group title="Candidate" text="Tell the candidate you are referring them before you submit." />
      <Field id="rf-cn" name="candidateName" label="Candidate name" type="text" maxLength={120} />
      <Field id="rf-ce" name="candidateEmail" label="Candidate email" type="email" maxLength={160} />
      <Field id="rf-cp" name="candidatePhone" label="Candidate phone" hint="10 digits" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} />

      <div className="grid gap-4 md:col-span-2 md:grid-cols-2 md:gap-x-6">
        <Field
          id="rf-find"
          label="Find a role"
          type="search"
          required={false}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Ref or title, e.g. DM065 or Workday"
          autoComplete="off"
          aria-controls="rf-job"
          disabled={!roles.length}
          hint={filter ? `${matching} of ${roles.length} roles match` : `Narrows the list of ${roles.length} open roles`}
        />
        <Select id="rf-job" name="jobId" label="Role" value={job} onChange={(e) => setJob(e.target.value)} disabled={!roles.length}>
          <option value="" disabled>
            {!roles.length ? "Open roles are unavailable right now" : filter ? `${matching} matching roles` : `Choose one of ${roles.length} open roles`}
          </option>
          {visible.map((r) => (
            <option key={r.ref} value={r.ref}>
              {r.ref} · {r.title}
            </option>
          ))}
        </Select>
        <p className="sr-only" aria-live="polite">
          {filter ? `${matching} roles match` : ""}
        </p>
      </div>

      <Field
        id="rf-cv"
        name="cv"
        label="Candidate CV"
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
      <Check id="rf-policy" name="policy" value="yes" required className="md:col-span-2">
        I have read and agree to the{" "}
        <a href={POLICY} target="_blank" rel="noopener" className="link">
          Referral Policy 2026
        </a>
        , and the candidate has agreed to be referred. Their details are handled under the{" "}
        <Link href="/privacy-policy" className="link">
          Privacy Policy
        </Link>
        .
      </Check>
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <Button type="submit" disabled={state.kind === "sending" || !roles.length}>
          {state.kind === "sending" ? "Sending…" : "Send referral"}
        </Button>
        <p id="rf-status" className={state.kind === "err" ? "text-small text-error" : "text-small text-muted"} role="status" aria-live="polite">
          {cvError ? "" : state.text}
        </p>
      </div>
    </form>
  );
}
