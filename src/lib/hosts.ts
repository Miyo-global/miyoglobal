export const ADMIN_URL = (process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://adm.miyoglobal.com").replace(/\/$/, "");
export const ADMIN_HOST = new URL(ADMIN_URL).hostname.toLowerCase();

export function normalizeHost(host: string): string {
  return host.split(":")[0].replace(/\.$/, "").toLowerCase();
}
