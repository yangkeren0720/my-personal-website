"use client";

import { ai } from "@/content/site";
import CompanyHead, { SubHead } from "./CompanyHead";
import Showcase from "./Showcase";
import AISection from "./AISection";
import StoryCards from "./StoryCards";

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
        />
        <SubHead id="work">The platform</SubHead>
        <Showcase />
        <SubHead id="ai">AI at work</SubHead>
        <AISection />
        <SubHead id="rbr-stories">RBR stories</SubHead>
        <StoryCards company="RBR" />
      </div>
    </section>
  );
}
