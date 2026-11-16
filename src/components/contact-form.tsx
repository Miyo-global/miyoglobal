"use client";

import { useState } from "react";

type Note = { text: string; kind?: "ok" | "err" };

/** Contact form: posts multipart form data to /api/contact, with the same checks and messages as the old static page. */
export function ContactForm() {
  const [note, setNote] = useState<Note>({ text: "" });

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

  return (
    <form id="cform" className="reveal cform" method="post" action="/api/contact" onSubmit={onSubmit}>
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="field"><label htmlFor="n">Name</label><input id="n" name="name" required /></div>
      <div className="field"><label htmlFor="e">Work email</label><input id="e" name="email" type="email" required /></div>
      <div className="field"><label htmlFor="c">Company</label><input id="c" name="company" /></div>
      <div className="field"><label htmlFor="ph">Phone (optional)</label><input id="ph" name="phone" /></div>
      <div className="field full"><label htmlFor="m">What do you need?</label><textarea id="m" name="message" rows={5} placeholder="Roles, volumes, timelines, target markets…" required></textarea></div>
      <button className="btn btn-navy" type="submit">Send enquiry</button>
      <p className={`form-note${note.kind ? ` ${note.kind}` : ""}`} id="fnote" role="status" aria-live="polite">{note.text}</p>
    </form>
  );
}
