# SEO and indexing

## Search engine verification

Optional. In Google Search Console and Bing Webmaster Tools choose the "HTML tag" method, copy only the `content` value, and set it in Vercel:

- `GOOGLE_SITE_VERIFICATION` renders `<meta name="google-site-verification">`
- `BING_SITE_VERIFICATION` renders `<meta name="msvalidate.01">`

Both are read in `src/app/layout.tsx`. Pages are prerendered, so redeploy after setting them. An unset variable renders nothing. If the domain is verified by DNS TXT instead, leave both empty. Once verified, submit `https://www.miyoglobal.com/sitemap.xml` in both consoles.

## robots.txt

`src/app/robots.txt/route.ts` allows everything except `/api/`, `/blog/search` and `/studio`, for `*` and for each named AI crawler. There is no blanket query-string rule: it would block `/_next/image?url=...` (every optimised image), and canonicals already fold `?utm_` variants. The admin host serves `Disallow: /` from `src/proxy.ts`.

## Page titles, descriptions and structured data

Each marketing page declares one `page` object (`src/app/(site)/*/page.tsx`) that feeds both `pageMetadata()` and `pageJsonLd()` in `src/lib/page-meta.ts`.

- Titles are 45 to 60 characters with ` | MIYO Global` at the end (the home page leads with the brand); descriptions are 120 to 158 characters. Use only facts printed on the page.
- Every page emits one JSON-LD graph: WebSite, Organization, the WebPage (with `dateModified` from `src/lib/pages.ts`) and, on inner pages, a BreadcrumbList.
- `/staffing-solutions` and `/digital-solutions` add a Service whose offer catalogue has one entry per service line. The lines live in `SERVICES` in `src/lib/pages.ts`, which also feeds `/llms.txt`. They mirror the visible copy, as do the `summary` strings in `STATIC_PAGES`: update both when a service is renamed or its description changes.
- `/case-studies` adds an ItemList of the three cases, `/about` adds a Person per named leader and advisor, and the home page adds a FAQPage. Those are passed as the second argument of `pageJsonLd()` and repeat names printed on the page, so edit them with the copy.
- The Organization `sameAs` lists the MIYO Global LinkedIn page (also linked in the footer). There is no telephone: no phone number is published on the site. Add more profiles or a phone in `siteGraph()` (`src/lib/seo.ts`) when they exist. The logo size there is the real pixel size of `public/images/logo-web.png`.
- Blog posts reference the same Organization by `@id` as publisher, and the author by the `@id` the author page declares.

## Sitemaps

`/sitemap.xml` is an index of `/pages-sitemap.xml` and `/posts-sitemap.xml`. All three are built in `src/app/sitemap.xml/urls.ts` from `sitemapEntries()`.

- **Marketing page lastmod** is the `updated` date in `src/lib/pages.ts`. Bump it by hand when a page's visible content changes. It is not read from git: Vercel builds from a shallow clone, where every git date and file mtime is the deploy date. Trade-off: a forgotten bump leaves lastmod too old, which only loses a recrawl hint; a lastmod that moves on every deploy makes search engines ignore it for the whole site.
- **Blog lastmod** is the newest `updatedAt` of the indexable posts behind each URL (the post itself, or the posts in a category, tag or author listing).
- Only indexable content is listed: published posts without the noindex flag, categories and authors with at least one such post, and tags with at least two (`TAG_MIN_POSTS`). A tag page with one article is served `noindex, follow`.
- With no published post, `/blog` is `noindex, follow` and absent from the sitemap, and the index does not list `posts-sitemap.xml`. Both return on their own with the first published post.
- Post covers are listed as `<image:image>` entries.

## Blog 404s

`src/proxy.ts` checks every blog URL against the database and rewrites unknown ones to a path no route matches, so the host returns the branded not-found page with a real 404 status. Do not point that rewrite at `/_not-found`: on Vercel it is a prerendered page that answers 200. Check after each deploy that touches the proxy:

```sh
curl -s -o /dev/null -w '%{http_code}\n' https://www.miyoglobal.com/blog/no-such-post   # must print 404
```

## IndexNow

Publishing, updating or deleting a post submits the post URL and `/blog` when `INDEXNOW_KEY` is set (`/indexnow-key.txt` must return 200). Marketing pages are not submitted automatically. After a release that changes them, submit every URL in the pages sitemap once:

```sh
KEY=...   # the INDEXNOW_KEY value from Vercel
curl -s https://www.miyoglobal.com/pages-sitemap.xml | grep -o '<loc>[^<]*' | cut -c6- \
  | jq -Rn --arg key "$KEY" '{host: "www.miyoglobal.com", key: $key, keyLocation: "https://www.miyoglobal.com/indexnow-key.txt", urlList: [inputs]}' \
  | curl -s -o /dev/null -w '%{http_code}\n' -X POST https://api.indexnow.org/indexnow -H 'Content-Type: application/json' -d @-
```

