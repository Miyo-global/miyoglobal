"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { verifyOtp } from "@/app/actions";
import { Icon } from "@/components/ui";

export function Otp({ role, email, isNew, next }: { role: string; email: string; isNew: boolean; next?: string }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [state, setState] = useState<"idle" | "error" | "ok" | "busy">("idle");
  const [wait, setWait] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const submit = async (code: string) => {
    setState("busy");
    const res = await verifyOtp(role, code, isNew, next);
    if (!res.ok) {
      setState("error");
      setDigits(Array(6).fill(""));
      refs.current[0]?.focus();
      return;
    }
    setState("ok");
    setTimeout(() => router.push(res.next ?? "/"), 900);
  };

  const put = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "");
    if (clean.length > 1) {
      const all = clean.slice(0, 6).split("");
      const d = Array(6).fill("").map((_, n) => all[n] ?? "");
      setDigits(d);
      refs.current[Math.min(all.length, 5)]?.focus();
      if (all.length === 6) submit(all.join(""));
      return;
    }
    const d = [...digits];
    d[i] = clean;
    setDigits(d);
    if (state === "error") setState("idle");
    if (clean && i < 5) refs.current[i + 1]?.focus();
    if (d.every(Boolean)) submit(d.join(""));
  };

  if (state === "ok")
    return (
      <div className="stack" style={{ textAlign: "center", display: "grid", justifyItems: "center" }} role="status">
        <span className="ico" style={{ borderColor: "var(--gold)" }}><Icon name="check" size={24} /></span>
        <h1>You&apos;re verified</h1>
        <p className="muted">Taking you {isNew ? "to set up your account" : "to your dashboard"}…</p>
      </div>
    );

  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <header className="stack" style={{ ["--gap" as string]: "8px", textAlign: "center" }}>
        <h1>Check your email</h1>
        <p className="muted">
          We sent a 6-digit code to <strong style={{ color: "var(--ink)" }}>{email || "your email"}</strong>.
        </p>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (digits.every(Boolean)) submit(digits.join(""));
        }}
        className="stack"
      >
        <fieldset>
          <legend className="sr">Verification code</legend>
          <div className="otp" data-state={state}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={d}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${i + 1}`}
                aria-invalid={state === "error" ? true : undefined}
                aria-describedby={state === "error" ? "otp-err" : "otp-hint"}
                onChange={(e) => put(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus();
                }}
                autoFocus={i === 0}
              />
            ))}
          </div>
        </fieldset>
        {state === "error" ? (
          <p id="otp-err" className="field-error" role="alert">That code is incorrect. Check the email and try again.</p>
        ) : (
          <p id="otp-hint" className="hint">Demo code: 123456. The code expires in 10 minutes.</p>
        )}
        <button className="btn btn-primary btn-block" disabled={!digits.every(Boolean) || state === "busy"}>
          {state === "busy" ? "Verifying…" : "Verify"}
        </button>
      </form>
      <div className="row between small">
        {wait > 0 ? (
          <span className="mono muted">Resend in 00:{String(wait).padStart(2, "0")}</span>
        ) : (
          <button className="btn-link" onClick={() => setWait(30)}>Resend code</button>
        )}
        <Link href={isNew ? "/auth/sign-up" : "/auth/log-in"}>Change email</Link>
      </div>
    </div>
  );
}
