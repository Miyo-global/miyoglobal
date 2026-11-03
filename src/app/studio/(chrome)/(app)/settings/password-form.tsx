"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function PasswordForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const { error } = await authClient.changePassword({
      currentPassword: String(d.get("current")),
      newPassword: String(d.get("next")),
      revokeOtherSessions: true,
    });
    setMsg(error ? { ok: false, text: "Could not change password" } : { ok: true, text: "Password changed" });
    if (!error) form.reset();
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Change password</h2>
      <label>Current password<input name="current" type="password" required autoComplete="current-password" maxLength={128} /></label>
      <label>New password (12+ characters)<input name="next" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></label>
      {msg && <p className={msg.ok ? "ok" : "error"} role="status">{msg.text}</p>}
      <button className="btn">Change password</button>
    </form>
  );
}
