import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal";

export const metadata: Metadata = { title: "Recruitment notice" };

export default function Page() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Recruitment notice"
      sections={[
        ["How matching works", "Companies see a blind card with a first initial, the role, a fit score and a pay-band chip. Fit scores are a guide built from three verified criteria and never the only basis for a decision."],
        ["Human review", "Every video pitch is reviewed by a person on our moderation desk before it goes live, and you can ask for any automated score to be reviewed."],
        ["Equal opportunity", "Companies on MIYO agree not to discriminate on gender, religion, caste, nationality, age, disability or marital status."],
        ["No fees for candidates", "MIYO never charges candidates to apply, be matched or be hired."],
        ["Complaints", "Report a company or a candidate from any profile, or write to trust@miyoglobal.com."],
      ]}
    />
  );
}
