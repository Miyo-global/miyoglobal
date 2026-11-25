/**
 * The three published cases, as long-form dossiers. Figures and facts are exactly those already on the site (the old
 * /case-studies cards and the home proof cards). Anchor ids are linked from the home page; keep them.
 */
export type Dossier = {
  id: string;
  sector: string;
  title: string;
  challenge: string;
  approach: string;
  outcome: string;
  figures: { value: string; label: string }[];
};

export const intro = {
  eyebrow: "Proof",
  title: "Delivered, not promised",
  lead: "Specialist teams stood up fast, held to measurable quality. A sample of engagements delivered by our practice teams.",
  footnote: "Delivered by our practice teams, led by the domain consultants on the About page.",
};

export const dossiers: Dossier[] = [
  {
    id: "physician-review",
    sector: "Healthcare & Life Sciences",
    title: "Licensed US physicians reviewing AI health answers",
    challenge: "A global AI services firm needed licensed US physicians to review AI-generated health answers for safety and accuracy.",
    approach: "We vetted and deployed licensed US physicians, live two weeks from request, starting with a 10-day pilot.",
    outcome: "The 10-day pilot was extended to three months on performance.",
    figures: [
      { value: "11", label: "Physicians" },
      { value: "2 wks", label: "Request to live" },
      { value: "3 mo", label: "Pilot extended" },
    ],
  },
  {
    id: "radiology",
    sector: "Radiology · Imaging",
    title: "Board-certified radiologists reporting CT and MRI",
    challenge: "The engagement called for comprehensive CT and MRI reports in English, with full findings and impressions, delivered on the OneForma platform.",
    approach: "We put board-certified radiologists to work on the OneForma platform, producing complete reports in English.",
    outcome: "45 radiologists produced 3,750 CT and MRI reports, averaging 40 minutes per report.",
    figures: [
      { value: "45", label: "Radiologists" },
      { value: "3,750", label: "CT & MRI reports" },
      { value: "40 min", label: "Avg per report" },
    ],
  },
  {
    id: "ai-data-labeling",
    sector: "AI Data Services",
    title: "Native-speaker contributors labeling multilingual text in images",
    challenge: "Multilingual text in images had to be labeled by native speakers, held to a strict accuracy bar.",
    approach: "We sourced, trained, and managed 100+ native-speaker contributors, with daily quality checks.",
    outcome: "Accuracy held at 95%+ across 4 label types.",
    figures: [
      { value: "100+", label: "Contributors" },
      { value: "95%+", label: "Accuracy held" },
      { value: "4", label: "Label types" },
    ],
  },
];
