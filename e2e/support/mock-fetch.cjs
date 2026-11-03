const real = globalThis.fetch;
const fs = require("fs");
globalThis.fetch = async (url, init) => {
  const u = String(url);
  if (u.startsWith("https://api.resend.com/")) {
    fs.appendFileSync("/tmp/miyo-e2e-mock-calls.log", "RESEND " + init.body + "\n");
    return new Response(JSON.stringify({ id: "x" }), { status: 200 });
  }
  if (u.startsWith("https://api.indexnow.org/")) {
    fs.appendFileSync("/tmp/miyo-e2e-mock-calls.log", "INDEXNOW " + init.body + "\n");
    return new Response("", { status: 200 });
  }
  if (u.startsWith("https://apps.test/")) {
    const b = init && init.body ? String(init.body) : "";
    fs.appendFileSync("/tmp/miyo-e2e-mock-calls.log", "APPS " + (init && init.method || "GET") + " " + u + " " + (b.includes('"secret":"s3cret"') ? "HAS_SECRET" : b ? "NO_SECRET" : "") + "\n");
    return new Response(JSON.stringify(init && init.method === "POST" ? { status: "success" } : { status: "success", jobs: [] }), { status: 200 });
  }
  return real(url, init);
};
