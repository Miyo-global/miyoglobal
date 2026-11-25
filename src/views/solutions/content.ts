/**
 * Copy for /staffing-solutions and /digital-solutions. Every statement here is already published on the site (the old page
 * copy, src/lib/pages.ts SERVICES lines, or the home "delivery ledger" copy). Do not add figures, clients or claims.
 */

export type Link = { label: string; href: string };

export type ServiceDetail = {
  title: string;
  what: string;
  who: string;
  how: string;
  points?: string[];
  link?: Link;
};

export type Faq = { q: string; a: string };

/** A comparison table: column headers, then rows whose first cell is the row header. */
export type Table = { id: string; eyebrow: string; title: string; lead: string; caption: string; columns: string[]; rows: string[][]; note?: { text: string; link: Link } };

export type Solution = {
  path: string;
  crumb: string;
  eyebrow: string;
  title: string;
  lead: string;
  primary: Link;
  secondary: Link;
  facts: { label: string; value: string }[];
  servicesTitle: string;
  servicesLead: string;
  services: Record<string, ServiceDetail>;
  table: Table;
  faq: Faq[];
  next: { text: string; link: Link };
};

const PRIME_STAFFING: Link = { label: "Prime Learning Staff Augmentation", href: "https://primelearning.ae/staffing" };
const PRIME: Link = { label: "Visit Prime Learning", href: "https://primelearning.ae" };

export const COMPLIANCE = {
  eyebrow: "Compliance",
  title: "One compliance shield, two entities",
  lead: "100% compliant with Indian labour law: Contract Labour (R&A) Act, EPF / ESI, and Shop & Establishment.",
  caption: "Legal entities and labour-law compliance, India and UAE",
  columns: ["Detail", "India", "UAE"],
  rows: [
    ["Legal entity", "Miyo Global Private Limited", "Prime Assets Education & Training Ltd."],
    ["Operating as", "MIYO Global", "Prime Learning"],
    ["Office", "Operations HQ, Hyderabad", "RAK DAO Business Centre, Ras Al Khaimah"],
    ["Contract Labour (R&A) Act", "Compliant", "Indian statute, not applicable"],
    ["EPF / ESI", "Compliant", "Indian statute, not applicable"],
    ["Shop & Establishment", "Compliant", "Indian statute, not applicable"],
  ],
};

