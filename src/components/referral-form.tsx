"use client";

import Link from "next/link";
import { useState } from "react";
import { RESUME_ACCEPT, RESUME_TYPES, resumeProblem } from "@/lib/resume";
import { useSearch } from "@/lib/use-search";

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

/**
 * Referral form: the same JSON contract /api/referral has always taken (base64 resume, honeypot, 5 per IP per 10 minutes).
 * ?job=<ref> preselects a role, which is how the "Refer for ₹15,000" button on each job page links here.
 */
export function ReferralForm({ roles }: { roles: Option[] }) {
  const [state, setState] = useState<State>({ kind: "idle", text: "" });
  const [file, setFile] = useState<File | null>(null);
  const [picked, setJob] = useState<string | null>(null);
  const fromUrl = useSearch().get("job")?.toUpperCase() ?? "";
  const job = picked ?? (roles.some((r) => r.ref === fromUrl) ? fromUrl : "");

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
      <div className="ed-done" role="status">
        <h3>Referral received</h3>
        <p>
          Thank you. Your candidate is logged against {state.text || "the role you chose"}. We screen every referral the same way and will
          email you when their status changes.
        </p>
      </div>
    );
  }

  return (
    <form className="ed-form" onSubmit={onSubmit} aria-describedby="rf-note">
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="group">
        <h3>Your details</h3>
        <p>You are the referrer. The reward is paid to you.</p>
      </div>
      <div className="ed-field">
        <label htmlFor="rf-rn">Your name</label>
        <input id="rf-rn" name="referrerName" type="text" autoComplete="name" required maxLength={120} />
      </div>
      <div className="ed-field">
        <label htmlFor="rf-re">Your email</label>
        <input id="rf-re" name="referrerContact" type="email" autoComplete="email" required maxLength={160} />
      </div>
      <div className="ed-field">
        <label htmlFor="rf-rp">
          Your phone <span className="hint">(10 digits)</span>
        </label>
        <input id="rf-rp" name="referrerPhone" type="tel" inputMode="numeric" autoComplete="tel-national" required pattern="[0-9]{10}" maxLength={10} />
      </div>

      <div className="group">
        <h3>Candidate</h3>
        <p>Tell the candidate you are referring them before you submit.</p>
      </div>
      <div className="ed-field">
        <label htmlFor="rf-cn">Candidate name</label>
        <input id="rf-cn" name="candidateName" type="text" required maxLength={120} />
      </div>
      <div className="ed-field">
        <label htmlFor="rf-ce">Candidate email</label>
        <input id="rf-ce" name="candidateEmail" type="email" required maxLength={160} />
      </div>
      <div className="ed-field">
        <label htmlFor="rf-cp">
          Candidate phone <span className="hint">(10 digits)</span>
        </label>
        <input id="rf-cp" name="candidatePhone" type="tel" inputMode="numeric" required pattern="[0-9]{10}" maxLength={10} />
      </div>
      <div className="ed-field">
        <label htmlFor="rf-job">Role</label>
        <select id="rf-job" name="jobId" required value={job} onChange={(e) => setJob(e.target.value)} disabled={!roles.length}>
          <option value="" disabled>
            {roles.length ? `Choose one of ${roles.length} open roles` : "Open roles are unavailable right now"}
          </option>
          {roles.map((r) => (
            <option key={r.ref} value={r.ref}>
              {r.ref} · {r.title}
            </option>
          ))}
        </select>
      </div>
      <div className="ed-field full">
        <span className="ed-legend" id="rf-cv-label">
          Candidate CV
        </span>
        <label className="ed-file">
          <input id="rf-cv" name="cv" type="file" accept={RESUME_ACCEPT} required aria-labelledby="rf-cv-label rf-cv-name" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5M12 17v-6M9 14l3-3 3 3" /></svg>
          <span id="rf-cv-name">
            <b>{file ? file.name : "Choose a file or drop it here"}</b>
            <span>PDF or DOCX, up to 3 MB</span>
          </span>
        </label>
      </div>
      <label className="ed-consent full">
        <input type="checkbox" name="policy" value="yes" required />
        <span>
          I have read and agree to the{" "}
          <a href={POLICY} target="_blank" rel="noopener">
            Referral Policy 2026
          </a>
          , and the candidate has agreed to be referred. Their details are handled under the <Link href="/privacy-policy">Privacy Policy</Link>.
        </span>
      </label>
      <div className="ed-submit full">
        <button className="ed-btn dark" type="submit" disabled={state.kind === "sending" || !roles.length}>
          {state.kind === "sending" ? "Sending…" : "Send referral"}
        </button>
        <p id="rf-note" className={`ed-note${state.kind === "err" ? " err" : ""}`} role="status" aria-live="polite">
          {state.text}
        </p>
      </div>
    </form>
  );
}
