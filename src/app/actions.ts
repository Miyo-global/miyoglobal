"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_OTP, DEMO_PASSWORD, demoAccounts, type Role } from "@/data/fixtures";
import { COOKIE } from "@/lib/session";

const isRole = (v: unknown): v is Role => v === "candidate" || v === "recruiter" || v === "admin";

async function start(role: Role) {
  (await cookies()).set(COOKIE, role, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
}

export async function switchRole(formData: FormData) {
  const role = formData.get("role");
  if (!isRole(role)) return;
  await start(role);
  redirect(demoAccounts[role].home);
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
  redirect("/auth/log-in?signed_out=1");
}

export type FormState = { error?: string; field?: string };

export async function logIn(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@")) return { error: "Enter a valid email address.", field: "email" };
  const role = (Object.keys(demoAccounts) as Role[]).find((r) => demoAccounts[r].email === email);
  if (!role || password !== DEMO_PASSWORD) return { error: "That email and password don't match a demo account.", field: "password" };
  if (role === "admin") return { error: "Admins sign in from the admin console.", field: "email" };
  const next = String(formData.get("next") ?? "");
  redirect(`/auth/otp?role=${role}&email=${encodeURIComponent(email)}${next.startsWith("/") && !next.startsWith("//") ? `&next=${encodeURIComponent(next)}` : ""}`);
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const role = formData.get("as") === "company" ? "recruiter" : "candidate";
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!name) return { error: "Enter your full name.", field: "name" };
  if (!email.includes("@")) return { error: "Enter a valid email address.", field: "email" };
  if (password.length < 8) return { error: "Use at least 8 characters.", field: "password" };
  if (!formData.get("terms")) return { error: "Accept the terms to continue.", field: "terms" };
  redirect(`/auth/otp?role=${role}&email=${encodeURIComponent(email)}&new=1`);
}

export async function verifyOtp(role: string, code: string, isNew: boolean, next?: string): Promise<{ ok: boolean; next?: string }> {
  if (code !== DEMO_OTP || !isRole(role)) return { ok: false };
  await start(role);
  if (isNew) return { ok: true, next: role === "recruiter" ? "/r/sign-up" : "/c/onboarding" };
  const prefix = role === "candidate" ? "/c" : "/r";
  return { ok: true, next: next?.startsWith(prefix + "/") ? next : demoAccounts[role].home };
}

export async function adminLogIn(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const code = String(formData.get("code") ?? "");
  const passkey = formData.get("passkey") === "1";
  if (!passkey) {
    if (email !== demoAccounts.admin.email || password !== DEMO_PASSWORD) return { error: "Those admin credentials aren't recognised.", field: "password" };
    if (code !== DEMO_OTP) return { error: "That authenticator code is wrong or expired.", field: "code" };
  }
  await start("admin");
  redirect("/admin");
}
