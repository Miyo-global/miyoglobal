import { z } from "zod";
import { sendMail } from "@/server/mail";
import { allow, clientIp, sameOrigin, tooLarge } from "@/server/request";

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

  if (tooLarge(req, 64 * 1024)) return json({ ok: false, error: "Message is too large" }, 413);
  const ip = clientIp(req);
  if (!(await allow(`contact:${ip}`, 5, 10 * 60 * 1000))) {
    return json({ ok: false, error: "Too many requests. Please try again later or email us directly." }, 429);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return json({ ok: false, error: "Invalid request" }, 400);
  const parsed = body.safeParse(Object.fromEntries(form));
  if (!parsed.success) return json({ ok: false, error: "Please add your name, a valid work email, and a message." }, 422);
  const d = parsed.data;
  if (d.website) return json({ ok: true });

  const sent = await sendMail({
    to: process.env.CONTACT_TO_EMAIL ?? "staffing@miyoglobal.com",
    replyTo: { address: d.email, name: line(d.name) },
    subject: `Staffing enquiry from ${line(d.name)}${d.company ? ` (${line(d.company)})` : ""}`,
    text: `Name: ${line(d.name)}\nEmail: ${d.email}\nCompany: ${line(d.company)}\nPhone: ${line(d.phone)}\nIP: ${ip}\n\nMessage:\n${d.message}\n`,
  });
  if (!sent) return json({ ok: false, error: "Could not send right now. Please email staffing@miyoglobal.com directly." }, 502);
  return json({ ok: true });
}
