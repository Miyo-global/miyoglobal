import type { Metadata } from "next";
import { PageHead, Sample } from "@/components/ui";
import { PlansAdmin } from "./plans";

export const metadata: Metadata = { title: "Plans and payments" };

export default function Plans() {
  return (
    <div>
      <PageHead eyebrow="Revenue" title="Plans and payments" lede="All payments in the beta are simulated." />
      <PlansAdmin />
      <Sample />
    </div>
  );
}
