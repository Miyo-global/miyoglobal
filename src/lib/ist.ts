const IST_MS = 5.5 * 60 * 60 * 1000;

export function toIstInput(iso: string | null): string {
  return iso ? new Date(new Date(iso).getTime() + IST_MS).toISOString().slice(0, 16) : "";
}

export function fromIstInput(value: string): string | null {
  return value ? new Date(`${value}:00+05:30`).toISOString() : null;
}
