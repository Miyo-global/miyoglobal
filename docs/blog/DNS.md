# Studio host (adm.miyoglobal.com)

1. Vercel project → Settings → Domains → add `adm.miyoglobal.com`.
2. At the DNS provider add `CNAME adm → cname.vercel-dns.com`.
3. Set env vars `ADMIN_HOST=adm.miyoglobal.com` and `ADMIN_ORIGIN=https://adm.miyoglobal.com`.

`src/proxy.ts` serves Studio only on `ADMIN_HOST`. On any other host `/studio/*` and `/api/auth/*` return 404. On the admin host every public path returns 404, responses carry `X-Robots-Tag: noindex` and `Cache-Control: no-store`, and `/robots.txt` disallows all.
