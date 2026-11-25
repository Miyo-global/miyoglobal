import Image from "next/image";
import Link from "next/link";
import { PostCard, fmtDate } from "@/components/post-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Tag } from "@/components/ui/tag";
import { headingIds, isPublished, renderHtml, wordCount, type Doc } from "@/lib/content";
import { absolute, jsonLdScript, ORG_ID, parseCustomJsonLd, siteGraph, SITE_NAME, SITE_URL } from "@/lib/seo";
import { related, type PostData } from "@/server/services/public";
import { authorName, isOrgAuthor } from "@/views/blog/meta";

const railHeading = "meta text-muted";

/**
 * A post: split header (category in the rail, title over the article), hard-edged cover, then a 3-column rail
 * (byline, dates, share, contents) beside the 680px reading column, and related articles as hairline rows.
 * `preview`: rendered on the admin host, so site links point at NEXT_PUBLIC_SITE_URL instead of relative paths.
 */
export async function PostView({ data, preview = false }: { data: PostData; preview?: boolean }) {
  const { post, author, reviewer, cover, categoryName, categorySlug, tags } = data;
  const doc = post.content as Doc;
  const toc = headingIds(doc);
  const base = preview ? SITE_URL : "";
  const rendered = renderHtml(doc);
  const html = preview ? rendered.replaceAll('href="/', `href="${SITE_URL}/`) : rendered;
  const minutes = wordCount(doc) ? Math.max(1, post.readingMinutes) : 0;
  const published = post.publishedAt ?? post.createdAt;
  const url = absolute(`/blog/${post.slug}`);
  const more = await related(post.id, post.categoryId, tags.map((t) => t.id));
  const person = author && !isOrgAuthor(author.name) ? author : null;

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: url,
    headline: post.title,
    description: post.metaDescription || post.excerpt || undefined,
    image: cover ? [cover.ogUrl ? absolute(cover.ogUrl) : absolute(cover.url)] : [absolute(`/blog/${post.slug}/opengraph-image`)],
    datePublished: published.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    wordCount: html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
    articleSection: categoryName ?? undefined,
    keywords: post.focusKeyword || undefined,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/blog#blog` },
    // Same @id the author page gives its Person, so both pages describe one entity. The admin account (or no author) is the Organization.
    author: person
      ? { "@type": "Person", "@id": `${absolute(`/blog/author/${person.slug}`)}#person`, name: person.name, url: absolute(`/blog/author/${person.slug}`), sameAs: person.sameAs.length ? person.sameAs : undefined }
      : { "@id": ORG_ID },
    reviewedBy: reviewer ? (isOrgAuthor(reviewer.name) ? { "@id": ORG_ID } : { "@type": "Person", name: reviewer.name, url: absolute(`/blog/author/${reviewer.slug}`) }) : undefined,
    publisher: { "@id": ORG_ID },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absolute("/blog") },
      ...(categoryName && categorySlug ? [{ "@type": "ListItem", position: 3, name: categoryName, item: absolute(`/blog/category/${categorySlug}`) }] : []),
      { "@type": "ListItem", position: categoryName ? 4 : 3, name: post.title, item: url },
    ],
  };
  const faq = post.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;
  const custom = post.customJsonLd ? parseCustomJsonLd(post.customJsonLd) : null;
  // The shared WebSite and Organization nodes are emitted too, so the publisher @id resolves on this page.
  const schemas = [article, crumbs, faq, custom?.ok ? custom.value : null, { "@context": "https://schema.org", "@graph": siteGraph() }].filter(Boolean);
  const share = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(post.title);
  const who = (a: { slug: string; name: string }) => (
    <Link href={`${base}/blog/author/${a.slug}`} className="link">
      {authorName(a.name)}
    </Link>
  );
  const date = (d: Date) => (
    <time dateTime={d.toISOString()} className="num">
      {fmtDate(d)}
    </time>
  );
  const fact = (term: string, value: React.ReactNode) => (
    <div>
      <dt className={railHeading}>{term}</dt>
      <dd className="mt-1 text-small">{value}</dd>
    </div>
  );

  return (
    <article className="frame pb-section pt-12">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(s) }} />
      ))}
      <Breadcrumbs
        items={[
          { label: "Home", href: `${base}/` },
          { label: "Blog", href: `${base}/blog` },
          ...(categoryName && categorySlug ? [{ label: categoryName, href: `${base}/blog/category/${categorySlug}` }] : []),
          { label: post.title },
        ]}
      />
      <header className="grid-12 mt-12 gap-y-6">
        <div className="col-span-4 md:col-span-4">
          {categoryName && categorySlug && (
            <Eyebrow className="md:pt-3">
              <Link href={`${base}/blog/category/${categorySlug}`} className="hover:underline">
                {categoryName}
              </Link>
            </Eyebrow>
          )}
        </div>
        <div className="col-span-4 md:col-span-8">
          <h1 className="text-h1">{post.title}</h1>
          {post.excerpt && <p className="lead mt-6">{post.excerpt}</p>}
        </div>
      </header>

      {cover && (
        <figure className="mt-12">
          <Image
            src={cover.url}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            priority
            sizes="(min-width: 1440px) 1280px, 100vw"
            quality={75}
            placeholder={cover.blurDataUrl ? "blur" : "empty"}
            blurDataURL={cover.blurDataUrl ?? undefined}
            className="h-auto w-full"
          />
        </figure>
      )}

      <div className="grid-12 mt-12 gap-y-12">
        <aside aria-label="About this article" className="col-span-4 md:col-span-12 lg:col-span-3">
          <dl className="grid gap-4 border-t border-rule-strong pt-6">
            {fact("Written by", author ? who(author) : SITE_NAME)}
            {reviewer && fact("Reviewed by", who(reviewer))}
            {post.status === "scheduled"
              ? fact("Scheduled", post.scheduledAt ? <>{date(post.scheduledAt)}, not published</> : "Not published")
              : isPublished(post)
                ? fact("Published", date(published))
                : fact("Status", "Draft, not published")}
            {isPublished(post) && post.updatedAt.getTime() - published.getTime() > 86_400_000 && fact("Updated", date(post.updatedAt))}
            {minutes > 0 && fact("Reading time", `${minutes} min`)}
          </dl>
          <div className="mt-8 border-t border-rule pt-6">
            <h2 className={railHeading}>Share</h2>
            <ul className="flex flex-wrap gap-x-6">
              <li>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${share}`} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-12 items-center text-small">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`https://twitter.com/intent/tweet?url=${share}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-12 items-center text-small">
                  X
                </a>
              </li>
              <li>
                <a href={`mailto:?subject=${shareTitle}&body=${share}`} className="link inline-flex min-h-12 items-center text-small">
                  Email
                </a>
              </li>
            </ul>
          </div>
          {toc.length > 0 && (
            <nav aria-labelledby="toc" className="mt-8 border-t border-rule pt-6 lg:sticky lg:top-header">
              <h2 id="toc" className={railHeading}>
                In this article
              </h2>
              <ol className="mt-3 border-l border-rule">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className={`block py-2 text-small text-muted hover:text-ink ${t.level === 3 ? "pl-8" : "pl-4"}`}>
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </aside>

        <div className="col-span-4 md:col-span-12 lg:col-span-8 lg:col-start-5">
          {post.quickAnswer && (
            <div className="mb-12 max-w-reading border-l border-accent pl-6">
              <p className="meta text-accent-text">Quick answer</p>
              <p className="mt-2 text-lead">{post.quickAnswer}</p>
            </div>
          )}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          {post.faq.length > 0 && (
            <section aria-labelledby="faq" className="mt-16 max-w-reading border-t border-rule-strong pt-8">
              <h2 id="faq" className="text-h3">
                Frequently asked questions
              </h2>
              <div className="mt-6 border-t border-rule">
                {post.faq.map((f) => (
                  <details key={f.q} className="border-b border-rule">
                    <summary className="cursor-pointer py-4 font-semibold">{f.q}</summary>
                    <p className="pb-4 text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          {post.sources.length > 0 && (
            <section aria-labelledby="sources" className="mt-16 max-w-reading border-t border-rule-strong pt-8">
              <h2 id="sources" className="text-h3">
                Sources &amp; further reading
              </h2>
              <ul className="mt-6 grid gap-2">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener noreferrer nofollow" target="_blank" className="link">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {tags.length > 0 && (
            <section aria-labelledby="tags" className="mt-16 max-w-reading border-t border-rule pt-6">
              <h2 id="tags" className={railHeading}>
                Tagged
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <li key={t.id}>
                    <Link href={`${base}/blog/tag/${t.slug}`} className="hover:underline">
                      <Tag>{t.name}</Tag>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {person && (
            <section aria-labelledby="about-author" className="mt-16 max-w-reading border-t border-rule-strong pt-8">
              <h2 id="about-author" className={railHeading}>
                About the author
              </h2>
              <p className="mt-4 font-display text-h3">
                <Link href={`${base}/blog/author/${person.slug}`} className="hover:underline">
                  {person.name}
                </Link>
              </p>
              {person.credentials && <p className="meta mt-2 text-ink">{person.credentials}</p>}
              {person.bio && <p className="mt-4 text-muted">{person.bio}</p>}
            </section>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <section aria-labelledby="related" className="mt-section">
          <h2 id="related" className="pb-8 text-h2">
            Related articles
          </h2>
          <div className="border-b border-rule">
            {more.map((p) => (
              <PostCard key={p.id} post={p} base={base} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
