import "server-only";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { readingMinutes, type Doc } from "@/lib/content";
import { checkHealth, type Issue } from "@/lib/health";
import { can } from "@/lib/roles";
import { parseCustomJsonLd } from "@/lib/seo";
import type { Intent, PostInput } from "@/lib/post-schema";
import { planRedirect } from "@/lib/redirects";
import { db } from "../db";
import { media, postTags, posts, redirects, revisions } from "../db/schema";

export class PostError extends Error {}

export const PAGE_SIZE = 20;

export async function listPosts(opts: { q?: string; status?: string; page?: number }) {
  const page = Math.max(1, opts.page ?? 1);
  const filters = [
    opts.status && ["draft", "scheduled", "published", "archived"].includes(opts.status)
      ? eq(posts.status, opts.status as "draft")
      : undefined,
    opts.q ? or(ilike(posts.title, `%${opts.q.replace(/[%_]/g, "")}%`), ilike(posts.slug, `%${opts.q.replace(/[%_]/g, "")}%`)) : undefined,
  ].filter((f) => f !== undefined);
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(posts.updatedAt))
    .limit(PAGE_SIZE + 1)
    .offset((page - 1) * PAGE_SIZE);
}

export async function getPost(id: number) {
  const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  if (!post) return null;
  const tagRows = await db.select({ tagId: postTags.tagId }).from(postTags).where(eq(postTags.postId, id));
  return { ...post, tagIds: tagRows.map((t) => t.tagId) };
}

export async function createDraft(authorId: number | null) {
  const [row] = await db
    .insert(posts)
    .values({ slug: `untitled-${crypto.randomUUID().slice(0, 8)}`, authorId })
    .returning({ id: posts.id });
  return row.id;
}

export async function healthFor(input: PostInput): Promise<Issue[]> {
  const cover = input.coverMediaId
    ? (await db.select({ alt: media.alt, width: media.width }).from(media).where(eq(media.id, input.coverMediaId)))[0]
    : undefined;
  return checkHealth({
    title: input.title,
    slug: input.slug,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    focusKeyword: input.focusKeyword,
    quickAnswer: input.quickAnswer,
    doc: input.content as Doc,
    coverAlt: cover?.alt ?? null,
    hasCover: !!cover,
    coverWidth: cover?.width,
  });
}

export async function savePost(id: number, userId: string, role: string, input: PostInput, intent: Intent) {
  const existing = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  if (!existing) throw new PostError("Post not found");

  if (input.customJsonLd) {
    if (!can(role, "customJsonLd")) throw new PostError("Only admins can set custom JSON-LD");
    const parsed = parseCustomJsonLd(input.customJsonLd);
    if (!parsed.ok) throw new PostError(parsed.error);
  }
  if (!can(role, "customJsonLd") && existing.customJsonLd) input = { ...input, customJsonLd: existing.customJsonLd };

  const taken = await db.select({ id: posts.id }).from(posts).where(and(eq(posts.slug, input.slug), sql`${posts.id} <> ${id}`));
  if (taken.length) throw new PostError("That slug is already used by another post");

  let status = existing.status;
  let publishedAt = existing.publishedAt;
  let scheduledAt: Date | null = null;
  const issues = await healthFor(input);
  const blocking = issues.filter((i) => i.level === "error");

  if (intent === "publish" || intent === "schedule") {
    if (blocking.length) throw new PostError(`Fix before publishing: ${blocking.map((b) => b.message).join("; ")}`);
    if (!input.title) throw new PostError("Title is required");
  }
  if (intent === "publish") {
    status = "published";
    publishedAt = existing.publishedAt ?? new Date();
  } else if (intent === "schedule") {
    if (!input.scheduledAt || new Date(input.scheduledAt) <= new Date()) throw new PostError("Pick a future date to schedule");
    status = "scheduled";
    scheduledAt = new Date(input.scheduledAt);
  } else if (intent === "draft") {
    status = "draft";
  } else if (intent === "archive") {
    status = "archived";
  } else if (existing.status === "scheduled") {
    scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : existing.scheduledAt;
  }

  const wasLive = existing.status === "published" || existing.status === "archived" || !!existing.publishedAt;
  const slugChanged = wasLive && existing.slug !== input.slug;

  await db.transaction(async (tx) => {
    if (slugChanged) {
      const rows = await tx.select({ fromPath: redirects.fromPath, toPath: redirects.toPath }).from(redirects);
      const plan = planRedirect(rows, `/blog/${existing.slug}`, `/blog/${input.slug}`);
      if (plan.remove.length) await tx.delete(redirects).where(inArray(redirects.fromPath, plan.remove));
      for (const r of plan.upsert) {
        await tx
          .insert(redirects)
          .values(r)
          .onConflictDoUpdate({ target: redirects.fromPath, set: { toPath: r.toPath } });
      }
    }
    await tx
      .update(posts)
      .set({
        title: input.title,
        slug: input.slug,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        excerpt: input.excerpt,
        quickAnswer: input.quickAnswer,
        content: input.content,
        sources: input.sources,
        faq: input.faq,
        customJsonLd: input.customJsonLd || null,
        focusKeyword: input.focusKeyword,
        cluster: input.cluster,
        noindex: input.noindex,
        nofollow: input.nofollow,
        ogTitle: input.ogTitle,
        ogDescription: input.ogDescription,
        authorId: input.authorId,
        reviewerId: input.reviewerId,
        categoryId: input.categoryId,
        coverMediaId: input.coverMediaId,
        readingMinutes: readingMinutes(input.content as Doc),
        status,
        publishedAt,
        scheduledAt,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));
    await tx.delete(postTags).where(eq(postTags.postId, id));
    if (input.tagIds.length) await tx.insert(postTags).values(input.tagIds.map((tagId) => ({ postId: id, tagId })));

    const [last] = await tx
      .select({ createdAt: revisions.createdAt })
      .from(revisions)
      .where(eq(revisions.postId, id))
      .orderBy(desc(revisions.createdAt))
      .limit(1);
    if (intent !== "save" || !last || Date.now() - last.createdAt.getTime() > 5 * 60 * 1000) {
      await tx.insert(revisions).values({ postId: id, title: input.title, content: input.content, userId });
    }
  });

  return { status, slug: input.slug, previousSlug: existing.slug, issues, wasLive: status === "published" || existing.status === "published" };
}

export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id));
}
