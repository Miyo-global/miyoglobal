import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";

const adminHost = process.env.ADMIN_HOST ?? "adm.miyoglobal.com";
const adminOrigin = process.env.ADMIN_ORIGIN ?? `https://${adminHost}`;

export const auth = betterAuth({
  baseURL: adminOrigin,
  trustedOrigins: [adminOrigin],
  secret: process.env.BETTER_AUTH_SECRET,
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
      "/two-factor/verify-totp": { window: 60, max: 5 },
      "/two-factor/verify-backup-code": { window: 60, max: 5 },
    },
  },
  advanced: {
    useSecureCookies: adminOrigin.startsWith("https://"),
    cookiePrefix: "miyo-studio",
    ipAddress: { ipAddressHeaders: ["x-forwarded-for", "x-real-ip"] },
  },
  plugins: [twoFactor({ issuer: "MIYO Studio" }), nextCookies()],
});
