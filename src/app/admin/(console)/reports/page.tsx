import type { Metadata } from "next";
import { PageHead, Sample } from "@/components/ui";
import { ReportsTable } from "./table";

export const metadata: Metadata = { title: "Reports and flags" };

export default function Reports() {
  return (
    <div>
      <PageHead eyebrow="Trust and safety" title="Reports and flags" lede="Reports from users, the auto-scan and the reliability monitor." />
      <ReportsTable />
      <Sample />
    </div>
  );
}
