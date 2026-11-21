/**
 * Home page copy, verbatim from the live site (MASTER_PROMPT §5). Every figure
 * on the page comes from here. `{ em }` marks the one stressed word that
 * Fraunces sets in its 400 italic.
 */
export type Segment = string | { em: string };
export type Rich = readonly Segment[];

export interface Img {
  src: string;
  alt: string;
}

export const hero = {
  eyebrow: "Enterprise Staffing · India & the UAE",
  title: ["Build teams that ", { em: "own" }, " outcomes."] as Rich,
  intro:
    "MIYO Global helps enterprises and staffing partners stand up capability, from GCC build-outs and technology talent to managed digital delivery, under your brand and inside your process.",
  links: [
    { label: "Get started", href: "/contact", primary: true },
    { label: "Explore staffing solutions", href: "/staffing-solutions", primary: false },
  ],
  tagline: ["Talent · Delivery · Capability", "India & UAE delivery hubs"],
  stats: [
    { value: "5", label: "India tech hubs" },
    { value: "4", label: "Engagement models" },
    { value: "120+", label: "Languages in digital delivery" },
  ],
  // {{PLACEHOLDER: commissioned photo of the Hyderabad team/office strongly recommended; the current image is stock}}
  image: { src: "/images/hero.jpg", alt: "Enterprise teams collaborating" },
};

export const capabilities = {
  eyebrow: "01 // Capabilities we build",
  title: ["Two service lines, one accountable partner"] as Rich,
  topics: [
    "GCC & Captive Centres",
    "IT & Technology Staffing",
    "Executive Search",
    "High-Volume Hiring",
    "Healthcare & Clinical Staffing",
    "AI Data Services",
    "Localization",
    "Trust & Safety",
    "Corporate Training",
  ],
  gallery: [
    { src: "/images/gcc.jpg", alt: "A capability centre team at work" },
    { src: "/images/tech.jpg", alt: "Engineers reviewing code together" },
    { src: "/images/healthcare.jpg", alt: "Clinicians reviewing medical information" },
    { src: "/images/ai-data.jpg", alt: "Data specialists labelling AI training data" },
    { src: "/images/localization.jpg", alt: "Linguists working on multilingual content" },
    { src: "/images/about.jpg", alt: "A delivery team planning an engagement" },
  ] satisfies Img[],
  mission:
    "Staffing solutions to build and scale your teams, backed by managed digital delivery when you need work done, not just seats filled.",
  action: { label: "about us", href: "/about" },
};

export interface ServiceTab {
  name: string;
  cells: readonly { title: string; text: string }[];
  text: string;
  facts: readonly { label: string; value: string }[];
  cta: { label: string; href: string };
}

export const services = {
  eyebrow: "02 // What we do",
  tabs: [
    {
      name: "Staffing Solutions",
      cells: [
        { title: "GCC & Captive Centres", text: "Stand up your capability centre in India." },
        { title: "IT & Technology Staffing", text: "Engineering talent that clears your bar." },
        { title: "Executive Search", text: "CXOs and functional leaders who understand local operations and global standards." },
        { title: "High-Volume & Lateral", text: "Recruitment machinery for large funnels, without losing quality or time-to-hire." },
        { title: "Healthcare & Clinical", text: "Licensed physicians, NPs and PAs, medical coders, and clinical reviewers, vetted and credentialed." },
        { title: "Surge & Contract", text: "Flex capacity for launches, backlogs, and overflow from your own pipeline." },
      ],
      text: "From single specialists to full GCC build-outs, we source, vet, and deploy teams that plug into your operations.",
      facts: [
        { label: "Hires", value: "Contract, contract-to-hire, direct hire" },
        { label: "Screening", value: "Technical screening before submission" },
        { label: "Backouts", value: "Pre-screened alternates" },
        { label: "GCC locations", value: "Hyderabad, Bangalore, Pune, Noida, Chennai" },
      ],
      cta: { label: "Explore staffing →", href: "/staffing-solutions" },
    },
    {
      name: "Digital Solutions",
      cells: [
        { title: "AI Data Services", text: "Data your models can learn from." },
        { title: "Localization & Multilingual", text: "Products that read native in every market." },
        { title: "Trust & Safety Operations", text: "Policy & content moderation with clear playbooks." },
        { title: "Healthcare AI Data", text: "Licensed clinicians review AI health output for safety and accuracy." },
        { title: "Corporate Training", text: "Expert-led cohort programmes in AI, data, cloud, and leadership, via Prime Learning." },
        { title: "Quality & LQA Programs", text: "Localization QA with human review at every step." },
      ],
      text: "Managed delivery for the digital work behind global products: AI data, multilingual localization, trust & safety, and enterprise training.",
      facts: [
        { label: "Languages", value: "120+" },
        { label: "QA", value: "Human-in-the-loop, daily checks" },
        { label: "AI data", value: "Labeling, RLHF, red-teaming" },
        { label: "Model", value: "Managed service" },
      ],
      cta: { label: "Explore digital →", href: "/digital-solutions" },
    },
  ] satisfies ServiceTab[],
};

