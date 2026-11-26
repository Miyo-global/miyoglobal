import Link from "next/link";
import type { ReactNode } from "react";
import { Modal } from "./client";
import { Icon, type IconName } from "./ui";

export function DeckLoading() {
  return (
    <div className="stack" style={{ display: "grid", justifyItems: "center", padding: "48px 0" }} role="status" aria-live="polite">
      <div className="drift" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="mono muted">Shuffling the deck…</p>
    </div>
  );
}

export function SkeletonVideo() {
  return (
    <div className="card stack" aria-busy="true" aria-label="Loading video card">
      <div className="skel" style={{ aspectRatio: "9 / 16", maxHeight: 360 }} />
      <div className="skel" style={{ height: 20, width: "60%" }} />
      <div className="skel" style={{ height: 14, width: "40%" }} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="table-wrap" aria-busy="true" aria-label="Loading table">
      <table>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i}>
              {[30, 20, 25, 15].map((w, j) => (
                <td key={j}>
                  <div className="skel" style={{ height: 14, width: `${w * 3}%` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Burst() {
  return (
    <div className="burst" aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} style={{ transform: `rotate(${i * 22.5}deg) translateY(28px)`, animationDelay: `${i * 20}ms` }} />
      ))}
    </div>
  );
}

export function MatchCelebration({ who, href }: { who: string; href: string }) {
  return (
    <div className="stack" style={{ display: "grid", justifyItems: "center", textAlign: "center", ["--gap" as string]: "16px" }}>
      <Burst />
      <p className="eyebrow">Mutual match · {who}</p>
      <h2>It&apos;s a match. 48 hours to reply.</h2>
      <p className="muted measure">Identities are now revealed to both sides. Send a message or two video questions before the timer runs out.</p>
      <Link href={href} className="btn btn-gold">
        Open chat <Icon name="right" size={16} />
      </Link>
    </div>
  );
}

export function Success({ icon = "check", title, body, children }: { icon?: IconName; title: string; body: string; children?: ReactNode }) {
  return (
    <div className="card stack" style={{ display: "grid", justifyItems: "center", textAlign: "center", padding: 48 }} role="status">
      <span className="ico" style={{ borderColor: "var(--gold)" }}>
        <Icon name={icon} size={24} />
      </span>
      <h2 style={{ fontSize: 32 }}>{title}</h2>
      <p className="muted measure">{body}</p>
      {children && <div className="row" style={{ justifyContent: "center" }}>{children}</div>}
    </div>
  );
}

export function ErrorPanel({ icon = "alert", title, body, children }: { icon?: IconName; title: string; body: string; children?: ReactNode }) {
  return (
    <div className="card stack" style={{ borderLeft: "2px solid var(--error)" }} role="alert">
      <div className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
        <span className="err"><Icon name={icon} /></span>
        <div className="stack" style={{ ["--gap" as string]: "8px" }}>
          <h3>{title}</h3>
          <p className="muted">{body}</p>
          {children && <div className="row">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export function ConfirmDestructive({ trigger = "Delete", title, body, confirm }: { trigger?: ReactNode; title: string; body: string; confirm: string }) {
  return (
    <Modal trigger={trigger} triggerClass="btn" title={title}>
      <p className="muted">{body}</p>
      <form method="dialog" className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn">Cancel</button>
        <button className="btn btn-danger">{confirm}</button>
      </form>
    </Modal>
  );
}

export function ReportModal({ who, trigger = "Report" }: { who: string; trigger?: ReactNode }) {
  return (
    <Modal trigger={trigger} triggerClass="btn btn-ghost" title={`Report ${who}`}>
      <form method="dialog" className="stack">
        <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
          <legend>What&apos;s wrong?</legend>
          {["Asked for contact details before a match", "Inappropriate content", "Misleading information", "Something else"].map((r, i) => (
            <label key={r} className="check">
              <input type="radio" name="reason" defaultChecked={i === 0} /> {r}
            </label>
          ))}
        </fieldset>
        <div className="field">
          <label htmlFor="report-note">Details (optional)</label>
          <textarea id="report-note" />
        </div>
        <p className="hint">Our trust desk reviews reports within 24 hours. The other side isn&apos;t told who reported them.</p>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn" value="cancel">Cancel</button>
          <button className="btn btn-primary">Send report</button>
        </div>
      </form>
    </Modal>
  );
}

export function BlockCompany({ name }: { name: string }) {
  return (
    <Modal trigger={<><Icon name="ban" /> Block company</>} triggerClass="btn btn-ghost" title={`Block ${name}?`}>
      <p className="muted">{name} won&apos;t see your pitch or be able to send you match requests. Any open match will close. You can unblock them in Settings.</p>
      <form method="dialog" className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn">Cancel</button>
        <button className="btn btn-danger">Block</button>
      </form>
    </Modal>
  );
}

export function LanguagePicker() {
  return (
    <Modal trigger={<><Icon name="globe" /> English (India)</>} triggerClass="btn" title="Choose a language">
      <form method="dialog" className="stack" style={{ ["--gap" as string]: "0" }}>
        {["English (India)", "English (UAE)", "हिन्दी", "తెలుగు", "العربية"].map((l, i) => (
          <label key={l} className="check" style={{ borderBottom: "1px solid var(--line)" }}>
            <input type="radio" name="lang" defaultChecked={i === 0} /> <span lang={i === 2 ? "hi" : i === 3 ? "te" : i === 4 ? "ar" : "en"}>{l}</span>
          </label>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 16 }}>Save language</button>
      </form>
    </Modal>
  );
}
