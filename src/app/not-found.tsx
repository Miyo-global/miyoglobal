import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found-view";
import SiteLayout, { metadata as siteMetadata } from "./(site)/layout";

export const metadata: Metadata = {
  ...siteMetadata,
  title: { absolute: "Page not found | MIYO Global" },
  description: "This MIYO Global page does not exist or has moved. Find open jobs, our staffing and digital services, insights from the blog, or contact our team directly.",
  robots: { index: false, follow: false },
};

/** Any URL no route matches (and unknown blog URLs, rewritten here by src/proxy.ts) gets this page with a 404 status. */
export default function NotFound() {
  return (
    <SiteLayout>
      <NotFoundView />
    </SiteLayout>
  );
}
