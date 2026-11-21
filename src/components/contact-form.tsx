"use client";

import { useState } from "react";

type Note = { text: string; kind?: "ok" | "err" };

/** Presentation only: the fields, names, ids, checks, endpoint and messages are identical in both variants. */
const STYLES = {
  page: {
    form: "reveal cform",
    field: "field",
    full: "field full",
    label: undefined,
    input: undefined,
    button: "btn btn-navy",
    note: "form-note",
  },
  ledger: {
    form: "grid grid-cols-1 gap-x-6 gap-y-6 font-sans text-ink md:grid-cols-2",
    field: "flex flex-col gap-2",
    full: "flex flex-col gap-2 md:col-span-2",
    label: "text-eyebrow font-medium uppercase text-ink-meta",
    input:
      "min-h-12 w-full rounded-none border-0 border-b border-rule-light bg-transparent px-0 py-2 text-body text-ink outline-none transition-colors duration-[var(--duration-fast)] placeholder:text-ink-meta focus:border-b-2 focus:border-ink",
    button: "min-h-[3.25rem] justify-self-start rounded-control bg-accent-deep px-8 text-label font-medium uppercase text-on-dark md:col-span-2",
    note: "min-h-6 text-body md:col-span-2",
  },
} as const;

/** Contact form: posts multipart form data to /api/contact, with the same checks and messages as the old static page. */
export function ContactForm({ variant = "page" }: { variant?: keyof typeof STYLES }) {
  const [note, setNote] = useState<Note>({ text: "" });
  const s = STYLES[variant];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"));
    const invalid = !value("name") ? "name" : !emailOk ? "email" : !value("message") ? "message" : null;
    if (invalid) {
      setNote({ kind: "err", text: invalid === "name" ? "Please add your name." : invalid === "email" ? "Please use a valid work email." : "Please tell us what you need." });
      (form.elements.namedItem(invalid) as HTMLElement).focus();
      return;
    }
    setNote({ text: "Sending…" });
    try {
      const res = await fetch(form.action, { method: "POST", body: data, headers: { "X-Requested-With": "fetch" } });
      const json: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setNote({ kind: "ok", text: "Thanks — we will be in touch shortly." });
        form.reset();
      } else {
        setNote({ kind: "err", text: json.error || "Something went wrong. Please email staffing@miyoglobal.com." });
      }
    } catch {
      setNote({ kind: "err", text: "Network error. Please email staffing@miyoglobal.com directly." });
    }
  }

  const noteKind = variant === "page" ? (note.kind ? ` ${note.kind}` : "") : note.kind === "err" ? " text-danger" : note.kind === "ok" ? " text-ink" : " text-ink-muted";

  return (
    <form id="cform" className={s.form} method="post" action="/api/contact" onSubmit={onSubmit}>
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={variant === "ledger" ? { position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 } : undefined} />
      <div className={s.field}><label className={s.label} htmlFor="n">Name</label><input className={s.input} id="n" name="name" required /></div>
      <div className={s.field}><label className={s.label} htmlFor="e">Work email</label><input className={s.input} id="e" name="email" type="email" required /></div>
      <div className={s.field}><label className={s.label} htmlFor="c">Company</label><input className={s.input} id="c" name="company" /></div>
      <div className={s.field}><label className={s.label} htmlFor="ph">Phone (optional)</label><input className={s.input} id="ph" name="phone" /></div>
      <div className={s.full}><label className={s.label} htmlFor="m">What do you need?</label><textarea className={s.input} id="m" name="message" rows={5} placeholder="Roles, volumes, timelines, target markets…" required></textarea></div>
      <button className={s.button} type="submit">Send enquiry</button>
      <p className={`${s.note}${noteKind}`} id="fnote" role="status" aria-live="polite">{note.text}</p>
    </form>
  );
}
