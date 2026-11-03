import { NextResponse, type NextRequest } from "next/server";

const adminHost = (process.env.ADMIN_HOST ?? "adm.miyoglobal.com").toLowerCase();
const adminOnly = /^\/(studio|api\/auth)(\/|$)/;
const shared = /^\/(_next|images\/|favicon\.svg)/;

function notFound() {
  return new NextResponse(null, { status: 404 });
}

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const { pathname } = req.nextUrl;

  if (host !== adminHost) return adminOnly.test(pathname) ? notFound() : NextResponse.next();

  if (shared.test(pathname)) return NextResponse.next();

  if (pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    });
  }

  let res: NextResponse;
  if (/^\/api\/auth(\/|$)/.test(pathname)) {
    res = NextResponse.next();
  } else if (pathname.startsWith("/studio")) {
    return notFound();
  } else {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/studio" : `/studio${pathname}`;
    res = NextResponse.rewrite(url);
  }

  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
