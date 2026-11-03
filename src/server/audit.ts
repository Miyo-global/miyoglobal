import "server-only";
import { db } from "./db";
import { auditLog } from "./db/schema";

export async function audit(userId: string | null, action: string, target = "") {
  await db.insert(auditLog).values({ userId, action, target: target.slice(0, 200) });
}
