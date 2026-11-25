"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { Field, TextArea } from "@/components/ui/field";
import { preferredCall, SLOTS, workingDays, ZONES } from "@/views/contact/slots";

type Errors = Partial<Record<"name" | "email" | "message" | "slot", string>>;
type Status = { text: string; kind?: "ok" | "err" };

const PICKER_FIELDS = ["call-tz", "call-day", "call-time"];
const noop = () => () => {};

/** A radio drawn as a hairline chip; the native input stays in the tab order (visually hidden) so arrow keys work. */
function Choice({ id, name, value, checked, onChange, children, mono }: { id?: string; name: string; value: string; checked: boolean; onChange: (v: string) => void; children: React.ReactNode; mono?: boolean }) {
  return (
    <label
      className={cx(
        "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-control border border-rule-strong bg-surface px-4 text-small text-ink transition-colors duration-150 ease-brand hover:border-ink",
        "has-checked:border-ink has-checked:bg-ink has-checked:text-on-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-text",
        mono && "num",
      )}
    >
      <input id={id} type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {children}
    </label>
  );
}

/** Enquiry form: posts multipart data to /api/contact (name, email, company, phone, message, honeypot website). A chosen call slot is appended to the message. */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ text: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [zone, setZone] = useState<string>("IST");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  // Dates exist only on the client: the server snapshot is null, so hydration matches and the days fill in after mount.
  const today = useSyncExternalStore(noop, () => new Date().toDateString(), () => null);
  const days = today ? workingDays(new Date(today)) : [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const next: Errors = {};
    if (!value("name")) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) next.email = "Please use a valid work email.";
    if (!value("message")) next.message = "Please tell us what you need.";
    if (day && !time) next.slot = "Choose a time for the call, or set the day back to no preference.";
    setErrors(next);
    const first = (["name", "email", "message", "slot"] as const).find((k) => next[k]);
    if (first) {
      setStatus({ kind: "err", text: "Please check the highlighted fields." });
      document.getElementById(first === "slot" ? "cf-slot-first" : `cf-${first}`)?.focus();
      return;
    }

    PICKER_FIELDS.forEach((k) => data.delete(k));
    if (day && time) data.set("message", `${value("message")}\n\n${preferredCall(day, time, zone)}`);

    setSending(true);
    setStatus({ text: "Sending your enquiry…" });
    try {
      const res = await fetch("/api/contact", { method: "POST", body: data, headers: { "X-Requested-With": "fetch" } });
      const json: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus({ kind: "ok", text: "" });
        setSent(true);
      } else {
        setStatus({ kind: "err", text: json.error || "Something went wrong. Please email staffing@miyoglobal.com." });
      }
    } catch {
      setStatus({ kind: "err", text: "Network error. Please email staffing@miyoglobal.com directly." });
    } finally {
      setSending(false);
    }
  }

  if (sent)
    return (
      <div ref={(el) => el?.focus()} tabIndex={-1} role="status" className="border-t-2 border-accent pt-6 outline-none">
        <h2 className="text-h3">Thank you. Your enquiry is with us.</h2>
        <p className="mt-4 max-w-measure text-muted">
          We will be in touch shortly{day && time ? `, and we will confirm your preferred call (${day}, ${time} ${zone}) by email` : ""}.
        </p>
        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => {
            setSent(false);
            setDay("");
            setTime("");
            setStatus({ text: "" });
          }}
        >
          Send another enquiry
        </Button>
      </div>
    );

  return (
    <form method="post" action="/api/contact" noValidate onSubmit={onSubmit} aria-labelledby="cf-title">
      <h2 id="cf-title" className="text-h3">
        Send an enquiry
      </h2>
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field id="cf-name" name="name" label="Name" autoComplete="name" maxLength={120} error={errors.name} />
        <Field id="cf-email" name="email" type="email" label="Work email" autoComplete="email" maxLength={160} error={errors.email} />
        <Field id="cf-company" name="company" label="Company" autoComplete="organization" maxLength={160} optional />
        <Field id="cf-phone" name="phone" type="tel" label="Phone" autoComplete="tel" maxLength={40} optional />
        <TextArea id="cf-message" name="message" label="What do you need?" rows={5} maxLength={3800} placeholder="Roles, volumes, timelines, target markets…" error={errors.message} className="sm:col-span-2" />
      </div>

      <fieldset className="mt-12" aria-describedby="cf-call-hint">
        <legend className="w-full border-t border-rule pt-6 text-body font-semibold text-ink">
          Book a 20-minute call <span className="font-normal text-muted">(optional)</span>
        </legend>
        <p id="cf-call-hint" className="mt-2 text-small text-muted">
          Pick a time that suits you, 10:00 to 17:40 office time. This is a preference, not a booking: we confirm the call by email.
        </p>

        <fieldset className="mt-6">
          <legend className="meta text-muted">Time zone</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {ZONES.map((z) => (
              <Choice key={z.id} name="call-tz" value={z.id} checked={zone === z.id} onChange={setZone}>
                {z.label}
              </Choice>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="meta text-muted">Day</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <Choice
              name="call-day"
              value=""
              checked={day === ""}
              onChange={() => {
                setDay("");
                setTime("");
              }}
            >
              No preference
            </Choice>
            {days.map((d) => (
              <Choice key={d.value} name="call-day" value={d.value} checked={day === d.value} onChange={setDay}>
                {d.label}
              </Choice>
            ))}
          </div>
        </fieldset>

        {day && (
          <fieldset className="mt-6" aria-describedby={errors.slot ? "cf-slot-error" : undefined}>
            <legend className="meta text-muted">Time ({zone})</legend>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {SLOTS.map((s, i) => (
                <Choice key={s} id={i === 0 ? "cf-slot-first" : undefined} name="call-time" value={s} checked={time === s} onChange={setTime} mono>
                  {s}
                </Choice>
              ))}
            </div>
            {errors.slot && (
              <p id="cf-slot-error" role="alert" className="mt-3 text-small text-error">
                {errors.slot}
              </p>
            )}
          </fieldset>
        )}
      </fieldset>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <Button type="submit" disabled={sending}>
          {sending ? "Sending…" : "Send enquiry"}
        </Button>
        <p role="status" aria-live="polite" className={cx("text-small", status.kind === "err" ? "text-error" : "text-muted")}>
          {status.text}
        </p>
      </div>
    </form>
  );
}
