import { requireStaff } from "@/server/guards";
import { PasswordForm } from "./password-form";

export default async function SettingsPage() {
  const me = await requireStaff();
  return (
    <>
      <h1>Settings</h1>
      <div className="card">
        <h2>Account</h2>
        <p>{me.name} · {me.email} · {me.role}</p>
      </div>
      <PasswordForm />
    </>
  );
}
