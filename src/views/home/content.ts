/**
 * Home page copy. Figures, names and claims are the ones already published on miyoglobal.com (ledger content and the
 * f9a0e7c home); nothing here is invented. One file, so the visible page and its JSON-LD never drift.
 */
const S = "/staffing-solutions";
const D = "/digital-solutions";

export const hero = {
  eyebrow: "Enterprise staffing, India and the UAE",
  title: "Build teams that own outcomes.",
  lead: "MIYO Global helps enterprises and staffing partners stand up capability, from GCC build-outs and technology talent to managed digital delivery, under your brand and inside your process.",
  stats: [
    { value: "5", label: "India tech hubs" },
    { value: "4", label: "Engagement models" },
    { value: "120+", label: "Languages in digital delivery" },
  ],
};

export const credentials = ["Contract Labour (R&A) Act", "EPF / ESI", "Shop & Establishment", "Miyo Global Private Limited, India", "Prime Learning, UAE"];

export const models = [
  { name: "Staff augmentation", text: "Vetted specialists embedded into your team, under your direction." },
  { name: "Managed teams", text: "A full pod with our PM and QA layer. We own SLAs and reporting." },
  { name: "White-label", text: "Behind the scenes, under your brand. Your client sees your team." },
  { name: "Build-Operate-Transfer", text: "We stand up and run your centre, then transfer to full ownership on plan." },
];

export const services = [
  {
    id: "staffing",
    name: "Staffing Solutions",
    text: "From single specialists to full GCC build-outs, we source, vet, and deploy teams that plug into your operations.",
    cells: [
      { title: "GCC & captive centres", text: "Talent mapping, leadership hiring and team build-outs in India.", href: `${S}#gcc` },
      { title: "IT & technology staffing", text: "Engineering talent that clears your bar.", href: `${S}#technology` },
      { title: "Executive search", text: "CXOs and functional leaders who understand local operations and global standards.", href: `${S}#executive-search` },
      { title: "High-volume & lateral", text: "Large funnels, without losing quality or time-to-hire.", href: `${S}#high-volume` },
      { title: "Healthcare & clinical", text: "Licensed physicians, NPs and PAs, medical coders, and clinical reviewers, vetted and credentialed.", href: `${S}#healthcare` },
      { title: "Surge & contract", text: "Flex capacity for launches, backlogs, and overflow from your own pipeline.", href: `${S}#surge` },
    ],
    facts: [
      { label: "Hires", value: "Contract, contract-to-hire, direct hire" },
      { label: "Screening", value: "Technical screening before submission" },
      { label: "Backouts", value: "Pre-screened alternates" },
      { label: "GCC locations", value: "Hyderabad, Bangalore, Pune, Noida, Chennai" },
    ],
    cta: { label: "Explore staffing solutions", href: S },
  },
  {
    id: "digital",
    name: "Digital Solutions",
    text: "Managed delivery for the digital work behind global products: AI data, multilingual localization, trust & safety, and enterprise training.",
    cells: [
      { title: "AI data services", text: "Data labeling, multilingual collection, evaluation and red-teaming.", href: `${D}#ai-data` },
      { title: "Localization & multilingual", text: "Translation, review, LQA and subtitling across 120+ languages.", href: `${D}#localization` },
      { title: "Trust & safety operations", text: "Policy and content moderation with clear playbooks.", href: `${D}#healthcare-ai` },
      { title: "Healthcare AI review", text: "Licensed clinicians review AI health output for safety and accuracy.", href: `${D}#healthcare-ai` },
      { title: "Corporate training", text: "Expert-led cohort programmes in AI, data, cloud, and leadership, via Prime Learning.", href: `${D}#training` },
      { title: "Quality & LQA programmes", text: "Localization QA with human review at every step.", href: `${D}#localization` },
    ],
    facts: [
      { label: "Languages", value: "120+" },
      { label: "QA", value: "Human-in-the-loop, daily checks" },
      { label: "AI data", value: "Labeling, RLHF, red-teaming" },
      { label: "Model", value: "Managed service" },
    ],
    cta: { label: "Explore digital solutions", href: D },
  },
];

