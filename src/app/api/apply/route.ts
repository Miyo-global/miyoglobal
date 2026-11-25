import { z } from "zod";
import { MAX_RESUME_BYTES, RESUME_TYPES, resumeBytesOk } from "@/lib/resume";
import { getRoles } from "@/server/jobs";
import { sendMail } from "@/server/mail";
import { allow, clientIp, sameOrigin, tooLarge } from "@/server/request";

const text = (max: number) => z.string().trim().max(max);

const body = z.object({
  ref: text(20).min(1),
  title: text(200).default(""),
  name: text(120).min(1),
  email: z.email().max(160),
  phone: z.string().trim().regex(/^[0-9+()\- ]{7,20}$/),
  linkedin: z.union([z.literal(""), z.url().max(200)]).default(""),
  notice: text(40).min(1),
  ctc: text(40).default(""),
  note: text(2000).default(""),
  consent: z.literal("yes"),
  website: z.string().max(200).default(""),
});

const line = (s: string) => s.replace(/[\r\n]+/g, " ");
const json = (data: object, status = 200) => Response.json(data, { status });

/** Direct application to one role: emailed with the CV attached to the talent desk (CONTACT_TO_EMAIL). Same guards as /api/contact. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: "Forbidden" }, 403);
  if (tooLarge(req, MAX_RESUME_BYTES + 64 * 1024)) return json({ ok: false, error: "The CV must be a PDF or DOCX of 3 MB or less." }, 413);
  const ip = clientIp(req);
  if (!(await allow(`apply:${ip}`, 5, 10 * 60 * 1000))) {
    return json({ ok: false, error: "Too many applications from this connection. Wait ten minutes, or email staffing@miyoglobal.com." }, 429);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return json({ ok: false, error: "Invalid request" }, 400);
  const cv = form.get("cv");
  const fields = Object.fromEntries([...form].filter(([, v]) => typeof v === "string"));
  const parsed = body.safeParse(fields);
  if (!parsed.success) return json({ ok: false, error: "Check your name, email, phone, notice period and consent, then send again." }, 422);
  const d = parsed.data;
  if (d.website) return json({ ok: true });

  if (!(cv instanceof File)) return json({ ok: false, error: "Attach a CV as a PDF or DOCX file." }, 422);
  const bytes = new Uint8Array(await cv.arrayBuffer());
  if (!resumeBytesOk(bytes, cv.name)) return json({ ok: false, error: "The CV must be a PDF or DOCX of 3 MB or less." }, 422);

  // The role must be open now; the title comes from the sheet, not the client.
  const role = (await getRoles()).find((r) => r.ref === d.ref.toUpperCase());
  if (!role) return json({ ok: false, error: "This role has just closed. Browse the other open roles or email staffing@miyoglobal.com." }, 410);

  const ext = cv.name.toLowerCase().endsWith(".pdf") ? "pdf" : "docx";
  const sent = await sendMail({
    to: process.env.CONTACT_TO_EMAIL ?? "staffing@miyoglobal.com",
    replyTo: { address: d.email, name: line(d.name) },
    subject: `Application: ${line(role.title)} (${role.ref}) from ${line(d.name)}`,
    text: [
      `Role: ${role.title} (${role.ref})`,
      `Name: ${line(d.name)}`,
      `Email: ${d.email}`,
      `Phone: ${line(d.phone)}`,
      `LinkedIn: ${d.linkedin || "-"}`,
      `Notice period: ${line(d.notice)}`,
      `Current CTC: ${line(d.ctc) || "-"}`,
      `Consent (privacy policy, GDPR/DPDP): yes`,
      `IP: ${ip}`,
      "",
      "Note:",
      d.note || "-",
      "",
    ].join("\n"),
    attachments: [{ name: `${line(d.name).replace(/[^\w .-]+/g, "").slice(0, 60) || "candidate"} - ${role.ref}.${ext}`, mimeType: RESUME_TYPES[ext], content: Buffer.from(bytes).toString("base64") }],
  });
  if (!sent) return json({ ok: false, error: "Your application did not go through. Email your CV to staffing@miyoglobal.com." }, 502);
  return json({ ok: true });
}
