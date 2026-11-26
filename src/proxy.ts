import { NextResponse, type NextRequest } from "next/server";

const gates: [string, string, string[]][] = [
  ["/c", "candidate", []],
  ["/r", "recruiter", ["/r/sign-up"]],
  ["/admin", "admin", ["/admin/login"]],
];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const gate = gates.find(([p]) => pathname === p || pathname.startsWith(p + "/"));
  if (!gate || gate[2].includes(pathname)) return NextResponse.next();
  if (req.cookies.get("miyo_role")?.value === gate[1]) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = gate[1] === "admin" ? "/admin/login" : "/auth/log-in";
  url.search = `?next=${encodeURIComponent(pathname + search)}&as=${gate[1]}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/c/:path*", "/r/:path*", "/admin/:path*"] };
