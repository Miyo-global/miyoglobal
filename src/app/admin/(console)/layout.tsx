import { AppShell } from "@/components/shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="admin"
      title="Global admin"
      nav={[
        { href: "/admin", label: "Dashboard", icon: "grid", exact: true },
        { href: "/admin/videos", label: "Video review", icon: "video", badge: "3" },
        { href: "/admin/users", label: "Users", icon: "users" },
        { href: "/admin/companies", label: "Companies", icon: "building" },
        { href: "/admin/reports", label: "Reports and flags", icon: "flag", badge: "2" },
        { href: "/admin/plans", label: "Plans and payments", icon: "card" },
        { href: "/admin/audit", label: "Audit log", icon: "file" },
        { href: "/admin/settings", label: "Settings", icon: "settings" },
      ]}
      tabs={[
        { href: "/admin", label: "Home", icon: "grid", exact: true },
        { href: "/admin/videos", label: "Videos", icon: "video" },
        { href: "/admin/users", label: "Users", icon: "users" },
        { href: "/admin/reports", label: "Reports", icon: "flag" },
      ]}
    >
      {children}
    </AppShell>
  );
}
