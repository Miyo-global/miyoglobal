import { asc } from "drizzle-orm";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { requireStaff } from "@/server/guards";
import { NewUserForm } from "./new-user-form";
import { setRoleAction } from "../actions";

export default async function UsersPage() {
  const me = await requireStaff("manageUsers");
  const rows = await db.select().from(user).orderBy(asc(user.email));
  return (
    <>
      <h1>Users</h1>
      <div className="card scroll">
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {u.id === me.id ? u.role : (
                    <form action={setRoleAction} className="row">
                      <input type="hidden" name="id" value={u.id} />
                      <select name="role" defaultValue={u.role} style={{ width: 110 }}>
                        <option value="editor">editor</option>
                        <option value="admin">admin</option>
                      </select>
                      <button className="btn ghost">Save</button>
                    </form>
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
