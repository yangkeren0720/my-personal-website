"use client";

import CompanyHead, { SubHead } from "./CompanyHead";
import SkyWaterTimeline from "./SkyWaterStories";
import PlanningCharts from "./PlanningLab";
import StoryCards from "./StoryCards";

// Everything from the SkyWater (Infineon) Material Planner job, and nothing else.
export default function SkyWaterSection() {
  return (
    <section id="skywater" className="co-section">
      <div className="container">
        <CompanyHead
          co="skywater"
          company="SkyWater Technology"
          role="Material Planner"
          period="Dec 2023 – now · began under Infineon"
          title={
            <>
              Keeping a wafer fab <em>running</em>.
            </>
          }
          summary="Demand and supply for critical wafer-fab materials: specialty gases, CMP slurry, photoresist and process chemicals."
          kpis={[
            { value: 250, prefix: "~", label: "materials in the shortage-risk report I rebuilt (from ~100)" },
            { value: 4, label: "recovery paths run at once; production never stopped" },
            { value: 2, label: "acquisitions with supply kept running" },
          ]}
        />
        <SubHead>Story timeline</SubHead>
        <SkyWaterTimeline />
        <SubHead>The planning, as charts</SubHead>
        <PlanningCharts />
        <SubHead id="skywater-stories">More SkyWater stories</SubHead>
        <StoryCards company="SkyWater" />
      </div>
    </section>
  );
}
