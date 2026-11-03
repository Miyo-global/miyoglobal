import { count } from "drizzle-orm";
import { db } from "@/server/db";
import { media, posts } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";

export default async function Dashboard() {
  const user = await requireStaff();
  const [byStatus, [{ n: mediaCount }]] = await Promise.all([
    db.select({ status: posts.status, n: count() }).from(posts).groupBy(posts.status),
    db.select({ n: count() }).from(media),
  ]);
  const n = (s: string) => byStatus.find((r) => r.status === s)?.n ?? 0;
  return (
    <>
      <h1>Welcome, {user.name}</h1>
      <div className="grid stats">
        {["draft", "scheduled", "published", "archived"].map((s) => (
          <div className="card stat" key={s}>
            <b>{n(s)}</b>
            <span className="muted">{s}</span>
          </div>
        ))}
        <div className="card stat">
          <b>{mediaCount}</b>
          <span className="muted">media files</span>
        </div>
      </div>
    </>
  );
}
