import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { PostCard, fmtDate } from "@/components/post-card";
import { headingIds, renderHtml, type Doc } from "@/lib/content";
import { absolute, jsonLdScript, parseCustomJsonLd, SITE_NAME, titleFor } from "@/lib/seo";
import { findRedirect, getPostBySlug, related } from "@/server/services/public";

export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

const load = cache(getPostBySlug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return {};
  const { post, cover } = data;
  const url = absolute(`/blog/${post.slug}`);
  const title = titleFor(post.metaTitle, post.title);
  const description = post.metaDescription || post.excerpt;
  const image = cover?.ogUrl ?? `/blog/${post.slug}/og`;
  const imageAlt = cover?.alt ?? post.title;
  return {
    title: { absolute: title.includes("|") ? title : `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: url },
    robots: { index: !post.noindex, follow: !post.nofollow },
    authors: data.author ? [{ name: data.author.name, url: absolute(`/blog/author/${data.author.slug}`) }] : undefined,
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: post.ogTitle || post.title,
      description: post.ogDescription || description,
      publishedTime: (post.publishedAt ?? post.scheduledAt)?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title: post.ogTitle || post.title, description: post.ogDescription || description, images: [{ url: image, alt: imageAlt }] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) {
    const to = await findRedirect(`/blog/${slug}`);
    if (to) permanentRedirect(to);
    notFound();
  }
  const { post, author, reviewer, cover, categoryName, categorySlug, tags } = data;
  const doc = post.content as Doc;
  const toc = headingIds(doc);
  const html = renderHtml(doc);
  const published = post.publishedAt ?? post.scheduledAt ?? post.createdAt;
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
          <li><Link href="/">Home</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          {categoryName && categorySlug && <li><Link href={`/blog/category/${categorySlug}`}>{categoryName}</Link></li>}
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>
      <header className="b-post-head" style={{ position: "static", background: "none", backdropFilter: "none", border: 0 }}>
        {categoryName && categorySlug && <Link className="b-chip" href={`/blog/category/${categorySlug}`}>{categoryName}</Link>}
        <h1>{post.title}</h1>
        <p className="b-byline">
          {author && <span>By <b><Link href={`/blog/author/${author.slug}`}>{author.name}</Link></b></span>}
          {reviewer && <span>Reviewed by <b><Link href={`/blog/author/${reviewer.slug}`}>{reviewer.name}</Link></b></span>}
          <span>Published <time dateTime={published.toISOString()}>{fmtDate(published)}</time></span>
          {post.updatedAt.getTime() - published.getTime() > 86_400_000 && <span>Updated <time dateTime={post.updatedAt.toISOString()}>{fmtDate(post.updatedAt)}</time></span>}
          <span>{post.readingMinutes} min read</span>
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
          {tags.length > 0 && <p className="b-tags">{tags.map((t) => <Link key={t.id} href={`/blog/tag/${t.slug}`}>#{t.name}</Link>)}</p>}
          {author && (
            <aside className="b-box b-author" aria-label="About the author">
              <div className="b-avatar" aria-hidden="true">{author.name.slice(0, 1)}</div>
              <div>
                <h3><Link href={`/blog/author/${author.slug}`}>{author.name}</Link></h3>
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
          <div className="b-grid">{more.map((p) => <PostCard key={p.id} post={p} />)}</div>
        </section>
      )}
    </article>
  );
}
