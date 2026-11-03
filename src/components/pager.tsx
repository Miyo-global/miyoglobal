import Link from "next/link";

export function Pager({ page, pages, base }: { page: number; pages: number; base: string }) {
  if (pages <= 1) return null;
  const href = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
  return (
    <nav className="b-pager" aria-label="Pagination">
      {page > 1 && <Link className="btn btn-ghost" href={href(page - 1)} rel="prev">Newer</Link>}
      <span className="btn" aria-current="page">Page {page} of {pages}</span>
      {page < pages && <Link className="btn btn-ghost" href={href(page + 1)} rel="next">Older</Link>}
    </nav>
  );
}
