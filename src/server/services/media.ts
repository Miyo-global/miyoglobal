import "server-only";
import { randomUUID } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import sharp from "sharp";
import { detectImage, isHeic, MAX_UPLOAD_BYTES, MIN_UPLOAD_WIDTH, validateAlt } from "@/lib/image-type";
import { db } from "../db";
import { media, posts } from "../db/schema";
import { describeError, removeObject, StorageError, store } from "../storage";

export class UploadError extends Error {}

function storeFailure(e: unknown): string {
  if (e instanceof StorageError && e.status) return `Image storage rejected the upload (R2 ${e.status}${e.code ? ` ${e.code}` : ""}). Nothing was saved.`;
  if (e instanceof StorageError) return "Image storage is not configured on the server. Nothing was saved.";
  if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) return "Image storage timed out. Nothing was saved. Please try again.";
  if (e instanceof TypeError) return "Could not reach image storage. Nothing was saved. Please try again.";
  return "Could not save the image record. Nothing was saved. Please try again.";
}

async function encode(input: Buffer) {
  const base = sharp(input, { failOn: "error", limitInputPixels: 100_000_000 }).rotate();
  const fit = { width: 2560, withoutEnlargement: true };
  const [main, avif, og, blur] = await Promise.all([
    base.clone().resize(fit).webp({ quality: 78 }).toBuffer({ resolveWithObject: true }),
    base.clone().resize(fit).avif({ quality: 55, effort: 2 }).toBuffer(),
    base.clone().resize(1200, 630, { fit: "cover" }).webp({ quality: 80 }).toBuffer(),
    base.clone().resize(16).webp({ quality: 40 }).toBuffer(),
  ]);
  return { main, avif, og, blur };
}

export async function saveUpload(file: File, alt: string, userId: string) {
  if (file.size === 0) throw new UploadError("Choose an image");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError(`Image must be ${MAX_UPLOAD_BYTES / 1024 / 1024}MB or smaller`);
  const altError = validateAlt(alt);
  if (altError) throw new UploadError(altError);
  const input = Buffer.from(await file.arrayBuffer());
  if (isHeic(input)) throw new UploadError("HEIC photos are not supported. Export the photo as JPEG or PNG and upload that.");
  if (!detectImage(input)) throw new UploadError("Only JPEG, PNG, WebP or AVIF images are allowed");

  const meta = await sharp(input, { limitInputPixels: 100_000_000 }).metadata().catch(() => null);
  if (!meta?.width || !meta.height) throw new UploadError("Could not read the image. The file may be damaged or too large in pixels.");
  const width = meta.autoOrient?.width ?? meta.width;
  if (width < MIN_UPLOAD_WIDTH) throw new UploadError(`Image must be at least ${MIN_UPLOAD_WIDTH}px wide (this one is ${width}px)`);

  const id = randomUUID();
  const started = Date.now();
  const { main, avif, og, blur } = await encode(input).catch((e) => {
    console.error("media: encode failed", { id, ...describeError(e) });
    throw new UploadError("Could not process this image. The file may be damaged. Re-export it as JPEG or PNG and try again.");
  });

  // Sequential, not parallel: concurrent PUTs to R2 were the intermittent failure. Each store() retries.
  const variants = [
    [`${id}.webp`, main.data, "image/webp"],
    [`${id}-avif.avif`, avif, "image/avif"],
    [`${id}-og.webp`, og, "image/webp"],
  ] as const;
  const stored: string[] = [];
  try {
    const encoded = Date.now();
    for (const [name, body, type] of variants) stored.push(await store(name, body, type));
    console.info("media: upload timings", { id, encodeMs: encoded - started, storeMs: Date.now() - encoded, bytes: variants.map(([, body]) => body.length) });
    const [url, avifUrl, ogUrl] = stored;
    const [row] = await db
      .insert(media)
      .values({
        url,
        avifUrl,
        ogUrl,
        width: main.info.width,
        height: main.info.height,
        blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
        alt: alt.trim(),
        bytes: main.info.size,
        uploadedBy: userId,
      })
      .returning();
    return row;
  } catch (e) {
    console.error("media: upload failed", { id, stored: stored.length, ...describeError(e) });
    await Promise.all(stored.map((u) => removeObject(u).catch(() => null)));
    throw new UploadError(storeFailure(e));
  }
}

export async function deleteMedia(id: number) {
  const [row] = await db.select().from(media).where(eq(media.id, id));
  if (!row) throw new UploadError("Image not found");
  const [used] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(sql`${posts.coverMediaId} = ${id} or ${posts.content}::text like ${`%${row.url}%`}`)
    .limit(1);
  if (used) throw new UploadError("This image is used by a post");
  await Promise.all([row.url, row.avifUrl, row.ogUrl].filter((u): u is string => !!u).map(removeObject));
  await db.delete(media).where(eq(media.id, id));
}

export function listMedia(limit = 200) {
  return db.select().from(media).orderBy(desc(media.createdAt)).limit(limit);
}
