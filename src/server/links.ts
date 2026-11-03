import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { inArray } from "drizzle-orm";
import { STATIC_PAGES } from "@/lib/pages";
import { db } from "./db";
import { posts, redirects } from "./db/schema";

const STATIC: string[] = [...STATIC_PAGES.map((p) => p.path), "/blog"];

function privateAddress(ip: string): boolean {
  if (ip.includes(":")) return ip === "::1" || ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80") || ip.startsWith("::ffff:");
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

async function externalOk(url: string): Promise<boolean> {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^\[|\]$/g, "");
    const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
    if (addrs.some((a) => privateAddress(a.address))) return false;
    const res = await fetch(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(5000) });
    if (res.status === 405 || res.status === 403) return true;
    return res.status < 400;
  } catch {
    return false;
  }
}

export async function findBrokenLinks(internal: string[], external: string[]): Promise<string[]> {
  const broken: string[] = [];
  const paths = [...new Set(internal.map((h) => h.split(/[?#]/)[0].replace(/\/$/, "") || "/"))];
  const slugs = paths.filter((p) => p.startsWith("/blog/")).map((p) => p.slice(6).split("/")[0]);
  const live = slugs.length ? await db.select({ slug: posts.slug }).from(posts).where(inArray(posts.slug, slugs)) : [];
  const redirected = paths.length ? await db.select({ f: redirects.fromPath }).from(redirects).where(inArray(redirects.fromPath, paths)) : [];
  for (const p of paths) {
    const known =
      STATIC.includes(p) ||
      p.startsWith("/blog/category/") ||
      p.startsWith("/blog/tag/") ||
      p.startsWith("/blog/author/") ||
      live.some((l) => `/blog/${l.slug}` === p) ||
      redirected.some((r) => r.f === p);
    if (!known) broken.push(p);
  }
  const unique = [...new Set(external)].slice(0, 25);
  const results = await Promise.all(unique.map(async (u) => ((await externalOk(u)) ? null : u)));
  return [...broken, ...results.filter((u): u is string => !!u)];
}
