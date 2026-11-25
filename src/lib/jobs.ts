/**
 * Turns raw rows from the referral sheet (jobId, role, location, free-text description) into structured roles.
 * The sheet has no columns for pay, work mode or contract type, so those are read from "Key: value" lines in the
 * description when a recruiter wrote them, and left unset otherwise. Nothing here invents a fact the sheet lacks.
 */

export type RawJob = { jobId?: unknown; role?: unknown; location?: unknown; description?: unknown; status?: unknown; createdDate?: unknown };

export type Section = { heading: string; paragraphs: string[]; bullets: string[] };

export type Role = {
  ref: string;
  slug: string;
  title: string;
  location: string | null;
  cities: string[];
  workMode: "Remote" | "Hybrid" | "On-site" | null;
  contract: string | null;
  experience: string | null;
  minYears: number | null;
  level: string | null;
  fn: string;
  ctc: string | null;
  notice: string | null;
  openings: number | null;
  posted: string | null;
  pitch: string;
  role: Section[];
  doing: Section[];
  bring: Section[];
  other: Section[];
  plain: string;
};

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v)).trim();

export function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-[^-]*$/, (tail) => (tail.length > 1 && /-$/.test(tail) ? "" : tail))
    .replace(/-+$/, "");
}

/** Lines that identify the client or vendor system; mandates are confidential, so they never reach the page. */
const HIDDEN_KEYS = /^(vms id|client|grade|reporting to|reports to|hiring manager|hm email|email)$/i;

