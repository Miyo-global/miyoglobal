import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Scheduler } from "@/components/scheduler";
import { PageHead, Sample } from "@/components/ui";
import { company, match } from "@/data/fixtures";

export const metadata: Metadata = { title: "Schedule interview" };

export default async function Schedule({ params }: { params: Promise<{ id: string }> }) {
  const m = match((await params).id);
  if (!m) notFound();
  const c = company(m.company)!;
  return (
    <div style={{ maxWidth: 1080 }}>
      <PageHead eyebrow={`${m.roleId} · ${c.name}`} title="Schedule your interview" lede={`${c.name} proposed a time for ${m.role}. Confirm it or suggest another.`} />
      <Scheduler with={c.name} />
      <Sample />
    </div>
  );
}
