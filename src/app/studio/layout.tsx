import type { Metadata } from "next";
import "./studio.css";

export const metadata: Metadata = {
  title: "MIYO Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="studio">{children}</div>;
}
