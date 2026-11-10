import { formatIst } from "@/lib/ist";
import type { Metadata } from "next";
import Link from "next/link";
import { PAGE_SIZE, listPosts } from "@/server/services/posts";
import { requireStaff } from "@/server/guards";
import { Icon } from "../../icons";
import { PendingButton } from "../../ui";
import { createPostAction } from "../actions";

export const metadata: Metadata = { title: "Posts" };

const STATUSES = ["draft", "scheduled", "published", "archived"];

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  await requireStaff();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const rows = await listPosts({ q: sp.q?.slice(0, 80), status: sp.status, page });
  const more = rows.length > PAGE_SIZE;
  const filtered = !!(sp.q || sp.status);
  const qs = (p: number) => `/posts?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), ...(sp.status ? { status: sp.status } : {}), page: String(p) })}`;
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Posts</h1>
          <p className="muted">Write, schedule and publish articles for /blog.</p>
        </div>
        <form action={createPostAction}>
          <PendingButton className="btn primary" pendingLabel="Creating…"><Icon name="plus" size={16} />New post</PendingButton>
        </form>
      </div>
      <form className="card filters" method="get" role="search">
        <div className="field grow">
          <label htmlFor="posts-q" className="sr-only">Search posts</label>
          <input id="posts-q" name="q" type="search" placeholder="Search title or slug" defaultValue={sp.q} />
        </div>
        <div className="field">
          <label htmlFor="posts-status" className="sr-only">Status</label>
          <select id="posts-status" name="status" defaultValue={sp.status ?? ""}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <button className="btn secondary">Filter</button>
        {filtered && <Link href="/posts" className="btn ghost">Clear</Link>}
      </form>
      <div className="card flush scroll">
        {rows.length ? (
          <table className="table">
            <thead>
              <tr><th scope="col">Title</th><th scope="col">Status</th><th scope="col">Updated</th></tr>
            </thead>
            <tbody>
              {rows.slice(0, PAGE_SIZE).map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/posts/${p.id}`} className="list-title">{p.title || "Untitled"}</Link>
                    <span className="muted small">/blog/{p.slug}</span>
                  </td>
                  <td><span className={`pill ${p.status}`}>{p.status}</span></td>
                  <td className="muted nowrap"><time dateTime={p.updatedAt.toISOString()}>{formatIst(p.updatedAt)}</time></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">
            {filtered ? (
              <p><b>No posts match.</b> Try another search or status.</p>
            ) : (
              <p><b>No posts yet.</b> Use “New post” to write your first article.</p>
            )}
          </div>
        )}
      </div>
      {(page > 1 || more) && (
        <nav className="row" aria-label="Pagination">
          {page > 1 && <Link className="btn secondary" href={qs(page - 1)}>Previous</Link>}
          {more && <Link className="btn secondary" href={qs(page + 1)}>Next</Link>}
        </nav>
      )}
    </>
  );
}
