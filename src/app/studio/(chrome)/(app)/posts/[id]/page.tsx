import { asc, desc, eq, ne, and } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { can } from "@/lib/roles";
import { db } from "@/server/db";
import { authors, categories, media, posts, tags } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { getPost } from "@/server/services/posts";
import { listMedia } from "@/server/services/media";
import { PostEditor } from "./editor";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireStaff("writePosts");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const post = await getPost(id);
  if (!post) notFound();
  const [authorRows, cats, tgs, mediaRows, siblings, cover] = await Promise.all([
    db.select({ id: authors.id, name: authors.name }).from(authors).orderBy(asc(authors.name)),
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name)),
    db.select({ id: tags.id, name: tags.name }).from(tags).orderBy(asc(tags.name)),
    listMedia(60),
    db
      .select({ title: posts.title, slug: posts.slug, cluster: posts.cluster })
      .from(posts)
      .where(and(eq(posts.status, "published"), ne(posts.id, id)))
      .orderBy(desc(posts.publishedAt))
      .limit(60),
    post.coverMediaId ? db.select().from(media).where(eq(media.id, post.coverMediaId)) : Promise.resolve([]),
  ]);
  const items = mediaRows.map((m) => ({ id: m.id, url: m.url, alt: m.alt, width: m.width, height: m.height }));
  if (cover[0] && !items.some((m) => m.id === cover[0].id)) {
    items.push({ id: cover[0].id, url: cover[0].url, alt: cover[0].alt, width: cover[0].width, height: cover[0].height });
  }
  return (
    <PostEditor
      id={post.id}
      status={post.status}
      wasPublished={!!post.publishedAt}
      isAdmin={can(me.role, "customJsonLd")}
      canDelete={can(me.role, "deletePosts")}
      initial={{
        title: post.title,
        slug: post.slug,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        excerpt: post.excerpt,
        quickAnswer: post.quickAnswer,
        focusKeyword: post.focusKeyword,
        cluster: post.cluster,
        noindex: post.noindex,
        nofollow: post.nofollow,
        ogTitle: post.ogTitle,
        ogDescription: post.ogDescription,
        authorId: post.authorId,
        reviewerId: post.reviewerId,
        categoryId: post.categoryId,
        coverMediaId: post.coverMediaId,
        tagIds: post.tagIds,
        sources: post.sources,
        faq: post.faq,
        customJsonLd: post.customJsonLd,
        scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
        content: post.content,
      }}
      authors={authorRows}
      categories={cats}
      tags={tgs}
      media={items}
      siblings={siblings}
    />
  );
}
