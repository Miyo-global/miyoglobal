# MIYO Global · Beta

Video-first, blind-first hiring for India and the UAE. This branch (`beta`) is the hiring product served at https://beta.miyoglobal.com. It runs entirely on fictional fixture data in `src/data/fixtures.ts`; there is no database, payment processor, email or video pipeline.

```bash
pnpm install
pnpm dev
pnpm lint && pnpm typecheck && pnpm build
```

## Demo access

| Role | Email | Password | OTP / MFA |
| --- | --- | --- | --- |
| Candidate (Ananya Rao) | ananya@demo.miyoglobal.com | MiyoBeta-2026 | 123456 |
| Company (Kiran P., Northbridge Systems) | kiran@northbridge.demo | MiyoBeta-2026 | 123456 |
| Admin (Meera D.) | meera@miyoglobal.com at /admin/login | MiyoBeta-2026 | 123456, or "Use a passkey" |

The sign-in page also has one-click demo buttons, and every app sidebar has a demo role switch.

## Layout

- `src/app/(public)` landing, pricing, get started, legal pages, system states, offline
- `src/app/auth` sign up, log in, OTP, forgot and reset password
- `src/app/c` candidate onboarding and app
- `src/app/r` company verification and app (swipe deck, pipeline, billing)
- `src/app/admin` admin console
- `src/app/share/[token]` public expiring shortlist card
- `src/proxy.ts` gates `/c`, `/r` and `/admin` on the demo session cookie

Every response carries `X-Robots-Tag: noindex, nofollow` and `robots.txt` disallows everything.

## Environment

`NEXT_PUBLIC_SITE_URL` sets the metadata base URL. `NEXT_PUBLIC_ENV` must be `beta` on the beta Vercel project so the build is not skipped by `vercel.json`.
