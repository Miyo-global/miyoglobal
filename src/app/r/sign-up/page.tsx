import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth-frame";
import { Verify } from "./verify";

export const metadata: Metadata = { title: "Verify your company" };

export default async function CompanyVerify({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const s = (await searchParams).state;
  return (
    <AuthFrame>
      <Verify initial={s === "pending" || s === "verified" || s === "rejected" ? s : "form"} />
    </AuthFrame>
  );
}
