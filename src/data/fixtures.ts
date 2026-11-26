export type Band = "In-Band" | "Stretch" | "Out-of-Band";
export type Role = "candidate" | "recruiter" | "admin";

export const DEMO_OTP = "123456";
export const DEMO_PASSWORD = "MiyoBeta-2026";
export const FREE_UNLOCKS = 5;

export const demoAccounts: Record<Role, { email: string; name: string; home: string; title: string }> = {
  candidate: { email: "ananya@demo.miyoglobal.com", name: "Ananya Rao", home: "/c/home", title: "Senior React Developer" },
  recruiter: { email: "kiran@northbridge.demo", name: "Kiran P.", home: "/r/deck", title: "Talent Lead, Northbridge Systems" },
  admin: { email: "meera@miyoglobal.com", name: "Meera D.", home: "/admin", title: "Platform Admin" },
};

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;
export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export type Criterion = { label: string; score: number; note: string };
export type Candidate = {
  id: string;
  name: string;
  blind: string;
  title: string;
  city: string;
  notice: string;
  years: number;
  img: string;
  wide: string;
  fit: number;
  band: Band;
  pay: string;
  criteria: Criterion[];
  skills: { name: string; verified: boolean }[];
  certs: { name: string; issuer: string; verified: boolean }[];
  quote: string;
  transcript: { t: string; text: string }[];
  mutual?: boolean;
  available: string;
};

const t = (lines: string[]) => lines.map((text, i) => ({ t: `00:${String(i * 8).padStart(2, "0")}`, text }));

