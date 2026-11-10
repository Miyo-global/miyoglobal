import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { audit } from "@/server/audit";
import { db } from "@/server/db";
import { authors } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { createDraft, untouchedDraft } from "@/server/services/posts";

export const dynamic = "force-dynamic";

// GET /posts/new: open the newest blank draft, or create one, in the editor (Studio is auth-gated and noindex; nothing links here with prefetch).
export default async function NewPostPage() {
  const me = await requireStaff("writePosts");
  const [author] = await db.select({ id: authors.id }).from(authors).where(eq(authors.userId, me.id));
  const reuse = author ? await untouchedDraft(author.id) : null;
  if (reuse) redirect(`/posts/${reuse}`);
  const id = await createDraft(author?.id ?? null);
  await audit(me.id, "post.create", String(id));
  redirect(`/posts/${id}`);
}
