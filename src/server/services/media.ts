import "server-only";
import { randomUUID } from "node:crypto";
import { desc } from "drizzle-orm";
import sharp from "sharp";
import { detectImage, MAX_UPLOAD_BYTES, MIN_UPLOAD_WIDTH, validateAlt } from "@/lib/image-type";
import { db } from "../db";
import { media } from "../db/schema";
import { store } from "../storage";

export class UploadError extends Error {}

export async function saveUpload(file: File, alt: string, userId: string) {
  if (file.size === 0) throw new UploadError("Choose an image");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Image must be 10MB or smaller");
  const altError = validateAlt(alt);
  if (altError) throw new UploadError(altError);
  const input = Buffer.from(await file.arrayBuffer());
  if (!detectImage(input)) throw new UploadError("Only JPEG, PNG, WebP or AVIF images are allowed");

  const base = sharp(input, { failOn: "error", limitInputPixels: 100_000_000 }).rotate();
  const meta = await base.metadata().catch(() => null);
  if (!meta?.width || !meta.height) throw new UploadError("Could not read the image");
  if (meta.width < MIN_UPLOAD_WIDTH) throw new UploadError(`Image must be at least ${MIN_UPLOAD_WIDTH}px wide`);

  const id = randomUUID();
  const main = await base.clone().resize({ width: 2560, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer({ resolveWithObject: true });
  const avif = await base.clone().resize({ width: 2560, withoutEnlargement: true }).avif({ quality: 55 }).toBuffer();
  const og = await base.clone().resize(1200, 630, { fit: "cover" }).webp({ quality: 80 }).toBuffer();
  const blur = await base.clone().resize(16).webp({ quality: 40 }).toBuffer();

  const [url, avifUrl, ogUrl] = await Promise.all([
    store(`${id}.webp`, main.data, "image/webp"),
    store(`${id}-avif.avif`, avif, "image/avif"),
    store(`${id}-og.webp`, og, "image/webp"),
  ]);

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
}

export function listMedia(limit = 200) {
  return db.select().from(media).orderBy(desc(media.createdAt)).limit(limit);
}
