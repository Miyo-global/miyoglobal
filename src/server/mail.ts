import "server-only";

type Attachment = { name: string; mimeType: string; content: string };
type Mail = { to: string; subject: string; text: string; replyTo?: { address: string; name?: string }; attachments?: Attachment[] };

export async function sendMail({ to, subject, text, replyTo, attachments }: Mail): Promise<boolean> {
  const { ZEPTOMAIL_API_URL: url, ZEPTOMAIL_API_TOKEN: token, EMAIL_FROM_ADDRESS: from, EMAIL_REPLY_TO: fallback } = process.env;
  if (!url || !token || !from) {
    console.error("mail: ZeptoMail is not configured");
    return false;
  }
  const reply = replyTo ?? (fallback ? { address: fallback } : null);
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Zoho-enczapikey ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      bounce_address: process.env.ZEPTOMAIL_BOUNCE_ADDRESS,
      from: { address: from, name: process.env.EMAIL_FROM_NAME },
      to: [{ email_address: { address: to } }],
      ...(reply ? { reply_to: [reply] } : {}),
      subject,
      textbody: text,
      ...(attachments?.length ? { attachments: attachments.map((a) => ({ name: a.name, mime_type: a.mimeType, content: a.content })) } : {}),
    }),
    signal: AbortSignal.timeout(attachments?.length ? 20000 : 10000),
  }).catch(() => null);
  if (!res?.ok) console.error("mail: ZeptoMail rejected the message", res?.status);
  return !!res?.ok;
}
