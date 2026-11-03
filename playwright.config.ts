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
      ADMIN_HOST: `adm.localhost:${port}`,
      ADMIN_ORIGIN: `http://adm.localhost:${port}`,
      SITE_URL: `http://localhost:${port}`,
      UPLOAD_DIR: "/tmp/miyo-e2e-uploads",
      RESEND_API_KEY: "re_test",
      REFERRAL_ENDPOINT: "https://apps.test/exec",
      REFERRAL_SECRET: "s3cret",
      INDEXNOW_KEY: "e2ekey1234567890",
      NODE_OPTIONS: `--require ${process.cwd()}/e2e/support/mock-fetch.cjs`,
    },
  },
});