export const why = {
  eyebrow: "03 // Why MIYO",
  title: ["Execution-first, not advisory-heavy"] as Rich,
  lead: "We own delivery, not just recommendations. Built by operators who have run this at scale.",
  cells: [
    {
      title: "Execution-first",
      text: "We stand up teams and run them. Outcomes, not slideware.",
      getLabel: "Speed on demand",
      get: "Specialist teams deployed in about two weeks, not months.",
    },
    {
      title: "End-to-end accountability",
      text: "One partner, one named delivery lead. No handoffs between vendors.",
      getLabel: "Managed quality",
      get: "Human-in-the-loop QA on every engagement, with daily checks.",
    },
    {
      title: "White-label by design",
      text: "We work under your brand. Your client sees your team.",
      getLabel: "White-label delivery",
      // The one copy edit in this section, to avoid repeating the line above (§5.5).
      get: "Under your brand, end to end.",
    },
    {
      title: "Compliance shield",
      text: "Contract Labour (R&A) Act, EPF / ESI, and Shop & Establishment compliant.",
      getLabel: "Trust & governance",
      get: "Compliance-backed delivery from India and the UAE.",
    },
  ],
};

export const process = {
  eyebrow: "04 // How we deliver",
  title: ["Sourced, vetted, deployed, managed"] as Rich,
  steps: [
    { label: "01 / Source", text: "Targeted sourcing across specialist networks to find the right people, fast.", image: { src: "/images/tech.jpg", alt: "Specialists collaborating at a workstation" } },
    { label: "02 / Vet", text: "Role-specific testing, technical screening, and reference checks.", image: { src: "/images/gcc.jpg", alt: "A team reviewing candidates together" } },
    { label: "03 / Deploy", text: "People work inside your tools, process, and platform, under your brand.", image: { src: "/images/about.jpg", alt: "A deployed team working inside a client process" } },
    { label: "04 / Manage", text: "Human-in-the-loop QA, escalation paths, and regular reporting.", image: { src: "/images/ai-data.jpg", alt: "Quality reviewers checking delivered work" } },
  ],
  caption: "Named delivery ownership",
};

export const models = {
  eyebrow: "05 // Engagement models",
  title: ["Models that fit how you operate"] as Rich,
  rows: [
    { index: "01", name: "Staff augmentation", text: "Vetted specialists embedded into your team, under your direction." },
    { index: "02", name: "Managed teams", text: "A full pod with our PM and QA layer. We own SLAs and reporting." },
    { index: "03", name: "White-label", text: "Behind the scenes, under your brand. Your client sees your team." },
    { index: "04", name: "Build-Operate-Transfer", text: "We stand up and run your centre, then transfer to full ownership on plan." },
  ],
};

export const proof = {
  eyebrow: "06 // Proof",
  title: ["Delivered, not ", { em: "promised" }] as Rich,
  action: { label: "See all case studies", href: "/case-studies" },
  cards: [
    {
      label: "Healthcare & Life Sciences",
      text: "Licensed US physicians deployed to review AI-generated health answers. A 10-day pilot extended to three months on performance.",
      image: { src: "/images/healthcare.jpg", alt: "Physicians reviewing clinical information" },
      position: "50% 40%",
      figures: [
        { value: "11", label: "Physicians" },
        { value: "2 wks", label: "Request to live" },
        { value: "3 mo", label: "Pilot extended" },
      ],
    },
    {
      label: "Radiology · Imaging",
      text: "Board-certified radiologists producing comprehensive CT and MRI reports in English on the OneForma platform.",
      // {{PLACEHOLDER: a radiology-appropriate photo}}; a different crop of the healthcare image until then.
      image: { src: "/images/healthcare.jpg", alt: "Clinical specialists at work" },
      position: "80% 50%",
      tall: true,
      figures: [
        { value: "45", label: "Radiologists" },
        { value: "3,750", label: "CT & MRI reports" },
        { value: "40 min", label: "Avg per report" },
      ],
    },
    {
      label: "AI Data Services",
      text: "100+ native-speaker contributors labeling multilingual text in images, held to a strict accuracy bar with daily checks.",
      image: { src: "/images/ai-data.jpg", alt: "Contributors labelling multilingual data" },
      position: "50% 50%",
      figures: [
        { value: "100+", label: "Contributors" },
        { value: "95%+", label: "Accuracy held" },
        { value: "4", label: "Label types" },
      ],
    },
  ],
  footnote: "Delivered by our practice teams, led by the domain consultants on the About page.",
};

