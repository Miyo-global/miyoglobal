import type { Metadata } from "next";
import Link from "next/link";
import { Empty, Icon, PageHead, Sample, type IconName } from "@/components/ui";
import { notifications } from "@/data/fixtures";

export const metadata: Metadata = { title: "Notifications" };

const icons: Record<string, IconName> = { match: "match", chat: "chat", clock: "clock", check: "check", eye: "eye" };

export default async function Notifications({ searchParams }: { searchParams: Promise<{ empty?: string }> }) {
  const list = (await searchParams).empty ? [] : notifications;
  return (
    <div style={{ maxWidth: 840 }}>
      <PageHead eyebrow="Inbox" title="Notifications">
        {list.length > 0 && <Link href="/c/notifications?empty=1" className="btn">Mark all as read</Link>}
      </PageHead>
      {list.length === 0 ? (
        <Empty icon="bell" title="You're all caught up" body="New match requests, messages and reminders will appear here." />
      ) : (
        <ul className="list">
          {list.map((n) => (
            <li key={n.id} className="item">
              <span className="ico" style={{ width: 44, height: 44 }}><Icon name={icons[n.kind]} /></span>
              <span className="item-body">
                <span style={{ fontWeight: n.unread ? 600 : 400 }}>{n.text}</span>
                <span className="muted small" style={{ display: "block" }}>{n.when}</span>
              </span>
              {n.unread && <span className="dot" aria-label="Unread" />}
            </li>
          ))}
        </ul>
      )}
      <Sample />
    </div>
  );
}
