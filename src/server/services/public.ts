import "server-only";
import { and, desc, eq, ilike, inArray, lte, ne, or, sql } from "drizzle-orm";
import { db } from "../db";
import { authors, categories, media, postTags, posts, redirects, tags } from "../db/schema";

export const PER_PAGE = 9;

const live = () =>
  or(eq(posts.status, "published"), and(eq(posts.status, "scheduled"), lte(posts.scheduledAt, new Date())));

const cardColumns = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  publishedAt: posts.publishedAt,
  scheduledAt: posts.scheduledAt,
  updatedAt: posts.updatedAt,
  readingMinutes: posts.readingMinutes,
  categoryName: categories.name,
  categorySlug: categories.slug,
  coverUrl: media.url,
  coverAlt: media.alt,
  coverWidth: media.width,
  coverHeight: media.height,
  coverBlur: media.blurDataUrl,
};

export type CardPost = Awaited<ReturnType<typeof latest>>[number];

function cards(where?: ReturnType<typeof and>, limit = PER_PAGE, offset = 0) {
  return db
    .select(cardColumns)
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(media, eq(posts.coverMediaId, media.id))
    .where(where ? and(live(), where) : live())
    .orderBy(desc(sql`coalesce(${posts.publishedAt}, ${posts.scheduledAt})`))
    .limit(limit)
    .offset(offset);
}

export function latest(limit = PER_PAGE, offset = 0) {
  return cards(undefined, limit, offset);
}

export async function countLive(where?: ReturnType<typeof and>) {
  const rows = await db.select({ n: sql<number>`count(*)::int` }).from(posts).where(where ? and(live(), where) : live());
  return rows[0].n;
}

export function byCategoryId(categoryId: number, limit = PER_PAGE, offset = 0) {
  return cards(eq(posts.categoryId, categoryId), limit, offset);
}

export const countByCategory = (categoryId: number) => countLive(eq(posts.categoryId, categoryId));

export async function byTagId(tagId: number, limit = 48) {
  const ids = await db.select({ id: postTags.postId }).from(postTags).where(eq(postTags.tagId, tagId));
  if (!ids.length) return [];
  return cards(inArray(posts.id, ids.map((i) => i.id)), limit);
}

export const byAuthorId = (authorId: number, limit = 48) => cards(eq(posts.authorId, authorId), limit);

export function search(q: string, limit = 24) {
  const like = `%${q.replace(/[%_\\]/g, "")}%`;
  return cards(or(ilike(posts.title, like), ilike(posts.excerpt, like), ilike(posts.focusKeyword, like)), limit);
}

export async function categoriesWithPosts() {
  return db
    .select({ id: categories.id, slug: categories.slug, name: categories.name, description: categories.description })
    .from(categories)
    .where(sql`exists (select 1 from ${posts} where ${posts.categoryId} = ${categories.id} and (${posts.status} = 'published' or (${posts.status} = 'scheduled' and ${posts.scheduledAt} <= now())))`)
    .orderBy(categories.name);
}

export const getCategory = async (slug: string) => (await db.select().from(categories).where(eq(categories.slug, slug)))[0] ?? null;
export const getTag = async (slug: string) => (await db.select().from(tags).where(eq(tags.slug, slug)))[0] ?? null;
export const getAuthor = async (slug: string) => (await db.select().from(authors).where(eq(authors.slug, slug)))[0] ?? null;

export async function getPostBySlug(slug: string) {
  const [row] = await db
    .select({
      post: posts,
      categoryName: categories.name,
      categorySlug: categories.slug,
      cover: media,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(media, eq(posts.coverMediaId, media.id))
    .where(and(live(), eq(posts.slug, slug)));
  if (!row) return null;
  const [author] = row.post.authorId ? await db.select().from(authors).where(eq(authors.id, row.post.authorId)) : [];
  const [reviewer] = row.post.reviewerId ? await db.select().from(authors).where(eq(authors.id, row.post.reviewerId)) : [];
  const postTagRows = await db
    .select({ id: tags.id, slug: tags.slug, name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, row.post.id));
  return { ...row, author: author ?? null, reviewer: reviewer ?? null, tags: postTagRows };
}

export async function related(postId: number, categoryId: number | null, tagIds: number[], limit = 3) {
  const tagged = tagIds.length
    ? (await db.select({ id: postTags.postId }).from(postTags).where(inArray(postTags.tagId, tagIds))).map((r) => r.id)
    : [];
  const conds = [categoryId ? eq(posts.categoryId, categoryId) : undefined, tagged.length ? inArray(posts.id, tagged) : undefined].filter((c) => c !== undefined);
  if (!conds.length) return cards(ne(posts.id, postId), limit);
  const rows = await cards(and(ne(posts.id, postId), or(...conds)), limit);
  return rows.length >= limit ? rows : [...rows, ...(await cards(ne(posts.id, postId), limit + rows.length)).filter((r) => !rows.some((x) => x.id === r.id))].slice(0, limit);
}

export async function findRedirect(path: string) {
  const [row] = await db.select({ to: redirects.toPath }).from(redirects).where(eq(redirects.fromPath, path));
  return row?.to ?? null;
}

export async function sitemapEntries() {
  const [postRows, cats, tgs, auths] = await Promise.all([
    db
      .select({ slug: posts.slug, updatedAt: posts.updatedAt, publishedAt: posts.publishedAt, title: posts.title, excerpt: posts.excerpt })
      .from(posts)
      .where(and(live(), eq(posts.noindex, false)))
      .orderBy(desc(posts.publishedAt)),
    categoriesWithPosts(),
    db.select({ slug: tags.slug }).from(tags).where(sql`exists (select 1 from ${postTags} join ${posts} on ${posts.id} = ${postTags.postId} where ${postTags.tagId} = ${tags.id} and ${posts.status} = 'published')`),
    db.select({ slug: authors.slug }).from(authors).where(sql`exists (select 1 from ${posts} where ${posts.authorId} = ${authors.id} and ${posts.status} = 'published')`),
  ]);
  return { posts: postRows, categories: cats, tags: tgs, authors: auths };
}
