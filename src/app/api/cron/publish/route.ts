import { createHash, timingSafeEqual } from "node:crypto";
import { and, eq, lte, sql } from "drizzle-orm";
import { audit } from "@/server/audit";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { afterPublish } from "@/server/publish";

const digest = (s: string) => createHash("sha256").update(s).digest();

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return timingSafeEqual(digest(req.headers.get("authorization") ?? ""), digest(`Bearer ${secret}`));
}

export async function GET(req: Request) {
  if (!authorized(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const due = await db
    .update(posts)
    .set({ status: "published", publishedAt: sql`${posts.scheduledAt}`, scheduledAt: null, updatedAt: new Date() })
    .where(and(eq(posts.status, "scheduled"), lte(posts.scheduledAt, new Date())))
    .returning({ id: posts.id, slug: posts.slug });
  for (const post of due) {
    await audit(null, "post.cron-publish", String(post.id));
    afterPublish(post.slug, post.slug);
  }
  return Response.json({ published: due.length });
}
