import "server-only";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { can, type Capability } from "@/lib/roles";
import { getAuth } from "./auth";

export async function getSession() {
  const requestHeaders = await headers();
  return getAuth().api.getSession({ headers: requestHeaders });
}

export async function requireStaff(capability?: Capability) {
  const session = await getSession();
  if (!session) {
    const pending = (await cookies()).getAll().some((c) => c.name.endsWith("miyo-studio.two_factor"));
    redirect(pending ? "/two-factor" : "/login");
  }
  if (!session.user.twoFactorEnabled) redirect("/setup-2fa");
  if (capability && !can(session.user.role, capability)) notFound();
  return session.user;
}
