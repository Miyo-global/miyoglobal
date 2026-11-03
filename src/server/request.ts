import "server-only";
import { and, count, eq, gt, lt } from "drizzle-orm";
import { db } from "./db";
import { contactRateLimit } from "./db/schema";

export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function tooLarge(req: Request, max: number): boolean {
  return Number(req.headers.get("content-length") ?? Infinity) > max;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function allow(key: string, max: number, windowMs: number): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);
  const [{ n }] = await db
    .select({ n: count() })
    .from(contactRateLimit)
    .where(and(eq(contactRateLimit.key, key), gt(contactRateLimit.createdAt, since)));
  if (n >= max) return false;
  await db.insert(contactRateLimit).values({ key });
  await db.delete(contactRateLimit).where(lt(contactRateLimit.createdAt, new Date(Date.now() - 24 * 3600 * 1000)));
  return true;
}
