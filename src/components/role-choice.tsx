import Link from "next/link";
import { Modal } from "./client";
import { Icon, type IconName } from "./ui";

const choices: { href: string; icon: IconName; title: string; body: string; cta: string }[] = [
  { href: "/auth/sign-up?as=candidate", icon: "user", title: "Candidate", body: "Record a 60-second pitch. Stay anonymous until you choose to reveal yourself. Always free.", cta: "Join as a candidate" },
  { href: "/auth/sign-up?as=company", icon: "building", title: "Company", body: "Verify your work domain, open a role and swipe blind video pitches. 5 free unlocks a month.", cta: "Join as a company" },
  { href: "/admin/login", icon: "shield", title: "Admin sign in", body: "For MIYO staff only. Requires an authenticator code or passkey.", cta: "Go to admin console" },
];

export function RoleChoice() {
  return (
    <div className="cols-3">
      {choices.map((c) => (
        <Link key={c.title} href={c.href} className="card stack" style={{ textDecoration: "none", display: "grid", alignContent: "start" }}>
          <span className="ico">
            <Icon name={c.icon} />
          </span>
          <h3>{c.title}</h3>
          <p className="muted">{c.body}</p>
          <span className="gold row" style={{ ["--gap" as string]: "8px", fontWeight: 500 }}>
            {c.cta} <Icon name="right" size={16} />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function RoleChoiceModal({ label = "Join the beta", className = "btn btn-gold" }: { label?: string; className?: string }) {
  return (
    <Modal trigger={label} triggerClass={className} title="How will you use MIYO?">
      <p className="muted">Pick one. You can switch between demo roles at any time.</p>
      <div style={{ display: "grid", gap: 12 }}>
        {choices.map((c) => (
          <Link key={c.title} href={c.href} className="card row" style={{ textDecoration: "none", padding: 16, flexWrap: "nowrap" }}>
            <span className="ico" style={{ width: 44, height: 44 }}>
              <Icon name={c.icon} />
            </span>
            <span className="item-body">
              <strong>{c.title}</strong>
              <span className="muted small" style={{ display: "block" }}>
                {c.body}
              </span>
            </span>
            <Icon name="right" />
          </Link>
        ))}
      </div>
      <Link href="/get-started" className="btn-link small" style={{ justifySelf: "start" }}>
        Open as a full page
      </Link>
    </Modal>
  );
}
