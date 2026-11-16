# miyoglobal

Next.js 16 (App Router) app serving the MIYO Global marketing pages, the blog at `/blog` and the Studio admin on the `adm.` host.

- Marketing pages are App Router pages in `src/app/(site)`. Only `/referrals` is still a static file (`public/referrals.html`), served through a clean-URL rewrite in `next.config.ts`.
- Studio (`src/app/studio`) answers only on the `NEXT_PUBLIC_ADMIN_URL` host; see `docs/blog/DNS.md`.
- Integrations and env vars: `docs/INTEGRATIONS.md`, `.env.example`.

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm e2e
```
