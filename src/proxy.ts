import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { parseBlogPath } from "@/lib/blog-path";
import { ADMIN_HOST, normalizeHost } from "@/lib/hosts";
import { db } from "@/server/db";
import { redirects } from "@/server/db/schema";
import { blogTargetExists } from "@/server/services/public";

const adminOnly = /^\/(studio|api\/auth)(\/|$)/;
const shared = /^\/(_next|media\/|images\/|favicon\.(svg|ico))/;
const postPath = /^\/blog\/(?!search$)[a-z0-9-]+$/;

const PUBLIC_HOST = "www.miyoglobal.com";

function notFound() {
  return new NextResponse(null, { status: 404 });
}

function noindex<T extends NextResponse>(res: T, value = "noindex, nofollow"): T {
  res.headers.set("X-Robots-Tag", value);
  return res;
}

async function findRedirect(path: string) {
  const [row] = await db.select({ to: redirects.toPath }).from(redirects).where(eq(redirects.fromPath, path));
  return row?.to ?? null;
}

export async function proxy(req: NextRequest) {
  const host = normalizeHost(req.headers.get("host") ?? "");
  const { pathname } = req.nextUrl;

  if (host !== ADMIN_HOST) {
    // Previews (*.vercel.app) and any other alias must never be indexed.
    const tag = <T extends NextResponse>(res: T) => (host === PUBLIC_HOST ? res : noindex(res));
    if (adminOnly.test(pathname)) return tag(notFound());
    if (postPath.test(pathname)) {
      const to = await findRedirect(pathname).catch(() => null);
      if (to) return tag(NextResponse.redirect(new URL(to, req.url), 301));
    }
    // Unknown blog URLs get the branded static 404 (real <title>, status 404). Next 16 serves an empty
    // error shell when a dynamic page calls notFound(), so the check runs here, before the page renders.
    const target = parseBlogPath(pathname);
    if (target && !(await blogTargetExists(target).catch(() => true))) {
      return tag(NextResponse.rewrite(new URL("/not-found-html", req.url)));
    }
    return tag(NextResponse.next());
  }

  if (shared.test(pathname)) return NextResponse.next();

  if (pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" },
    });
  }

  let res: NextResponse;
  if (/^\/api\/auth(\/|$)/.test(pathname)) {
    res = NextResponse.next();
  } else if (pathname.startsWith("/studio")) {
    return noindex(notFound(), "noindex, nofollow, noarchive");
  } else {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/studio" : `/studio${pathname}`;
    res = NextResponse.rewrite(url);
  }

  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
