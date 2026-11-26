import Link from "next/link";
import { Logo } from "@/components/ui";
import { Progress } from "./progress";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100dvh", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <header style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div className="wrap row between" style={{ height: 64, flexWrap: "nowrap" }}>
          <Logo href="/c/home" />
          <Link href="/c/home" className="btn btn-ghost">Save and exit</Link>
        </div>
        <div className="wrap" style={{ paddingBottom: 12 }}>
          <Progress />
        </div>
      </header>
      <main id="main">{children}</main>
    </div>
  );
}
