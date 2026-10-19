"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";
import { CardHead, Toggle, useWidth } from "./PlanningLab";

// More SkyWater planning visuals: the weekly zero-bin rate (real percentages
// only), a usage-change check and the supplier changes handled. No material,
// supplier or people names, no part numbers or dollar amounts, and no AI or
// automation wording (SkyWater doesn't allow AI).

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Zero-bin rate, week by week (real percentages) ---------- */

const ZB_TARGET = 5;
const zeroBin: { d: string; pct: number }[] = [
  { d: "May 21", pct: 6.76 },
  { d: "Jun 30", pct: 5.61 },
  { d: "Jul 7", pct: 5.48 },
  { d: "Jul 13", pct: 7.0 },
  { d: "Jul 20", pct: 6.54 },
  { d: "Jul 27", pct: 5.77 },
  { d: "Aug 7", pct: 5.28 },
  { d: "Aug 17", pct: 5.23 },
  { d: "Aug 24", pct: 5.46 },
  { d: "Aug 31", pct: 5.23 },
  { d: "Sep 8", pct: 5.08 },
  { d: "Sep 16", pct: 4.47 },
  { d: "Sep 25", pct: 5.09 },
  { d: "Sep 28", pct: 4.98 },
  { d: "Oct 5", pct: 5.09 },
  { d: "Oct 12", pct: 5.02 },
  { d: "Oct 19", pct: 4.76 },
];

function ZeroBinRate() {
  const [wrap, W] = useWidth<HTMLDivElement>();
  const inView = useInView(wrap, { once: true, margin: "-60px 0px -60px 0px" });
  const [hover, setHover] = useState<number | null>(null);
  const n = zeroBin.length;
  const H = 220;
  const pad = { l: 34, r: 14, t: 14, b: 26 };
  const lo = 4;
  const hi = 7.5;
  const x = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
  const d = zeroBin.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.pct).toFixed(1)}`).join(" ");
  const last = zeroBin[n - 1];
  const ticks = W > 520 ? [0, 4, 8, 12, 16] : [0, 8, 16];

  return (
    <>
      <CardHead title="Zero-bin rate, week by week" sub="Share of reorder-point items with nothing on the shelf, May to Oct 2026" />
      <div className="lab-kpis">
        <div>
          <strong>6.8%</strong>
          <span>first week (May)</span>
        </div>
        <div>
          <strong className="good">{last.pct.toFixed(1)}%</strong>
          <span>this week (Oct)</span>
        </div>
        <div>
          <strong>~5,000</strong>
          <span>items checked weekly</span>
        </div>
      </div>
      <div ref={wrap} className="lab-chart" onMouseLeave={() => setHover(null)}>
        <svg width={W} height={H} role="img" aria-label={`Weekly zero-bin rate fell from 6.8% in May to ${last.pct.toFixed(1)}% in October, under the 5% target.`}>
          {[4, 5, 6, 7].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="lab-grid-line" />
              <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" className="lab-axis">
                {v}%
              </text>
            </g>
          ))}
          <rect x={pad.l} width={W - pad.l - pad.r} y={y(ZB_TARGET)} height={y(lo) - y(ZB_TARGET)} className="lab-band" />
          <line x1={pad.l} x2={W - pad.r} y1={y(ZB_TARGET)} y2={y(ZB_TARGET)} className="lab-ref" />
          <text x={pad.l + 6} y={y(ZB_TARGET) + 15} className="lab-ref-label strong">
            5% target
          </text>
          <motion.path d={d} className="lab-line s1" initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 2, ease }} />
          {zeroBin.map((p, i) => (
            <motion.circle
              key={p.d}
              cx={x(i)}
              cy={y(p.pct)}
              r={hover === i || i === n - 1 ? 5 : 3}
              className={`zb-dot ${p.pct < ZB_TARGET ? "under" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ delay: 0.2 + (i / n) * 1.8 }}
            />
          ))}
          {ticks.map((i) => (
            <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="lab-axis">
              {zeroBin[i].d}
            </text>
          ))}
          {zeroBin.map((_, i) => (
            <rect key={i} x={x(i) - (W - pad.l - pad.r) / (n - 1) / 2} y={0} width={(W - pad.l - pad.r) / (n - 1)} height={H} fill="transparent" onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} />
          ))}
          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="lab-cross" pointerEvents="none" />}
        </svg>
        {hover !== null && (
          <div className="lab-tip" style={{ left: Math.min(Math.max(x(hover), 80), W - 80) }}>
            <b>{zeroBin[hover].d}</b> · {zeroBin[hover].pct.toFixed(1)}% {zeroBin[hover].pct < ZB_TARGET ? "· under target" : ""}
          </div>
        )}
      </div>
      <div className="lab-legend">
        <span>
          <i className="sw s1" /> Zero-bin rate
        </span>
        <span>
          <i className="sw ref" /> 5% target
        </span>
        <span>
          <i className="sw zb-under" /> Week under target
        </span>
      </div>
      <p className="woi-note">Zero-bin rate = items on a reorder point with 0 on hand ÷ all reorder-point items. Each week I chase every zero bin to an order, a date or a planning change. Real weekly percentages; counts and names left out.</p>
    </>
  );
}

