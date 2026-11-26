import type { Metadata } from "next";
import { PageHead, Sample } from "@/components/ui";
import { CompaniesTable } from "./table";

export const metadata: Metadata = { title: "Companies" };

export default function Companies() {
  return (
    <div>
      <PageHead eyebrow="Moderation" title="Company verification" lede="Check work domain, registration and reliability. Rejections always carry a reason the company can see." />
      <CompaniesTable />
      <Sample />
    </div>
  );
}
