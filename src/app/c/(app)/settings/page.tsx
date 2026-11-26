import type { Metadata } from "next";
import { Flash, Toggle } from "@/components/client";
import { ConfirmDestructive, LanguagePicker } from "@/components/states";
import { Icon, PageHead, Sample } from "@/components/ui";
import { demoAccounts } from "@/data/fixtures";

export const metadata: Metadata = { title: "Settings" };

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="card stack" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} style={{ fontSize: 24 }}>{title}</h2>
      {children}
    </section>
  );
}

export default function Settings() {
  return (
    <div style={{ maxWidth: 1080 }}>
      <PageHead eyebrow="Settings" title="Account and privacy" />
      <div className="split" style={{ alignItems: "start" }}>
        <div className="stack" style={{ ["--gap" as string]: "24px" }}>
          <Section id="account" title="Account">
            <div className="cols-2">
              <div className="field"><label htmlFor="name">Full name</label><input id="name" defaultValue="Ananya Rao" /></div>
              <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" defaultValue={demoAccounts.candidate.email} /></div>
              <div className="field"><label htmlFor="phone">Mobile</label><input id="phone" type="tel" defaultValue="+91 98480 12345" /></div>
              <div className="field"><label htmlFor="portfolio">Portfolio URL</label><input id="portfolio" type="url" placeholder="https://" /></div>
            </div>
            <Flash><button className="btn btn-primary" style={{ width: "fit-content" }}>Save changes</button></Flash>
          </Section>
          <Section id="privacy" title="Privacy">
            <Toggle label="Blind mode" hint="Companies see only your first initial until you accept a match." on />
            <Toggle label="Hide me from my current employer" hint="Companies on the domain you add won't see your card." on />
            <Toggle label="Show me to companies in the UAE" on />
            <Toggle label="Show me to companies in India" on />
            <Toggle label="Pause my profile" hint="Take your card out of every deck until you turn this off." />
          </Section>
          <Section id="notifications" title="Notifications">
            <Toggle label="Match requests" hint="Email and push" on />
            <Toggle label="Messages and video questions" hint="Email and push" on />
            <Toggle label="Reminders before a match expires" on />
            <Toggle label="Weekly profile insights" />
          </Section>
          <Section id="language" title="Language and region">
            <div className="row between">
              <span>App language</span>
              <LanguagePicker />
            </div>
            <div className="row between">
              <span>Time zone</span>
              <span className="mono">IST · UTC+05:30</span>
            </div>
          </Section>
        </div>
        <aside className="stack" style={{ ["--gap" as string]: "16px" }}>
          <section className="card stack" aria-labelledby="data-h">
            <h2 id="data-h" style={{ fontSize: 24 }}>Your data</h2>
            <p className="muted small">Download a copy of your profile, pitch transcript and match history, or delete everything.</p>
            <a className="btn" download="miyo-my-data.json" href={`data:application/json,${encodeURIComponent(JSON.stringify({ name: "Ananya Rao", exported: "26 Nov 2026", note: "Beta sample export" }, null, 2))}`}>
              <Icon name="download" /> Download my data
            </a>
            <ConfirmDestructive
              trigger={<><Icon name="trash" /> Delete my data</>}
              title="Delete all your data?"
              body="This permanently deletes your profile, video pitch, transcript, matches and messages within 30 days. Companies you matched with keep only what you already shared. This can't be undone."
              confirm="Delete everything"
            />
          </section>
          <section className="card card-sunk stack small">
            <strong>Signed in on 2 devices</strong>
            <p className="muted">Chrome on macOS · Hyderabad · now</p>
            <p className="muted">Mobile app · Hyderabad · 24 Nov 2026</p>
          </section>
        </aside>
      </div>
      <Sample />
    </div>
  );
}
