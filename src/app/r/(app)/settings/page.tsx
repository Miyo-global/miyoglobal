import type { Metadata } from "next";
import { Flash, Toggle } from "@/components/client";
import { ConfirmDestructive, LanguagePicker } from "@/components/states";
import { Icon, PageHead, Sample } from "@/components/ui";

export const metadata: Metadata = { title: "Company settings" };

export default function RSettings() {
  return (
    <div style={{ maxWidth: 960 }}>
      <PageHead eyebrow="Settings" title="Company settings" />
      <div className="stack" style={{ ["--gap" as string]: "24px" }}>
        <section className="card stack" aria-labelledby="p">
          <h2 id="p" style={{ fontSize: 24 }}>Profile</h2>
          <div className="cols-2">
            <div className="field"><label htmlFor="dn">Display name</label><input id="dn" defaultValue="Northbridge Systems" /></div>
            <div className="field"><label htmlFor="wd">Work domain</label><input id="wd" defaultValue="northbridge.demo" readOnly aria-describedby="wd-h" /><p id="wd-h" className="hint">Verified 02 Nov 2026. Contact support to change.</p></div>
          </div>
          <div className="row between"><span>Language</span><LanguagePicker /></div>
          <Flash><button className="btn btn-primary" style={{ width: "fit-content" }}>Save</button></Flash>
        </section>
        <section className="card stack" aria-labelledby="n">
          <h2 id="n" style={{ fontSize: 24 }}>Notifications</h2>
          <Toggle label="New mutual matches" on />
          <Toggle label="Candidate replies and video answers" on />
          <Toggle label="Match expiring in 6 hours" hint="Protects your Reliability score." on />
          <Toggle label="Weekly hiring summary" />
        </section>
        <section className="card stack" aria-labelledby="s">
          <h2 id="s" style={{ fontSize: 24 }}>Security</h2>
          <Toggle label="Require multi-factor authentication (MFA) for all seats" hint="Authenticator app or passkey." on />
          <Toggle label="Sign out idle sessions after 8 hours" on />
          <div className="row between"><span>Single sign-on (SSO)</span><span className="chip">Enterprise plan</span></div>
        </section>
        <section className="card stack" aria-labelledby="i">
          <h2 id="i" style={{ fontSize: 24 }}>Integrations</h2>
          <div className="row between" style={{ flexWrap: "nowrap" }}>
            <span className="row" style={{ flexWrap: "nowrap" }}><span className="ico" style={{ width: 44, height: 44 }}><Icon name="link" /></span><span><strong>MIYO ATS sync</strong><span className="muted small" style={{ display: "block" }}>Send matched candidates to your applicant tracking system. Available on Team plan.</span></span></span>
            <button className="btn" disabled>Coming soon</button>
          </div>
        </section>
        <section className="card stack" aria-labelledby="d" style={{ borderLeft: "2px solid var(--error)" }}>
          <h2 id="d" style={{ fontSize: 24 }}>Close workspace</h2>
          <p className="muted small">Closes all roles, ends every open match and deletes chats after 30 days.</p>
          <ConfirmDestructive trigger="Close workspace" title="Close the Northbridge workspace?" body="All roles close and every open match ends. Candidates are told politely. This can't be undone." confirm="Close workspace" />
        </section>
      </div>
      <Sample />
    </div>
  );
}
