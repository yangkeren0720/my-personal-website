"use client";

import CompanyHead, { SubHead } from "./CompanyHead";
import SkyWaterTimeline from "./SkyWaterStories";
import PlanningCharts from "./PlanningLab";
import StoryCards from "./StoryCards";
import SkyWaterExtras, { SupplierChanges } from "./SkyWaterExtras";
import Fold from "./Fold";
import SkyWaterCadence from "./SkyWaterCadence";

// Everything from the SkyWater (Infineon) Material Planner job, and nothing else.
export default function SkyWaterSection() {
  return (
    <section id="skywater" className="co-section">
      <div className="container">
        <CompanyHead
          co="skywater"
          company="SkyWater Technology"
          role="Material Planner"
          period="Dec 2023 – now · full-time · Infineon → SkyWater → IonQ"
          title={
            <>
              Keeping a wafer fab <em>running</em>.
            </>
          }
          summary="Demand and supply for critical wafer-fab materials (specialty gases, CMP slurry, photoresist and process chemicals), plus a weekly zero-bin review of the fab's spare parts and consumables."
          kpis={[
            { value: 250, prefix: "~", label: "materials in the shortage-risk report I rebuilt (from ~100)" },
            { value: 4.8, suffix: "%", decimals: 1, label: "zero-bin rate, down from 6.8% and under the 5% target" },
            { value: 0, label: "production stops from a material shortage" },
          ]}
        />
        <SubHead id="skywater-cadence">My planning rhythm</SubHead>
        <SkyWaterCadence />
        <SubHead>Story timeline</SubHead>
        <SkyWaterTimeline />
        <Fold
          name="SkyWater"
          parts={[
            { label: "Planning charts", id: "skywater-charts" },
            { label: "Zero-bin review", id: "zero-bin-review" },
            { label: "Supplier changes", id: "supplier-changes" },
            { label: "More stories", id: "skywater-stories" },
          ]}
        >
        <SubHead id="skywater-charts">The planning, as charts</SubHead>
        <PlanningCharts />
        <SubHead id="zero-bin-review">Weekly zero-bin review</SubHead>
        <SkyWaterExtras />
        <SubHead id="supplier-changes">Supplier changes I planned around</SubHead>
        <SupplierChanges />
        <SubHead id="skywater-stories">More SkyWater stories</SubHead>
        <StoryCards company="SkyWater" />
        </Fold>
      </div>
    </section>
  );
}
