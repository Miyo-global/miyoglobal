import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui";

export const metadata: Metadata = { title: "Reset your password" };

export default async function Forgot({ searchParams }: { searchParams: Promise<{ sent?: string; email?: string }> }) {
  const sp = await searchParams;
  if (sp.sent)
    return (
      <div className="stack" style={{ textAlign: "center", display: "grid", justifyItems: "center", ["--gap" as string]: "16px" }}>
        <span className="ico"><Icon name="mail" size={24} /></span>
        <h1>Check your inbox</h1>
        <p className="muted">If an account exists for {sp.email || "that email"}, we&apos;ve sent a reset link. It expires in 30 minutes.</p>
        <Link href="/auth/reset" className="btn btn-primary btn-block">Open reset link (demo)</Link>
        <Link href="/auth/log-in" className="small">Back to sign in</Link>
      </div>
    );
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <header className="stack" style={{ ["--gap" as string]: "8px", textAlign: "center" }}>
        <h1>Forgot your password?</h1>
        <p className="muted">Enter your email and we&apos;ll send you a reset link.</p>
      </header>
      <form className="stack">
        <input type="hidden" name="sent" value="1" />
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <button className="btn btn-primary btn-block">Send reset link</button>
      </form>
      <Link href="/auth/log-in" className="small" style={{ textAlign: "center" }}>Back to sign in</Link>
    </div>
  );
}