/* ---------- Weekly zero-bin summary (week of Oct 19, 2026) ---------- */

// Built from the weekly report's summary tab. Shares only: counts, item,
// supplier and people names are left out.
const zbTiles: { v: string; label: string; cls?: string }[] = [
  { v: "4.8%", label: "zero-bin rate (target 5%)", cls: "good" },
  { v: "−5%", label: "zero bins vs last week", cls: "good" },
  { v: "18%", label: "of last week's list cleared" },
  { v: "14%", label: "of this week's list is new" },
];
const zbPanels: { title: string; note: string; rows: { label: string; pct: number; cls?: string }[] }[] = [
  {
    title: "Where this week's list came from",
    note: "Carried-over items each get a note: received, ETA, or a planning change.",
    rows: [
      { label: "Carried over", pct: 86 },
      { label: "New this week", pct: 14, cls: "hl" },
    ],
  },
  {
    title: "Last movement before zero",
    note: "Most went to zero in the last two months, so the list stays current.",
    rows: [
      { label: "This month", pct: 28 },
      { label: "Last month", pct: 28 },
      { label: "2–3 months", pct: 20 },
      { label: "4–6 months", pct: 14 },
      { label: "7–8 months", pct: 6 },
      { label: "Older", pct: 4 },
    ],
  },
  {
    title: "Is the minimum still right?",
    note: "No recent use means the item may need a lower min/max or time-phased planning instead.",
    rows: [
      { label: "No use this year", pct: 48, cls: "warn" },
      { label: "No use since 2023", pct: 21, cls: "bad" },
    ],
  },
  {
    title: "Which suppliers",
    note: "The top two suppliers hold almost a quarter of zero bins, so they get a weekly follow-up.",
    rows: [
      { label: "Supplier A", pct: 12 },
      { label: "Supplier B", pct: 10 },
      { label: "Supplier C", pct: 4 },
      { label: "Supplier D", pct: 3 },
      { label: "All others", pct: 70, cls: "dim" },
    ],
  },
  {
    title: "Consigned or bought",
    note: "Consigned stock is refilled by the supplier, so the follow-up goes to them.",
    rows: [
      { label: "Bought", pct: 92 },
      { label: "Consigned", pct: 8, cls: "hl" },
    ],
  },
  {
    title: "Below min, but not yet zero",
    note: "The next zero bins. Most already have an order on the way; the rest get one.",
    rows: [
      { label: "Order on the way", pct: 77, cls: "good" },
      { label: "No order yet", pct: 4, cls: "bad" },
      { label: "No min/max set", pct: 19, cls: "warn" },
    ],
  },
];

function ZeroBinSummary() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  return (
    <>
      <CardHead title="Zero-bin dashboard: weekly summary" sub="Week of Oct 19, 2026 · every reorder-point item at the fab, ~5,000 in all" />
      <div className="zbs-tiles">
        {zbTiles.map((t) => (
          <div key={t.label} className="zbs-tile">
            <strong className={t.cls}>{t.v}</strong>
            <span>{t.label}</span>
          </div>
        ))}
      </div>
      <div className="zbs-grid" ref={ref}>
        {zbPanels.map((p, pi) => (
          <div key={p.title} className="zbs-panel">
            <b>{p.title}</b>
            {p.rows.map((r, i) => (
              <div key={r.label} className="zbs-row">
                <span className="zbs-label">{r.label}</span>
                <span className="zbs-track">
                  <motion.span className={`zbs-bar ${r.cls ?? ""}`} initial={{ width: "0%" }} animate={{ width: inView ? `${r.pct}%` : "0%" }} transition={{ duration: 0.8, ease, delay: pi * 0.08 + i * 0.05 }} />
                </span>
                <span className="zbs-val">{r.pct}%</span>
              </div>
            ))}
            <p>{p.note}</p>
          </div>
        ))}
      </div>
      <p className="woi-note">Real shares from one week's summary; counts and names left out. Each panel answers one question in the weekly review.</p>
    </>
  );
}

