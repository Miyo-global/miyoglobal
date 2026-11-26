import type { Metadata } from "next";
import { Otp } from "./otp";

export const metadata: Metadata = { title: "Verify your email" };

export default async function OtpPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return <Otp role={sp.role ?? "candidate"} email={sp.email ?? ""} isNew={sp.new === "1"} next={sp.next} />;
}
