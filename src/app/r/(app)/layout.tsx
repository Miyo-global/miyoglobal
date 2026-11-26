import { AppShell, TopIcon } from "@/components/shell";
import { UnlockMeter } from "./unlock-meter";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="recruiter"
      title="Northbridge Systems"
      nav={[
        { href: "/r/deck", label: "Swipe deck", icon: "deck" },
        { href: "/r/roles", label: "Open roles", icon: "briefcase", badge: "3" },
        { href: "/r/pipeline", label: "Shortlist pipeline", icon: "kanban" },
        { href: "/r/chat", label: "Chat", icon: "chat", badge: "1" },
        { href: "/r/schedule", label: "Interviews", icon: "calendar" },
        { href: "/r/analytics", label: "Analytics", icon: "chart" },
        { href: "/r/team", label: "Team and seats", icon: "users" },
        { href: "/r/billing", label: "Billing", icon: "card" },
        { href: "/r/profile", label: "Company profile", icon: "building" },
        { href: "/r/settings", label: "Settings", icon: "settings" },
      ]}
      tabs={[
        { href: "/r/deck", label: "Deck", icon: "deck" },
        { href: "/r/roles", label: "Roles", icon: "briefcase" },
        { href: "/r/pipeline", label: "Pipeline", icon: "kanban" },
        { href: "/r/chat", label: "Chat", icon: "chat" },
      ]}
      sideExtra={<UnlockMeter />}
      topActions={
        <>
          <TopIcon href="/r/chat" icon="bell" label="Notifications, 1 unread" dot />
        </>
      }
    >
      {children}
    </AppShell>
  );
}
