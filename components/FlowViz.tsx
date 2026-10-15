"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// The supply chain as a funnel ribbon: each stage's height is its volume and
// dashes flow through it left to right. Sample numbers, not real data.
const stages = [
  { label: "Demand", sub: "interest forms", value: 168 },
  { label: "Applications", sub: "screened", value: 92 },
  { label: "Approved", sub: "matched to rooms", value: 48 },
  { label: "Orders", sub: "leases signed", value: 27 },
  { label: "Fulfilled", sub: "moved in on time", value: 27 },
];

const W = 1000;
const H = 260;
const MID = 120;
const MAXH = 200;

export default function FlowViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const max = stages[0].value;
  const step = W / (stages.length - 1);
  const h = (v: number) => Math.max(18, (v / max) * MAXH);

  // Smooth top and bottom edges through every stage.
  const pts = stages.map((s, i) => ({ x: i * step, half: h(s.value) / 2 }));
  // A smooth line through every stage at fraction k of each stage's half-height.
  const curve = (k: number) =>
    pts
      .map((p, i) => {
        const y = MID + k * p.half;
        if (i === 0) return `M${p.x},${y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `C${cx},${MID + k * prev.half} ${cx},${y} ${p.x},${y}`;
      })
      .join(" ");
  const top = curve(-1);
  // Build a closed shape: top edge forward, bottom edge backward.
  const bottomBack = [...pts]
    .reverse()
    .map((p, i, arr) => {
      const y = MID + p.half;
      if (i === 0) return `L${p.x},${y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C${cx},${MID + prev.half} ${cx},${y} ${p.x},${y}`;
    })
    .join(" ");
  const shape = `${top} ${bottomBack} Z`;

  return (
    <div className="flow" ref={ref}>
      <div className="flow-scroll">
        <svg viewBox={`-90 0 ${W + 180} ${H + 70}`} className="flow-svg" role="img" aria-label="Supply chain funnel from demand to fulfillment, sample data">
          <defs>
            <linearGradient id="flow-grad" x1="0" x2="1">
              <stop offset="0" stopColor="#ff9a62" />
              <stop offset="0.5" stopColor="#f472b6" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
            <clipPath id="flow-clip">
              <motion.rect x={-20} y={0} height={H} initial={{ width: 0 }} animate={{ width: inView ? W + 40 : 0 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
            </clipPath>
          </defs>
          <g clipPath="url(#flow-clip)">
            <path d={shape} fill="url(#flow-grad)" opacity={0.18} />
            {[-0.6, -0.3, 0, 0.3, 0.6].map((k) => (
              <path
                key={k}
                d={curve(k)}
                fill="none"
                stroke="url(#flow-grad)"
                strokeWidth={2}
                strokeLinecap="round"
                className="flow-dash"
                style={{ animationDelay: `${Math.abs(k) * 0.8}s` }}
              />
            ))}
          </g>
          {stages.map((s, i) => (
            <motion.g
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.18, duration: 0.5 }}
            >
              <line x1={i * step} x2={i * step} y1={MID - h(s.value) / 2 - 8} y2={MID + h(s.value) / 2 + 8} strokeDasharray="3 4" style={{ stroke: "rgba(var(--fg-rgb),0.35)" }} />
              <circle cx={i * step} cy={MID} r={7} strokeWidth={2} style={{ fill: "var(--bg)", stroke: "var(--text)" }} />
              <text x={i * step} y={H + 6} textAnchor="middle" className="flow-value">
                {s.value}
              </text>
              <text x={i * step} y={H + 32} textAnchor="middle" className="flow-label">
                {s.label}
              </text>
              <text x={i * step} y={H + 52} textAnchor="middle" className="flow-sub">
                {s.sub}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
      <span className="flow-note"><span className="flow-swipe">Swipe to follow the flow → · </span>Sample data · one leasing term</span>
    </div>
  );
}
