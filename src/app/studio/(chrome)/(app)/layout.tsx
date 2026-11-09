import { can } from "@/lib/roles";
import { requireStaff } from "@/server/guards";
import { UiProvider } from "../ui";
import { Shell } from "./shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  return (
    <UiProvider>
      <Shell user={{ name: user.name, email: user.email, role: user.role }} canManageUsers={can(user.role, "manageUsers")}>
        {children}
      </Shell>
    </UiProvider>
  );
}
