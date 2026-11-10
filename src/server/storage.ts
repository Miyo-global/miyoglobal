import "server-only";
import { AwsClient } from "aws4fetch";

export const MEDIA_NAME = /^[a-f0-9-]{36}(-og|-avif)?\.(webp|avif)$/;

const CACHE = "public, max-age=31536000, immutable";

const ATTEMPTS = 3;

export class StorageError extends Error {
  name = "StorageError";
  constructor(message: string, readonly status?: number, readonly code?: string) {
    super(message);
  }
}

/** Loggable fields only: never includes credentials or the signed request. */
export function describeError(e: unknown) {
  if (!(e instanceof Error)) return { message: String(e) };
  const cause = e.cause instanceof Error ? e.cause.message : undefined;
  return { name: e.name, message: e.message, status: e instanceof StorageError ? e.status : undefined, code: e instanceof StorageError ? e.code : undefined, cause };
}

// One client per server instance. R2 = S3 API, region "auto", path-style URL (<account>.r2.cloudflarestorage.com/<bucket>/<key>).
let client: { client: AwsClient; objectUrl: (name: string) => string } | undefined;

function r2() {
  if (client) return client;
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_BUCKET } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_BUCKET) throw new StorageError("R2 is not configured");
  client = {
    client: new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto", retries: 0 }),
    objectUrl: (name: string) => `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_PUBLIC_BUCKET}/${name}`,
  };
  return client;
}

async function put(name: string, body: Buffer, contentType: string) {
  const { client, objectUrl } = r2();
  const res = await client.fetch(objectUrl(name), {
    method: "PUT",
    body: new Uint8Array(body),
    headers: { "Content-Type": contentType, "Cache-Control": CACHE },
    signal: AbortSignal.timeout(15_000),
  });
  if (res.ok) return;
  const text = await res.text().catch(() => "");
  throw new StorageError(`R2 PUT ${name} failed`, res.status, /<Code>([^<]+)<\/Code>/.exec(text)?.[1]);
}

export async function store(name: string, body: Buffer, contentType: string): Promise<string> {
  for (let attempt = 1; ; attempt++) {
    try {
      await put(name, body, contentType);
      break;
    } catch (e) {
      console.error("storage: put failed", { object: name, attempt, ...describeError(e) });
      if (attempt >= ATTEMPTS || (e instanceof StorageError && e.status === undefined)) throw e;
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }
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