export const candidates: Candidate[] = [
  {
    id: "c-ananya",
    name: "Ananya Rao",
    blind: "Ananya R.",
    title: "Senior React Developer",
    city: "Hyderabad",
    notice: "30 days",
    years: 7,
    img: "/media/ananya.webp",
    wide: "/media/ananya-wide.webp",
    fit: 94,
    band: "In-Band",
    pay: "₹38,00,000 per year",
    criteria: [
      { label: "React and TypeScript depth", score: 98, note: "Shipped a design system used by 40 product teams." },
      { label: "Pay-band overlap", score: 92, note: "Expectation sits inside the role band." },
      { label: "Notice and relocation", score: 90, note: "30 days' notice, open to Dubai." },
    ],
    skills: [
      { name: "React 19", verified: true },
      { name: "TypeScript", verified: true },
      { name: "Next.js", verified: true },
      { name: "Accessibility", verified: true },
      { name: "GraphQL", verified: false },
    ],
    certs: [
      { name: "Professional Cloud Developer", issuer: "Cloud certification body", verified: true },
      { name: "Web Accessibility Specialist", issuer: "Accessibility association", verified: true },
    ],
    quote: "I rebuilt our checkout in React and cut page load from four seconds to under one.",
    transcript: t([
      "Hi, I'm Ananya, a senior React developer based in Hyderabad.",
      "For the last three years I've led the front end for a payments product.",
      "I rebuilt our checkout in React and cut page load from four seconds to under one.",
      "I care about accessible interfaces and calm, well-tested code.",
      "I'm looking for a product team in Hyderabad or Dubai where design matters.",
      "Thanks for watching. I'd be glad to talk.",
    ]),
    available: "30 days' notice",
  },
  {
    id: "c-mohammed",
    name: "Mohammed Al Farsi",
    blind: "Mohammed A.",
    title: "DevOps Engineer",
    city: "Dubai",
    notice: "15 days",
    years: 6,
    img: "/media/mohammed.webp",
    wide: "/media/mohammed.webp",
    fit: 88,
    band: "In-Band",
    pay: "AED 26,000 per month",
    criteria: [
      { label: "Kubernetes in production", score: 93, note: "Runs 300 services across three regions." },
      { label: "Pay-band overlap", score: 88, note: "Inside the band at the midpoint." },
      { label: "Availability", score: 84, note: "15 days' notice, Dubai based." },
    ],
    skills: [
      { name: "Kubernetes", verified: true },
      { name: "Terraform", verified: true },
      { name: "CI/CD", verified: true },
      { name: "Observability", verified: false },
    ],
    certs: [{ name: "Certified Kubernetes Administrator", issuer: "Open-source foundation", verified: true }],
    quote: "I moved our deploys from weekly to forty times a day without a single outage.",
    transcript: t([
      "I'm Mohammed, a DevOps engineer in Dubai.",
      "I moved our deploys from weekly to forty times a day without a single outage.",
      "I like platforms that make the right thing the easy thing.",
      "I'm available on 15 days' notice.",
    ]),
    mutual: true,
    available: "15 days' notice",
  },
  {
    id: "c-priya",
    name: "Priya Sharma",
    blind: "Priya S.",
    title: "Data Analyst",
    city: "Hyderabad",
    notice: "Immediate",
    years: 4,
    img: "/media/priya.webp",
    wide: "/media/priya.webp",
    fit: 81,
    band: "Stretch",
    pay: "₹18,00,000 per year",
    criteria: [
      { label: "SQL and modelling", score: 90, note: "Owns the revenue model for a retail group." },
      { label: "Pay-band overlap", score: 72, note: "Slightly above the top of the band." },
      { label: "Availability", score: 100, note: "Available immediately." },
    ],
    skills: [
      { name: "SQL", verified: true },
      { name: "Python", verified: true },
      { name: "Dashboards", verified: false },
    ],
    certs: [{ name: "Data Analytics Professional", issuer: "Analytics institute", verified: true }],
    quote: "My forecast model cut stock-outs by a fifth across 60 stores.",
    transcript: t([
      "Hello, I'm Priya, a data analyst in Hyderabad.",
      "My forecast model cut stock-outs by a fifth across 60 stores.",
      "I can start immediately.",
    ]),
    available: "Immediately",
  },
  {
    id: "c-rahul",
    name: "Rahul Kapoor",
    blind: "Rahul K.",
    title: "Finance Manager",
    city: "Ras Al Khaimah",
    notice: "60 days",
    years: 12,
    img: "/media/rahul.webp",
    wide: "/media/rahul.webp",
    fit: 76,
    band: "Out-of-Band",
    pay: "AED 38,000 per month",
    criteria: [
      { label: "IFRS reporting", score: 91, note: "Led two group audits with no findings." },
      { label: "Pay-band overlap", score: 54, note: "Expectation is above the band." },
      { label: "Notice", score: 70, note: "60 days' notice." },
    ],
    skills: [
      { name: "IFRS", verified: true },
      { name: "FP&A", verified: true },
      { name: "VAT (UAE)", verified: true },
    ],
    certs: [{ name: "Chartered Accountant", issuer: "Professional accounting body", verified: true }],
    quote: "I closed the books in five days instead of twelve.",
    transcript: t(["I'm Rahul, a finance manager in Ras Al Khaimah.", "I closed the books in five days instead of twelve.", "My notice period is 60 days."]),
    available: "60 days' notice",
  },
  {
    id: "c-fatima",
    name: "Fatima Hassan",
    blind: "Fatima H.",
    title: "HR Business Partner",
    city: "Dubai",
    notice: "30 days",
    years: 9,
    img: "/media/fatima.webp",
    wide: "/media/fatima.webp",
    fit: 85,
    band: "In-Band",
    pay: "AED 24,000 per month",
    criteria: [
      { label: "Workforce planning", score: 89, note: "Planned headcount for 1,200 staff." },
      { label: "Pay-band overlap", score: 86, note: "Inside the band." },
      { label: "Notice", score: 80, note: "30 days' notice." },
    ],
    skills: [
      { name: "Employee relations", verified: true },
      { name: "UAE labour law", verified: true },
      { name: "Talent reviews", verified: false },
    ],
    certs: [{ name: "Senior HR Professional", issuer: "HR institute", verified: true }],
    quote: "I cut regretted attrition in half in eighteen months.",
    transcript: t(["I'm Fatima, an HR business partner in Dubai.", "I cut regretted attrition in half in eighteen months."]),
    available: "30 days' notice",
  },
  {
    id: "c-vikram",
    name: "Vikram Tiwari",
    blind: "Vikram T.",
    title: "Cloud Architect",
    city: "Hyderabad",
    notice: "45 days",
    years: 11,
    img: "/media/vikram.webp",
    wide: "/media/vikram.webp",
    fit: 90,
    band: "In-Band",
    pay: "₹52,00,000 per year",
    criteria: [
      { label: "Multi-region design", score: 95, note: "Designed active-active across two clouds." },
      { label: "Pay-band overlap", score: 87, note: "Inside the band." },
      { label: "Notice", score: 78, note: "45 days' notice." },
    ],
    skills: [
      { name: "Cloud architecture", verified: true },
      { name: "Networking", verified: true },
      { name: "Cost control", verified: true },
    ],
    certs: [{ name: "Professional Solutions Architect", issuer: "Cloud certification body", verified: true }],
    quote: "I halved our cloud bill while doubling traffic.",
    transcript: t(["I'm Vikram, a cloud architect in Hyderabad.", "I halved our cloud bill while doubling traffic."]),
    available: "45 days' notice",
  },
  {
    id: "c-sneha",
    name: "Sneha Menon",
    blind: "Sneha M.",
    title: "QA Lead",
    city: "Hyderabad",
    notice: "30 days",
    years: 8,
    img: "/media/sneha.webp",
    wide: "/media/sneha.webp",
    fit: 83,
    band: "In-Band",
    pay: "₹26,00,000 per year",
    criteria: [
      { label: "Test automation", score: 88, note: "Built a suite of 4,000 end-to-end tests." },
      { label: "Pay-band overlap", score: 84, note: "Inside the band." },
      { label: "Notice", score: 80, note: "30 days' notice." },
    ],
    skills: [
      { name: "Playwright", verified: true },
      { name: "API testing", verified: true },
      { name: "Release management", verified: false },
    ],
    certs: [{ name: "Advanced Test Analyst", issuer: "Software testing board", verified: true }],
    quote: "Our escaped defects dropped by 70 percent in one year.",
    transcript: t(["I'm Sneha, a QA lead in Hyderabad.", "Our escaped defects dropped by 70 percent in one year."]),
    available: "30 days' notice",
  },
  {
    id: "c-omar",
    name: "Omar Bakri",
    blind: "Omar B.",
    title: "Operations Lead",
    city: "Ras Al Khaimah",
    notice: "30 days",
    years: 10,
    img: "/media/omar.webp",
    wide: "/media/omar.webp",
    fit: 79,
    band: "Stretch",
    pay: "AED 22,000 per month",
    criteria: [
      { label: "Warehouse operations", score: 86, note: "Runs a 40,000 sq ft fulfilment site." },
      { label: "Pay-band overlap", score: 70, note: "Just above the band." },
      { label: "Notice", score: 80, note: "30 days' notice." },
    ],
    skills: [
      { name: "Lean operations", verified: true },
      { name: "Inventory systems", verified: true },
      { name: "Team leadership", verified: false },
    ],
    certs: [{ name: "Lean Six Sigma Green Belt", issuer: "Quality institute", verified: true }],
    quote: "We raised on-time dispatch from 82 to 98 percent.",
    transcript: t(["I'm Omar, an operations lead in Ras Al Khaimah.", "We raised on-time dispatch from 82 to 98 percent."]),
    available: "30 days' notice",
  },
];

