import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/forms";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUp({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  const as = (await searchParams).as === "company" ? "company" : "candidate";
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <nav className="tabs" aria-label="Account type">
        <Link href="/auth/sign-up?as=candidate" className="tab" aria-current={as === "candidate" ? "page" : undefined} style={{ flex: 1, justifyContent: "center" }}>Candidate</Link>
        <Link href="/auth/sign-up?as=company" className="tab" aria-current={as === "company" ? "page" : undefined} style={{ flex: 1, justifyContent: "center" }}>Company</Link>
      </nav>
      <header className="stack" style={{ ["--gap" as string]: "8px", textAlign: "center" }}>
        <p className="eyebrow">{as === "company" ? "For companies" : "For candidates · always free"}</p>
        <h1>{as === "company" ? "Start hiring blind" : "Create your profile"}</h1>
        <p className="muted">{as === "company" ? "5 free unlocks every month. No card needed." : "Record one 60-second pitch. Stay anonymous until you say yes."}</p>
      </header>
      <SignUpForm as={as} />
      <p className="small muted" style={{ textAlign: "center" }}>
        Already have an account? <Link href="/auth/log-in">Sign in</Link>
      </p>
    </div>
  );
}
