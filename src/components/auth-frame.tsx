import Link from "next/link";
import { Logo } from "./ui";

export function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth">
      <aside className="auth-aside">
        <Logo />
        <p className="auth-quote">Show the work. Reveal the name when both sides say yes.</p>
        <p className="auth-meta">Hyderabad and Ras Al Khaimah</p>
      </aside>
      <div className="auth-pane">
        <header className="auth-top">
          <Logo />
        </header>
        <main id="main" className="auth-main">
          <div className="auth-card">{children}</div>
        </main>
        <footer className="auth-foot">
          <span>© 2026 MIYO Global · Beta</span>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/recruitment">Recruitment notice</Link>
        </footer>
      </div>
    </div>
  );
}
