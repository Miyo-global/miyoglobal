import type { Metadata } from "next";
import Link from "next/link";
import { RoleChoice } from "@/components/role-choice";

export const metadata: Metadata = { title: "Get started" };

export default function GetStarted() {
  return (
    <div className="wrap section stack" style={{ ["--gap" as string]: "48px" }}>
      <header className="stack" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Join the beta</p>
        <h1>How will you use MIYO?</h1>
        <p className="lede">Pick a path. You can switch between demo roles at any time from the app menu.</p>
      </header>
      <RoleChoice />
      <p className="muted small">
        Already have an account? <Link href="/auth/log-in">Sign in</Link>
      </p>
    </div>
  );
}