200 or 202 means accepted.

## Hosts and HSTS (Vercel settings, not code)

- `miyoglobal.com` must stay a 308 redirect to `www.miyoglobal.com` in Vercel → Domains. The app does not repeat that redirect: if the primary domain were ever switched, a second redirect in code would loop. Any host other than `www.miyoglobal.com` that does reach the app is served with `X-Robots-Tag: noindex, nofollow`.
- `http://miyoglobal.com` takes two hops (to https, then to www). That is Vercel's domain handling and is fine.
- HSTS preload is not enabled. The `www` header is set in `next.config.ts` (`max-age=63072000; includeSubDomains`), but the apex header comes from Vercel's redirect and has no `includeSubDomains`, so the domain is not eligible as it stands. Preloading also commits every present and future subdomain to HTTPS and is slow to undo. Decide that first; do not add `preload` to the `www` header alone.
- Wrong-case links to a page or blog URL (`/About`, `/Blog/Post`) are redirected to the lower-case URL by `src/proxy.ts`.

## Icons and manifest

`public/apple-touch-icon.png` (180), `public/icon-192.png` and `public/icon-512.png` are centre crops of `public/images/logo.png`. The icon links are declared once in `src/app/layout.tsx`; the manifest is `src/app/manifest.ts` (`/manifest.webmanifest`). A layout that sets its own `icons` replaces the root ones.

## Staging and beta (non-production environments)

| Host | Branch | Vercel project | `NEXT_PUBLIC_ENV` | Indexed |
|---|---|---|---|---|
| www.miyoglobal.com | `main` | `miyoglobal` | unset (`production`) | yes |
| staging.miyoglobal.com | `staging` | `miyoglobal-staging` | `staging` | no |
| beta.miyoglobal.com | `beta` | `miyoglobal-beta` | `beta` | no |

Any `NEXT_PUBLIC_ENV` other than `production` sets `NOINDEX` (`src/lib/seo.ts`). Then `/robots.txt` serves `Disallow: /`, the three sitemaps return 404, every page carries `<meta name="robots" content="noindex, nofollow">`, and Google Tag Manager is not loaded. Independently, `src/proxy.ts` sends `X-Robots-Tag: noindex, nofollow` on every host except `www.miyoglobal.com`. Canonicals come from `NEXT_PUBLIC_SITE_URL`, so these hosts are self-canonical.

Both projects have no `CRON_SECRET` (the publish cron returns 401) and no `INDEXNOW_KEY`, and their `vercel.json` registers no cron.

```bash
curl -sI https://beta.miyoglobal.com | grep -i x-robots-tag
curl -s https://beta.miyoglobal.com/robots.txt
curl -s -o /dev/null -w "%{http_code}\n" https://beta.miyoglobal.com/sitemap.xml   # 404
```

## Redesign notes (staging-premium)

- **Titles** come from `titleFor` (`src/lib/seo.ts`): the brand suffix " | MIYO Global" is added only when the result fits in 60 characters, and a title is never cut mid-word. Every page's title and description are checked for length and uniqueness by `scripts/qa-screens.mts`.
- **Structured data:** every `@id` and `url` derives from `NEXT_PUBLIC_SITE_URL`, so staging graphs point at staging and production graphs at www. The Organization node carries both offices (Hyderabad and Ras Al Khaimah) as `PostalAddress`es and `sameAs` LinkedIn. Pages add: FAQPage (home, solutions, referrals), Service (solutions), Person (about), Place (contact), ItemList (case studies, jobs), JobPosting (each role), BlogPosting (posts), CollectionPage + BreadcrumbList (journal categories and tags).
- **Share images:** every page has its own 1200×630 card. Static cards in `public/images/og/` are rendered by `pnpm og:images` (`scripts/og-images.tsx`) from the brand tokens; posts, journal categories and tags, and each job have a generated `opengraph-image.tsx`.
- **robots.txt (production):** `/api/`, `/studio`, `/blog/search` and URLs carrying tracking parameters (utm_*, gclid, fbclid, msclkid) are disallowed. There is no blanket `/*?*` rule, so `/_next/image?url=…` stays crawlable. Staging and beta serve `Disallow: /`.
- **Verification tags** (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`) render on production only.
- **Jobs:** `/jobs` and every `/jobs/<slug>` are in the pages sitemap and revalidate every 10 minutes. `JobPosting` includes `datePosted`, `employmentType`, `baseSalary` and `validThrough` only when the sheet provides them; see `CONTENT_NEEDED.md`.
- **QA:** `pnpm exec tsx scripts/qa-screens.mts` (with `BASE` and `OUT`) screenshots every main route at 375, 768 and 1440 px and reports title, description, canonical, og:image, h1 count, heading skips, JSON-LD types, images without alt and horizontal overflow. `lighthouserc.json` holds the budgets (all categories ≥ 95, LCP < 2 s, CLS ≤ 0.05, TBT < 150 ms).
