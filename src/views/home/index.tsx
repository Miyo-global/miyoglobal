/**
 * Home view (`/`): "The delivery ledger". A Server Component assembling the
 * sections; only the moving leaves are client components. One fixed ground for
 * the whole page (Northwall `PageGround`) springs between navy and paper at the
 * viewport mid-line; the shared header recolours on the same line.
 */
import { AdaptiveGrid } from "@/ledger/components/common/grid";
import { PageGround } from "@/ledger/components/common/page-ground";
import { ReducedMotion } from "@/ledger/components/common/reduced-motion";
import { SectionFlow } from "@/ledger/components/common/section-flow";

import { Capabilities } from "./capabilities";
import { ComplianceReferrals } from "./compliance-referrals";
import { Contact } from "./contact";
import { Hero } from "./hero";
import { Leadership } from "./leadership";
import { Models } from "./models";
import { Passage } from "./passage";
import { PASSAGE_GATE } from "./passage-gate";
import { Presence } from "./presence";
import { Process } from "./process";
import { Proof } from "./proof";
import { Services } from "./services";
import { Why } from "./why";

export function HomeView() {
  return (
    <div className="ld" data-ledger-home="">
      <Passage />
      <script dangerouslySetInnerHTML={{ __html: PASSAGE_GATE }} />
      <noscript>
        <style>{"[data-rise] span{opacity:1!important;transform:none!important}"}</style>
      </noscript>
      <PageGround />
      <AdaptiveGrid />
      <ReducedMotion />
      <Hero />
      <SectionFlow>
        <Capabilities />
      </SectionFlow>
      <SectionFlow>
        <Services />
      </SectionFlow>
      <SectionFlow>
        <Why />
      </SectionFlow>
      <SectionFlow>
        <Process />
      </SectionFlow>
      <SectionFlow>
        <Models />
      </SectionFlow>
      <SectionFlow>
        <Proof />
      </SectionFlow>
      <SectionFlow>
        <Presence />
      </SectionFlow>
      <SectionFlow>
        <Leadership />
      </SectionFlow>
      <ComplianceReferrals />
      <Contact />
    </div>
  );
}
