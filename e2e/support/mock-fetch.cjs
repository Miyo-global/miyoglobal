const real = globalThis.fetch;
const fs = require("fs");
const objects = new Map();
const log = (line) => fs.appendFileSync("/tmp/miyo-e2e-mock-calls.log", line + "\n");

globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url ?? String(input);
  const method = init?.method ?? input.method ?? "GET";
  if (url.includes(".r2.cloudflarestorage.com/")) {
    const key = new URL(url).pathname;
    log(`R2 ${method} ${key}`);
    if (method === "PUT") {
      objects.set(key, await new Request(input, init).arrayBuffer());
      return new Response(null, { status: 200 });
    }
    if (method === "DELETE") {
      objects.delete(key);
      return new Response(null, { status: 204 });
    }
    return objects.has(key) ? new Response(objects.get(key)) : new Response(null, { status: 404 });
  }
  if (url.startsWith("https://api.zeptomail.test/")) {
    log(`ZEPTO ${new Headers(init.headers).get("authorization")} ${init.body}`);
    return new Response(JSON.stringify({ data: [] }), { status: 201 });
  }
  if (url.startsWith("https://api.indexnow.org/")) {
    log(`INDEXNOW ${init.body}`);
    return new Response("", { status: 200 });
  }
  if (url.startsWith("https://apps.test/")) {
    const body = init?.body ? String(init.body) : "";
    log(`APPS ${method} ${url} ${body.includes('"secret":"s3cret"') ? "HAS_SECRET" : body ? "NO_SECRET" : ""}`);
    return new Response(JSON.stringify(method === "POST" ? { status: "success" } : { status: "success", jobs: [] }), { status: 200 });
  }
  return real(input, init);
};