export const candidate = (id: string) => candidates.find((c) => c.id === id);
export const me = candidates[0];

export type Company = {
  id: string;
  name: string;
  city: string;
  img: string;
  about: string;
  tags: string[];
  reliability: number;
  size: string;
  domain: string;
  status: "Verified" | "Pending" | "Rejected";
};

export const companies: Company[] = [
  {
    id: "northbridge",
    name: "Northbridge Systems",
    city: "Hyderabad",
    img: "/media/northbridge.webp",
    about: "Northbridge builds payments and lending software for banks across India and the Gulf. Product teams of six to eight ship weekly.",
    tags: ["Hybrid", "Design-led", "Weekly releases", "Learning budget"],
    reliability: 97,
    size: "420 people",
    domain: "northbridge.demo",
    status: "Verified",
  },
  {
    id: "gulfline",
    name: "Gulfline Logistics",
    city: "Ras Al Khaimah",
    img: "/media/gulfline.webp",
    about: "Gulfline runs freight forwarding and warehousing for importers across the northern Emirates.",
    tags: ["On-site", "Operations", "Family-friendly hours"],
    reliability: 91,
    size: "1,100 people",
    domain: "gulfline.demo",
    status: "Verified",
  },
  {
    id: "meridian",
    name: "Meridian Fintech",
    city: "Dubai",
    img: "/media/meridian.webp",
    about: "Meridian builds treasury tools for mid-sized companies in the UAE and India.",
    tags: ["Hybrid", "Fintech", "Visa sponsorship"],
    reliability: 94,
    size: "180 people",
    domain: "meridian.demo",
    status: "Verified",
  },
  {
    id: "orchid",
    name: "Orchid Health Labs",
    city: "Hyderabad",
    img: "/media/orchid.webp",
    about: "Orchid runs diagnostic labs and a patient app across Telangana and Andhra Pradesh.",
    tags: ["Healthcare", "Mission-driven", "On-site"],
    reliability: 88,
    size: "650 people",
    domain: "orchid.demo",
    status: "Pending",
  },
  {
    id: "sandstone",
    name: "Sandstone Retail Group",
    city: "Dubai",
    img: "/media/sandstone.webp",
    about: "Sandstone operates 60 lifestyle stores across the UAE and Oman.",
    tags: ["Retail", "Omnichannel", "Staff discount"],
    reliability: 82,
    size: "2,400 people",
    domain: "sandstone.demo",
    status: "Rejected",
  },
];

