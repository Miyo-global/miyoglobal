# miyoglobal

Next.js 16 (App Router) app serving the MIYO Global marketing pages, the blog at `/blog` and the Studio admin on the `adm.` host.

- Marketing pages are App Router pages in `src/app/(site)`. `/jobs`, `/jobs/[slug]` and `/referrals` live in `src/app/(site)/(editorial)` and read the open roles from the referral sheet (`src/server/jobs.ts`, parsed by `src/lib/jobs.ts`).
- Studio (`src/app/studio`) answers only on the `NEXT_PUBLIC_ADMIN_URL` host; see `docs/blog/DNS.md`.
- Integrations and env vars: `docs/INTEGRATIONS.md`, `.env.example`.
- SEO: robots.txt, sitemaps and lastmod, page titles, structured data and search-engine verification are described in `docs/SEO.md`.

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm e2e
```
