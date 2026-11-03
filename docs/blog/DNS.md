# Studio host (adm.miyoglobal.com)

1. Vercel project → Settings → Domains → add `adm.miyoglobal.com`.
2. At the DNS provider add `CNAME adm → cname.vercel-dns.com`.
3. Set `NEXT_PUBLIC_ADMIN_URL=https://adm.miyoglobal.com` and `BETTER_AUTH_URL=https://adm.miyoglobal.com`, then rebuild.

`src/proxy.ts` serves Studio only on the `NEXT_PUBLIC_ADMIN_URL` host. On any other host `/studio/*` and `/api/auth/*` return 404. On the admin host every public path returns 404, responses carry `X-Robots-Tag: noindex` and `Cache-Control: no-store`, and `/robots.txt` disallows all.
