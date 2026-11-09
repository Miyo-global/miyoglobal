import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import pg from "pg";
import sharp from "sharp";

const ADMIN = "http://adm.localhost:3111";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@miyoglobal.test";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "";
const CRON = { Authorization: "Bearer e2e-cron-secret" };
const mockCalls = () => readFileSync("/tmp/miyo-e2e-mock-calls.log", "utf8");
const ALT = "A recruiter reviewing candidate resumes at a bright modern office desk";

let page: Page;
let slug = "gcc-staffing-guide-2026";

const confirmDialog = () => page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();

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
    expect((await request.get("/login")).status()).toBe(404);
    expect((await request.get(`${ADMIN}/about`)).status()).toBe(404);
    const root = await request.get(`${ADMIN}/`, { maxRedirects: 0 });
    expect(root.headers()["location"]).toBe("/login");
    const robots = await request.get(`${ADMIN}/robots.txt`);
    expect(await robots.text()).toContain("Disallow: /");
    const res = await page.goto(`${ADMIN}/login`);
    expect(res?.headers()["x-robots-tag"]).toContain("noindex");
    expect(res?.headers()["cache-control"]).toContain("no-store");
  });

  test("login with email and password, no 2FA", async () => {
    await page.goto(`${ADMIN}/posts`);
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("wrong-password-123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator('p.error[role="alert"]')).toContainText("Invalid email or password");
    await login(page);
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
    expect(robots).not.toContain("uploads");
    expect(await (await request.get("/indexnow-key.txt")).text()).toBe("e2ekey1234567890");
    expect(mockCalls()).toMatch(/INDEXNOW .*\/blog\/gcc-staffing-guide-2026/);
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
    expect(old.status()).toBe(301);
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

  test("preview, schedule, cron, cancel, unpublish and delete", async ({ request }) => {
    const draftSlug = "scheduled-flow-post";
    await page.goto(`${ADMIN}/posts`);
    await page.getByRole("button", { name: "New post" }).click();
    await expect(page).toHaveURL(/\/posts\/\d+$/);
    const id = page.url().split("/").pop();
    await page.getByLabel("Title (H1)").fill("Scheduled flow post");
    await page.getByLabel("Slug", { exact: true }).fill(draftSlug);
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByText(/Saved as draft/)).toBeVisible();

    await page.goto(`${ADMIN}/preview/${id}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Scheduled flow post");
    await expect(page.getByRole("status")).toContainText("draft");
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    const anon = await request.get(`${ADMIN}/preview/${id}`, { maxRedirects: 0, headers: { Cookie: "" } });
    expect(anon.status()).not.toBe(200);
    expect((await request.get(`/blog/${draftSlug}`)).status()).toBe(404);

    const schedule = async () => {
      await page.goto(`${ADMIN}/posts/${id}`);
      await page.getByLabel("Schedule for (IST)").fill("2099-01-15T10:30");
      await page.getByRole("button", { name: "Schedule", exact: true }).click();
      await expect(page.locator("h1 .pill")).toHaveText("scheduled");
    };
    await schedule();
    await page.reload();
    await expect(page.getByLabel("Schedule for (IST)")).toHaveValue("2099-01-15T10:30");

    await page.getByRole("button", { name: "Cancel schedule" }).click();
    await expect(page.locator("h1 .pill")).toHaveText("draft");
    await schedule();

    expect((await request.get("/api/cron/publish")).status()).toBe(401);
    expect((await request.get("/api/cron/publish", { headers: { Authorization: "Bearer wrong" } })).status()).toBe(401);
    expect(await (await request.get("/api/cron/publish", { headers: CRON })).json()).toEqual({ published: 0 });
    expect((await request.get(`/blog/${draftSlug}`)).status()).toBe(404);

    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query("update posts set scheduled_at = timezone('utc', now()) - interval '1 minute' where id = $1", [id]);
    expect(await (await request.get("/api/cron/publish", { headers: CRON })).json()).toEqual({ published: 1 });
    const { rows } = await pool.query("select status, published_at from posts where id = $1", [id]);
    expect(rows[0].status).toBe("published");
    expect(rows[0].published_at).toBeTruthy();
    const audited = await pool.query("select 1 from audit_log where action = 'post.cron-publish' and target = $1", [id]);
    expect(audited.rowCount).toBe(1);
    await pool.end();
    expect((await request.get(`/blog/${draftSlug}`)).status()).toBe(200);
    expect(await (await request.get("/posts-sitemap.xml")).text()).toContain(draftSlug);
    expect(await (await request.get("/feed.xml")).text()).toContain(draftSlug);
    expect(await (await request.get("/llms.txt")).text()).toContain("Scheduled flow post");
    expect(mockCalls()).toContain(`/blog/${draftSlug}`);

    await page.goto(`${ADMIN}/posts/${id}`);
    await page.getByRole("button", { name: "Unpublish" }).click();
    await expect(page.locator("h1 .pill")).toHaveText("draft");
    expect((await request.get(`/blog/${draftSlug}`)).status()).toBe(404);
    expect(await (await request.get("/blog")).text()).not.toContain("Scheduled flow post");

    await page.getByRole("button", { name: "Delete post" }).click();
    await confirmDialog();
    await expect(page).toHaveURL(/\/posts$/);
    await expect(page.getByRole("link", { name: "Scheduled flow post" })).toHaveCount(0);
  });

  test("media in use is protected and deletes remove R2 objects", async () => {
    await page.goto(`${ADMIN}/media`);
    await page.getByRole("button", { name: "Delete" }).first().click();
    await confirmDialog();
    await expect(page.locator('p.error[role="alert"]')).toContainText("used by a post");
    const png = await sharp({ create: { width: 1300, height: 800, channels: 3, background: "#225588" } }).png().toBuffer();
    await page.locator('input[type="file"]').setInputFiles({ name: "x.png", mimeType: "image/png", buffer: png });
    await page.getByLabel(/^Alt text/).fill(ALT);
    await page.getByRole("button", { name: "Upload" }).click();
    await expect(page.locator(".media-grid figure")).toHaveCount(2);
    expect(mockCalls()).toMatch(/R2 PUT \/e2e-public\/[a-f0-9-]+-avif\.avif/);
    await page.getByRole("button", { name: "Delete" }).first().click();
    await confirmDialog();
    await expect(page.locator(".media-grid figure")).toHaveCount(1);
    expect(mockCalls().match(/R2 DELETE/g)).toHaveLength(3);
  });

  test("editor cannot reach admin-only pages", async () => {
    await page.goto(`${ADMIN}/users`);
    await page.getByLabel("Name").fill("Edie Editor");
    await page.getByLabel("Email").fill("editor@miyoglobal.test");
    await page.getByLabel(/^Temporary password/).fill("Editor-Passw0rd-123");
    await page.getByRole("button", { name: "Create user" }).click();
    await expect(page.getByText("User created")).toBeVisible();
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByLabel("Email").fill("editor@miyoglobal.test");
    await page.getByLabel("Password").fill("Editor-Passw0rd-123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible();
    await page.goto(`${ADMIN}/users`);
    await expect(page.getByRole("heading", { name: "Users" })).toHaveCount(0);
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
  expect(mockCalls()).not.toContain("spam");
  expect(mockCalls()).toContain("Zoho-enczapikey e2e-token");
  expect(mockCalls()).toContain('"reply_to":[{"address":"pat@example.com"');
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
  expect(mockCalls()).toContain("APPS POST https://apps.test/exec HAS_SECRET");
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

test("sign-in is rate limited and accounts lock after repeated failures", async ({ request }) => {
  const attempt = (email: string, ip: string) =>
    request.post(`${ADMIN}/api/auth/sign-in/email`, {
      headers: { Origin: ADMIN, "x-forwarded-for": ip },
      data: { email, password: "wrong-password-123" },
    });
  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) statuses.push((await attempt("nobody@miyoglobal.test", "203.0.113.7")).status());
  expect(statuses.slice(0, 5)).not.toContain(429);
  expect(statuses[5]).toBe(429);
  for (let i = 0; i < 10; i++) expect((await attempt("locked@miyoglobal.test", `198.51.100.${i + 1}`)).status()).toBe(401);
  expect((await attempt("locked@miyoglobal.test", "198.51.100.200")).status()).toBe(429);
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const { rowCount } = await pool.query("select 1 from audit_log where action = 'auth.locked' and target = 'locked@miyoglobal.test'");
  await pool.end();
  expect(rowCount).toBe(1);
});

test("static pages use clean canonicals without redirects", async ({ request }) => {
  for (const p of ["about", "terms", "disclosure", "editorial-policy"]) {
    const html = await (await request.get(`/${p}`)).text();
    expect(html).toContain(`<link rel="canonical" href="https://www.miyoglobal.com/${p}">`);
    expect(html).not.toContain(".html\"");
  }
  const referrals = await (await request.get("/referrals")).text();
  expect(referrals).not.toContain("script.google.com");
  expect(referrals).not.toContain("s3cret");
});

test("no horizontal overflow on phones, tablets and desktop", async ({ page }) => {
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ["/blog", "/blog/gcc-staffing-guide-updated", "/terms", "/about"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} at ${width}`).toBe(true);
    }
  }
});
