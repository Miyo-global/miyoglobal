import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatThread } from "@/components/chat";
import { Icon, Sample } from "@/components/ui";
import { candidate, recruiterThreads, type Msg } from "@/data/fixtures";

export const metadata: Metadata = { title: "Chat" };

export default async function RThread({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const th = recruiterThreads.find((x) => x.id === id);
  if (!th) notFound();
  const c = candidate(th.candidate)!;
  const first = c.name.split(" ")[0];
  const msgs: Msg[] = [
    { from: "me", kind: "text", text: `Hi ${first}, thanks for matching with us for ${th.role}.`, at: "25 Nov 2026, 10:02 GST" },
    { from: "me", kind: "video", text: "What does a good on-call rotation look like to you?", at: "25 Nov 2026, 10:03 GST", meta: "0:20 video question" },
    { from: "me", kind: "video", text: "Tell us about the hardest outage you've handled.", at: "25 Nov 2026, 10:03 GST", meta: "0:20 video question" },
    { from: "them", kind: "video", text: "Answer: on-call rotations", at: "26 Nov 2026, 09:40 GST", meta: "0:20 video reply" },
    { from: "them", kind: "file", text: `${first} - portfolio summary.pdf`, at: "26 Nov 2026, 09:41 GST", meta: "PDF · 310 KB" },
    { from: "them", kind: "text", text: th.last, at: "26 Nov 2026, 09:42 GST" },
  ];
  return (
    <div style={{ maxWidth: 840 }} className="stack">
      <header className="row between" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 16 }}>
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <Link href="/r/chat" className="btn btn-ghost btn-icon" aria-label="Back to chats"><Icon name="left" /></Link>
          <img src={c.img} alt="" className="avatar" width={40} height={40} />
          <div>
            <h1 style={{ fontSize: 24, fontFamily: "var(--f-sans)", fontWeight: 600, letterSpacing: 0 }}>{c.name}</h1>
            <p className="muted small">{c.title} · {th.role} · Matched</p>
          </div>
        </div>
        <Link href="/r/schedule" className="btn"><Icon name="calendar" /> Schedule</Link>
      </header>
      <ChatThread initial={msgs} hoursLeft={29} recruiter />
      <Sample />
    </div>
  );
}