export const staffing: Solution = {
  path: "/staffing-solutions",
  crumb: "Staffing Solutions",
  eyebrow: "Staffing Solutions",
  title: "Build teams with precision and full ownership",
  lead: "From a single hard-to-fill role to a complete capability centre, we source, vet, and deploy teams that plug into your operations and own outcomes.",
  primary: { label: "Hire talent", href: "/contact" },
  secondary: { label: "Compare engagement models", href: "#models" },
  facts: [
    { label: "Hires", value: "Contract, contract-to-hire, direct hire" },
    { label: "Screening", value: "Technical screening before submission" },
    { label: "Backouts", value: "Pre-screened alternates" },
    { label: "GCC locations", value: "Hyderabad, Bangalore, Pune, Noida, Chennai" },
  ],
  servicesTitle: "Six specialisms, one staffing engine",
  servicesLead: "Pick a line to see what it covers, who it is for, and how we deliver it.",
  services: {
    gcc: {
      title: "Stand up your capability centre in India",
      what: "Turnkey talent mapping, leadership hiring, and team build-outs across Hyderabad, Bangalore, Pune, Noida, and Chennai, with a structured path from first hires to a scaled, independent centre.",
      who: "Enterprises standing up a capability centre in India.",
      how: "Leadership and anchor hires first, then ramp plans with clear milestones. Transfer to your ownership is planned from day one.",
      points: ["Talent mapping and location strategy", "Leadership and anchor hires first", "Ramp plans with clear milestones", "Transfer to your ownership, planned from day one"],
    },
    technology: {
      title: "Engineering talent that clears your bar",
      what: "Software engineers, data scientists, cloud architects, and product managers across modern stacks, screened with role-specific technical evaluation before you ever see a profile.",
      who: "Teams hiring across cloud, data, AI, and platform engineering.",
      how: "Contract, contract-to-hire, and direct hire, with technical screening before submission and pre-screened alternates if a candidate backs out.",
      points: ["Cloud, data, AI, and platform engineering", "Contract, contract-to-hire, and direct hire", "Technical screening before submission", "Backout management with pre-screened alternates"],
    },
    "executive-search": {
      title: "Leadership hiring",
      what: "CXOs and functional leaders who understand local operations and global standards.",
      who: "Enterprises hiring at CXO and functional-leadership level.",
      how: "Targeted sourcing across specialist networks, then role-specific assessment and reference checks.",
    },
    "high-volume": {
      title: "Large funnels, quality intact",
      what: "Recruitment machinery for large funnels, without losing quality or time-to-hire.",
      who: "Programmes hiring at volume, or laterally across a function.",
      how: "Targeted sourcing across specialist networks, with role-specific testing, technical screening, and reference checks.",
    },
    healthcare: {
      title: "Clinicians, vetted and credentialed",
      what: "Licensed physicians, NPs and PAs, medical coders, and clinical reviewers, vetted and credentialed.",
      who: "Healthcare, life-sciences, and healthcare AI programmes.",
      how: "Vetted and credentialed before deployment. In one engagement, 11 licensed US physicians were live two weeks from request.",
      link: { label: "Read the physician review case", href: "/case-studies#physician-review" },
    },
    surge: {
      title: "Flex capacity when the pipeline overflows",
      what: "Flex capacity for launches, backlogs, and overflow from your own pipeline.",
      who: "Teams facing a launch, a backlog, or more demand than their own pipeline can fill.",
      how: "Contract capacity that works inside your tools, process, and platform, under your brand.",
    },
  },
  table: {
    id: "models",
    eyebrow: "Engagement models",
    title: "Models that fit how you operate",
    lead: "Four ways to work with us. Every model works inside your tools, process, and platform, under your brand.",
    caption: "Engagement models compared by who directs the work, who owns SLAs and reporting, and whose brand the client sees",
    columns: ["Model", "How it works", "Directs the work", "SLAs and reporting", "Brand"],
    rows: [
      ["Staff augmentation", "Vetted specialists embedded into your team, under your direction.", "You", "Set in your plan", "Yours"],
      ["Managed teams", "A full pod with our PM and QA layer. We own SLAs and reporting.", "Our PM and QA layer", "MIYO Global", "Yours"],
      ["White-label", "Behind the scenes, under your brand. Your client sees your team.", "Set in your plan", "Set in your plan", "Yours; your client sees your team"],
      ["Build-Operate-Transfer", "We stand up and run your centre, then transfer to full ownership on plan.", "MIYO Global, until transfer", "Set in your plan", "Yours, with full ownership on transfer"],
    ],
    note: { text: "Our India staff augmentation practice also operates under Prime Learning.", link: PRIME_STAFFING },
  },
  faq: [
    {
      q: "Which engagement models do you offer?",
      a: "Four: staff augmentation (vetted specialists embedded into your team, under your direction), managed teams (a full pod with our PM and QA layer, where we own SLAs and reporting), white-label (behind the scenes, under your brand), and Build-Operate-Transfer (we stand up and run your centre, then transfer it to full ownership on plan).",
    },
    {
      q: "Where in India can you build a capability centre?",
      a: "Hyderabad, Bangalore, Pune, Noida, and Chennai. We start with talent mapping and location strategy, hire leadership and anchor roles first, ramp to plan with clear milestones, and plan the transfer to your ownership from day one.",
    },
    {
      q: "How do you screen technology candidates?",
      a: "Every software engineer, data scientist, cloud architect, and product manager is screened with a role-specific technical evaluation before you ever see a profile. If a candidate backs out, we have pre-screened alternates ready.",
    },
    {
      q: "Which hiring types do you support?",
      a: "Contract, contract-to-hire, and direct hire, plus surge and contract capacity for launches, backlogs, and overflow from your own pipeline.",
    },
    {
      q: "Which clinical roles do you staff?",
      a: "Licensed physicians, NPs and PAs, medical coders, and clinical reviewers, vetted and credentialed.",
    },
    {
      q: "Are your engagements compliant with Indian labour law?",
      a: "Yes. We are 100% compliant with Indian labour law: the Contract Labour (R&A) Act, EPF / ESI, and Shop & Establishment. Our India entity is Miyo Global Private Limited; our UAE entity is Prime Assets Education & Training Ltd., operating as Prime Learning.",
    },
  ],
  next: { text: "Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.", link: { label: "Talk to us about your team", href: "/contact" } },
};

