import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="auth">
      <div className="auth-card">
        <Image src="/images/logo-web.png" alt="MIYO Global" width={89} height={48} priority className="auth-logo" />
        <h1>Sign in to Studio</h1>
        <p className="muted">Manage posts, media and authors for miyoglobal.com.</p>
        <LoginForm />
      </div>
    </main>
  );
}
