import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { RoleWizard } from "./wizard";

export const metadata: Metadata = { title: "Create role" };

export default async function NewRole({ searchParams }: { searchParams: Promise<{ step?: string }> }) {
  const step = Math.min(4, Math.max(1, Number((await searchParams).step) || 1));
  return (
    <div>
      <PageHead eyebrow="New role" title="Open a role" lede="Three steps. Candidates see the pay band as a chip, never the raw numbers." />
      <RoleWizard initial={step} />
    </div>
  );
}
