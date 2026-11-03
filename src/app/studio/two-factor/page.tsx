"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TwoFactorPage() {
  const router = useRouter();
  const [backup, setBackup] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const code = String(new FormData(e.currentTarget).get("code")).trim();
    const { error: err } = backup
      ? await authClient.twoFactor.verifyBackupCode({ code })
      : await authClient.twoFactor.verifyTotp({ code });
    setBusy(false);
    if (err) return setError("Invalid code");
    router.replace("/");
  }

  return (
    <main className="auth-card">
      <h1>Two-factor check</h1>
      <form onSubmit={submit}>
        <label>
          {backup ? "Backup code" : "6-digit code"}
          <input
            name="code"
            required
            autoComplete="one-time-code"
            inputMode={backup ? "text" : "numeric"}
            maxLength={backup ? 24 : 6}
          />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "Checking…" : "Verify"}</button>
        <button type="button" className="link" onClick={() => setBackup(!backup)}>
          {backup ? "Use authenticator code" : "Use a backup code"}
        </button>
      </form>
    </main>
  );
}
