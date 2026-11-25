/** About page copy. People, roles and bios as published; portraits come later, so each card shows initials. */
export type Person = { name: string; initials: string; role: string; bio: string };

export const LEADERS: Person[] = [
  {
    name: "Prudvidhar Reddy",
    initials: "PR",
    role: "Managing Director",
    bio: "Runs enterprise strategy and day-to-day operations across MIYO Global and allied businesses in India and the UAE. Owns P&L and operational governance.",
  },
  {
    name: "Sudheer Reddy",
    initials: "SR",
    role: "Chief Executive Officer",
    bio: "Veteran operator who has built and led delivery at scale. Sets the bar for real outcomes and the standards for people, process, and quality.",
  },
  {
    name: "Biswajit Sircar",
    initials: "BS",
    role: "Senior Director, HR",
    bio: "Talent-acquisition leader with over two decades building scalable hiring engines across cloud, AI, BFSI, and telecom, at volume across EMEA, APAC, and China.",
  },
];

export const ADVISORS: Person[] = [
  {
    name: "Kalyan Reddy",
    initials: "KR",
    role: "Consultant, Digital Solutions",
    bio: "Over 16 years across top LSPs including Keywords Studios, Pactera EDGE, Centific, and Localsoft. Large-scale multilingual delivery and AI data operations.",
  },
  {
    name: "Sushanth Reddy, MBBS",
    initials: "SR",
    role: "Consultant, Healthcare & Life Sciences",
    bio: "MBBS-qualified, with deep expertise in clinical workflows, medical content review, and healthcare AI data operations.",
  },
];

export const APPROACH = ["Vetted, domain-tested specialists", "Deployed in about two weeks", "Human-in-the-loop QA", "Named delivery ownership", "White-label by design", "Compliance-backed engagement"];

export const VALUES = [
  { title: "Execution-first", text: "We stand up teams and run them. Outcomes, not slideware." },
  { title: "End-to-end accountability", text: "One partner, one named delivery lead. No handoffs between vendors." },
  { title: "White-label by design", text: "We work under your brand. Your client sees your team." },
  { title: "Compliance shield", text: "Contract Labour (R&A) Act, EPF / ESI, and Shop & Establishment compliant." },
];
