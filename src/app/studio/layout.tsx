import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s · MIYO Studio", default: "MIYO Studio" },
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
