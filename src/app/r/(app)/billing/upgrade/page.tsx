import type { Metadata } from "next";
import { Icon, Sample } from "@/components/ui";
import { candidates } from "@/data/fixtures";
import { Checkout } from "./checkout";

export const metadata: Metadata = { title: "Upgrade" };

export default async function Upgrade({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const plan = (await searchParams).plan;
  const next = candidates[5];
  return (
    <div className="stack" style={{ ["--gap" as string]: "32px" }}>
      <header className="row" style={{ ["--gap" as string]: "24px", alignItems: "center" }}>
        <div style={{ position: "relative", width: 120, flex: "none" }} className="video">
          <img src={next.img} alt="" className="blur" />
          <span className="watermark" style={{ transform: "none" }}><span className="chip"><Icon name="lock" size={12} /> Next</span></span>
        </div>
        <div className="stack" style={{ maxWidth: 640 }}>
          <p className="eyebrow">Free limit reached</p>
          <h1>You&apos;ve used your 5 free unlocks</h1>
          <p className="lede">{next.blind}, a {next.title.toLowerCase()} with a {next.fit} fit, is next in your deck. Upgrade or add a single unlock to keep going.</p>
        </div>
      </header>
      <Checkout plan={plan === "growth" || plan === "team" || plan === "addon" ? plan : undefined} />
      <Sample />
    </div>
  );
}
