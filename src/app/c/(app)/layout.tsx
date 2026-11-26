import { AppShell, TopIcon } from "@/components/shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="candidate"
      nav={[
        { href: "/c/home", label: "Home", icon: "home" },
        { href: "/c/matches", label: "Matches", icon: "match", badge: "2" },
        { href: "/c/chat", label: "Chat", icon: "chat", badge: "2" },
        { href: "/c/schedule/m-2", label: "Interviews", icon: "calendar" },
        { href: "/c/notifications", label: "Notifications", icon: "bell" },
        { href: "/c/profile", label: "Profile", icon: "user" },
        { href: "/c/subscription", label: "Subscription", icon: "card" },
        { href: "/c/settings", label: "Settings", icon: "settings" },
      ]}
      tabs={[
        { href: "/c/home", label: "Home", icon: "home" },
        { href: "/c/matches", label: "Matches", icon: "match" },
        { href: "/c/chat", label: "Chat", icon: "chat" },
        { href: "/c/profile", label: "Profile", icon: "user" },
      ]}
      topActions={<TopIcon href="/c/notifications" icon="bell" label="Notifications, 2 unread" dot />}
    >
      {children}
    </AppShell>
  );
}