/** Real coordinates, so the chart's geography is honest. */
export const ports = {
  from: { code: "HYD", name: "Hyderabad", lat: 17.39, lon: 78.49 },
  to: { code: "RAK", name: "Ras Al Khaimah", lat: 25.79, lon: 55.94 },
  cities: [
    { name: "Bangalore", lat: 12.97, lon: 77.59, anchor: "end" },
    { name: "Pune", lat: 18.52, lon: 73.86 },
    { name: "Noida", lat: 28.54, lon: 77.39 },
    { name: "Chennai", lat: 13.08, lon: 80.27 },
  ],
  label: "India · UAE",
};

export const presence = {
  eyebrow: "07 // Our presence",
  title: ["Two delivery hubs, global reach"] as Rich,
  offices: [
    {
      region: "India · Operations HQ, Hyderabad",
      address:
        "MIYO Global Office (Trendz Trinity), Plot No. 21, Madhapur, Gafoornagar, Hyderabad, Telangana 500081. Delivery across Bangalore, Pune, Noida, and Chennai.",
    },
    {
      region: "UAE, Ras Al Khaimah",
      address: "Prime Assets Education & Training Ltd., Office A, RAK DAO Business Centre, Al Riffa, Sheikh Mohammed Bin Zayed Road.",
    },
  ],
};

export interface Leader {
  eyebrow: string;
  name: string;
  initials: string;
  bio: string;
  role: string;
  /** Only where the site states one. */
  experience?: string;
}

export const leadership = {
  eyebrow: "08 // Leadership",
  title: ["The people accountable for delivery"] as Rich,
  // {{PLACEHOLDER: real portraits; when supplied, use them with the duotone}}
  leaders: [
    {
      eyebrow: "01 // Managing Director",
      name: "Prudvidhar Reddy",
      initials: "PR",
      bio: "Runs enterprise strategy and day-to-day operations across MIYO Global and allied businesses in India and the UAE. Owns P&L and operational governance.",
      role: "Managing Director",
    },
    {
      eyebrow: "02 // Chief Executive Officer",
      name: "Sudheer Reddy",
      initials: "SR",
      bio: "Veteran operator who has built and led delivery at scale. Sets the bar for real outcomes and the standards for people, process, and quality.",
      role: "Chief Executive Officer",
    },
    {
      eyebrow: "03 // Senior Director, HR",
      name: "Biswajit Sircar",
      initials: "BS",
      bio: "Talent-acquisition leader with over two decades building scalable hiring engines across cloud, AI, BFSI, and telecom, at volume across EMEA, APAC, and China.",
      role: "Senior Director, HR",
      experience: "20+ years",
    },
  ] satisfies Leader[],
  advisors: [
    {
      eyebrow: "Consultant · Digital Solutions",
      name: "Kalyan Reddy",
      initials: "KR",
      bio: "Over 16 years across top LSPs including Keywords Studios, Pactera EDGE, Centific, and Localsoft. Large-scale multilingual delivery and AI data operations.",
      role: "Consultant · Digital Solutions",
      experience: "16+ years",
    },
    {
      eyebrow: "Consultant · Healthcare & Life Sciences",
      name: "Sushanth Reddy, MBBS",
      initials: "SR",
      bio: "MBBS-qualified, with deep expertise in clinical workflows, medical content review, and healthcare AI data operations.",
      role: "Consultant · Healthcare & Life Sciences",
    },
  ] satisfies Leader[],
};

export const compliance = {
  title: "Full compliance shield.",
  text: "100% compliant with Indian labour law: Contract Labour (R&A) Act, EPF / ESI, and Shop & Establishment. India: Miyo Global Private Limited. UAE: Prime Assets Education & Training Ltd., operating as Prime Learning.",
};

export const referrals = {
  eyebrow: "Referral program",
  title: "Refer talent. Earn ₹15,000.",
  text: "Know someone great? Refer a candidate for an open MIYO Global mandate. When they are hired and onboarded, you earn a referral reward.",
  meta: "₹15,000 (subject to TDS) · paid by NEFT / IMPS within 45 days of onboarding",
  action: { label: "Start a referral", href: "/referrals" },
};

export const contact = {
  title: "Ready to build your team?",
  text: "Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.",
  // hero.jpg and about.jpg are the same file, so the closing photo uses another one.
  image: { src: "/images/localization.jpg", alt: "" },
};
