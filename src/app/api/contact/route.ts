import { z } from "zod";
import { allow, clientIp, sameOrigin } from "@/server/request";

const body = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(160),
  company: z.string().trim().max(160).default(""),
  phone: z.string().trim().max(40).default(""),
  message: z.string().trim().min(1).max(4000),
  website: z.string().max(200).default(""),
});

const line = (s: string) => s.replace(/[\r\n]+/g, " ");
const json = (data: object, status = 200) => Response.json(data, { status });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: "Forbidden" }, 403);

  const form = await req.formData().catch(() => null);
  if (!form) return json({ ok: false, error: "Invalid request" }, 400);
  const parsed = body.safeParse(Object.fromEntries(form));
  if (!parsed.success) return json({ ok: false, error: "Please add your name, a valid work email, and a message." }, 422);
  const d = parsed.data;
  if (d.website) return json({ ok: true });

  const ip = clientIp(req);
  if (!(await allow(`contact:${ip}`, 5, 10 * 60 * 1000))) {
    return json({ ok: false, error: "Too many requests. Please try again later or email us directly." }, 429);
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("contact: RESEND_API_KEY is not set");
    return json({ ok: false, error: "Could not send right now. Please email staffing@miyoglobal.com directly." }, 500);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "MIYO Global <no-reply@miyoglobal.com>",
      to: [process.env.CONTACT_TO ?? "staffing@miyoglobal.com"],
      reply_to: d.email,
      subject: `Staffing enquiry from ${line(d.name)}${d.company ? ` (${line(d.company)})` : ""}`,
      text: `Name: ${line(d.name)}\nEmail: ${d.email}\nCompany: ${line(d.company)}\nPhone: ${line(d.phone)}\nIP: ${ip}\n\nMessage:\n${d.message}\n`,
    }),
    signal: AbortSignal.timeout(10000),
  }).catch(() => null);

  if (!res?.ok) {
    console.error("contact: Resend rejected the message", res?.status);
    return json({ ok: false, error: "Could not send right now. Please email staffing@miyoglobal.com directly." }, 502);
  }
  return json({ ok: true });
}