export const company = (id: string) => companies.find((c) => c.id === id);

export type OpenRole = {
  id: string;
  title: string;
  company: string;
  city: string;
  mode: string;
  band: string;
  bandAed: string;
  status: "Open" | "Paused" | "Draft" | "Closed";
  inDeck: number;
  liked: number;
  matched: number;
  posted: string;
};

export const roles: OpenRole[] = [
  { id: "MIYO-HYD-0412", title: "Senior React Developer", company: "northbridge", city: "Hyderabad", mode: "Hybrid", band: "₹32–40 LPA", bandAed: "AED 14,000–17,500 / mo", status: "Open", inDeck: 24, liked: 6, matched: 2, posted: "12 Nov 2026" },
  { id: "MIYO-DXB-0388", title: "DevOps Engineer", company: "northbridge", city: "Dubai", mode: "On-site", band: "₹55–62 LPA", bandAed: "AED 24,000–27,000 / mo", status: "Open", inDeck: 18, liked: 4, matched: 1, posted: "04 Nov 2026" },
  { id: "MIYO-HYD-0405", title: "QA Lead", company: "northbridge", city: "Hyderabad", mode: "Hybrid", band: "₹24–30 LPA", bandAed: "AED 10,500–13,000 / mo", status: "Paused", inDeck: 9, liked: 2, matched: 0, posted: "28 Oct 2026" },
  { id: "MIYO-RAK-0419", title: "Finance Manager", company: "northbridge", city: "Ras Al Khaimah", mode: "On-site", band: "₹60–70 LPA", bandAed: "AED 26,000–30,000 / mo", status: "Draft", inDeck: 0, liked: 0, matched: 0, posted: "Not published" },
];

export type Match = {
  id: string;
  company: string;
  role: string;
  roleId: string;
  band: Band;
  pay: string;
  fit: number;
  status: "Request" | "Matched" | "Expiring";
  hoursLeft: number;
  isNew: boolean;
  when: string;
};

export const matches: Match[] = [
  { id: "m-1", company: "northbridge", role: "Senior React Developer", roleId: "MIYO-HYD-0412", band: "In-Band", pay: "₹32–40 LPA", fit: 94, status: "Request", hoursLeft: 38, isNew: true, when: "26 Nov 2026" },
  { id: "m-2", company: "meridian", role: "Lead Frontend Engineer", roleId: "MIYO-DXB-0371", band: "In-Band", pay: "AED 22,000–26,000 / mo", fit: 91, status: "Matched", hoursLeft: 31, isNew: false, when: "24 Nov 2026" },
  { id: "m-3", company: "orchid", role: "Frontend Platform Engineer", roleId: "MIYO-HYD-0399", band: "Stretch", pay: "₹28–34 LPA", fit: 86, status: "Expiring", hoursLeft: 6, isNew: false, when: "24 Nov 2026" },
  { id: "m-4", company: "sandstone", role: "React Developer, Commerce", roleId: "MIYO-DXB-0360", band: "Out-of-Band", pay: "AED 13,000–15,000 / mo", fit: 72, status: "Request", hoursLeft: 44, isNew: true, when: "26 Nov 2026" },
];

