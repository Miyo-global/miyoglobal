import { ButtonLink } from "@/components/ui/button";

export function Pager({ page, pages, base }: { page: number; pages: number; base: string }) {
  if (pages <= 1) return null;
  const href = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
  return (
    <nav aria-label="Pagination" className="mt-12 grid grid-cols-3 items-center gap-4 border-t border-rule pt-6">
      <div>
        {page > 1 && (
          <ButtonLink variant="secondary" href={href(page - 1)} rel="prev">
            Newer
          </ButtonLink>
        )}
      </div>
      <p className="meta text-center text-muted" aria-current="page">
        Page {page} of {pages}
      </p>
      <div className="text-right">
        {page < pages && (
          <ButtonLink variant="secondary" href={href(page + 1)} rel="next">
            Older
          </ButtonLink>
        )}
      </div>
    </nav>
  );
}