export const process = [
  { name: "Source", text: "Targeted sourcing across specialist networks to find the right people, fast." },
  { name: "Vet", text: "Role-specific testing, technical screening, and reference checks." },
  { name: "Deploy", text: "People work inside your tools, process, and platform, under your brand." },
  { name: "Manage", text: "Human-in-the-loop QA, escalation paths, and regular reporting, with one named delivery lead." },
];

export const proof = {
  counters: [
    { value: "11", label: "US physicians live in two weeks" },
    { value: "45", label: "Board-certified radiologists" },
    { value: "3,750", label: "CT and MRI reports delivered" },
    { value: "95%+", label: "Accuracy held on AI data" },
  ],
  dossiers: [
    {
      sector: "Healthcare & Life Sciences",
      text: "Licensed US physicians deployed to review AI-generated health answers. A 10-day pilot extended to three months on performance.",
      figures: [
        { value: "11", label: "Physicians" },
        { value: "2 wks", label: "Request to live" },
        { value: "3 mo", label: "Pilot extended" },
      ],
    },
    {
      sector: "AI Data Services",
      text: "100+ native-speaker contributors labeling multilingual text in images, held to a strict accuracy bar with daily checks.",
      figures: [
        { value: "100+", label: "Contributors" },
        { value: "95%+", label: "Accuracy held" },
        { value: "4", label: "Label types" },
      ],
    },
  ],
};

/** Real coordinates, so the chart's geography is honest. */
export const ports = {
  from: { code: "HYD", name: "Hyderabad", lat: 17.39, lon: 78.49 },
  to: { code: "RAK", name: "Ras Al Khaimah", lat: 25.79, lon: 55.94 },
  cities: [
    { name: "Bangalore", lat: 12.97, lon: 77.59 },
    { name: "Pune", lat: 18.52, lon: 73.86 },
    { name: "Noida", lat: 28.54, lon: 77.39 },
    { name: "Chennai", lat: 13.08, lon: 80.27 },
  ],
};

export const offices = [
  {
    region: "India, operations headquarters",
    city: "Hyderabad",
    address: "MIYO Global Office (Trendz Trinity), Plot No. 21, Madhapur, Gafoornagar, Hyderabad, Telangana 500081",
    note: "Delivery across Bangalore, Pune, Noida and Chennai.",
  },
  {
    region: "United Arab Emirates",
    city: "Ras Al Khaimah",
    address: "Prime Assets Education & Training Ltd., Office A, RAK DAO Business Centre, Al Riffa, Sheikh Mohammed Bin Zayed Road",
    note: "Operating as Prime Learning.",
  },
];

export type Leader = { name: string; initials: string; role: string; bio: string; experience?: string };

export const leaders: Leader[] = [
  { name: "Prudvidhar Reddy", initials: "PR", role: "Managing Director", bio: "Runs enterprise strategy and day-to-day operations across MIYO Global and allied businesses in India and the UAE. Owns P&L and operational governance." },
  { name: "Sudheer Reddy", initials: "SR", role: "Chief Executive Officer", bio: "Veteran operator who has built and led delivery at scale. Sets the bar for real outcomes and the standards for people, process, and quality." },
  { name: "Biswajit Sircar", initials: "BS", role: "Senior Director, HR", experience: "20+ years", bio: "Talent-acquisition leader with over two decades building scalable hiring engines across cloud, AI, BFSI, and telecom, at volume across EMEA, APAC, and China." },
];

export const referral = {
  title: "Refer talent. Earn ₹15,000.",
  text: "Know someone great? Refer a candidate for an open MIYO Global role. When they are hired and join, you earn the reward, paid by NEFT or IMPS within 45 days, subject to TDS.",
};

export const contact = {
  title: "Ready to build your team?",
  text: "Start with a pilot role, a managed pod, or a GCC conversation. We come back with a plan and ramp-up timelines, fast.",
};

