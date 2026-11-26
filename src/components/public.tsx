import Link from "next/link";
import { Logo } from "./ui";
import { RoleChoiceModal } from "./role-choice";

const nav = [
  ["/#how", "How it works"],
  ["/#candidates", "For candidates"],
  ["/#companies", "For companies"],
  ["/pricing", "Pricing"],
];

export function PublicHeader() {
  return (
    <header className="pub-head">
      <div className="wrap">
        <Logo />
        <nav className="pub-nav" aria-label="Main">
          {nav.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="pub-actions">
          <Link href="/auth/log-in" className="btn btn-ghost hide-sm">
            Sign in
          </Link>
          <RoleChoiceModal />
        </div>
      </div>
      <nav className="mnav hide-lg" aria-label="Mobile">
        <div className="row" style={{ overflowX: "auto", flexWrap: "nowrap", gap: 0 }}>
          {[...nav, ["/auth/log-in", "Sign in"]].map(([href, label]) => (
            <Link key={href} href={href} className="tab" style={{ borderBottom: 0 }}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="cols-4">
          <div className="stack">
            <Logo />
            <p className="muted small measure">Video-first, blind-first hiring for India and the UAE. This beta runs on sample data.</p>
          </div>
          <div>
            <p className="eyebrow">Product</p>
            <ul>
              <li><Link href="/#how">How it works</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/get-started">Join the beta</Link></li>
              <li><Link href="/states">System states</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Desks</p>
            <ul>
              <li>Hyderabad, Telangana</li>
              <li>Ras Al Khaimah, UAE</li>
              <li>Hours 09:00–18:00 IST / GST</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Legal</p>
            <ul>
              <li><Link href="/legal/privacy">Privacy notice</Link></li>
              <li><Link href="/legal/terms">Terms of use</Link></li>
              <li><Link href="/legal/recruitment">Recruitment notice</Link></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 MIYO Global. Beta build with fictional sample data. Not for production use.</span>
          <span className="mono">BETA · NOINDEX</span>
        </div>
      </div>
    </footer>
  );
}

export function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main id="main">{children}</main>
      <PublicFooter />
    </>
  );
}
