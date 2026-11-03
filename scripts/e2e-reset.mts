import { execSync } from "node:child_process";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
await pool.query(
  'TRUNCATE "user","session","account","verification","two_factor","rate_limit","authors","categories","tags","posts","post_tags","media","revisions","redirects","audit_log","contact_rate_limit" RESTART IDENTITY CASCADE',
);
await pool.end();
execSync("pnpm db:seed", { stdio: "inherit" });
