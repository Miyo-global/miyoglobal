import type { Metadata } from "next";
import { PageHead, Sample } from "@/components/ui";
import { UsersTable } from "./users";

export const metadata: Metadata = { title: "Users" };

export default function Users() {
  return (
    <div>
      <PageHead eyebrow="Users" title="User management" />
      <UsersTable />
      <Sample />
    </div>
  );
}
