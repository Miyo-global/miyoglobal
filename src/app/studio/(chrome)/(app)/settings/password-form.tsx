"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useUi } from "../../ui";

export function PasswordForm({ email }: { email: string }) {
  const ui = useUi();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setBusy(true);
    setError("");
    const { error: err } = await authClient.changePassword({
      currentPassword: String(d.get("current")),
      newPassword: String(d.get("next")),
      revokeOtherSessions: true,
    });
    setBusy(false);
    if (err) return setError("Could not change password. Check your current password.");
    ui.toast("Password changed");
    form.reset();
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Change password</h2>
      <input type="text" name="username" autoComplete="username" value={email} readOnly hidden />
      <div className="grid-2">
        <div className="field"><label htmlFor="pw-current">Current password</label><input id="pw-current" name="current" type="password" required autoComplete="current-password" maxLength={128} /></div>
        <div className="field"><label htmlFor="pw-next">New password (12+ characters)</label><input id="pw-next" name="next" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></div>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn primary" disabled={busy}>Change password</button>
    </form>
  );
}
