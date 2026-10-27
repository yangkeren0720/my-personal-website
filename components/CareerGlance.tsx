"use client";

import { motion } from "framer-motion";

// The whole career on one strip, for a recruiter's first look: each role is a bar on a shared year axis,
// so overlaps (part-time and side roles next to the full-time job) read at a glance. Bars draw in left to right.
const START = 2015;
const END = 2027;
const NOW = 2026 + 9.5 / 12;

// Years as decimals: Jun 2021 = 2021 + 5/12.
const rows = [
  { co: "education", org: "Illinois Wesleyan → Illinois State", title: "B.A. · B.S. · M.S. Mathematics", from: 2015 + 8 / 12, to: 2021 + 11 / 12, period: "2015 – Dec 2021", href: "#education" },
  { co: "mino", org: "Mino Automation", title: "Purchasing Analyst", from: 2021 + 5 / 12, to: 2023 + 9 / 12, period: "Jun 2021 – Oct 2023", href: "#mino" },
  { co: "rbr", org: "RBR Property Mgmt", title: "Co-Owner · side business", from: 2023, to: NOW, period: "2023 – now", href: "#rbr" },
  { co: "skywater", org: "Infineon → SkyWater", title: "Material Planner · full-time", from: 2023 + 11 / 12, to: NOW, period: "Dec 2023 – now", href: "#skywater" },
  { co: "belong", org: "Belong Automotive", title: "Office Manager · part-time", from: 2026 + 1 / 12, to: NOW, period: "Feb 2026 – now", href: "#belong" },
];

const pct = (y: number) => `${((y - START) / (END - START)) * 100}%`;
const ticks = Array.from({ length: END - START + 1 }, (_, i) => START + i);

export default function CareerGlance() {
  return (
    <div className="glance" aria-label="Career timeline at a glance">
      <div className="glance-axis" aria-hidden>
        <span />
        <div className="glance-track">
          {ticks.map((y) => (
            <span key={y} className={`glance-tick ${y % 2 ? "odd" : ""}`} style={{ left: pct(y) }}>
              {y}
            </span>
          ))}
        </div>
      </div>
      {rows.map((r, i) => (
        <a key={r.co} href={r.href} className={`glance-row co-${r.co}`}>
          <span className="glance-label">
            <strong>{r.org}</strong>
            <small>{r.title}</small>
          </span>
          <span className="glance-track">
            {ticks.map((y) => (
              <i key={y} className="glance-grid" style={{ left: pct(y) }} aria-hidden />
            ))}
            <motion.span
              className="glance-bar"
              style={{ left: pct(r.from), width: `calc(${pct(r.to)} - ${pct(r.from)})` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.em
              className="glance-period"
              // The date goes on whichever side of the bar has more room.
              style={r.from - START > END - r.to ? { right: `calc(100% - ${pct(r.from)} + 8px)` } : { left: `calc(${pct(r.to)} + 8px)` }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + i * 0.18 }}
            >
              {r.period}
            </motion.em>
          </span>
        </a>
      ))}
      <div className="glance-now" aria-hidden>
        <span />
        <div className="glance-track">
          <span style={{ left: pct(NOW) }}>Now</span>
        </div>
      </div>
    </div>
  );
}
