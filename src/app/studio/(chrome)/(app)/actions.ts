"use server";

import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { externalLinks, internalLinks } from "@/lib/health";
import { intents, postInput, type Intent } from "@/lib/post-schema";
import { slugify } from "@/lib/slug";
import type { Doc } from "@/lib/content";
import { audit } from "@/server/audit";
import { db } from "@/server/db";
import { account, authors, categories, session, tags, twoFactor, user } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { findBrokenLinks } from "@/server/links";
import { afterPublish } from "@/server/publish";
import { deleteMedia, saveUpload, UploadError } from "@/server/services/media";
import { createDraft, deletePost, PostError, savePost } from "@/server/services/posts";

function parseJson(raw: string): unknown {
  try {
    return typeof raw === "string" && raw.length < 500_000 ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

export async function createPostAction() {
  const me = await requireStaff("writePosts");
  const [author] = await db.select({ id: authors.id }).from(authors).where(eq(authors.userId, me.id));
  const id = await createDraft(author?.id ?? null);
  await audit(me.id, "post.create", String(id));
  redirect(`/posts/${id}`);
}

export async function savePostAction(id: number, rawJson: string, intent: Intent): Promise<Result<{ status: string; slug: string; issues: { level: string; code: string; message: string }[] }>> {
  const me = await requireStaff("writePosts");
  const parsed = postInput.safeParse(parseJson(rawJson));
  if (!parsed.success || !intents.includes(intent) || !Number.isInteger(id)) {
    return { ok: false, error: parsed.success ? "Invalid request" : parsed.error.issues[0]?.message ?? "Invalid post" };
  }
  try {
    const res = await savePost(id, me.id, me.role, parsed.data, intent);
    await audit(me.id, `post.${intent}`, String(id));
    if (res.wasLive) afterPublish(res.slug, res.previousSlug);
    revalidatePath("/posts");
    return { ok: true, status: res.status, slug: res.slug, issues: res.issues };
  } catch (e) {
    if (e instanceof PostError) return { ok: false, error: e.message };
    throw e;
  }
}

export async function deletePostAction(id: number) {
  const me = await requireStaff("deletePosts");
  await deletePost(id);
  await audit(me.id, "post.delete", String(id));
  revalidatePath("/posts");
  redirect("/posts");
}

export async function checkLinksAction(contentJson: string): Promise<Result<{ broken: string[] }>> {
  await requireStaff("writePosts");
  const parsed = postInput.shape.content.safeParse(parseJson(contentJson));
  if (!parsed.success) return { ok: false, error: "Invalid content" };
  const doc = parsed.data as Doc;
  return { ok: true, broken: await findBrokenLinks(internalLinks(doc), externalLinks(doc)) };
}

export async function uploadMediaAction(form: FormData): Promise<Result<{ media: { id: number; url: string; alt: string; width: number; height: number } }>> {
  const me = await requireStaff("uploadMedia");
  const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Choose an image" };
  try {
    const m = await saveUpload(file, String(form.get("alt") ?? ""), me.id);
    await audit(me.id, "media.upload", String(m.id));
    revalidatePath("/media");
    return { ok: true, media: { id: m.id, url: m.url, alt: m.alt, width: m.width, height: m.height } };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, error: e.message };
    throw e;
  }
}

export async function deleteMediaAction(id: number): Promise<Result> {
  const me = await requireStaff("deletePosts");
  try {
    await deleteMedia(id);
    await audit(me.id, "media.delete", String(id));
    revalidatePath("/media");
    return { ok: true };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, error: e.message };
    throw e;
  }
}

const name = z.string().trim().min(1).max(80);

export async function addCategoryAction(form: FormData) {
  const me = await requireStaff("manageTaxonomy");
  const n = name.parse(form.get("name"));
  await db.insert(categories).values({ name: n, slug: slugify(n) || "category", description: String(form.get("description") ?? "").slice(0, 300) }).onConflictDoNothing();
  await audit(me.id, "category.add", n);
  revalidatePath("/taxonomy");
}

