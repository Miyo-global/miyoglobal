import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth-frame";
import { AdminLogInForm } from "@/components/forms";
import { Icon } from "@/components/ui";

export const metadata: Metadata = { title: "Admin sign in" };

export default function AdminLogin() {
  return (
    <AuthFrame>
      <div className="stack" style={{ ["--gap" as string]: "24px" }}>
        <header className="stack" style={{ ["--gap" as string]: "8px", textAlign: "center" }}>
          <p className="eyebrow">Staff only</p>
          <h1>Admin console</h1>
          <p className="muted">Sign in with your staff account and a second factor.</p>
        </header>
        <AdminLogInForm />
        <p className="banner small"><Icon name="shield" /> Every admin action is recorded in the audit log with your name and IP address.</p>
      </div>
    </AuthFrame>
  );
}
