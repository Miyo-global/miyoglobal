# UI components

One set, used by every public page. Styling comes only from the tokens in `src/styles/tokens.css` (Tailwind utilities generated from its `@theme inline` tier). No hex values and no arbitrary values (`w-[37px]`); `pnpm check:tokens` enforces both.

| Component | File | Variants and notes |
|---|---|---|
| Button / ButtonLink | `button.tsx` | `primary` navy fill, once per view. `accent` gold fill, navy grounds only. `secondary` hairline outline beside a primary. `ghost` text plus arrow for tertiary links. Min height 48px. |
| Eyebrow | `eyebrow.tsx` | Mono 12px uppercase, 0.12em tracking. Gold-deep on paper, muted white with `onInk`. Names the section; never restates the heading. |
| SectionHeader | `section-header.tsx` | `split` (eyebrow in columns 1 to 4, heading and lead in 5 to 12) or `stack` (first 8 columns). `as="h1"` for page heads. `action` slot for one link. |
| Stat | `stat.tsx` | Mono figure over a label on a top hairline. `size` h2 or h3, `onInk` for navy grounds. Values are strings, exactly as published. |
| RoleRow | `../jobs/role-row.tsx` | Departure Board row: ref, role, function, chips, city, status. Whole row is the link. |
| Card | `card.tsx` | `box` (1px rule, white, 4px radius) or `plain` (top rule only). Never a shadow. |
| Breadcrumbs | `breadcrumbs.tsx` | Visible trail; `mono` on a crumb for ref codes. JSON-LD comes from the page. |
| Field / TextArea / Select / Check | `field.tsx` | Label, hint, error wired with `aria-describedby` and `aria-invalid`. `optional` adds "(optional)" and drops `required`. |
| Tag | `tag.tsx` | Hairline chip; `accent` tone (gold rule, mono) for pay. |
| Quote | `quote.tsx` | Real, attributable quotes only. |
| LogoStrip | `logo-strip.tsx` | Label plus a row of items between hairlines. Shows credentials until real client logos are cleared. |
| SiteHeader | `../site-header.tsx` | Logo, five links, "Refer & earn ₹15,000", "Hire talent". Frosted with a hairline after scroll. |
| SiteFooter | `../site-footer.tsx` | Navy rail: CTA slab (hidden where the page already closes with one), brand, four columns, recruitment notice verbatim, legal entities. |

Motion lives in `src/components/motion/` (anime.js v4 only): `WordRise`, `CountUp`, `Tabs`, `Flap`. Server HTML is always the final state; anything on screen at load never animates, and `prefers-reduced-motion` turns every effect off.
