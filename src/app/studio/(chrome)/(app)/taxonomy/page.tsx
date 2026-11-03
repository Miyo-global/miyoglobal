import { asc } from "drizzle-orm";
import { can } from "@/lib/roles";
import { db } from "@/server/db";
import { categories, tags } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { addCategoryAction, addTagAction, deleteTaxonomyAction } from "../actions";

export default async function TaxonomyPage() {
  const me = await requireStaff();
  const [cats, tgs] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.name)),
    db.select().from(tags).orderBy(asc(tags.name)),
  ]);
  const del = (kind: string, id: number) =>
    can(me.role, "deletePosts") && (
      <form action={deleteTaxonomyAction} style={{ display: "inline" }}>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <button className="link">remove</button>
      </form>
    );
  return (
    <>
      <h1>Categories and tags</h1>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <div className="card">
          <h2>Categories</h2>
          <ul>{cats.map((c) => <li key={c.id}>{c.name} <span className="muted">/{c.slug}</span> {del("category", c.id)}</li>)}</ul>
          <form action={addCategoryAction}>
            <label>Name<input name="name" required maxLength={80} /></label>
            <label>Description<textarea name="description" maxLength={300} /></label>
            <button className="btn">Add category</button>
          </form>
        </div>
        <div className="card">
          <h2>Tags</h2>
          <ul>{tgs.map((t) => <li key={t.id}>{t.name} <span className="muted">/{t.slug}</span> {del("tag", t.id)}</li>)}</ul>
          <form action={addTagAction}>
            <label>Name<input name="name" required maxLength={80} /></label>
            <button className="btn">Add tag</button>
          </form>
        </div>
      </div>
    </>
  );
}
