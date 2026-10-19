"use client";

import { ai, rbrPlatform } from "@/content/site";
import CompanyHead, { SubHead } from "./CompanyHead";
import Showcase from "./Showcase";
import AISection from "./AISection";
import StoryCards from "./StoryCards";
import LeaseToRent from "./LeaseToRent";
import RBRDevices from "./RBRDevices";
import RBRBuild from "./RBRBuild";
import RBRWorkflow from "./RBRWorkflow";

// Everything from RBR Property Management, the side business Eva co-owns.
export default function RBRSection() {
  return (
    <section id="rbr" className="co-section">
      <div className="container">
        <CompanyHead
          co="rbr"
          company="RBR Property Management"
          role="Co-Owner, side business"
          period="2023 – now"
          title={
            <>
              A business I automated <em>with AI</em>.
            </>
          }
          summary={ai.builtWith}
          kpis={rbrPlatform.kpis}
        />
        <SubHead id="lease-to-rent">From lease to rent</SubHead>
        <LeaseToRent />
        <SubHead id="work" built="I built this">The platform</SubHead>
        <Showcase />
        <SubHead id="rbr-flow">Application to move-in</SubHead>
        <RBRWorkflow />
        <SubHead id="rbr-phone">On the phone</SubHead>
        <RBRDevices />
        <SubHead id="rbr-build" built="I built this">How it's built</SubHead>
        <RBRBuild />
        <SubHead id="ai">AI at work</SubHead>
        <AISection />
        <SubHead id="rbr-stories">RBR stories</SubHead>
        <StoryCards company="RBR" />
      </div>
    </section>
  );
}
