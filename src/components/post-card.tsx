import Image from "next/image";
import Link from "next/link";
import type { CardPost } from "@/server/services/public";

export const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";

export function PostCard({ post, large = false }: { post: CardPost; large?: boolean }) {
  const date = post.publishedAt ?? post.scheduledAt;
  return (
    <article className={`b-card${large ? " large" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="b-card-img" tabIndex={-1} aria-hidden="true">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt=""
            width={post.coverWidth ?? 1200}
            height={post.coverHeight ?? 750}
            sizes={large ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"}
            placeholder={post.coverBlur ? "blur" : "empty"}
            blurDataURL={post.coverBlur ?? undefined}
            priority={large}
            quality={75}
          />
        ) : (
          <span className="b-card-fallback">MIYO</span>
        )}
      </Link>
      <div className="b-card-body">
        {post.categoryName && post.categorySlug && (
          <Link href={`/blog/category/${post.categorySlug}`} className="b-chip">{post.categoryName}</Link>
        )}
        <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        {post.excerpt && <p className="b-excerpt">{post.excerpt}</p>}
        <p className="b-meta">
          <time dateTime={date?.toISOString()}>{fmtDate(date)}</time> · {post.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}
