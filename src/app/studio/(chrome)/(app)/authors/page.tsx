import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/server/db";
import { authors } from "@/server/db/schema";
import { can } from "@/lib/roles";
import { requireStaff } from "@/server/guards";
import { ActionForm } from "../../ui";
import { deleteAuthorAction, saveAuthorAction } from "../actions";

export const metadata: Metadata = { title: "Authors" };

export default async function AuthorsPage() {
  const me = await requireStaff();
  const rows = await db.select().from(authors).orderBy(asc(authors.name));
  const form = (a?: (typeof rows)[number]) => {
    const p = `author-${a?.id ?? "new"}`;
    return (
      <ActionForm action={saveAuthorAction} key={a?.id ?? "new"} className="card" success={a ? "Author saved" : "Author added"} reset={!a}>
        <h2>{a ? a.name : "New author"}</h2>
        {a && <input type="hidden" name="id" value={a.id} />}
        <div className="grid-2">
          <div className="field"><label htmlFor={`${p}-name`}>Name</label><input id={`${p}-name`} name="name" required maxLength={80} defaultValue={a?.name} /></div>
          <div className="field"><label htmlFor={`${p}-slug`}>Slug</label><input id={`${p}-slug`} name="slug" maxLength={96} defaultValue={a?.slug} /></div>
        </div>
        <div className="field"><label htmlFor={`${p}-cred`}>Credentials</label><input id={`${p}-cred`} name="credentials" maxLength={300} defaultValue={a?.credentials} /></div>
        <div className="field"><label htmlFor={`${p}-bio`}>Bio</label><textarea id={`${p}-bio`} name="bio" maxLength={1000} defaultValue={a?.bio} /></div>
        <div className="field"><label htmlFor={`${p}-same`}>sameAs links (https, one per line)</label><textarea id={`${p}-same`} name="sameAs" maxLength={1500} defaultValue={a?.sameAs.join("\n")} /></div>
        <button className="btn primary">{a ? "Save author" : "Add author"}</button>
      </ActionForm>
    );
  };
  const remove = (a: (typeof rows)[number]) =>
    can(me.role, "deletePosts") && (
      <ActionForm action={deleteAuthorAction} key={`del-${a.id}`} className="row" success="Author deleted" confirm={`Delete ${a.name}? Their posts stay, without a byline.`}>
        <input type="hidden" name="id" value={a.id} />
        <button className="btn danger-ghost sm">Delete {a.name}</button>
      </ActionForm>
    );
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Authors</h1>
          <p className="muted">Bylines and credentials shown on posts and author pages.</p>
        </div>
      </div>
      <div className="cards">
        {rows.map((a) => (
          <div key={a.id}>
            {form(a)}
            {remove(a)}
          </div>
        ))}
        {form()}
      </div>
    </>
  );
}
