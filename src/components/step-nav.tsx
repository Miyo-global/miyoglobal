import Link from "next/link";
import { Icon } from "./ui";

export function StepNav({ back, next, nextLabel = "Continue" }: { back: string; next: string; nextLabel?: string }) {
  return (
    <div className="row between" style={{ borderTop: "1px solid var(--line)", paddingTop: 24 }}>
      <Link href={back} className="btn btn-ghost"><Icon name="left" size={16} /> Back</Link>
      <Link href={next} className="btn btn-primary">{nextLabel} <Icon name="right" size={16} /></Link>
    </div>
  );
}
