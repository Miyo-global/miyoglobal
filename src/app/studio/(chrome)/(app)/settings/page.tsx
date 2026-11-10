import type { Metadata } from "next";
import { requireStaff } from "@/server/guards";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const me = await requireStaff();
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="muted">Your account details and password.</p>
        </div>
      </div>
      <div className="card">
        <h2>Account</h2>
        <dl className="facts">
          <dt>Name</dt><dd>{me.name}</dd>
          <dt>Email</dt><dd>{me.email}</dd>
          <dt>Role</dt><dd><span className="pill">{me.role}</span></dd>
        </dl>
      </div>
      <PasswordForm email={me.email} />
    </>
  );
}
