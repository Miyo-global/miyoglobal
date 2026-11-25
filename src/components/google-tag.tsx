import Script from "next/script";
import { NOINDEX } from "@/lib/seo";

const GTM_ID = "GTM-5JZCNPRF";

export function GoogleTag() {
  if (NOINDEX) return null;
  return (
    <>
      <Script id="google-tag" strategy="afterInteractive">
        {"window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());"}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} strategy="afterInteractive" />
    </>
  );
}
