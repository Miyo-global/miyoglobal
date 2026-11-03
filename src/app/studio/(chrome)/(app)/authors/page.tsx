import { asc } from "drizzle-orm";
import { db } from "@/server/db";
import { authors } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { saveAuthorAction } from "../actions";

export default async function AuthorsPage() {
  await requireStaff();
  const rows = await db.select().from(authors).orderBy(asc(authors.name));
  const form = (a?: (typeof rows)[number]) => (
    <form action={saveAuthorAction} key={a?.id ?? "new"} className="card">
      <h2>{a ? a.name : "New author"}</h2>
      {a && <input type="hidden" name="id" value={a.id} />}
      <label>Name<input name="name" required maxLength={80} defaultValue={a?.name} /></label>
      <label>Slug<input name="slug" maxLength={96} defaultValue={a?.slug} /></label>
      <label>Credentials<input name="credentials" maxLength={300} defaultValue={a?.credentials} /></label>
      <label>Bio<textarea name="bio" maxLength={1000} defaultValue={a?.bio} /></label>
      <label>sameAs links (https, one per line)<textarea name="sameAs" maxLength={1500} defaultValue={a?.sameAs.join("\n")} /></label>
      <button className="btn">Save author</button>
    </form>
  );
  return (
    <>
      <h1>Authors</h1>
      {rows.map((a) => form(a))}
      {form()}
    </>
  );
}
