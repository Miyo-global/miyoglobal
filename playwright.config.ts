import { defineConfig } from "@playwright/test";

const port = 3111;

export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  workers: 1,
  fullyParallel: false,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: `pnpm start -p ${port}`,
    port,
    reuseExistingServer: false,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      BETTER_AUTH_SECRET: "e2e-secret-e2e-secret-e2e-secret-0123456789",
      BETTER_AUTH_URL: `http://adm.localhost:${port}`,
      CRON_SECRET: "e2e-cron-secret",
      INDEXNOW_KEY: "e2ekey1234567890",
      R2_ACCOUNT_ID: "e2e",
      R2_ACCESS_KEY_ID: "e2e",
      R2_SECRET_ACCESS_KEY: "e2e",
      R2_PUBLIC_BUCKET: "e2e-public",
      ZEPTOMAIL_API_URL: "https://api.zeptomail.test/v1.1/email",
      ZEPTOMAIL_API_TOKEN: "e2e-token",
      ZEPTOMAIL_BOUNCE_ADDRESS: "bounce@miyoglobal.test",
      EMAIL_FROM_ADDRESS: "no-reply@miyoglobal.test",
      EMAIL_FROM_NAME: "MIYO Global",
      CONTACT_TO_EMAIL: "staffing@miyoglobal.test",
      REFERRAL_SCRIPT_URL: "https://apps.test/exec",
      REFERRAL_SCRIPT_SECRET: "s3cret",
      NODE_OPTIONS: `--require ${process.cwd()}/e2e/support/mock-fetch.cjs`,
    },
  },
});
