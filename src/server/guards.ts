import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { can, type Capability } from "@/lib/roles";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireStaff(capability?: Capability) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.user.twoFactorEnabled) redirect("/setup-2fa");
  if (capability && !can(session.user.role, capability)) notFound();
  return session.user;
}
