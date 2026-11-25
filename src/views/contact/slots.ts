/** Consultation slot picker data: 20-minute calls, 10:00 to 17:40 office time, on the next five working days. UI only; we confirm by email. */
export const ZONES = [
  { id: "IST", label: "India (IST)" },
  { id: "GST", label: "UAE (GST)" },
] as const;

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** 10:00, 10:20 … 17:40. */
export const SLOTS = Array.from({ length: 24 }, (_, i) => {
  const m = 600 + i * 20;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
});

/** The next five Monday-to-Friday dates after `from` (local calendar), labelled like "Tue 2 Dec". */
// ponytail: uses the visitor's calendar date, not office time; starting tomorrow keeps the gap harmless.
export function workingDays(from: Date, count = 5): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const w = d.getDay();
    if (w === 0 || w === 6) continue;
    const label = `${DAY[w]} ${d.getDate()} ${MONTH[d.getMonth()]}`;
    out.push({ value: label, label });
  }
  return out;
}

export const preferredCall = (day: string, time: string, zone: string) => `Preferred call: ${day}, ${time} ${zone}`;
