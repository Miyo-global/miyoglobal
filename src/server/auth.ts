import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { and, count, desc, eq, gt } from "drizzle-orm";
import { ADMIN_URL } from "@/lib/hosts";
import { db } from "./db";
import * as schema from "./db/schema";

const GUARDED = new Set(["/sign-in/email"]);
const MAX_FAILURES = 10;
const LOCK_MS = 15 * 60 * 1000;

function auditTarget(email: unknown): string {
  return String(email ?? "").toLowerCase().slice(0, 200);
}

async function lockedOut(target: string): Promise<boolean> {
  const [lastOk] = await db
    .select({ at: schema.auditLog.createdAt })
    .from(schema.auditLog)
    .where(and(eq(schema.auditLog.action, "auth.ok"), eq(schema.auditLog.target, target)))
    .orderBy(desc(schema.auditLog.createdAt))
    .limit(1);
  const windowStart = new Date(Date.now() - LOCK_MS);
  const since = lastOk && lastOk.at > windowStart ? lastOk.at : windowStart;
  const [{ n }] = await db
    .select({ n: count() })
    .from(schema.auditLog)
    .where(and(eq(schema.auditLog.action, "auth.failed"), eq(schema.auditLog.target, target), gt(schema.auditLog.createdAt, since)));
  return n >= MAX_FAILURES;
}

function build() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("BETTER_AUTH_SECRET is not set");
  const baseURL = process.env.BETTER_AUTH_URL ?? ADMIN_URL;

  return betterAuth({
    baseURL,
    trustedOrigins: [baseURL, ADMIN_URL],
    secret,
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    user: {
      additionalFields: {
        role: { type: "string", required: true, defaultValue: "editor", input: false },
      },
    },
    session: { expiresIn: 60 * 60 * 12, updateAge: 60 * 30 },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 30,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/change-password": { window: 60, max: 5 },
      },
    },
    advanced: {
      useSecureCookies: baseURL.startsWith("https://"),
      cookiePrefix: "miyo-studio",
      ipAddress: { ipAddressHeaders: ["x-forwarded-for", "x-real-ip"] },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (!GUARDED.has(ctx.path)) return;
        const target = auditTarget(ctx.body?.email);
        if (await lockedOut(target)) {
          await db.insert(schema.auditLog).values({ action: "auth.locked", target });
          throw new APIError("TOO_MANY_REQUESTS", { message: "Too many failed attempts. Try again in 15 minutes." });
        }
      }),
      after: createAuthMiddleware(async (ctx) => {
        if (!GUARDED.has(ctx.path)) return;
        const failed = ctx.context.returned instanceof APIError;
        if (failed && (ctx.context.returned as APIError).status === "TOO_MANY_REQUESTS") return;
        const target = auditTarget(ctx.body?.email);
        await db.insert(schema.auditLog).values({ userId: ctx.context.newSession?.user.id ?? null, action: failed ? "auth.failed" : "auth.ok", target });
      }),
    },
    plugins: [nextCookies()],
  });
}

let instance: ReturnType<typeof build> | undefined;

export function getAuth() {
  return (instance ??= build());
}
