import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { put } from "@vercel/blob";

export const UPLOAD_NAME = /^[a-f0-9-]{36}(-og|-avif)?\.(webp|avif)$/;

export async function store(name: string, body: Buffer, contentType: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`media/${name}`, body, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 31536000,
    });
    return blob.url;
  }
  const dir = process.env.UPLOAD_DIR;
  if (!dir) throw new Error("Set BLOB_READ_WRITE_TOKEN (or UPLOAD_DIR for local development)");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), body);
  return `/uploads/${name}`;
}

export async function readLocal(name: string): Promise<Buffer | null> {
  const dir = process.env.UPLOAD_DIR;
  if (!dir || !UPLOAD_NAME.test(name)) return null;
  return readFile(join(dir, name)).catch(() => null);
}