export const match = (id: string) => matches.find((m) => m.id === id);

export type Msg = { from: "me" | "them"; kind: "text" | "video" | "file"; text: string; at: string; meta?: string };
export type Thread = { id: string; company: string; person: string; role: string; unread: number; hoursLeft: number; messages: Msg[] };

export const threads: Thread[] = [
  {
    id: "t-1",
    company: "meridian",
    person: "Leena J., Engineering Manager",
    role: "Lead Frontend Engineer",
    unread: 2,
    hoursLeft: 31,
    messages: [
      { from: "them", kind: "text", text: "Hi Ananya, thanks for accepting. We loved the checkout story in your pitch.", at: "24 Nov 2026, 10:12 GST" },
      { from: "them", kind: "video", text: "How would you structure a design system for three product teams?", at: "24 Nov 2026, 10:14 GST", meta: "0:20 video question" },
      { from: "them", kind: "video", text: "Tell us about a release that went wrong and what you changed.", at: "24 Nov 2026, 10:14 GST", meta: "0:20 video question" },
      { from: "me", kind: "video", text: "Answer: design system structure", at: "25 Nov 2026, 19:40 IST", meta: "0:20 video reply" },
      { from: "me", kind: "text", text: "Recorded both answers. Happy to talk through either in more depth.", at: "25 Nov 2026, 19:42 IST" },
      { from: "them", kind: "file", text: "Role brief - Lead Frontend Engineer.pdf", at: "26 Nov 2026, 09:05 GST", meta: "PDF · 240 KB" },
      { from: "them", kind: "text", text: "Here's the role brief. Could you do a 45-minute call next week?", at: "26 Nov 2026, 09:06 GST" },
    ],
  },
  {
    id: "t-2",
    company: "northbridge",
    person: "Kiran P., Talent Lead",
    role: "Senior React Developer",
    unread: 0,
    hoursLeft: 38,
    messages: [{ from: "them", kind: "text", text: "Welcome to the shortlist. We'll send two short video questions shortly.", at: "26 Nov 2026, 11:30 IST" }],
  },
];

export const thread = (id: string) => threads.find((x) => x.id === id);

export const recruiterThreads = [
  { id: "rt-1", candidate: "c-mohammed", role: "DevOps Engineer", unread: 1, last: "Recorded both answers. Thanks for the questions.", when: "26 Nov 2026" },
  { id: "rt-2", candidate: "c-ananya", role: "Senior React Developer", unread: 0, last: "Looking forward to it.", when: "25 Nov 2026" },
  { id: "rt-3", candidate: "c-sneha", role: "QA Lead", unread: 0, last: "You sent 2 video questions.", when: "22 Nov 2026" },
];

export const notifications = [
  { id: "n1", kind: "match", text: "Northbridge Systems sent a match request for Senior React Developer.", when: "2h ago", unread: true },
  { id: "n2", kind: "chat", text: "Meridian Fintech sent you 2 video questions.", when: "Yesterday", unread: true },
  { id: "n3", kind: "clock", text: "Your match with Orchid Health Labs expires in 6 hours.", when: "Yesterday", unread: false },
  { id: "n4", kind: "check", text: "Your video pitch passed review and is live.", when: "21 Nov 2026", unread: false },
  { id: "n5", kind: "eye", text: "14 companies viewed your blind pitch this week.", when: "20 Nov 2026", unread: false },
];

export type Stage = "Liked" | "Requested" | "Matched" | "Interview" | "Offer" | "Archived";
export const stages: Stage[] = ["Liked", "Requested", "Matched", "Interview", "Offer", "Archived"];
export const pipeline: { id: string; candidate: string; role: string; stage: Stage; note: string }[] = [
  { id: "p1", candidate: "c-vikram", role: "MIYO-DXB-0388", stage: "Liked", note: "Liked 26 Nov 2026" },
  { id: "p2", candidate: "c-priya", role: "MIYO-HYD-0412", stage: "Liked", note: "Liked 25 Nov 2026" },
  { id: "p3", candidate: "c-sneha", role: "MIYO-HYD-0405", stage: "Requested", note: "Expires in 41h" },
  { id: "p4", candidate: "c-ananya", role: "MIYO-HYD-0412", stage: "Matched", note: "Matched 26 Nov 2026" },
  { id: "p5", candidate: "c-mohammed", role: "MIYO-DXB-0388", stage: "Interview", note: "03 Dec 2026, 14:00 GST" },
  { id: "p6", candidate: "c-fatima", role: "MIYO-DXB-0388", stage: "Offer", note: "Offer sent 20 Nov 2026" },
  { id: "p7", candidate: "c-omar", role: "MIYO-RAK-0419", stage: "Archived", note: "Pay band mismatch" },
];

