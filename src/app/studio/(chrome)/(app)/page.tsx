import { count } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/server/db";
import { media, posts } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { listPosts } from "@/server/services/posts";
import { Icon, type IconName } from "../icons";
import { createPostAction } from "./actions";

export const metadata: Metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const user = await requireStaff();
  const [byStatus, [{ n: mediaCount }], recent] = await Promise.all([
    db.select({ status: posts.status, n: count() }).from(posts).groupBy(posts.status),
    db.select({ n: count() }).from(media),
    listPosts({ page: 1 }),
  ]);
  const n = (s: string) => byStatus.find((r) => r.status === s)?.n ?? 0;
  const stats: { label: string; value: number; icon: IconName; tone: string }[] = [
    { label: "Published", value: n("published"), icon: "posts", tone: "ok" },
    { label: "Drafts", value: n("draft"), icon: "posts", tone: "neutral" },
    { label: "Scheduled", value: n("scheduled"), icon: "posts", tone: "gold" },
    { label: "Media files", value: mediaCount, icon: "media", tone: "navy" },
  ];
  const rows = recent.slice(0, 6);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p className="muted">Here is what is happening on the MIYO blog.</p>
        </div>
      </div>
      <div className="stats">
        {stats.map((s) => (
          <div className={`card stat tone-${s.tone}`} key={s.label}>
            <span className="stat-icon"><Icon name={s.icon} /></span>
            <div>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>
      <section className="card flush">
        <div className="card-head">
          <h2>Recent posts</h2>
          <Link href="/posts" className="btn secondary sm">View all</Link>
        </div>
        {rows.length ? (
          <ul className="list">
            {rows.map((p) => (
              <li key={p.id}>
                <Link href={`/posts/${p.id}`} className="list-title">{p.title || "Untitled"}</Link>
                <span className={`pill ${p.status}`}>{p.status}</span>
                <time className="muted" dateTime={p.updatedAt.toISOString()}>{p.updatedAt.toISOString().slice(0, 10)}</time>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <p><b>No posts yet.</b> Your first article will show up here.</p>
            <form action={createPostAction}>
              <button className="btn primary"><Icon name="plus" size={16} />Write a post</button>
            </form>
          </div>
        )}
      </section>
    </>
  );
}
