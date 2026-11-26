import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Sample } from "@/components/ui";
import { candidate, recruiterThreads } from "@/data/fixtures";

export const metadata: Metadata = { title: "Chat" };

export default function RChat() {
  return (
    <div style={{ maxWidth: 840 }}>
      <PageHead eyebrow="Chat" title="Conversations" lede="Each matched candidate gets one thread. Reply within 48 hours." />
      <ul className="list">
        {recruiterThreads.map((t) => {
          const c = candidate(t.candidate)!;
          return (
            <li key={t.id}>
              <Link href={`/r/chat/${t.id}`} className="item">
                <img src={c.img} alt="" className="avatar" width={40} height={40} />
                <span className="item-body">
                  <span className="row between"><strong>{c.name}</strong><span className="muted small">{t.when}</span></span>
                  <span className="muted small truncate" style={{ display: "block" }}>{t.role} · {t.last}</span>
                </span>
                {t.unread > 0 && <span className="badge" aria-label={`${t.unread} unread`}>{t.unread}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
      <Sample />
    </div>
  );
}
