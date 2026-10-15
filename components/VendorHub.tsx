"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Management as a hub: everything the business runs on, connected through
// one operations core. Pulses travel along each link.
const nodes = [
  { label: "Property software", angle: -90 },
  { label: "E-signature", angle: -30 },
  { label: "Messaging", angle: 30 },
  { label: "Cloud & database", angle: 90 },
  { label: "AI models", angle: 150 },
  { label: "Office team", angle: 210 },
];

const CX = 300;
const CY = 210;
const R = 165;

export default function VendorHub() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div className="hub" ref={ref}>
      <svg viewBox="0 0 600 420" role="img" aria-label="Operations hub connecting vendors, systems and the team">
        <defs>
          <radialGradient id="hub-core">
            <stop offset="0" stopColor="#f472b6" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f472b6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r={110} fill="url(#hub-core)" />
        {nodes.map((n, i) => {
          const a = (n.angle * Math.PI) / 180;
          const x = CX + R * Math.cos(a);
          const y = CY + R * Math.sin(a);
          return (
            <g key={n.label}>
              <motion.line
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={1.5}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              />
              {inView && (
                <motion.circle
                  r={4}
                  fill={i % 2 ? "#a78bfa" : "#ff9a62"}
                  initial={{ cx: CX, cy: CY, opacity: 0 }}
                  animate={{ cx: [CX, x, CX], cy: [CY, y, CY], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 3, delay: 1 + i * 0.45, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                />
              )}
              <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 260, damping: 18 }} style={{ transformOrigin: `${x}px ${y}px` }}>
                <rect x={x - 70} y={y - 18} width={140} height={36} rx={18} fill="#16161f" stroke="rgba(255,255,255,0.2)" />
                <text x={x} y={y + 5} textAnchor="middle" className="hub-label">
                  {n.label}
                </text>
              </motion.g>
            </g>
          );
        })}
        <motion.g initial={{ scale: 0.5, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ type: "spring", stiffness: 200, damping: 14 }} style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <circle cx={CX} cy={CY} r={54} fill="#0b0b10" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          <circle cx={CX} cy={CY} r={54} fill="none" stroke="#f472b6" strokeOpacity={0.6} strokeWidth={2} className="hub-ring" />
          <text x={CX} y={CY - 4} textAnchor="middle" className="hub-core-title">
            Operations
          </text>
          <text x={CX} y={CY + 16} textAnchor="middle" className="hub-core-sub">
            co-owner
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