export const team = [
  { name: "Kiran P.", email: "kiran@northbridge.demo", role: "Admin", last: "Today" },
  { name: "Arvind S.", email: "arvind@northbridge.demo", role: "Recruiter", last: "Yesterday" },
  { name: "Leena J.", email: "leena@northbridge.demo", role: "Recruiter", last: "24 Nov 2026" },
  { name: "Deepak R.", email: "deepak@northbridge.demo", role: "Viewer", last: "Invited" },
];

export const invoices = [
  { id: "INV-2026-1104", date: "01 Nov 2026", plan: "Free Trial", amount: "₹0", gst: "₹0", status: "Paid" },
  { id: "INV-2026-1003", date: "01 Oct 2026", plan: "Free Trial", amount: "₹0", gst: "₹0", status: "Paid" },
  { id: "INV-2026-0918", date: "18 Sep 2026", plan: "Extra unlocks × 3", amount: "₹1,050", gst: "₹189", status: "Paid" },
];

export type Plan = { id: string; name: string; inr: number | null; aed: number | null; usd: number | null; unlocks: string; seats: string; roles: string; blurb: string; featured?: boolean; extras: string[] };

export const plans: Plan[] = [
  { id: "free", name: "Free Trial", inr: 0, aed: 0, usd: 0, unlocks: "5 unlocks a month", roles: "1 open role", seats: "1 seat", blurb: "Try blind video hiring on one role.", extras: ["Swipe deck and fit scores", "48-hour match timer", "Email support"] },
  { id: "growth", name: "Growth", inr: 12500, aed: 549, usd: 149, unlocks: "50 unlocks a month", roles: "3 open roles", seats: "2 seats", blurb: "For teams hiring every month.", featured: true, extras: ["Everything in Free Trial", "Async video questions", "Expiring share links", "Analytics"] },
  { id: "team", name: "Team", inr: 42000, aed: 1830, usd: 499, unlocks: "250 unlocks a month", roles: "10 open roles", seats: "5 seats", blurb: "For hiring teams across offices.", extras: ["Everything in Growth", "Roles and permissions", "MIYO ATS sync", "Priority support"] },
  { id: "enterprise", name: "Enterprise", inr: null, aed: null, usd: null, unlocks: "Custom unlocks", roles: "Unlimited roles", seats: "Unlimited seats", blurb: "For large or regulated employers.", extras: ["Single sign-on (SSO)", "99.9% uptime SLA", "Dedicated success manager", "Custom data retention"] },
];

export const adminUsers = [
  { id: "U-10231", name: "Ananya Rao", email: "ananya@demo.miyoglobal.com", type: "Candidate", city: "Hyderabad", status: "Active", joined: "02 Nov 2026" },
  { id: "U-10232", name: "Mohammed Al Farsi", email: "mohammed@demo.miyoglobal.com", type: "Candidate", city: "Dubai", status: "Active", joined: "03 Nov 2026" },
  { id: "U-10240", name: "Priya Sharma", email: "priya@demo.miyoglobal.com", type: "Candidate", city: "Hyderabad", status: "Pending review", joined: "19 Nov 2026" },
  { id: "U-10244", name: "Rahul Kapoor", email: "rahul@demo.miyoglobal.com", type: "Candidate", city: "Ras Al Khaimah", status: "Active", joined: "20 Nov 2026" },
  { id: "U-10251", name: "Kiran P.", email: "kiran@northbridge.demo", type: "Recruiter", city: "Hyderabad", status: "Active", joined: "01 Nov 2026" },
  { id: "U-10252", name: "Leena J.", email: "leena@meridian.demo", type: "Recruiter", city: "Dubai", status: "Active", joined: "05 Nov 2026" },
  { id: "U-10260", name: "Omar Bakri", email: "omar@demo.miyoglobal.com", type: "Candidate", city: "Ras Al Khaimah", status: "Suspended", joined: "11 Nov 2026" },
  { id: "U-10263", name: "Sneha Menon", email: "sneha@demo.miyoglobal.com", type: "Candidate", city: "Hyderabad", status: "Active", joined: "14 Nov 2026" },
];

