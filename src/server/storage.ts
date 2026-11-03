import "server-only";
import { AwsClient } from "aws4fetch";

export const MEDIA_NAME = /^[a-f0-9-]{36}(-og|-avif)?\.(webp|avif)$/;

const CACHE = "public, max-age=31536000, immutable";

function r2() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_BUCKET } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_BUCKET) throw new Error("R2 is not configured");
  return {
    client: new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" }),
    objectUrl: (name: string) => `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_PUBLIC_BUCKET}/${name}`,
  };
}

export async function store(name: string, body: Buffer, contentType: string): Promise<string> {
  const { client, objectUrl } = r2();
  const res = await client.fetch(objectUrl(name), {
    method: "PUT",
    body: new Uint8Array(body),
    headers: { "Content-Type": contentType, "Cache-Control": CACHE },
  });
  if (!res.ok) throw new Error(`R2 upload failed with status ${res.status}`);
  const base = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, "");
  return base ? `${base}/${name}` : `/media/${name}`;
}

export async function readObject(name: string): Promise<Response | null> {
  if (!MEDIA_NAME.test(name)) return null;
  const { client, objectUrl } = r2();
  const res = await client.fetch(objectUrl(name));
  return res.ok ? res : null;
}

export async function removeObject(url: string): Promise<void> {
  const name = url.split("/").pop() ?? "";
  if (!MEDIA_NAME.test(name)) return;
  const { client, objectUrl } = r2();
  const res = await client.fetch(objectUrl(name), { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`R2 delete failed with status ${res.status}`);
}