export async function addTagAction(form: FormData) {
  const me = await requireStaff("manageTaxonomy");
  const n = name.parse(form.get("name"));
  await db.insert(tags).values({ name: n, slug: slugify(n) || "tag" }).onConflictDoNothing();
  await audit(me.id, "tag.add", n);
  revalidatePath("/taxonomy");
}

export async function deleteTaxonomyAction(form: FormData) {
  const me = await requireStaff("deletePosts");
  const id = z.coerce.number().int().positive().parse(form.get("id"));
  if (form.get("kind") === "tag") await db.delete(tags).where(eq(tags.id, id));
  else await db.delete(categories).where(eq(categories.id, id));
  await audit(me.id, "taxonomy.delete", `${form.get("kind")}:${id}`);
  revalidatePath("/taxonomy");
}

const authorInput = z.object({
  id: z.coerce.number().int().positive().optional(),
  name,
  slug: z.string().trim().max(96).optional(),
  bio: z.string().trim().max(1000),
  credentials: z.string().trim().max(300),
  sameAs: z.string().max(1500),
});

export async function saveAuthorAction(form: FormData) {
  const me = await requireStaff("manageTaxonomy");
  const d = authorInput.parse({
    id: form.get("id") || undefined,
    name: form.get("name"),
    slug: form.get("slug") || undefined,
    bio: form.get("bio") ?? "",
    credentials: form.get("credentials") ?? "",
    sameAs: form.get("sameAs") ?? "",
  });
  const sameAs = d.sameAs
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => /^https:\/\//i.test(s))
    .slice(0, 10);
  const slug = slugify(d.slug || d.name) || "author";
  if (d.id) {
    await db.update(authors).set({ name: d.name, bio: d.bio, credentials: d.credentials, sameAs, slug }).where(eq(authors.id, d.id));
  } else {
    await db.insert(authors).values({ name: d.name, bio: d.bio, credentials: d.credentials, sameAs, slug }).onConflictDoNothing();
  }
  await audit(me.id, "author.save", d.name);
  revalidatePath("/authors");
  revalidatePath("/blog", "layout");
}

const newUser = z.object({
  name,
  email: z.email().max(254).transform((e) => e.toLowerCase()),
  password: z.string().min(12).max(128),
  role: z.enum(["admin", "editor"]),
});

export async function createUserAction(form: FormData): Promise<Result> {
  const me = await requireStaff("manageUsers");
  const parsed = newUser.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, error: "Name, a valid email, a 12+ character password and a role are required" };
  const d = parsed.data;
  const exists = await db.select({ id: user.id }).from(user).where(eq(user.email, d.email));
  if (exists.length) return { ok: false, error: "That email already has an account" };
  const id = crypto.randomUUID();
  await db.insert(user).values({ id, name: d.name, email: d.email, emailVerified: true, role: d.role });
  await db.insert(account).values({ id: crypto.randomUUID(), accountId: id, providerId: "credential", userId: id, password: await hashPassword(d.password) });
  await db.insert(authors).values({ userId: id, name: d.name, slug: slugify(d.name) || id.slice(0, 8) }).onConflictDoNothing();
  await audit(me.id, "user.create", `${d.email}:${d.role}`);
  revalidatePath("/users");
  return { ok: true };
}

export async function setRoleAction(form: FormData) {
  const me = await requireStaff("manageUsers");
  const d = z.object({ id: z.string().min(1), role: z.enum(["admin", "editor"]) }).parse(Object.fromEntries(form));
  if (d.id === me.id) return;
  await db.update(user).set({ role: d.role }).where(eq(user.id, d.id));
  await audit(me.id, "user.role", `${d.id}:${d.role}`);
  revalidatePath("/users");
}

export async function resetTwoFactorAction(form: FormData) {
  const me = await requireStaff("manageUsers");
  const id = z.string().min(1).parse(form.get("id"));
  if (id === me.id) return;
  await db.update(user).set({ twoFactorEnabled: false }).where(eq(user.id, id));
  await db.delete(twoFactor).where(eq(twoFactor.userId, id));
  await db.delete(session).where(eq(session.userId, id));
  await audit(me.id, "user.2fa-reset", id);
  revalidatePath("/users");
}
