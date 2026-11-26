import type { Metadata } from "next";
import Link from "next/link";
import { BlockCompany, ConfirmDestructive, DeckLoading, ErrorPanel, LanguagePicker, MatchCelebration, ReportModal, SkeletonTable, SkeletonVideo, Success } from "@/components/states";
import { Empty } from "@/components/ui";

export const metadata: Metadata = { title: "System states" };

function Group({ id, title, note, children }: { id: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <section id={id} className="stack" style={{ ["--gap" as string]: "24px" }} aria-labelledby={`${id}-h`}>
      <div className="stack" style={{ ["--gap" as string]: "8px" }}>
        <h2 id={`${id}-h`}>{title}</h2>
        <p className="muted">{note}</p>
      </div>
      {children}
    </section>
  );
}

export default function States() {
  return (
    <div className="wrap section stack" style={{ ["--gap" as string]: "64px" }}>
      <header className="stack" style={{ maxWidth: 720 }}>
        <p className="eyebrow">System states</p>
        <h1>Every empty, loading, error and success state.</h1>
        <p className="lede">Each state also appears in context inside the apps. This page collects them for review.</p>
        <nav className="row small" aria-label="Jump to">
          {["empty", "loading", "error", "success", "modals"].map((s) => (
            <a key={s} href={`#${s}`} className="chip">{s}</a>
          ))}
        </nav>
      </header>

      <Group id="empty" title="Empty" note="Shown when there's nothing to display yet.">
        <div className="cols-3">
          <div className="dark card"><Empty icon="deck" title="You've seen everyone" body="No more pitches match this role and filters. Widen the filters or check back tomorrow."><Link href="/r/deck" className="btn">Edit filters</Link></Empty></div>
          <Empty icon="match" title="No matches yet" body="When a company requests a match, it appears here with a 48-hour timer." />
          <Empty icon="chat" title="No conversations" body="Chats open after a mutual match. Accept a request to start one." />
          <Empty icon="bell" title="You're all caught up" body="New match requests, messages and reminders will appear here." />
          <Empty icon="briefcase" title="No open roles" body="Create your first role to start receiving blind pitches."><Link href="/r/roles/new" className="btn btn-primary">Create role</Link></Empty>
          <Empty icon="check" title="All clear" body="The moderation queue is empty. New videos land here for review." />
        </div>
      </Group>

      <Group id="loading" title="Loading" note="Skeletons hold layout while data loads.">
        <div className="cols-3">
          <SkeletonVideo />
          <div style={{ gridColumn: "span 2" }}><SkeletonTable /></div>
        </div>
        <div className="dark card"><DeckLoading /></div>
      </Group>

      <Group id="error" title="Errors" note="Errors say what happened and what to do next. They never rely on colour alone.">
        <div className="row">
          <Link href="/states/missing-page" className="btn">Open 404 screen</Link>
          <Link href="/states/500" className="btn">Open 500 screen</Link>
          <Link href="/offline" className="btn">Open offline screen</Link>
        </div>
        <div className="cols-2">
          <ErrorPanel icon="video" title="Camera or microphone blocked" body="Allow camera and microphone access in your browser settings, then reload. You can also upload a video instead.">
            <Link href="/c/onboarding/record?denied=1" className="btn">See in recorder</Link>
          </ErrorPanel>
          <ErrorPanel icon="upload" title="Upload failed" body="Your connection dropped at 64%. Your recording is safe on this device.">
            <Link href="/c/onboarding/preview?state=error" className="btn">See in upload flow</Link>
          </ErrorPanel>
          <ErrorPanel icon="play" title="Playback failed" body="This pitch couldn't load. Check your connection and retry." />
          <ErrorPanel icon="lock" title="Session expired" body="For your security we signed you out after 8 hours. Sign in again to continue.">
            <Link href="/auth/log-in?expired=1" className="btn">See on sign-in</Link>
          </ErrorPanel>
        </div>
      </Group>

      <Group id="success" title="Success" note="Calm confirmation with one clear next step.">
        <div className="card"><MatchCelebration who="Mohammed A." href="/r/chat/rt-1" /></div>
        <div className="cols-2">
          <Success icon="video" title="Video published" body="Your pitch passed review and is now in company decks." />
          <Success icon="calendar" title="Interview booked" body="Wed 03 Dec 2026, 14:00 GST (15:30 IST). A calendar invite is on its way." />
          <Success icon="card" title="Payment received" body="Growth plan active. 50 unlocks are available now." />
          <Success icon="briefcase" title="Role published" body="MIYO-HYD-0412 is live and in candidate feeds." />
        </div>
      </Group>

      <Group id="modals" title="Modals and sheets" note="Open each to review.">
        <div className="row">
          <ConfirmDestructive trigger="Confirm destructive" title="Delete this role?" body="MIYO-RAK-0419 and its 0 applicants will be removed. This can't be undone." confirm="Delete role" />
          <ReportModal who="this candidate" trigger="Report candidate" />
          <BlockCompany name="Sandstone Retail Group" />
          <LanguagePicker />
        </div>
      </Group>
    </div>
  );
}