export const digital: Solution = {
  path: "/digital-solutions",
  crumb: "Digital Solutions",
  eyebrow: "Digital Solutions",
  title: "Managed delivery for your digital operations",
  lead: "Beyond seats, we deliver the work: AI data operations, multilingual localization, trust & safety, and enterprise training, run as managed services with measurable quality.",
  primary: { label: "Start a programme", href: "/contact" },
  secondary: { label: "See how delivery works", href: "#delivery" },
  facts: [
    { label: "Languages", value: "120+" },
    { label: "QA", value: "Human-in-the-loop, daily checks" },
    { label: "AI data", value: "Labeling, RLHF, red-teaming" },
    { label: "Model", value: "Managed service" },
  ],
  servicesTitle: "Four service lines, delivered as managed work",
  servicesLead: "Pick a line to see what it covers, who it is for, and how we deliver it.",
  services: {
    "ai-data": {
      title: "Data your models can learn from",
      what: "Native speakers and trained annotators collect, label, and validate multilingual training data inside your platform, held to strict accuracy with daily checks.",
      who: "AI teams that need multilingual, model-ready training data.",
      how: "Work happens inside your platform, held to strict accuracy with daily checks.",
      points: ["Data labeling & annotation", "Multilingual data collection", "Prompt & response evaluation", "RLHF / preference rating", "Red-teaming & safety review", "Data operations leads"],
      link: { label: "Read the AI data labeling case", href: "/case-studies#ai-data-labeling" },
    },
    localization: {
      title: "Products that read native in every market",
      what: "Full localization pipelines across 120+ languages: translation, review, LQA, terminology, and subtitling, with human review at every step and consistency built in.",
      who: "Products shipping into new markets and languages.",
      how: "A managed pipeline with human review at every step, from translation to localization QA.",
      points: ["Translation & transcreation", "Review & proofreading", "Localization QA (LQA)", "Terminology management", "Subtitling & OST / OCR", "Localization program management"],
    },
    "healthcare-ai": {
      title: "High-stakes content, expertly reviewed",
      what: "Licensed clinicians review AI health output for safety and accuracy, and trained analysts run trust & safety operations across languages with clear policy playbooks.",
      who: "AI health products, and platforms that moderate content across languages.",
      how: "Licensed clinicians on medical review; trained analysts on policy and moderation, with escalation workflows and reporting.",
      points: ["Medical AI review & safety checks", "Health data structuring & QA", "Policy & content moderation", "Escalation workflows & reporting"],
    },
    training: {
      title: "Upskill the teams behind the work",
      what: "Outcomes-driven, expert-led cohort programmes in AI, data, cloud, and leadership, delivered by Prime Learning across India, the UAE, and global markets.",
      who: "Enterprise teams building skills in AI, data, cloud, and leadership.",
      how: "Expert-led cohort programmes, delivered by Prime Learning, the operating name of our UAE entity.",
      link: PRIME,
    },
  },
  table: {
    id: "delivery",
    eyebrow: "Delivery model",
    title: "Run as a managed service",
    lead: "We own delivery, not just recommendations: one partner, one named delivery lead, no handoffs between vendors.",
    caption: "How managed digital delivery works",
    columns: ["Aspect", "How we run it"],
    rows: [
      ["Model", "Managed service: we deliver the work, not seats"],
      ["Ownership", "One named delivery lead, end-to-end accountability"],
      ["Quality", "Human-in-the-loop QA, with daily checks"],
      ["Escalation", "Escalation paths and regular reporting"],
      ["Languages", "120+"],
      ["Where the work runs", "Inside your tools, process, and platform, under your brand"],
    ],
  },
  faq: [
    {
      q: "What does managed delivery mean here?",
      a: "Beyond seats, we deliver the work. AI data operations, localization, trust & safety, and training run as managed services with measurable quality, one named delivery lead, human-in-the-loop QA, and regular reporting.",
    },
    {
      q: "How many languages do you cover?",
      a: "120+. Localization pipelines cover translation, review, LQA, terminology, and subtitling, with human review at every step.",
    },
    {
      q: "How is quality held on AI data work?",
      a: "Native speakers and trained annotators work inside your platform, held to strict accuracy with daily checks. On one engagement, 100+ contributors held 95%+ accuracy across 4 label types.",
    },
    {
      q: "Who reviews healthcare AI output?",
      a: "Licensed clinicians review AI health output for safety and accuracy. Trained analysts run trust & safety operations across languages with clear policy playbooks.",
    },
    {
      q: "Who delivers corporate training?",
      a: "Prime Learning, the operating name of our UAE entity, Prime Assets Education & Training Ltd. It runs expert-led cohort programmes in AI, data, cloud, and leadership across India, the UAE, and global markets.",
    },
  ],
  next: { text: "Start with a pilot or a managed pod. We come back with a plan and ramp-up timelines, fast.", link: { label: "Talk to us about your programme", href: "/contact" } },
};
