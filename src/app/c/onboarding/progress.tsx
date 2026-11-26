"use client";

import { usePathname } from "next/navigation";

const steps = [
  ["basics", "Basics"],
  ["skills", "Skills"],
  ["video", "Pitch"],
  ["record", "Record"],
  ["preview", "Review"],
];

export function Progress() {
  const path = usePathname();
  const at = path.endsWith("/review") ? 5 : steps.findIndex(([s]) => path.endsWith("/" + s));
  return (
    <ol className="steps" aria-label="Onboarding progress">
      {steps.map(([s, label], i) => (
        <li key={s} className={i < at ? "on" : i === at ? "now" : ""} aria-current={i === at ? "step" : undefined}>
          <span className="hide-sm">{label}</span>
          <span className="sr">{i < at ? " completed" : ""}</span>
        </li>
      ))}
    </ol>
  );
}
