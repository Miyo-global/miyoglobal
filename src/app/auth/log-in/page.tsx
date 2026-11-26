import type { Metadata } from "next";
import Link from "next/link";
import { switchRole } from "@/app/actions";
import { LogInForm } from "@/components/forms";
import { Icon } from "@/components/ui";

export const metadata: Metadata = { title: "Sign in" };

export default async function LogIn({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <header className="stack" style={{ ["--gap" as string]: "8px", textAlign: "center" }}>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to your candidate or company account.</p>
      </header>
      {sp.expired && (
        <div className="banner banner-err" role="alert">
          <Icon name="lock" />
          <span><strong>Session expired.</strong> For your security we signed you out. Sign in again to continue.</span>
        </div>
      )}
      {sp.signed_out && (
        <div className="banner" role="status">
          <Icon name="check" />
          <span>You&apos;re signed out.</span>
        </div>
      )}
      {sp.next && !sp.expired && (
        <div className="banner" role="status">
          <Icon name="info" />
          <span>Sign in as the demo {sp.as === "recruiter" ? "company" : "candidate"} to open that page.</span>
        </div>
      )}
      <LogInForm next={sp.next} />
      <p className="small muted" style={{ textAlign: "center" }}>
        New to MIYO? <Link href="/get-started">Create an account</Link>
      </p>
      <form action={switchRole} className="card card-sunk stack" style={{ ["--gap" as string]: "12px" }}>
        <p className="label">Demo shortcut · skips OTP</p>
        <div className="cols-3" style={{ ["--gap" as string]: "8px" }}>
          <button className="btn" name="role" value="candidate">Candidate</button>
          <button className="btn" name="role" value="recruiter">Company</button>
          <button className="btn" name="role" value="admin">Admin</button>
        </div>
      </form>
    </div>
  );
}
