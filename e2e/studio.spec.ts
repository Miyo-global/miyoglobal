import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";
import { totp } from "./support/totp";

const ADMIN = "http://adm.localhost:3111";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@miyoglobal.test";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "";
const ALT = "A recruiter reviewing candidate resumes at a bright modern office desk";

let page: Page;
let secret = "";
let slug = "gcc-staffing-guide-2026";

async function login(page: Page) {
  await page.goto(`${ADMIN}/login`);
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test.describe.serial("studio to public flow", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ baseURL: "http://localhost:3111" });
  });

  test("host lock", async ({ request }) => {
    expect((await request.get("/studio/login")).status()).toBe(404);
    expect((await request.get("/api/auth/get-session")).status()).toBe(404);
    expect((await request.get(`${ADMIN}/about`)).status()).toBe(404);
    const robots = await request.get(`${ADMIN}/robots.txt`);
    expect(await robots.text()).toContain("Disallow: /");
    const res = await page.goto(`${ADMIN}/login`);
    expect(res?.headers()["x-robots-tag"]).toContain("noindex");
    expect(res?.headers()["cache-control"]).toContain("no-store");
  });

  test("login forces 2FA setup", async () => {
    await page.goto(`${ADMIN}/posts`);
    await expect(page).toHaveURL(/\/login$/);
    await login(page);
    await expect(page).toHaveURL(/\/setup-2fa$/);
    await page.goto(`${ADMIN}/posts`);
    await expect(page).toHaveURL(/\/setup-2fa$/);
    await page.getByLabel("Confirm your password").fill(PASSWORD);
    await page.getByRole("button", { name: "Continue" }).click();
    secret = (await page.locator("code").first().innerText()).trim();
    expect(secret.length).toBeGreaterThan(10);
    await page.getByLabel("6-digit code").fill(totp(secret));
    await page.getByRole("button", { name: "Enable" }).click();
    await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible();
  });

  test("bad credentials and codes are rejected", async () => {
    await page.goto(`${ADMIN}/login`);
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("wrong-password-123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator('p.error[role="alert"]')).toContainText("Invalid email or password");
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/two-factor$/);
    await page.getByLabel("6-digit code").fill("000000");
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page.locator('p.error[role="alert"]')).toContainText("Invalid code");
    await page.getByLabel("6-digit code").fill(totp(secret));
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible();
  });

  test("write and publish a post", async () => {
    await page.getByRole("link", { name: "Posts" }).click();
    await page.getByRole("button", { name: "New post" }).click();
    await expect(page).toHaveURL(/\/posts\/\d+$/);

    await page.getByLabel("Title (H1)").fill("GCC staffing guide for 2026");
    await page.getByLabel("Quick answer / TL;DR").fill("A GCC staffing plan starts with scope, then hiring waves.");
    await page.locator(".tiptap").click();
    await page.keyboard.type("A GCC staffing programme needs a clear plan. ");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "H2", exact: true }).click();
    await page.keyboard.type("What is GCC staffing?");
    await page.keyboard.press("Enter");
    await page.keyboard.type("It is the hiring of teams for a global capability centre.");

    await page.getByLabel("Focus keyword").fill("GCC staffing");
    await page.getByLabel(/^Meta title/).fill("GCC staffing guide for 2026 | MIYO");
    await page.getByLabel(/^Meta description/).fill("x".repeat(150));
    await page.getByLabel("Category").selectOption({ label: "Staffing" });
    await page.getByLabel("Slug", { exact: true }).fill(slug);

    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText("Saved as published")).toBeVisible();
    await expect(page.locator("h1 .pill")).toHaveText("published");
  });

  test("cover upload enforces alt text and image rules", async () => {
    await page.getByRole("link", { name: "Media" }).click();

    const png = await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#336699" } }).png().toBuffer();
    const small = await sharp({ create: { width: 300, height: 200, channels: 3, background: "#996633" } }).png().toBuffer();
    const upload = async (buffer: Buffer, alt: string, name = "cover.png") => {
      await page.locator('input[type="file"]').setInputFiles({ name, mimeType: "image/png", buffer });
      await page.getByLabel(/^Alt text/).fill(alt);
      await page.getByRole("button", { name: "Upload" }).click();
    };

    await upload(png, "too short");
    await expect(page.locator('p.error[role="alert"]')).toContainText("8-20 words");
    await upload(small, ALT);
    await expect(page.locator('p.error[role="alert"]')).toContainText("at least 1200px");
    await page.locator('input[type="file"]').setInputFiles({ name: "x.png", mimeType: "image/png", buffer: Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'></svg>") });
    await page.getByLabel(/^Alt text/).fill(ALT);
    await page.getByRole("button", { name: "Upload" }).click();
    await expect(page.locator('p.error[role="alert"]')).toContainText("Only JPEG, PNG, WebP or AVIF");
    await upload(png, ALT);
    await expect(page.locator(".media-grid img").first()).toBeVisible();
  });

  test("attach cover and see the post publicly", async ({ request }) => {
    await page.getByRole("link", { name: "Posts" }).click();
    await page.getByRole("link", { name: "GCC staffing guide for 2026" }).click();
    await page.getByRole("button", { name: /Choose cover/ }).click();
    await page.getByRole("button", { name: "Use this image" }).first().click();
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByText("Saved as published")).toBeVisible();

    await page.goto(`/blog/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("GCC staffing guide for 2026");
    await expect(page.getByRole("navigation", { name: "In this article" })).toContainText("What is GCC staffing?");
    await expect(page.locator("#what-is-gcc-staffing")).toBeVisible();
    await expect(page.locator(".b-quick")).toContainText("Quick answer");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `http://localhost:3111/blog/${slug}`);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toBeTruthy();
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", ALT);
    const ogRes = await request.get(og as string);
    expect(ogRes.status()).toBe(200);
    expect(ogRes.headers()["content-type"]).toContain("image/webp");
    const meta = await sharp(await ogRes.body()).metadata();
    expect([meta.width, meta.height]).toEqual([1200, 630]);

    const ld = (await page.locator('script[type="application/ld+json"]').allInnerTexts()).map((t) => JSON.parse(t));
    expect(ld.map((x) => x["@type"])).toEqual(expect.arrayContaining(["BlogPosting", "BreadcrumbList"]));
    const article = ld.find((x) => x["@type"] === "BlogPosting");
    expect(article.headline).toBe("GCC staffing guide for 2026");
    expect(article.datePublished).toBeTruthy();
    expect(article.dateModified).toBeTruthy();

    await page.goto("/blog");
    await expect(page.getByRole("link", { name: "GCC staffing guide for 2026" }).first()).toBeVisible();
    await page.goto("/blog/search?q=GCC");
    await expect(page.getByText("1 result for")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("feeds, sitemaps, robots and llms.txt", async ({ request }) => {
    const index = await (await request.get("/sitemap.xml")).text();
    expect(index).toContain("pages-sitemap.xml");
    expect(index).toContain("posts-sitemap.xml");
    const posts = await (await request.get("/posts-sitemap.xml")).text();
    expect(posts).toContain(`/blog/${slug}`);
    expect(posts).toContain("<lastmod>");
    const pages = await (await request.get("/pages-sitemap.xml")).text();
    expect(pages).toContain("/editorial-policy");
    expect(pages).toContain("/blog/category/staffing");
    const rss = await request.get("/feed.xml");
    expect(rss.headers()["content-type"]).toContain("rss");
    expect(await rss.text()).toContain(`/blog/${slug}`);
    expect(await (await request.get("/llms.txt")).text()).toContain("GCC staffing guide for 2026");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /blog/search");
    expect(robots).toContain("GPTBot");
    expect(robots).toContain("posts-sitemap.xml");
    expect(await (await request.get("/indexnow-key.txt")).text()).toBe("e2ekey1234567890");
    const calls = (await import("node:fs")).readFileSync("/tmp/miyo-e2e-mock-calls.log", "utf8");
    expect(calls).toMatch(/INDEXNOW .*\/blog\/gcc-staffing-guide-2026/);
  });

  test("slug change 301s the old URL", async ({ request }) => {
    await page.goto(`${ADMIN}/posts`);
    await page.getByRole("link", { name: "GCC staffing guide for 2026" }).click();
    await page.getByLabel("Slug", { exact: true }).fill("search");
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.locator('p.error[role="alert"]')).toContainText("Slug must be");
    const next = "gcc-staffing-guide-updated";
    await page.getByLabel("Slug", { exact: true }).fill(next);
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByText("Saved as published")).toBeVisible();
    const old = await request.get(`/blog/${slug}`, { maxRedirects: 0 });
    expect([301, 308]).toContain(old.status());
    expect(old.headers()["location"]).toContain(`/blog/${next}`);
    expect((await request.get(`/blog/${next}`)).status()).toBe(200);
    slug = next;
  });

  test("noindex hides a post from the sitemap", async ({ request }) => {
    await page.goto(`${ADMIN}/posts`);
    await page.getByRole("link", { name: "GCC staffing guide for 2026" }).click();
    await page.getByLabel(/noindex/).check();
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByText("Saved as published")).toBeVisible();
    expect(await (await request.get("/posts-sitemap.xml")).text()).not.toContain(`/blog/${slug}`);
    await page.goto(`/blog/${slug}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("editor cannot reach admin-only pages", async () => {
    await page.goto(`${ADMIN}/users`);
    await page.getByLabel("Name").fill("Edie Editor");
    await page.getByLabel("Email").fill("editor@miyoglobal.test");
    await page.getByLabel(/^Temporary password/).fill("Editor-Passw0rd-123");
    await page.getByRole("button", { name: "Create user" }).click();
    await expect(page.getByText("User created")).toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByLabel("Email").fill("editor@miyoglobal.test");
    await page.getByLabel("Password").fill("Editor-Passw0rd-123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/setup-2fa$/);
    await page.goto(`${ADMIN}/users`);
    await expect(page).toHaveURL(/\/setup-2fa$/);
  });
});

test("contact form delivers and rate limits", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Pat Tester");
  await page.getByLabel("Work email").fill("pat@example.com");
  await page.getByLabel("What do you need?").fill("We need a team of ten engineers.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("#fnote")).toContainText("Thanks");
});

test("contact API rejects bad requests", async ({ request }) => {
  const origin = { Origin: "http://localhost:3111" };
  const form = { name: "Pat", email: "pat@example.com", message: "hello" };
  expect((await request.post("/api/contact", { multipart: form })).status()).toBe(403);
  expect((await request.post("/api/contact", { headers: origin, multipart: { ...form, email: "nope" } })).status()).toBe(422);
  const spam = await request.post("/api/contact", { headers: origin, multipart: { ...form, website: "http://spam" } });
  expect(await spam.json()).toEqual({ ok: true });
  const sent = (await import("node:fs")).readFileSync("/tmp/miyo-e2e-mock-calls.log", "utf8");
  expect(sent).not.toContain("spam");
  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) statuses.push((await request.post("/api/contact", { headers: origin, multipart: form })).status());
  expect(statuses).toContain(429);
});

test("referral API requires origin, valid resume and attaches the secret", async ({ request }) => {
  const origin = { Origin: "http://localhost:3111" };
  const pdf = Buffer.from("%PDF-1.4\n").toString("base64");
  const payload = {
    referrerName: "R", referrerContact: "r@example.com", referrerPhone: "9999999999",
    candidateName: "C", candidateEmail: "c@example.com", candidatePhone: "8888888888",
    jobApplied: "Dev", jobId: "J1", jobDescription: "d", hmEmail: "h@example.com",
    resumeBase64: pdf, resumeMimeType: "application/pdf", resumeFileName: "cv.pdf", website: "",
  };
  expect((await request.post("/api/referral", { data: payload })).status()).toBe(403);
  const bad = await request.post("/api/referral", { headers: origin, data: { ...payload, resumeBase64: Buffer.from("hello world").toString("base64") } });
  expect(bad.status()).toBe(422);
  expect((await request.post("/api/referral", { headers: origin, data: { ...payload, extra: 1 } })).status()).toBe(422);
  const ok = await request.post("/api/referral", { headers: origin, data: payload });
  expect(ok.status()).toBe(200);
  const calls = (await import("node:fs")).readFileSync("/tmp/miyo-e2e-mock-calls.log", "utf8");
  expect(calls).toContain("APPS POST https://apps.test/exec HAS_SECRET");
});

test("static pages keep their URLs", async ({ request }) => {
  for (const p of ["/", "/about", "/staffing-solutions", "/digital-solutions", "/case-studies", "/referrals", "/contact", "/privacy-policy", "/editorial-policy"]) {
    expect((await request.get(p)).status(), p).toBe(200);
  }
  const old = await request.get("/about.html", { maxRedirects: 0 });
  expect(old.status()).toBe(308);
  const missing = await request.get("/nope");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("Page not found");
});
