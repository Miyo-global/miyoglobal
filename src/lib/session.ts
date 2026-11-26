import { cookies } from "next/headers";
import type { Role } from "@/data/fixtures";

export const COOKIE = "miyo_role";

export async function getRole(): Promise<Role | null> {
  const v = (await cookies()).get(COOKIE)?.value;
  return v === "candidate" || v === "recruiter" || v === "admin" ? v : null;
}
