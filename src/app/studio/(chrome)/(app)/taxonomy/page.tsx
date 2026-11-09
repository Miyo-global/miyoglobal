import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import { can } from "@/lib/roles";
import { db } from "@/server/db";
import { categories, tags } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { ActionForm } from "../../ui";
import { addCategoryAction, addTagAction, deleteTaxonomyAction } from "../actions";

export const metadata: Metadata = { title: "Categories & Tags" };

type Item = { id: number; name: string; slug: string };

export default async function TaxonomyPage() {
  const me = await requireStaff();
  const canDelete = can(me.role, "deletePosts");
  const [cats, tgs] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.name)),
    db.select().from(tags).orderBy(asc(tags.name)),
  ]);

  const list = (kind: "category" | "tag", items: Item[]) =>
    items.length ? (
      <ul className="list">
        {items.map((it) => (
          <li key={it.id}>
            <span className="list-title">{it.name}</span>
            <span className="muted small">/{it.slug}</span>
            {canDelete && (
              <ActionForm action={deleteTaxonomyAction} confirm={`Remove the ${kind} “${it.name}”? Posts keep their content.`} confirmLabel="Remove" success={`${kind === "tag" ? "Tag" : "Category"} removed`}>
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={it.id} />
                <button className="btn danger-ghost sm">Remove</button>
              </ActionForm>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <div className="empty"><p>No {kind === "tag" ? "tags" : "categories"} yet.</p></div>
    );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Categories and tags</h1>
          <p className="muted">Group posts for readers and search engines.</p>
        </div>
      </div>
      <div className="split">
        <section className="card flush">
          <div className="card-head"><h2>Categories</h2><span className="pill">{cats.length}</span></div>
          {list("category", cats)}
          <ActionForm action={addCategoryAction} success="Category added" reset className="card-foot">
            <div className="field">
              <label htmlFor="cat-name">Name</label>
              <input id="cat-name" name="name" required maxLength={80} />
            </div>
            <div className="field">
              <label htmlFor="cat-desc">Description</label>
              <textarea id="cat-desc" name="description" maxLength={300} rows={2} />
            </div>
            <button className="btn primary">Add category</button>
          </ActionForm>
        </section>
        <section className="card flush">
          <div className="card-head"><h2>Tags</h2><span className="pill">{tgs.length}</span></div>
          {list("tag", tgs)}
          <ActionForm action={addTagAction} success="Tag added" reset className="card-foot">
            <div className="field">
              <label htmlFor="tag-name">Name</label>
              <input id="tag-name" name="name" required maxLength={80} />
            </div>
            <button className="btn primary">Add tag</button>
          </ActionForm>
        </section>
      </div>
    </>
  );
}