export const videoQueue = [
  { id: "V-3301", candidate: "c-priya", length: "0:58", submitted: "26 Nov 2026, 08:40 IST", scan: { av: true, profanity: true, face: true, length: true } },
  { id: "V-3302", candidate: "c-omar", length: "1:04", submitted: "26 Nov 2026, 09:12 GST", scan: { av: true, profanity: true, face: true, length: false } },
  { id: "V-3303", candidate: "c-sneha", length: "0:55", submitted: "26 Nov 2026, 10:01 IST", scan: { av: true, profanity: false, face: true, length: true } },
];

export const reports = [
  { id: "R-118", target: "Sandstone Retail Group", kind: "Company", reason: "Asked for contact details before match", by: "Candidate U-10244", when: "25 Nov 2026", severity: "High", status: "Open" },
  { id: "R-117", target: "Omar B.", kind: "Candidate", reason: "Video longer than 60 seconds", by: "Auto-scan", when: "25 Nov 2026", severity: "Low", status: "Open" },
  { id: "R-115", target: "Gulfline Logistics", kind: "Company", reason: "Did not reply within 48 hours (3 times)", by: "Reliability monitor", when: "23 Nov 2026", severity: "Medium", status: "Reviewing" },
  { id: "R-109", target: "Priya S.", kind: "Candidate", reason: "Certificate could not be verified", by: "Verification desk", when: "19 Nov 2026", severity: "Low", status: "Resolved" },
];

export const transactions = [
  { id: "TX-88412", company: "Meridian Fintech", plan: "Growth", amount: "AED 549", method: "Card", date: "25 Nov 2026", status: "Paid" },
  { id: "TX-88409", company: "Northbridge Systems", plan: "Extra unlocks × 3", amount: "₹1,050", method: "UPI", date: "24 Nov 2026", status: "Paid" },
  { id: "TX-88401", company: "Gulfline Logistics", plan: "Team", amount: "AED 1,830", method: "Bank transfer", date: "22 Nov 2026", status: "Failed" },
  { id: "TX-88397", company: "Orchid Health Labs", plan: "Growth", amount: "₹12,500", method: "Card", date: "21 Nov 2026", status: "Refunded" },
  { id: "TX-88390", company: "Sandstone Retail Group", plan: "Growth", amount: "AED 549", method: "Card", date: "20 Nov 2026", status: "Failed" },
];

export const audit = [
  { at: "26 Nov 2026, 11:42 IST", actor: "Meera D.", action: "video.approve", target: "V-3298", ip: "10.24.8.14" },
  { at: "26 Nov 2026, 11:30 IST", actor: "Imran S.", action: "company.verify", target: "Meridian Fintech", ip: "10.24.8.31" },
  { at: "26 Nov 2026, 10:05 IST", actor: "Meera D.", action: "user.suspend", target: "U-10260", ip: "10.24.8.14" },
  { at: "25 Nov 2026, 18:22 GST", actor: "System", action: "match.expire", target: "M-5521", ip: "internal" },
  { at: "25 Nov 2026, 16:10 IST", actor: "Imran S.", action: "refund.issue", target: "TX-88397", ip: "10.24.8.31" },
  { at: "25 Nov 2026, 09:00 IST", actor: "Meera D.", action: "flag.update", target: "free_unlocks = 5", ip: "10.24.8.14" },
  { at: "24 Nov 2026, 14:48 GST", actor: "Imran S.", action: "company.reject", target: "Sandstone Retail Group", ip: "10.24.8.31" },
  { at: "24 Nov 2026, 12:02 IST", actor: "Meera D.", action: "report.resolve", target: "R-109", ip: "10.24.8.14" },
];

export const pitchPrompts = [
  ["00:00–00:20", "Who are you and what do you do?", "Your role, years of experience and what you're best at."],
  ["00:20–00:40", "What's one thing you're proud of?", "A specific result, with a number if you can."],
  ["00:40–01:00", "What are you looking for next?", "The team, the work and the city you want."],
];
