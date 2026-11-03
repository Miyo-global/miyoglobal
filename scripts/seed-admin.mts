import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { db } from "../src/server/db/index";
import { account, user } from "../src/server/db/auth-schema";
import { authors, categories } from "../src/server/db/schema";

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const name = process.env.SEED_ADMIN_NAME ?? "MIYO Admin";

if (!email || !password || password.length < 12) {
  throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (min 12 chars) are required");
}

const existing = await db.select().from(user).where(eq(user.email, email.toLowerCase()));

if (existing.length === 0) {
  const id = crypto.randomUUID();
  await db.insert(user).values({ id, name, email: email.toLowerCase(), emailVerified: true, role: "admin" });
  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: id,
    providerId: "credential",
    userId: id,
    password: await hashPassword(password),
  });
  await db.insert(authors).values({ userId: id, slug: "miyo-global-team", name }).onConflictDoNothing();
}

await db
  .insert(categories)
  .values([
    { slug: "staffing", name: "Staffing" },
    { slug: "digital", name: "Digital Solutions" },
    { slug: "hiring-guides", name: "Hiring Guides" },
  ])
  .onConflictDoNothing();

process.exit(0);
