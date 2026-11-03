import { z } from "zod";
import { isValidSlug } from "./slug";

const text = (max: number) => z.string().trim().max(max);
const id = z.number().int().positive().nullable();

export const postInput = z.strictObject({
  title: text(120),
  slug: text(96).refine(isValidSlug, "Slug must be lowercase letters, numbers and single hyphens"),
  metaTitle: text(120),
  metaDescription: text(300),
  excerpt: text(300),
  quickAnswer: text(600),
  focusKeyword: text(80),
  cluster: text(80),
  noindex: z.boolean(),
  nofollow: z.boolean(),
  ogTitle: text(120),
  ogDescription: text(300),
  authorId: id,
  reviewerId: id,
  categoryId: id,
  coverMediaId: id,
  tagIds: z.array(z.number().int().positive()).max(15),
  sources: z.array(z.strictObject({ title: text(200).min(1), url: z.url({ protocol: /^https?$/ }).max(500) })).max(20),
  faq: z.array(z.strictObject({ q: text(200).min(1), a: text(1000).min(1) })).max(20),
  customJsonLd: text(8000).nullable(),
  scheduledAt: z.iso.datetime().nullable(),
  content: z
    .custom<Record<string, unknown>>((v) => !!v && typeof v === "object" && (v as { type?: unknown }).type === "doc")
    .refine((v) => JSON.stringify(v).length < 400_000, "Content is too large"),
});

export type PostInput = z.infer<typeof postInput>;

export const intents = ["save", "publish", "schedule", "draft", "archive"] as const;
export type Intent = (typeof intents)[number];