/** "Key: value" header lines recruiters put at the top of a description. */
const FIELD = /^\s*[•\-*]?\s*([A-Za-z][A-Za-z /&()'.]{1,32}?)\s*[:：]\s*(.+)$/;

const FIELD_KEYS: Record<string, keyof Fields> = {
  "experience": "experience",
  "total experience": "experience",
  "years of experience": "experience",
  "location": "location",
  "locations": "location",
  "job location": "location",
  "ctc": "ctc",
  "ctc budget": "ctc",
  "budget": "ctc",
  "salary": "ctc",
  "package": "ctc",
  "notice period": "notice",
  "notice": "notice",
  "employment type": "contract",
  "job type": "contract",
  "contract": "contract",
  "work mode": "workMode",
  "mode": "workMode",
  "work model": "workMode",
  "positions": "openings",
  "number of positions": "openings",
  "no of positions": "openings",
  "openings": "openings",
  "job title": "title",
  "role": "title",
  "position": "title",
};

type Fields = { experience?: string; location?: string; ctc?: string; notice?: string; contract?: string; workMode?: string; openings?: string; title?: string };

const BULLET = /^\s*(?:[•●▪◦‣∙·*]|-(?=\s)|\d{1,2}[.)](?=\s))\s*/;

const DOING = /respons|what you('|’)?ll do|what you will do|duties|day[- ]to[- ]day|role overview|key result|scope|accountabilit|deliverables|your work/i;
const BRING = /skill|requirement|qualif|must have|nice to have|good to have|who (we|you)|what you bring|what you('|’)?ll bring|experience|certif|ideal candidate|profile|expertise|competenc|knowledge|education|preferred/i;
const ROLE = /about|overview|summary|description|purpose|mission|opportunit|the role|who we need|why/i;

/** A heading is a short line that ends in ":" or reads like a section title, never a sentence. */
function headingOf(line: string): string | null {
  const t = line.trim().replace(/\s+/g, " ");
  if (!t || t.length > 60 || BULLET.test(line)) return null;
  const bare = t.replace(/[:：]\s*$/, "");
  if (/[.!?]$/.test(bare) || bare.split(" ").length > 8) return null;
  if (/[:：]$/.test(t)) return bare;
  if (DOING.test(bare) || BRING.test(bare) || ROLE.test(bare)) return /^[A-Z]/.test(bare) ? bare : null;
  return null;
}

/** Joins hard-wrapped PDF lines: a line that does not end a sentence and is followed by a lowercase start continues it. */
function unwrap(lines: string[]): string[] {
  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.replace(/\s+/g, " ").trim();
    if (!line) {
      out.push("");
      continue;
    }
    const prev = out.at(-1);
    const continues = prev && !BULLET.test(raw) && (/^[a-z(]/.test(line) || /[-–,]$/.test(prev)) && !/[.:!?]$/.test(prev);
    if (continues) out[out.length - 1] = `${prev.replace(/-$/, "")}${/-$/.test(prev) ? "" : " "}${line}`;
    else out.push(BULLET.test(raw) ? `• ${line.replace(BULLET, "")}` : line);
  }
  return out;
}

function parseSections(text: string, fields: Fields): Section[] {
  const sections: Section[] = [];
  let cur: Section = { heading: "", paragraphs: [], bullets: [] };
  const push = () => {
    if (cur.paragraphs.length || cur.bullets.length) sections.push(cur);
  };
  for (const line of unwrap(text.split(/\r?\n/))) {
    if (!line) continue;
    const field = FIELD.exec(line);
    if (field) {
      const key = field[1].trim().toLowerCase();
      if (HIDDEN_KEYS.test(key)) continue;
      const mapped = FIELD_KEYS[key];
      if (mapped) {
        fields[mapped] ??= field[2].trim();
        continue;
      }
    }
    const heading = headingOf(line);
    if (heading) {
      push();
      cur = { heading, paragraphs: [], bullets: [] };
      continue;
    }
    if (line.startsWith("• ")) cur.bullets.push(line.slice(2));
    else if (cur.bullets.length && line.length < 220 && !/[.]$/.test(line)) cur.bullets.push(line);
    else cur.paragraphs.push(line);
  }
  push();
  return sections;
}

const CITY_ALIASES: Record<string, string> = { bangalore: "Bengaluru", bengaluru: "Bengaluru", tvm: "Thiruvananthapuram", trivandrum: "Thiruvananthapuram", gurgaon: "Gurugram", bombay: "Mumbai" };

export function citiesOf(location: string): string[] {
  return [
    ...new Set(
      location
        .replace(/\(.*?\)/g, "")
        .split(/[/,|;]| or | and /i)
        .map((c) => c.replace(/[-–].*$/, "").trim())
        .filter((c) => c && !/^(remote|hybrid|on-?site|pan india|india|offshore|wfo|wfh)$/i.test(c))
        .map((c) => CITY_ALIASES[c.toLowerCase()] ?? c.replace(/\b\w/g, (ch) => ch.toUpperCase())),
    ),
  ];
}

function modeIn(t: string): Role["workMode"] {
  if (/\bhybrid\b/.test(t)) return "Hybrid";
  if (/\bremote\b|work from home|\bwfh\b|offshore \(remote\)/.test(t)) return "Remote";
  if (/on-?site|work from office|\bwfo\b|in-office/.test(t)) return "On-site";
  return null;
}

/** The sheet's location column wins over the description, which often mentions remote collaboration in passing. */
const workModeOf = (...texts: string[]): Role["workMode"] => texts.map((t) => modeIn(t.toLowerCase())).find(Boolean) ?? null;

/** "12 LPA - 25 LPA" → "₹12–25 LPA"; anything unusual is shown as written. */
function payOf(ctc: string): string {
  const t = sentence(ctc);
  const m = /^(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lpa|l)?\s*(?:-|–|to)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lpa|lakhs?)\b/i.exec(t);
  return m ? `₹${m[1]}–${m[2]} LPA` : t;
}

/** Long experience notes ("4–8 years of experience, ideally ...") shown as their range alone. */
function shortExperience(e: string): string {
  const t = sentence(e).replace(/(\d)\s*[-–]\s*(\d)/g, "$1–$2").replace(/\b(years?|yrs?)\b/gi, (w) => (/^y/i.test(w) && /s$/i.test(w) ? "years" : w.toLowerCase()));
  if (t.length <= 28) return t;
  const m = /\d{1,2}\s*(?:[–-]\s*\d{1,2}\s*\+?|\+)?\s*(?:years?|yrs?)/i.exec(t);
  return m ? m[0].replace(/\s*([–-])\s*/, "–").replace(/yrs?$/i, "years") : t;
}

function contractOf(field: string | undefined, text: string): string | null {
  const t = `${field ?? ""} ${text}`.toLowerCase();
  if (/contract[- ]to[- ]hire|\bc2h\b/.test(t)) return "Contract-to-hire";
  if (field && /contract|temporary|fixed[- ]term/.test(field.toLowerCase())) return "Contract";
  if (/\bpermanent\b|full[- ]time/.test(t)) return "Full-time";
  if (/\bcontract (role|position|basis)\b|on contract/.test(t)) return "Contract";
  return null;
}

/** "3–6 Years", "8+ yrs", "Minimum 5 years" → the lower bound in years. */
export function minYearsOf(experience: string): number | null {
  const m = /(\d{1,2})(?:\s*\.\s*\d)?\s*(?:\+|[-–to ]+\s*\d{1,2})?\s*(?:years?|yrs?)/i.exec(experience) ?? /(\d{1,2})\s*(?:\+|[-–])/.exec(experience);
  return m ? Number(m[1]) : null;
}

function levelOf(title: string, minYears: number | null): string | null {
  const t = title.toLowerCase();
  if (/\b(head|director|vp|vice president|chief|principal)\b/.test(t)) return "Leadership";
  if (/\b(lead|architect)\b/.test(t) || (minYears ?? 0) >= 10) return "Lead";
  if (/\b(senior|sr\.?|manager)\b/.test(t) || (minYears ?? 0) >= 6) return "Senior";
  if (minYears !== null && minYears >= 3) return "Mid-level";
  if (minYears !== null || /\b(executive|associate|junior|trainee|analyst)\b/.test(t)) return "Associate";
  return null;
}

/** Function hubs, matched in order against the title first, then the description. */
export const FUNCTIONS: [name: string, test: RegExp][] = [
  ["Enterprise Applications", /\b(oracle|sap|ormb|blue yonder|crm ?next|businessnext|salesforce|workday|servicenow|dynamics|flexcube|obma|finacle|peoplesoft|erp)\b/i],
  ["Data & AI", /\b(data|gen ?ai|genai|machine learning|\bml\b|llm|ai engineer|analytics|bi developer|power bi|reporting engineer|mi \/ reporting)\b/i],
  ["Engineering", /\b(developer|engineer|full ?stack|java|golang|python|devops|cloud|sre|qa|tester|testing|architect|frontend|backend|mobile|security)\b/i],
  ["Finance & Risk", /\b(finance|accounting|accountant|audit|risk|compliance|treasury|reconciliation)\b/i],
  ["Business & Operations", /\b(sales|business development|marketing|customer success|field executive|operations|account manager|recruiter|hr|consultant)\b/i],
];

function functionOf(title: string, text: string): string {
  return FUNCTIONS.find(([, re]) => re.test(title))?.[0] ?? FUNCTIONS.find(([, re]) => re.test(text.slice(0, 600)))?.[0] ?? "Specialist Roles";
}

const sentence = (s: string) => s.replace(/\s+/g, " ").trim();

/** "Banking Domain: Prior exposure ..." → a short bold label and its text. */
export const LABEL = /^([A-Z][^:.]{1,48}):\s+(?=\S)/;

function pitchOf(sections: Section[], title: string): string {
  const first = sections.flatMap((s) => s.paragraphs).find((p) => p.length > 60) ?? sections.flatMap((s) => s.bullets)[0] ?? "";
  const one = sentence(first).replace(LABEL, "").split(/(?<=[.!?])\s/)[0] ?? "";
  if (one.length >= 40) return one.length > 220 ? `${one.slice(0, 217).trimEnd()}…` : one;
  return `${title}: an open MIYO Global mandate, screened and represented end to end by our talent team.`;
}

function bucket(sections: Section[]) {
  const role: Section[] = [];
  const doing: Section[] = [];
  const bring: Section[] = [];
  const other: Section[] = [];
  for (const [i, s] of sections.entries()) {
    const h = s.heading;
    if (!h) (i === 0 ? role : other).push(s);
    else if (DOING.test(h)) doing.push(s);
    else if (BRING.test(h)) bring.push(s);
    else if (ROLE.test(h)) role.push(s);
    else other.push(s);
  }
  // A description written as one bulleted list: the opening paragraph is the role, the bullets are the work.
  if (!doing.length && !bring.length && role.length === 1 && role[0].bullets.length) {
    doing.push({ heading: "", paragraphs: [], bullets: role[0].bullets });
    role[0] = { ...role[0], bullets: [] };
  }
  return { role, doing, bring, other };
}

function dateOf(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

export function normalizeJob(raw: RawJob): Role | null {
  const ref = str(raw.jobId).toUpperCase();
  const description = str(raw.description);
  if (!ref || !str(raw.role)) return null;
  if (str(raw.status) && !/^open$/i.test(str(raw.status))) return null;
  const fields: Fields = {};
  const sections = parseSections(description, fields);
  const title = sentence(
    str(raw.role)
      .replace(/^\s*(role overview|job title|position|role)\s*[:：-]\s*/i, "")
      .replace(/\s+_\s*|\s*_\s+/g, " · ")
      .replace(/_/g, " ")
      .replace(/\s*[-–]\s+|\s+[-–]\s*/g, " – "),
  );
  const location = str(raw.location) || fields.location?.trim() || null;
  const experience = fields.experience ? shortExperience(fields.experience) : null;
  const minYears = experience ? minYearsOf(experience) : null;
  const openings = fields.openings ? Number.parseInt(fields.openings, 10) || null : null;
  const { role, doing, bring, other } = bucket(sections);
  const plain = sentence(sections.flatMap((s) => [s.heading, ...s.paragraphs, ...s.bullets]).join(" "));
  return {
    ref,
    slug: `${slugify(title)}-${ref.toLowerCase()}`,
    title,
    location: location ? sentence(location) : null,
    cities: location ? citiesOf(location) : [],
    workMode: workModeOf(location ?? "", fields.workMode ?? "", description.slice(0, 400)),
    contract: contractOf(fields.contract, description),
    experience,
    minYears,
    level: levelOf(title, minYears),
    fn: functionOf(title, description),
    ctc: fields.ctc ? payOf(fields.ctc) : null,
    notice: fields.notice ? sentence(fields.notice) : null,
    openings,
    posted: dateOf(raw.createdDate),
    pitch: pitchOf(sections, title),
    role,
    doing,
    bring,
    other,
    plain,
  };
}

/** Normalises the sheet, drops closed and broken rows, and keeps slugs unique when the sheet repeats a jobId. */
export function normalizeJobs(raw: RawJob[]): Role[] {
  const seen = new Map<string, number>();
  const out: Role[] = [];
  for (const r of raw) {
    const job = normalizeJob(r);
    if (!job) continue;
    const n = seen.get(job.ref) ?? 0;
    seen.set(job.ref, n + 1);
    if (n) {
      job.ref = `${job.ref}-${n + 1}`;
      job.slug = `${job.slug}-${n + 1}`;
    }
    out.push(job);
  }
  return out;
}

/** The pitch is shown on its own above the description, so its sentence is dropped where the description starts with it. */
export function withoutPitch(sections: Section[], pitch: string): Section[] {
  const bare = pitch.replace(/…$/, "");
  return sections
    .map((s) => ({
      ...s,
      paragraphs: s.paragraphs.map((p) => (p.replace(LABEL, "").startsWith(bare) ? p.replace(LABEL, "").slice(bare.length).trim() : p)).filter(Boolean),
      bullets: s.bullets.filter((b) => b.replace(LABEL, "") !== bare),
    }))
    .filter((s) => s.paragraphs.length || s.bullets.length);
}

/** Roles in the same function first, then the same level, never the role itself. */
export function similarRoles(all: Role[], job: Role, max = 3): Role[] {
  const score = (r: Role) => (r.fn === job.fn ? 2 : 0) + (r.level === job.level ? 1 : 0) + (r.cities.some((c) => job.cities.includes(c)) ? 1 : 0);
  return all
    .filter((r) => r.slug !== job.slug)
    .map((r) => [score(r), r] as const)
    .sort((a, b) => b[0] - a[0] || a[1].title.localeCompare(b[1].title))
    .slice(0, max)
    .map(([, r]) => r);
}

/** What the listing page ships to the browser: no descriptions, just what the board filters and shows. */
export type RoleCard = Pick<Role, "ref" | "slug" | "title" | "location" | "cities" | "workMode" | "contract" | "experience" | "minYears" | "level" | "fn" | "ctc" | "posted" | "pitch">;

export const toCard = ({ ref, slug, title, location, cities, workMode, contract, experience, minYears, level, fn, ctc, posted, pitch }: Role): RoleCard => ({
  ref,
  slug,
  title,
  location,
  cities,
  workMode,
  contract,
  experience,
  minYears,
  level,
  fn,
  ctc,
  posted,
  pitch,
});
