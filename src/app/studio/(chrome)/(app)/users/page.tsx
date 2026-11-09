import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { ActionForm } from "../../ui";
import { NewUserForm } from "./new-user-form";
import { setRoleAction } from "../actions";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireStaff("manageUsers");
  const rows = await db.select().from(user).orderBy(asc(user.email));
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Users</h1>
          <p className="muted">Admins manage everything. Editors write and publish posts.</p>
        </div>
      </div>
      <div className="card flush scroll">
        <table className="table">
          <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Role</th></tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td className="list-title">{u.name}</td>
                <td className="muted">{u.email}</td>
                <td>
                  {u.id === me.id ? (
                    <span className="pill">{u.role} · you</span>
                  ) : (
                    <ActionForm action={setRoleAction} className="row nowrap" success={`Role updated for ${u.name}`}>
                      <input type="hidden" name="id" value={u.id} />
                      <select id={`role-${u.id}`} name="role" defaultValue={u.role} aria-label={`Role for ${u.name}`} className="sm">
                        <option value="editor">editor</option>
                        <option value="admin">admin</option>
                      </select>
                      <button className="btn secondary sm">Save</button>
                    </ActionForm>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NewUserForm />
    </>
  );
}
