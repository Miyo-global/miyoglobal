import type { Metadata } from "next";
import Link from "next/link";
import { Empty, PageHead, Sample } from "@/components/ui";
import { company, threads } from "@/data/fixtures";

export const metadata: Metadata = { title: "Chat" };

export default async function ChatList({ searchParams }: { searchParams: Promise<{ empty?: string }> }) {
  const list = (await searchParams).empty ? [] : threads;
  return (
    <div style={{ maxWidth: 840 }}>
      <PageHead eyebrow="Chat" title="Conversations" lede="Chats open after a mutual match." />
      {list.length === 0 ? (
        <Empty icon="chat" title="No conversations yet" body="Chats open after a mutual match. Accept a request to start one.">
          <Link href="/c/matches" className="btn btn-primary">See match requests</Link>
        </Empty>
      ) : (
        <ul className="list">
          {list.map((t) => {
            const c = company(t.company)!;
            const last = t.messages[t.messages.length - 1];
            return (
              <li key={t.id}>
                <Link href={`/c/chat/${t.id}`} className="item">
                  <img src={c.img} alt="" className="avatar" width={40} height={40} />
                  <span className="item-body">
                    <span className="row between"><strong>{c.name}</strong><span className="muted small">{last.at.split(",")[0]}</span></span>
                    <span className="muted small truncate" style={{ display: "block" }}>{last.text}</span>
                  </span>
                  {t.unread > 0 && <span className="badge" aria-label={`${t.unread} unread`}>{t.unread}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <p className="small" style={{ marginTop: 24 }}><Link href="/c/chat?empty=1">Preview the empty state</Link></p>
      <Sample />
    </div>
  );
}
