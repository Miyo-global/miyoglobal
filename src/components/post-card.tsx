import Image from "next/image";
import Link from "next/link";
import { cx } from "@/components/ui/cx";
import type { CardPost } from "@/server/services/public";

export const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";

/**
 * One article on a hairline list. "row": meta in columns 1 to 4, title and excerpt in 5 to 9, image in 10 to 12 (h3).
 * "lead": the index's top story, image in 1 to 7 and copy in 8 to 12 (h2). Titles are never clamped.
 * `base` prefixes links (the Studio preview passes the public site URL so links leave the admin host).
 */
export function PostCard({ post, variant = "row", base = "" }: { post: CardPost; variant?: "row" | "lead"; base?: string }) {
  const lead = variant === "lead";
  const href = `${base}/blog/${post.slug}`;
  const H = lead ? "h2" : "h3";
  const meta = (
    <p className="meta text-muted">
      <time dateTime={post.publishedAt?.toISOString()}>{fmtDate(post.publishedAt)}</time>
      {post.categoryName && post.categorySlug && (
        <>
          <span aria-hidden="true"> / </span>
          <Link href={`${base}/blog/category/${post.categorySlug}`} className="text-accent-text hover:underline">
            {post.categoryName}
          </Link>
        </>
      )}
    </p>
  );
  const image = post.coverUrl && (
    <Link href={href} tabIndex={-1} aria-hidden="true" className={cx("order-first col-span-4 block md:order-none", lead ? "md:col-span-7" : "md:col-span-3")}>
      <Image
        src={post.coverUrl}
        alt={post.coverAlt || post.title}
        width={post.coverWidth ?? 1200}
        height={post.coverHeight ?? 800}
        priority={lead}
        sizes={lead ? "(min-width: 1280px) 720px, (min-width: 768px) 58vw, 100vw" : "(min-width: 1280px) 300px, (min-width: 768px) 25vw, 100vw"}
        placeholder={post.coverBlur ? "blur" : "empty"}
        blurDataURL={post.coverBlur ?? undefined}
        quality={75}
        className="aspect-3/2 w-full object-cover"
      />
    </Link>
  );
  const minutes = post.readingMinutes > 0 && <p className="meta mt-4 text-muted">{post.readingMinutes} min read</p>;

  if (lead)
    return (
      <article className="grid-12 gap-y-6 border-t border-rule-strong pt-8">
        {image}
        <div className={cx("col-span-4", post.coverUrl ? "md:col-span-5" : "md:col-span-8 md:col-start-5")}>
          {meta}
          <H className="mt-4 text-h2">
            <Link href={href} className="hover:underline">
              {post.title}
            </Link>
          </H>
          {post.excerpt && <p className="lead mt-6">{post.excerpt}</p>}
          {minutes}
        </div>
      </article>
    );

  return (
    <article className="grid-12 gap-y-4 border-t border-rule py-8">
      <div className="col-span-4">{meta}</div>
      <div className={cx("col-span-4", post.coverUrl ? "md:col-span-5" : "md:col-span-8")}>
        <H className="font-display text-h3 font-normal tracking-display">
          <Link href={href} className="hover:underline">
            {post.title}
          </Link>
        </H>
        {post.excerpt && <p className="mt-3 max-w-measure text-muted">{post.excerpt}</p>}
        {minutes}
      </div>
      {image}
    </article>
  );
}
