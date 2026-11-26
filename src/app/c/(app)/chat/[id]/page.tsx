import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatThread } from "@/components/chat";
import { ReportModal } from "@/components/states";
import { Icon, Sample } from "@/components/ui";
import { company, thread } from "@/data/fixtures";

export const metadata: Metadata = { title: "Chat" };

export default async function Thread({ params }: { params: Promise<{ id: string }> }) {
  const t = thread((await params).id);
  if (!t) notFound();
  const c = company(t.company)!;
  return (
    <div style={{ maxWidth: 840 }} className="stack">
      <header className="row between" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 16 }}>
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <Link href="/c/chat" className="btn btn-ghost btn-icon" aria-label="Back to chats"><Icon name="left" /></Link>
          <img src={c.img} alt="" className="avatar" width={40} height={40} />
          <div>
            <h1 style={{ fontSize: 24, fontFamily: "var(--f-sans)", fontWeight: 600, letterSpacing: 0 }}>{c.name}</h1>
            <p className="muted small">{t.person} · {t.role}</p>
          </div>
        </div>
        <div className="row">
          <Link href="/c/schedule/m-2" className="btn"><Icon name="calendar" /> Schedule</Link>
          <ReportModal who={c.name} trigger={<Icon name="flag" label="Report" />} />
        </div>
      </header>
      <ChatThread initial={t.messages} hoursLeft={t.hoursLeft} />
      <Sample />
    </div>
  );
}
