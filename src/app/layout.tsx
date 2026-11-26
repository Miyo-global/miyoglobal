import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { CookieBanner } from "@/components/client";
import "./globals.css";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--f-display" });
const sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--f-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--f-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://beta.miyoglobal.com"),
  title: { default: "MIYO Global Beta · Hiring, shown not told", template: "%s · MIYO Global Beta" },
  description: "Video-first, blind-first hiring for India and the UAE. Beta with sample data.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0b192f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
