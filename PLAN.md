# PLAN — "The delivery ledger" homepage rebuild (`feat/delivery-ledger`)

Source brief: `MASTER_PROMPT.md` (Part A). Bundled template sources live in `_getlayers/` (gitignored, excluded from `tsconfig.json`).

## Approach

1. **Port Northwall machinery** into `src/ledger/`, which keeps the template's internal layout (`components/`, `hooks/`, `lib/`, `utils/`, `types/`). Imports are rewritten from `@/…` to `@/ledger/…`, so nothing collides with the site's own `src/components` and `src/lib`.
   - **Not ported:** the preloader (0.18 CLS), the locale switch, cookie modules, `api-client`, the robot proxy, and every Northwall photo.
2. **Tailwind v4, dev-only.** Its theme and utilities layers are imported in `src/app/ledger.css`, scanning only `src/ledger` and `src/views`. Preflight is **not** imported, so inner pages and the blog keep their existing CSS untouched. Tokens follow §3 in three tiers (`--raw-*`, semantic, `@theme inline`).
3. **Runtime dependencies added:** `@react-spring/web`, `spring-text-engine`, `lenis`, `zustand`. These are only the ones Northwall uses.
4. **Homepage** `src/app/(site)/page.tsx` renders `src/views/home/` (sections 0–12). The old homepage markup moves to `src/views/home-legacy/home-page.tsx`, unrouted.
5. **Shared chrome:**
   - `src/components/site-header.tsx` becomes the Northwall recolouring header. On inner pages it adds an in-flow spacer, so their layout doesn't move.
   - `src/components/site-footer.tsx` becomes the navy rail footer, with the recruitment notice kept verbatim.
   - Both are used by `(site)` and `/blog`. The old `header` / `footer` element rules in `site-pages.css` and `blog/site.css` are removed, since only the old chrome used them.
6. **Kept as-is:**
   - The contact form handler. `ContactForm` gains a presentation-only `variant` prop.
   - The cookie bar, its wording and GTM.
   - JSON-LD, metadata, OG images, robots, sitemaps, `/studio`, `/api/*` and the blog.
   - `/referrals`, which is a static HTML file with its own chrome and can't share the React header and footer. It's noted as a follow-up.
7. **Fonts:** stay on the existing Google Fonts stylesheet (adding Fraunces 400 italic and Outfit 300), because the cookie notice must keep saying "Fonts load from Google Fonts". Moving to `next/font` would make that sentence false, so it's flagged as an owner decision.
8. **Passage intro** (Fathom, re-skinned): HYD → RAK in gold, shown once per session, 1200–2200 ms. It's skippable and skipped for reduced motion and bots. It calls Northwall's `markHandoff()`, so the hero entrance plays after it. The hero is server-rendered underneath it.

## Verification

- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`.
- Lighthouse on `/` (mobile and desktop).
- Keyboard pass and reduced-motion pass.
- Every route renders.
- Coherence greps: no stray hex values, only Fraunces and Outfit, no prices.
