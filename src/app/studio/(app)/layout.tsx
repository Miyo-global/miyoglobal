import Link from "next/link";
import { can } from "@/lib/roles";
import { requireStaff } from "@/server/guards";
import { signOut } from "../actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  return (
    <div className="shell">
      <nav aria-label="Studio">
        <span className="brand">MIYO Studio</span>
        <Link href="/">Dashboard</Link>
        <Link href="/posts">Posts</Link>
        <Link href="/media">Media</Link>
        <Link href="/taxonomy">Taxonomy</Link>
        <Link href="/authors">Authors</Link>
        {can(user.role, "manageUsers") && <Link href="/users">Users</Link>}
        <Link href="/settings">Settings</Link>
        <form action={signOut}>
          <button className="link">Sign out</button>
        </form>
      </nav>
      <main>{children}</main>
    </div>
  );
}
