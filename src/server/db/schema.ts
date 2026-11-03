import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const postStatus = pgEnum("post_status", ["draft", "scheduled", "published", "archived"]);

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio").notNull().default(""),
  credentials: text("credentials").notNull().default(""),
  sameAs: jsonb("same_as").$type<string[]>().notNull().default([]),
  avatarUrl: text("avatar_url"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  avifUrl: text("avif_url"),
  ogUrl: text("og_url"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  blurDataUrl: text("blur_data_url"),
  alt: text("alt").notNull(),
  bytes: integer("bytes").notNull(),
  uploadedBy: text("uploaded_by").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type FaqItem = { q: string; a: string };

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull().default(""),
    metaTitle: text("meta_title").notNull().default(""),
    metaDescription: text("meta_description").notNull().default(""),
    excerpt: text("excerpt").notNull().default(""),
    quickAnswer: text("quick_answer").notNull().default(""),
    content: jsonb("content").$type<Record<string, unknown>>().notNull().default({ type: "doc", content: [] }),
    sources: jsonb("sources").$type<{ title: string; url: string }[]>().notNull().default([]),
    faq: jsonb("faq").$type<FaqItem[]>().notNull().default([]),
    customJsonLd: text("custom_json_ld"),
    status: postStatus("status").notNull().default("draft"),
    authorId: integer("author_id").references(() => authors.id, { onDelete: "set null" }),
    reviewerId: integer("reviewer_id").references(() => authors.id, { onDelete: "set null" }),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    coverMediaId: integer("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    focusKeyword: text("focus_keyword").notNull().default(""),
    cluster: text("cluster").notNull().default(""),
    noindex: boolean("noindex").notNull().default(false),
    nofollow: boolean("nofollow").notNull().default(false),
    ogTitle: text("og_title").notNull().default(""),
    ogDescription: text("og_description").notNull().default(""),
    readingMinutes: integer("reading_minutes").notNull().default(1),
    publishedAt: timestamp("published_at"),
    scheduledAt: timestamp("scheduled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("posts_status_published_idx").on(t.status, t.publishedAt),
    index("posts_category_idx").on(t.categoryId),
  ],
);

export const postTags = pgTable(
  "post_tags",
  {
    postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);

export const revisions = pgTable(
  "revisions",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: jsonb("content").$type<Record<string, unknown>>().notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("revisions_post_idx").on(t.postId, t.createdAt)],
);

export const redirects = pgTable(
  "redirects",
  {
    id: serial("id").primaryKey(),
    fromPath: text("from_path").notNull().unique(),
    toPath: text("to_path").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id"),
    action: text("action").notNull(),
    target: text("target").notNull().default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("audit_created_idx").on(t.createdAt)],
);

export const contactRateLimit = pgTable(
  "contact_rate_limit",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("contact_rate_key_idx").on(t.key, t.createdAt)],
);