/** Single source for the visible FAQ and the FAQPage JSON-LD. */
export const faqs: [string, string][] = [
  ["What does MIYO Global do?", "MIYO Global is an enterprise staffing and digital delivery company with offices in India and the UAE. We build GCCs and captive centres, provide IT and technology staffing, executive search, high-volume hiring and healthcare staffing, and run managed digital delivery: AI data services, localization, trust & safety and corporate training."],
  ["Where do you build teams?", "Our operations headquarters is in Hyderabad, with delivery across Bangalore, Pune, Noida and Chennai. Our UAE office is in Ras Al Khaimah."],
  ["How quickly can a team be deployed?", "Specialist teams are deployed in about two weeks. In one healthcare engagement, 11 licensed US physicians went from request to live in two weeks."],
  ["Which engagement models do you offer?", "Four: staff augmentation, managed teams with our PM and QA layer, white-label delivery under your brand, and Build-Operate-Transfer, where we stand up and run your centre and then transfer it to your ownership on plan."],
  ["Can you work white-label for staffing partners?", "Yes. We are white-label by design. We work behind the scenes, under your brand, and your client sees your team."],
  ["How do you handle labour-law compliance in India?", "Staffing in India is 100% compliant with Indian labour law: the Contract Labour (R&A) Act, EPF / ESI, and Shop & Establishment. The contracting entity in India is Miyo Global Private Limited; in the UAE it is Prime Assets Education & Training Ltd., operating as Prime Learning."],
  ["How do you manage quality once a team is live?", "Every engagement has a named delivery lead, human-in-the-loop QA with daily checks, escalation paths and regular reporting."],
  ["How do we get started?", "Start with a pilot role, a managed pod, or a GCC conversation. Tell us the roles, volumes, timelines and target markets, and we come back with a plan and ramp-up timelines. Use the contact page or email staffing@miyoglobal.com."],
  ["Does MIYO Global charge candidates?", "No. MIYO Global never asks candidates for money, original documents, or cheques at any stage of hiring. If anyone requests these in our name, report it to staffing@miyoglobal.com."],
];

/** Every service term as printed on the two service pages, for the A to Z index. */
export const az: [string, string][] = [
  ["AI data services", `${D}#ai-data`],
  ["Build-Operate-Transfer", `${S}#models`],
  ["Clinical staffing", `${S}#healthcare`],
  ["Cloud, data, AI and platform engineering", `${S}#technology`],
  ["Content moderation", `${D}#healthcare-ai`],
  ["Contract, contract-to-hire and direct hire", `${S}#technology`],
  ["Corporate training", `${D}#training`],
  ["Data labeling & annotation", `${D}#ai-data`],
  ["Executive search", `${S}#executive-search`],
  ["GCC & captive centres", `${S}#gcc`],
  ["Health data structuring & QA", `${D}#healthcare-ai`],
  ["Healthcare AI review", `${D}#healthcare-ai`],
  ["High-volume & lateral hiring", `${S}#high-volume`],
  ["IT & technology staffing", `${S}#technology`],
  ["Leadership hiring", `${S}#gcc`],
  ["Localization program management", `${D}#localization`],
  ["Localization QA (LQA)", `${D}#localization`],
  ["Managed teams", `${S}#models`],
  ["Multilingual data collection", `${D}#ai-data`],
  ["Prompt & response evaluation", `${D}#ai-data`],
  ["Red-teaming & safety review", `${D}#ai-data`],
  ["Review & proofreading", `${D}#localization`],
  ["RLHF / preference rating", `${D}#ai-data`],
  ["Staff augmentation", `${S}#models`],
  ["Subtitling & OST / OCR", `${D}#localization`],
  ["Surge & contract staffing", `${S}#surge`],
  ["Talent mapping & location strategy", `${S}#gcc`],
  ["Terminology management", `${D}#localization`],
  ["Translation & transcreation", `${D}#localization`],
  ["Trust & safety operations", `${D}#healthcare-ai`],
  ["White-label delivery", `${S}#models`],
];
