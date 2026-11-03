"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SetupTwoFactorPage() {
  const router = useRouter();
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function start(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(e.currentTarget).get("password"));
    const { data, error: err } = await authClient.twoFactor.enable({ password });
    setBusy(false);
    if (err || data?.method !== "totp") return setError("Could not start setup. Check your password.");
    setQr(await QRCode.toDataURL(data.totpURI, { margin: 1, width: 200 }));
    setSecret(new URL(data.totpURI).searchParams.get("secret") ?? "");
    setCodes(data.backupCodes);
  }

  async function confirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const code = String(new FormData(e.currentTarget).get("code")).trim();
    const { error: err } = await authClient.twoFactor.verifyTotp({ code });
    setBusy(false);
    if (err) return setError("Invalid code");
    router.replace("/");
  }

  if (!qr) {
    return (
      <main className="auth-card">
        <h1>Set up two-factor</h1>
        <p>Two-factor authentication is required for Studio access.</p>
        <form onSubmit={start}>
          <label>
            Confirm your password
            <input name="password" type="password" autoComplete="current-password" required maxLength={128} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" disabled={busy}>Continue</button>
        </form>
      </main>
    );
  }

  return (
    <main className="auth-card">
      <h1>Scan and confirm</h1>
      <Image src={qr} alt="Authenticator QR code" width={200} height={200} unoptimized />
      <p className="muted">Or enter this key manually: <code>{secret}</code></p>
      <p>Save these backup codes somewhere safe:</p>
      <pre className="codes">{codes.join("\n")}</pre>
      <form onSubmit={confirm}>
        <label>
          6-digit code
          <input name="code" required inputMode="numeric" maxLength={6} autoComplete="one-time-code" />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={busy}>Enable</button>
      </form>
    </main>
  );
}
