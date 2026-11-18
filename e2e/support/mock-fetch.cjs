const real = globalThis.fetch;
const fs = require("fs");
const http = require("http");
const net = require("net");
const tls = require("tls");
const objects = new Map();
const log = (line) => fs.appendFileSync("/tmp/miyo-e2e-mock-calls.log", line + "\n");
const R2_HOST = /\.r2\.cloudflarestorage\.com$/;

const r2 = http.createServer((req, res) => {
  const key = new URL(req.url, "http://r2").pathname;
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    log(`R2 ${req.method} ${key}`);
    if (req.method === "PUT") {
      if (req.headers["content-length"] === undefined || req.headers["transfer-encoding"]) {
        log(`R2 411 ${key}`);
        res.writeHead(411, { "Content-Type": "application/xml" });
        return res.end("<Error><Code>MissingContentLength</Code><Message>You must provide the Content-Length HTTP header.</Message></Error>");
      }
      objects.set(key, Buffer.concat(chunks));
      return res.writeHead(200).end();
    }
    if (req.method === "DELETE") {
      objects.delete(key);
      return res.writeHead(204).end();
    }
    if (!objects.has(key)) return res.writeHead(404).end();
    res.writeHead(200).end(objects.get(key));
  });
});

const dispatcherKey = Symbol.for("undici.globalDispatcher.1");
const ready = new Promise((resolve) => {
  r2.listen(0, "127.0.0.1", async () => {
    await real(`http://127.0.0.1:${r2.address().port}/__init`).catch(() => null);
    const Agent = globalThis[dispatcherKey].constructor;
    globalThis[dispatcherKey] = new Agent({
      connect({ hostname, port, protocol }, cb) {
        const local = R2_HOST.test(hostname);
        const socket = local
          ? net.connect(r2.address().port, "127.0.0.1")
          : protocol === "https:"
            ? tls.connect({ host: hostname, port: Number(port) || 443, servername: hostname, ALPNProtocols: ["http/1.1"] })
            : net.connect(Number(port) || 80, hostname);
        socket.once(local || protocol !== "https:" ? "connect" : "secureConnect", () => cb(null, socket));
        socket.once("error", (e) => cb(e));
      },
    });
    resolve();
  });
  r2.unref();
});

globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url ?? String(input);
  const method = init?.method ?? input.method ?? "GET";
  if (url.includes(".r2.cloudflarestorage.com/")) {
    await ready;
    return real(input, init);
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
