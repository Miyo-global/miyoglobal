import Link from "next/link";
import { PAGE_SIZE, listPosts } from "@/server/services/posts";
import { requireStaff } from "@/server/guards";
import { createPostAction } from "../actions";

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  await requireStaff();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const rows = await listPosts({ q: sp.q?.slice(0, 80), status: sp.status, page });
  const more = rows.length > PAGE_SIZE;
  const qs = (p: number) => `/posts?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), ...(sp.status ? { status: sp.status } : {}), page: String(p) })}`;
  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Posts</h1>
        <form action={createPostAction}>
          <button className="btn gold">New post</button>
        </form>
      </div>
      <form className="row card" method="get">
        <input name="q" placeholder="Search title or slug" defaultValue={sp.q} style={{ maxWidth: 280 }} />
        <select name="status" defaultValue={sp.status ?? ""} style={{ maxWidth: 180 }}>
          <option value="">All statuses</option>
          {["draft", "scheduled", "published", "archived"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="btn ghost">Filter</button>
      </form>
      <div className="card scroll">
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Status</th><th>Updated</th></tr>
          </thead>
          <tbody>
            {rows.slice(0, PAGE_SIZE).map((p) => (
              <tr key={p.id}>
                <td><Link href={`/posts/${p.id}`}>{p.title || "Untitled"}</Link><br /><span className="muted">/blog/{p.slug}</span></td>
                <td><span className={`pill ${p.status}`}>{p.status}</span></td>
                <td>{p.updatedAt.toISOString().slice(0, 16).replace("T", " ")}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={3} className="muted">No posts found</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="row">
        {page > 1 && <Link className="btn ghost" href={qs(page - 1)}>Previous</Link>}
        {more && <Link className="btn ghost" href={qs(page + 1)}>Next</Link>}
      </div>
    </>
  );
}
