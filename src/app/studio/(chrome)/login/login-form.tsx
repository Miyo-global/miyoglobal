"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const { error: err } = await authClient.signIn.email({
      email: String(data.get("email")),
      password: String(data.get("password")),
    });
    if (err) {
      setBusy(false);
      return setError(err.status === 429 ? "Too many attempts. Try again in 15 minutes." : "Invalid email or password");
    }
    // Full load so the new session cookie is used for the first Studio render.
    window.location.replace("/");
  }

  const invalid = error ? true : undefined;
  return (
    <form onSubmit={submit}>
      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={invalid} aria-describedby={error ? "login-error" : undefined} />
      </div>
      <div className="field">
        <label htmlFor="login-password">Password</label>
        <div className="input-affix">
          <input id="login-password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required maxLength={128} aria-invalid={invalid} aria-describedby={error ? "login-error" : undefined} />
          <button type="button" className="affix" aria-controls="login-password" aria-pressed={show} onClick={() => setShow((s) => !s)}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {error && <p className="error" role="alert" id="login-error">{error}</p>}
      <button className="btn primary block" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