/* ---------- Usage-change check ---------- */

// Recent 2-month average vs the past average, one monthly review.
// The % changes are real; the materials are unnamed.
const usageChange = [
  { name: "Resist A", pct: 44 },
  { name: "Resist B", pct: 33 },
  { name: "Solvent A", pct: 30 },
  { name: "Resist C", pct: 25 },
  { name: "Resist D", pct: 18 },
  { name: "Resist E", pct: 13 },
  { name: "Coating A", pct: 10 },
  { name: "Resist F", pct: 5 },
];
type Th = "10" | "20" | "30";

function UsageCheck() {
  const [th, setTh] = useState<Th>("10");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const limit = Number(th);
  const flagged = usageChange.filter((m) => m.pct >= limit).length;
  const MAX = 50;

  return (
    <>
      <CardHead title="Usage jumped? Catch it early" sub="Recent 2-month average vs the past average, per material">
        <Toggle
          id="uc"
          value={th}
          onChange={setTh}
          options={[
            { key: "10", label: "Flag +10%" },
            { key: "20", label: "+20%" },
            { key: "30", label: "+30%" },
          ]}
        />
      </CardHead>
      <div className="lab-kpis">
        <div>
          <motion.strong key={th} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bad">
            {flagged}
          </motion.strong>
          <span>of {usageChange.length} flagged for re-planning</span>
        </div>
      </div>
      <div className="uc" ref={ref}>
        {usageChange.map((m, i) => {
          const on = m.pct >= limit;
          return (
            <div key={m.name} className={`uc-row ${on ? "on" : ""}`}>
              <span className="uc-name">{m.name}</span>
              <span className="uc-track">
                <motion.span className="uc-bar" initial={{ width: "0%" }} animate={{ width: inView ? `${(m.pct / MAX) * 100}%` : "0%" }} transition={{ duration: 0.7, ease, delay: i * 0.06 }} />
                <i className="uc-th" style={{ left: `${(limit / MAX) * 100}%` }} />
              </span>
              <span className="uc-val">+{m.pct}%</span>
            </div>
          );
        })}
      </div>
      <p className="woi-note">
        Change = recent average ÷ past average − 1. A flagged material gets a new run-out date and, if needed, a pull-in ask to the supplier. Real % changes from one review; materials unnamed.
      </p>
    </>
  );
}

/* ---------- Supplier changes handled ---------- */

const changes: { tag: string; title: string; line: string; status: string }[] = [
  { tag: "End of life", title: "Coating being discontinued", line: "Sized the final buy around a 6-month shelf life and ~100 bottles of on-site storage, with overflow at a nearby third-party warehouse.", status: "In progress" },
  { tag: "End of life", title: "Resist being discontinued", line: "Brought in alternate material for engineering trials and planned stock while the replacement qualified in phases.", status: "Phasing in" },
  { tag: "Packaging", title: "Switch to glass bottles", line: "The first new batch failed; ran four recovery paths at once and production kept running.", status: "Done" },
  { tag: "PFAS-free", title: "Greener resist versions", line: "Lined up samples, lead times and new part setup for PFAS-free versions of two resists.", status: "Testing" },
  { tag: "Plant move", title: "Supplier moving production", line: "Planned coverage and the price change ahead of a supplier's move to a new plant.", status: "Planned" },
  { tag: "Shutdowns", title: "Blackouts and holidays", line: "Pulled orders ahead of supplier shutdowns and a month-long shipping blackout, within cold-storage limits.", status: "Every year" },
];

function SupplierChanges() {
  return (
    <div className="chg-list">
      {changes.map((c, i) => (
        <Reveal key={c.title} delay={i * 0.06} className="chg-card card">
          <div className="chg-top">
            <span className="chg-tag">{c.tag}</span>
            <span className="chg-status">{c.status}</span>
          </div>
          <b>{c.title}</b>
          <p>{c.line}</p>
        </Reveal>
      ))}
    </div>
  );
}

export default function SkyWaterExtras() {
  return (
    <div className="lab viz-root">
      <div className="lab-grid">
        <Reveal className="lab-card card lab-anchor lab-wide">
          <span id="zero-bin-summary" className="anchor-offset" />
          <ZeroBinSummary />
        </Reveal>
        <Reveal className="lab-card card lab-anchor">
          <span id="zero-bin" className="anchor-offset" />
          <ZeroBinRate />
        </Reveal>
        <Reveal className="lab-card card lab-anchor" delay={0.08}>
          <span id="usage-check" className="anchor-offset" />
          <UsageCheck />
        </Reveal>
      </div>
    </div>
  );
}

export { SupplierChanges };
