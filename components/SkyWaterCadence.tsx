"use client";

import Reveal from "./Reveal";

// The planning rhythm at SkyWater: the signals that come in, the reviews run
// on a fixed cadence, and the decisions they feed. Every line is from Eva's
// resume or her SkyWater planning notes (read 2026-10-19). Counts and
// percentages only: no material, supplier or people names, no dollars, and no
// AI or automation wording anywhere near SkyWater.

const signals = ["ERP demand", "Open POs", "Supplier confirmations", "On-hand inventory", "Deliveries, twice a week"];

const reviews: { when: string; title: string; body: string; proof: string[] }[] = [
  {
    when: "Weekly",
    title: "Zero-bin review",
    body: "Every reorder-point item at the fab checked for empty bins, past-due orders, usage and lead time.",
    proof: ["~5,000 items", "6.8% → 4.8% zero-bin rate", "5% target"],
  },
  {
    when: "Weekly",
    title: "Chemical risk review",
    body: "Weeks on hand, lead time, usage change, run-out date and next delivery for each critical chemical.",
    proof: ["Under 3 weeks: high risk", "3–4 weeks: medium", "4 weeks: the floor"],
  },
  {
    when: "Every 2 weeks",
    title: "Inventory and shelf-life review",
    body: "What to use first and what could expire before it is used, within fridge, freezer and rack space.",
    proof: ["6-month shelf life on the end-of-life buy"],
  },
  {
    when: "Daily, once an item turns high-risk",
    title: "Recovery check",
    body: "Run-out date rebuilt from daily use, open POs and confirmed deliveries, worked with engineering, warehouse, procurement and the supplier.",
    proof: ["~1 bottle at the low point", "0 production stops"],
  },
];

const decisions = [
  "S&OP / SIOP inputs",
  "MPS decisions",
  "Pull-ins, expedites, de-expedites",
  "Escalation priorities",
  "Reorder points, min/max, safety stock",
  "Risk and recovery status to leadership",
];

export default function SkyWaterCadence() {
  return (
    <div className="cad">
      <Reveal className="cad-col cad-in">
        <span className="cad-label">Signals in</span>
        {signals.map((s) => (
          <span key={s} className="cad-chip">
            {s}
          </span>
        ))}
      </Reveal>
      <span className="cad-arrow" aria-hidden />
      <div className="cad-col cad-mid">
        <span className="cad-label">The rhythm I run</span>
        {reviews.map((r, i) => (
          <Reveal key={r.title} delay={0.08 * i} y={20} className="cad-card">
            <span className="cad-when">{r.when}</span>
            <b>{r.title}</b>
            <p>{r.body}</p>
            <div className="cad-proof">
              {r.proof.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
      <span className="cad-arrow" aria-hidden />
      <Reveal className="cad-col cad-out" delay={0.2}>
        <span className="cad-label">Decisions out</span>
        {decisions.map((d) => (
          <span key={d} className="cad-chip out">
            {d}
          </span>
        ))}
      </Reveal>
    </div>
  );
}
