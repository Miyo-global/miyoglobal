import type { Metadata } from "next";
import { StepNav } from "@/components/step-nav";
import { SkillsEditor } from "./skills";

export const metadata: Metadata = { title: "Skills and certificates" };

export default function Skills() {
  return (
    <div className="wrap section stack" style={{ maxWidth: 760, ["--gap" as string]: "32px" }}>
      <header className="stack">
        <p className="eyebrow">Step 2 of 5</p>
        <h1>Skills and certificates</h1>
        <p className="muted">Verified skills raise your fit score. Add the ones you&apos;d be happy to be tested on.</p>
      </header>
      <SkillsEditor />
      <StepNav back="/c/onboarding/basics" next="/c/onboarding/video" />
    </div>
  );
}
