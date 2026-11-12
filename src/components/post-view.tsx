import Image from "next/image";
import Link from "next/link";
import { PostCard, fmtDate } from "@/components/post-card";
import { isPublished } from "@/lib/content";
import { headingIds, renderHtml, wordCount, type Doc } from "@/lib/content";
import { absolute, jsonLdScript, parseCustomJsonLd, SITE_NAME, SITE_URL } from "@/lib/seo";
import { related, type PostData } from "@/server/services/public";

/** `preview`: rendered on the admin host, so site links point at NEXT_PUBLIC_SITE_URL instead of relative paths. */
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

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: url,
    headline: post.title,
    description: post.metaDescription || post.excerpt || undefined,
    image: cover ? [cover.ogUrl ? absolute(cover.ogUrl) : absolute(cover.url)] : [absolute(`/blog/${post.slug}/og`)],
    datePublished: published.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    wordCount: html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
    articleSection: categoryName ?? undefined,
    keywords: post.focusKeyword || undefined,
    author: author ? { "@type": "Person", name: author.name, url: absolute(`/blog/author/${author.slug}`), sameAs: author.sameAs.length ? author.sameAs : undefined } : { "@type": "Organization", name: SITE_NAME },
    reviewedBy: reviewer ? { "@type": "Person", name: reviewer.name, url: absolute(`/blog/author/${reviewer.slug}`) } : undefined,
    publisher: { "@type": "Organization", name: SITE_NAME, url: absolute("/"), logo: { "@type": "ImageObject", url: absolute("/images/logo.png") } },
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
  const schemas = [article, crumbs, faq, custom?.ok ? custom.value : null].filter(Boolean);
  const share = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <article className="b-wrap">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(s) }} />
      ))}
      <nav className="b-crumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href={`${base}/`}>Home</a></li>
          <li><Link href={`${base}/blog`}>Blog</Link></li>
          {categoryName && categorySlug && <li><Link href={`${base}/blog/category/${categorySlug}`}>{categoryName}</Link></li>}
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>
      <header className="b-post-head" style={{ position: "static", background: "none", backdropFilter: "none", border: 0 }}>
        {categoryName && categorySlug && <Link className="b-chip" href={`${base}/blog/category/${categorySlug}`}>{categoryName}</Link>}
        <h1>{post.title}</h1>
        <p className="b-byline">
          {author && <span>By <b><Link href={`${base}/blog/author/${author.slug}`}>{author.name}</Link></b></span>}
          {reviewer && <span>Reviewed by <b><Link href={`${base}/blog/author/${reviewer.slug}`}>{reviewer.name}</Link></b></span>}
          {post.status === "scheduled" ? (
            post.scheduledAt ? <span>Scheduled for <time dateTime={post.scheduledAt.toISOString()}>{fmtDate(post.scheduledAt)}</time>, not published</span> : <span>Scheduled, not published</span>
          ) : isPublished(post) ? (
            <>
              <span>Published <time dateTime={published.toISOString()}>{fmtDate(published)}</time></span>
              {post.updatedAt.getTime() - published.getTime() > 86_400_000 && <span>Updated <time dateTime={post.updatedAt.toISOString()}>{fmtDate(post.updatedAt)}</time></span>}
            </>
          ) : (
            <span>Draft, not published</span>
          )}
          {minutes > 0 && <span>{minutes} min read</span>}
        </p>
      </header>
      {cover && (
        <div className="b-cover">
          <Image src={cover.url} alt={cover.alt} width={cover.width} height={cover.height} priority sizes="(max-width: 1200px) 100vw, 1144px" quality={75} placeholder={cover.blurDataUrl ? "blur" : "empty"} blurDataURL={cover.blurDataUrl ?? undefined} />
        </div>
      )}
      <div className="b-layout">
        <div>
          {post.quickAnswer && (
            <div className="b-quick"><b>Quick answer</b>{post.quickAnswer}</div>
          )}
          <div className="b-body" dangerouslySetInnerHTML={{ __html: html }} />
          {post.faq.length > 0 && (
            <section className="b-box b-faq" aria-labelledby="faq">
              <h2 id="faq">Frequently asked questions</h2>
              {post.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </section>
          )}
          {post.sources.length > 0 && (
            <section className="b-box" aria-labelledby="sources">
              <h2 id="sources">Sources &amp; further reading</h2>
              <ul>
                {post.sources.map((s) => (
                  <li key={s.url}><a href={s.url} rel="noopener noreferrer nofollow" target="_blank">{s.title}</a></li>
                ))}
              </ul>
            </section>
          )}
          <div className="b-share" aria-label="Share this article">
            <b>Share</b>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${share}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`https://twitter.com/intent/tweet?url=${share}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer">X</a>
            <a href={`mailto:?subject=${shareTitle}&body=${share}`}>Email</a>
          </div>
          {tags.length > 0 && <p className="b-tags">{tags.map((t) => <Link key={t.id} href={`${base}/blog/tag/${t.slug}`}>#{t.name}</Link>)}</p>}
          {author && (
            <aside className="b-box b-author" aria-label="About the author">
              <div className="b-avatar" aria-hidden="true">{author.name.slice(0, 1)}</div>
              <div>
                <h3><Link href={`${base}/blog/author/${author.slug}`}>{author.name}</Link></h3>
                {author.credentials && <p><b>{author.credentials}</b></p>}
                {author.bio && <p>{author.bio}</p>}
              </div>
            </aside>
          )}
        </div>
        {toc.length > 0 && (
          <nav className="b-toc" aria-label="In this article">
            <b>In this article</b>
            <ol>
              {toc.map((t) => (
                <li key={t.id} className={t.level === 3 ? "l3" : undefined}><a href={`#${t.id}`}>{t.text}</a></li>
              ))}
            </ol>
          </nav>
        )}
      </div>
      {more.length > 0 && (
        <section className="b-sec" aria-labelledby="related">
          <h2 id="related">Related articles</h2>
          <div className="b-grid">{more.map((p) => <PostCard key={p.id} post={p} base={base} />)}</div>
        </section>
      )}
    </article>
  );
}
