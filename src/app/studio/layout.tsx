import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s · MIYO Studio", default: "MIYO Studio" },
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
};

/** Studio keeps the Outfit and Fraunces stylesheet the public site used to load in the root layout, so it looks exactly as before. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
        precedence="default"
      />
      {children}
    </>
  );
}
