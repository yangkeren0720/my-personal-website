"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useWidth } from "./PlanningLab";

// One small animated chart per story. Each plays once when its story opens.
// Quantities are sample unless the story's note says they're real.

const ease = [0.22, 1, 0.36, 1] as const;
type Pad = { l: number; r: number; t: number; b: number };

// Pixel-sized SVG that fills its container's width, so text stays legible on phones.
function Plot({ H = 200, pad, label, children }: { H?: number; pad: Pad; label: string; children: (W: number) => ReactNode }) {
  const [ref, W] = useWidth<HTMLDivElement>();
  return (
    <div ref={ref} className="lab-chart">
      <svg width={W} height={H} role="img" aria-label={label}>
        {children(W)}
      </svg>
    </div>
  );
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="lab-legend">
      {items.map(([cls, text]) => (
        <span key={text}>
          <i className={`sw ${cls}`} /> {text}
        </span>
      ))}
    </div>
  );
}

const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function YGrid({ ticks, x0, x1, y, fmt = String }: { ticks: number[]; x0: number; x1: number; y: (v: number) => number; fmt?: (v: number) => string }) {
  return (
    <>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={y(v)} y2={y(v)} className="lab-grid-line" />
          <text x={x0 - 6} y={y(v) + 4} textAnchor="end" className="lab-axis">
            {fmt(v)}
          </text>
        </g>
      ))}
    </>
  );
}

// ---------- SkyWater ----------

// Coverage through the holidays: the plan assumed a shutdown, the fab kept running.
export function HolidayChart() {
  const actual = [3.9, 3.6, 3.2, 2.8, 2.3, 1.8, 1.2, 2.2, 3.1, 3.6];
  const plan = [3.9, 3.8, 3.9, 4.1, 4.4, 4.6, 4.4, 4.1, 3.9, 3.8];
  const pad = { l: 30, r: 14, t: 14, b: 24 };
  const H = 210;
  return (
    <>
      <Plot H={H} pad={pad} label="Weeks of inventory through the holidays: planned against actual, lowest 1.2 weeks. Sample units.">
        {(W) => {
          const x = (i: number) => pad.l + (i / (actual.length - 1)) * (W - pad.l - pad.r);
          const y = (v: number) => pad.t + (1 - v / 5) * (H - pad.t - pad.b);
          return (
            <>
              <rect x={x(4)} width={x(6.3) - x(4)} y={pad.t} height={H - pad.t - pad.b} className="sc-shade" />
              <text x={(x(4) + x(6.3)) / 2} y={pad.t + 12} textAnchor="middle" className="lab-ref-label">
                Suppliers closed
              </text>
              <rect x={pad.l} width={W - pad.l - pad.r} y={y(4)} height={y(3) - y(4)} className="sc-band" />
              <YGrid ticks={[0, 1, 2, 3, 4, 5]} x0={pad.l} x1={W - pad.r} y={y} />
              <motion.path d={line(plan.map((v, i) => [x(i), y(v)]))} className="sc-plan" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease }} />
              <motion.path d={line(actual.map((v, i) => [x(i), y(v)]))} className="lab-line s1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.3, ease }} />
              <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }} style={{ transformOrigin: `${x(6)}px ${y(1.2)}px` }}>
                <circle cx={x(6)} cy={y(1.2)} r={5.5} className="lab-stockout" />
                <text x={x(6) - 9} y={y(1.2) + 4} textAnchor="end" className="lab-ref-label strong">
                  1.2 wks
                </text>
              </motion.g>
              <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} x={x(9)} y={y(0.45)} textAnchor="end" className="lab-ref-label strong">
                {W < 420 ? "Pulled in → 3–4 wks" : "Pulled in → back to 3–4 wks"}
              </motion.text>
              {[
                [0, "Nov"],
                [2, "Dec"],
                [6, "Jan"],
              ].map(([i, t]) => (
                <text key={t} x={x(i as number)} y={H - 6} textAnchor="middle" className="lab-axis">
                  {t}
                </text>
              ))}
            </>
          );
        }}
      </Plot>
      <Legend
        items={[
          ["s1", "Actual (fab kept running)"],
          ["ref", "Plan (assumed shutdown)"],
          ["band", "3–4 wks rebuilt"],
        ]}
      />
    </>
  );
}

// Weekly usage against the forecast: December jumps 50% above it.
export function SpikeChart() {
  const use = [10, 9, 10, 10, 15, 16, 15, 10];
  const fc = 10;
  const pad = { l: 30, r: 12, t: 14, b: 24 };
  const H = 200;
  return (
    <>
      <Plot H={H} pad={pad} label="Weekly usage against a 10 per week forecast; weeks 5 to 7 run 50% above it. Sample units.">
        {(W) => {
          const bw = (W - pad.l - pad.r) / use.length;
          const y = (v: number) => pad.t + (1 - v / 20) * (H - pad.t - pad.b);
          return (
            <>
              <YGrid ticks={[0, 5, 10, 15, 20]} x0={pad.l} x1={W - pad.r} y={y} />
              {use.map((v, i) => (
                <motion.rect
                  key={i}
                  x={pad.l + i * bw + bw * 0.2}
                  width={bw * 0.6}
                  rx={4}
                  className={v > fc ? "sc-bar hl" : "sc-bar"}
                  initial={{ y: y(0), height: 0 }}
                  animate={{ y: y(v), height: y(0) - y(v) }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease }}
                />
              ))}
              <line x1={pad.l} x2={W - pad.r} y1={y(fc)} y2={y(fc)} className="lab-ref" />
              <text x={pad.l + 4} y={y(fc) - 6} className="lab-ref-label">
                forecast
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                <text x={pad.l + 5 * bw + 6} y={y(16) - 8} className="lab-ref-label strong">
                  +50% vs forecast
                </text>
                <line x1={pad.l + 5 * bw} x2={pad.l + 5 * bw} y1={pad.t} y2={y(0)} className="lab-marker" />
                <text x={pad.l + 5 * bw - 6} y={pad.t + 10} textAnchor="end" className="lab-ref-label">
                  pull-in asked
                </text>
              </motion.g>
              {use.map((_, i) => (
                <text key={i} x={pad.l + i * bw + bw / 2} y={H - 6} textAnchor="middle" className="lab-axis">
                  W{i + 1}
                </text>
              ))}
            </>
          );
        }}
      </Plot>
      <Legend
        items={[
          ["s1 box", "Usage"],
          ["hl box", "Usage above forecast"],
          ["ref", "Forecast"],
        ]}
      />
    </>
  );
}

// Run-out date against the supplier's promised date, and what a specific ask fixes.
export function RunoutChart() {
  const pad = { l: 30, r: 14, t: 14, b: 24 };
  const H = 210;
  const D = 24;
  const base: [number, number][] = [
    [0, 84],
    [14, 0],
    [21, 0],
    [21, 90],
    [24, 72],
  ];
  const ask: [number, number][] = [
    [14, 0],
    [14, 42],
    [21, 0],
  ];
  return (
    <>
      <Plot H={H} pad={pad} label="Stock runs out on day 14, a week before the supplier's day 21 date; 42 units by day 14 close the gap. Sample units.">
        {(W) => {
          const x = (d: number) => pad.l + (d / D) * (W - pad.l - pad.r);
          const y = (v: number) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
          return (
            <>
              <motion.rect initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} x={x(14)} width={x(21) - x(14)} y={pad.t} height={H - pad.t - pad.b} className="sc-shade bad" />
              <YGrid ticks={[0, 25, 50, 75, 100]} x0={pad.l} x1={W - pad.r} y={y} />
              <motion.path d={line(base.map(([d, v]) => [x(d), y(v)]))} className="lab-line s1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease }} />
              <motion.path d={line(ask.map(([d, v]) => [x(d), y(v)]))} className="lab-line hl" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 1.3, ease }} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <text x={(x(14) + x(21)) / 2} y={y(62)} textAnchor="middle" className="lab-ref-label strong">
                  7 days short
                </text>
                <text x={x(14) - 5} y={pad.t + 11} textAnchor="end" className="lab-ref-label">
                  runs out
                </text>
                <text x={x(21) - 5} y={pad.t + 11} textAnchor="end" className="lab-ref-label">
                  supplier date
                </text>
              </motion.g>
              <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} x={x(14) + 6} y={y(42) - 6} className="lab-ref-label strong">
                {W < 420 ? "+42" : "ask: 42 by day 14"}
              </motion.text>
              {[0, 7, 14, 21].map((d) => (
                <text key={d} x={x(d)} y={H - 6} textAnchor="middle" className="lab-axis">
                  Day {d}
                </text>
              ))}
            </>
          );
        }}
      </Plot>
      <Legend
        items={[
          ["s1", "Supplier's plan"],
          ["hl", "With my specific ask"],
          ["bad-box", "Stocked out"],
        ]}
      />
    </>
  );
}

// ---------- Mino ----------

// Quote to final cost, one lever at a time.
export function CostWaterfall() {
  const steps = [
    { label: ["Quote"], from: 0, to: 100, kind: "total" },
    { label: ["Use our own", "equipment"], from: 92, to: 100, kind: "cut" },
    { label: ["Right skill", "per task"], from: 80, to: 92, kind: "cut" },
    { label: ["Final"], from: 0, to: 80, kind: "total" },
  ];
  const pad = { l: 34, r: 12, t: 18, b: 36 };
  const H = 220;
  return (
    <>
      <Plot H={H} pad={pad} label="Waterfall: quote 100%, minus 8% by using our own equipment, minus 12% by matching labor to each task, final about 80%. The split is sample.">
        {(W) => {
          const bw = (W - pad.l - pad.r) / steps.length;
          const y = (v: number) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
          return (
            <>
              <YGrid ticks={[0, 25, 50, 75, 100]} x0={pad.l} x1={W - pad.r} y={y} fmt={(v) => `${v}%`} />
              {steps.map((s, i) => {
                const bx = pad.l + i * bw + bw * 0.18;
                const top = y(s.to);
                const h = y(s.from) - y(s.to);
                const val = s.kind === "cut" ? `−${s.to - s.from}%` : i === 0 ? "100%" : "≈80%";
                return (
                  <g key={i}>
                    <motion.rect
                      x={bx}
                      width={bw * 0.64}
                      rx={4}
                      className={s.kind === "cut" ? "sc-bar good" : "sc-bar"}
                      initial={{ y: s.kind === "cut" ? top : y(0), height: 0, opacity: 0 }}
                      animate={{ y: top, height: h, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.45, ease }}
                    />
                    {i < steps.length - 1 && (
                      <motion.line
                        x1={bx + bw * 0.64}
                        x2={bx + bw}
                        y1={y(s.kind === "cut" ? s.from : s.to)}
                        y2={y(s.kind === "cut" ? s.from : s.to)}
                        className="sc-link"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.45 }}
                      />
                    )}
                    <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.45 }} x={bx + bw * 0.32} y={top - 6} textAnchor="middle" className="lab-ref-label strong">
                      {val}
                    </motion.text>
                    {s.label.map((t, k) => (
                      <text key={t} x={bx + bw * 0.32} y={H - 20 + k * 13} textAnchor="middle" className="lab-axis">
                        {t}
                      </text>
                    ))}
                  </g>
                );
              })}
            </>
          );
        }}
      </Plot>
      <Legend
        items={[
          ["s1 box", "Cost"],
          ["good-box", "Savings lever"],
        ]}
      />
    </>
  );
}

// A timesheet record moving through the checks I designed with IT.
export function TimesheetFlow() {
  const nodes = [
    ["Clock in", "project and line"],
    ["Hours", "minus unpaid break"],
    ["Team lead", "approves"],
    ["Manager", "approves"],
    ["Invoice", "matched to hours"],
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s >= nodes.length ? s : s + 1)), 650);
    return () => clearInterval(t);
  }, [nodes.length]);
  return (
    <div className="tsf">
      <div className="tsf-card">
        <span className="tsf-k">Timesheet</span>
        <span>Project 1042 · Line 3</span>
        <span>7:00 – 17:00 · break 0:30</span>
        <strong>9.5 h</strong>
      </div>
      <ol className="tsf-steps">
        {nodes.map(([a, b], i) => (
          <li key={a} className={step > i ? "on" : ""}>
            <span className="tsf-dot">{step > i ? "✓" : i + 1}</span>
            <div>
              <strong>{a}</strong>
              <span>{b}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Handover: the new hire's share grows while coverage never drops below 100%.
export function HandoverChart() {
  const hire = [0, 10, 25, 40, 55, 75, 90, 100];
  const pad = { l: 38, r: 14, t: 16, b: 24 };
  const H = 200;
  return (
    <>
      <Plot H={H} pad={pad} label="Share of material purchasing handled by me and by the new hire over 8 weeks; together always 100%. Sample split.">
        {(W) => {
          const x = (i: number) => pad.l + (i / (hire.length - 1)) * (W - pad.l - pad.r);
          const y = (v: number) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
          const hireArea = `${line(hire.map((v, i) => [x(i), y(v)]))} L${x(hire.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
          const meArea = `${line(hire.map((v, i) => [x(i), y(v)]))} L${x(hire.length - 1)},${y(100)} L${x(0)},${y(100)} Z`;
          return (
            <>
              <defs>
                <clipPath id="ho-reveal">
                  <motion.rect x={pad.l} y={0} height={H} initial={{ width: 0 }} animate={{ width: W - pad.l - pad.r }} transition={{ duration: 1.8, ease }} />
                </clipPath>
              </defs>
              <YGrid ticks={[0, 50, 100]} x0={pad.l} x1={W - pad.r} y={y} fmt={(v) => `${v}%`} />
              <g clipPath="url(#ho-reveal)">
                <path d={meArea} className="sc-area s1" />
                <path d={hireArea} className="sc-area hl" />
              </g>
              <line x1={pad.l} x2={W - pad.r} y1={y(100)} y2={y(100)} className="sc-goodline" />
              <text x={W - pad.r} y={y(100) - 5} textAnchor="end" className="lab-ref-label strong">
                coverage 100%, every week
              </text>
              {[0, 3, 7].map((i) => (
                <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="lab-axis">
                  Wk {i + 1}
                </text>
              ))}
            </>
          );
        }}
      </Plot>
      <Legend
        items={[
          ["s1 box", "Me"],
          ["hl box", "New hire"],
        ]}
      />
    </>
  );
}

// ---------- Belong ----------

type Mark = "yes" | "part" | "no";
const markIcon: Record<Mark, string> = { yes: "✓", part: "~", no: "✗" };
const markText: Record<Mark, string> = { yes: "yes", part: "partly", no: "no" };

// What decided the ERP: the four options against the four tests I used.
export function ErpGrid() {
  const cols = ["Fits project inventory", "Pay only for what we use", "Security & upkeep not all on us", "Lower 3–5 yr cost"];
  const rows: { name: string; marks: Mark[]; pick?: boolean }[] = [
    { name: "Odoo", marks: ["yes", "yes", "yes", "yes"], pick: true },
    { name: "NetSuite", marks: ["part", "no", "yes", "no"] },
    { name: "SAP", marks: ["part", "no", "yes", "no"] },
    { name: "Custom build", marks: ["yes", "yes", "no", "part"] },
  ];
  return (
    <div className="erp" role="table" aria-label="ERP options compared on four tests">
      <div className="erp-row erp-headrow" role="row">
        <span role="columnheader" />
        {cols.map((c) => (
          <span key={c} role="columnheader">
            {c}
          </span>
        ))}
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          role="row"
          className={`erp-row ${r.pick ? "pick" : ""}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.15, duration: 0.4, ease }}
        >
          <strong role="rowheader">
            {r.name}
            {r.pick && <em>chosen</em>}
          </strong>
          {r.marks.map((m, k) => (
            <span key={k} role="cell" className={`erp-mark ${m}`} title={markText[m]}>
              <b aria-hidden>{markIcon[m]}</b>
              <span className="sr-only">{markText[m]}</span>
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

// Floating seats sized to peak concurrent use, then the quote comparison.
export function SeatsChart() {
  const users = [1, 2, 3, 2, 3, 3, 2, 1, 2, 3, 1];
  const pad = { l: 26, r: 14, t: 16, b: 24 };
  const H = 180;
  return (
    <>
      <Plot H={H} pad={pad} label="People using the software at once through a sample workday: never more than 3, against 5 project teams.">
        {(W) => {
          const x = (i: number) => pad.l + (i / users.length) * (W - pad.l - pad.r);
          const y = (v: number) => pad.t + (1 - v / 6) * (H - pad.t - pad.b);
          const pts: [number, number][] = [];
          users.forEach((v, i) => {
            pts.push([x(i), y(v)], [x(i + 1), y(v)]);
          });
          return (
            <>
              <YGrid ticks={[0, 3, 6]} x0={pad.l} x1={W - pad.r} y={y} />
              <line x1={pad.l} x2={W - pad.r} y1={y(5)} y2={y(5)} className="lab-ref" />
              <text x={W - pad.r} y={y(5) - 5} textAnchor="end" className="lab-ref-label">
                one seat per team: 5
              </text>
              <line x1={pad.l} x2={W - pad.r} y1={y(3)} y2={y(3)} className="sc-cap" />
              <text x={W - pad.r} y={y(3) - 5} textAnchor="end" className="lab-ref-label strong">
                3 floating seats
              </text>
              <motion.path d={line(pts)} className="lab-line s1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease }} />
              {[0, 4, 8].map((i) => (
                <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="lab-axis">
                  {8 + i}:00
                </text>
              ))}
            </>
          );
        }}
      </Plot>
      <div className="sc-quotes">
        {[
          ["Highest quote", 100, "≈ $167K"],
          ["Chosen offer", 60, "≈ $100K"],
        ].map(([name, pct, amt], i) => (
          <div key={name as string} className="sc-quote">
            <span>{name}</span>
            <span className="sc-quote-track">
              <motion.i className={i ? "chosen" : ""} initial={{ width: "0%" }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 1.2 + i * 0.3, ease }} />
            </span>
            <b>{amt}</b>
          </div>
        ))}
      </div>
      <Legend
        items={[
          ["s1", "People using it at once"],
          ["hl", "Seats bought"],
        ]}
      />
    </>
  );
}

// Machine repair quotes as a share of a local baseline, two staffing scenarios per vendor.
export function RepairChart() {
  const rows: { name: string; a: number; b: number; note: string }[] = [
    { name: "Vendor A", a: 129, b: 119, note: "nearest" },
    { name: "Vendor B", a: 189, b: 162, note: "" },
    { name: "Vendor C", a: 256, b: 212, note: "" },
    { name: "Vendor D", a: 307, b: 203, note: "lowest hourly rate" },
  ];
  const max = 320;
  return (
    <>
      <div className="rp" role="img" aria-label="Repair cost as a share of the local baseline. Two technicians over two days, then one technician over four days: Vendor A 129% and 119%, B 189% and 162%, C 256% and 212%, D 307% and 203%.">
        <div className="rp-base" style={{ left: `calc(var(--rp-name, 96px) + (100% - var(--rp-name, 96px) - 54px) * ${100 / max})` }}>
          <span>baseline 100%</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.name} className="rp-row">
            <span className="rp-name">
              {r.name}
              {r.note && <em>{r.note}</em>}
            </span>
            <div className="rp-bars">
              {[r.a, r.b].map((v, k) => (
                <div key={k} className="rp-bar">
                  <span className="rp-track">
                    <motion.i className={k ? "one" : "two"} initial={{ width: "0%" }} animate={{ width: `${(v / max) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.15 + k * 0.08, ease }} />
                  </span>
                  <b>{v}%</b>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Legend
        items={[
          ["rp-two box", "2 technicians × 2 days"],
          ["rp-one box", "1 technician × 4 days"],
        ]}
      />
    </>
  );
}

// ---------- RBR ----------

// How I build with AI: describe, Claude Code builds, Codex cross-checks, I check against real records, ship.
export function BuildLoop() {
  const nodes = ["I describe the need", "Claude Code builds it", "Codex cross-checks it", "I check it against real records", "Ship"];
  const modules = ["Live room inventory", "Online applications", "Lease automation", "Occupancy calendar", "AI reply drafts", "TenantCloud agents"];
  const [lit, setLit] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setLit((s) => s + 1), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="loop">
      <ol className="loop-steps">
        {nodes.map((n, i) => (
          <li key={n} className={lit % (nodes.length + 1) > i ? "on" : ""}>
            <span className="tsf-dot">{i + 1}</span>
            {n}
          </li>
        ))}
      </ol>
      <div className="loop-mods">
        {modules.map((m, i) => (
          <motion.span key={m} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.18 }}>
            ✓ {m}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// An arrival day: energy runs down until the snack bag in the room.
export function ArrivalTimeline() {
  const steps: [string, number][] = [
    ["Long international flight", 70],
    ["No car to get groceries", 45],
    ["Unpacking, tired and hungry", 20],
    ["A snack bag waiting in the room", 75],
  ];
  return (
    <div className="arr">
      {steps.map(([t, e], i) => (
        <motion.div key={t} className={`arr-step ${i === steps.length - 1 ? "fix" : ""}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.45 }}>
          <span className="arr-t">{t}</span>
          <span className="arr-track" aria-label={`energy ${e}%`}>
            <motion.i initial={{ width: "0%" }} animate={{ width: `${e}%` }} transition={{ delay: 0.4 + i * 0.45, duration: 0.6, ease }} />
          </span>
        </motion.div>
      ))}
      <motion.blockquote initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3 }}>
        “You don&apos;t know how much it meant to me.”
      </motion.blockquote>
    </div>
  );
}

// A 90-day lead time: wait for it, or bridge it and swap later.
export function BridgeChart() {
  const pad = { l: 12, r: 12, t: 16, b: 34 };
  const H = 170;
  const rows = [
    { name: "Wait for the part", y: 0 },
    { name: "Bridge, then swap", y: 1 },
  ];
  return (
    <>
      <Plot H={H} pad={pad} label="Timeline over 90 days. Waiting: the install is blocked for all 90 days. Bridging: a temporary unit is running within days, and the proper part is swapped in on day 90. The bridge day is sample.">
        {(W) => {
          const x = (d: number) => pad.l + (d / 90) * (W - pad.l - pad.r);
          const rowY = (i: number) => pad.t + 18 + i * 52;
          return (
            <>
              {[0, 30, 60, 90].map((d) => (
                <g key={d}>
                  <line x1={x(d)} x2={x(d)} y1={pad.t} y2={H - pad.b} className="lab-grid-line" />
                  <text x={x(d)} y={H - 14} textAnchor="middle" className="lab-axis">
                    day {d}
                  </text>
                </g>
              ))}
              {rows.map((r, i) => (
                <text key={r.name} x={pad.l} y={rowY(i) - 8} className="lab-ref-label strong">
                  {r.name}
                </text>
              ))}
              <motion.rect x={x(0)} y={rowY(0)} height={14} rx={4} className="sc-bar" initial={{ width: 0 }} animate={{ width: x(90) - x(0) }} transition={{ duration: 1.2, delay: 0.2, ease }} />
              <motion.rect x={x(0)} y={rowY(1)} height={14} rx={4} className="sc-bar good" initial={{ width: 0 }} animate={{ width: x(7) - x(0) }} transition={{ duration: 0.4, delay: 1.5, ease }} />
              <motion.line x1={x(7)} x2={x(90)} y1={rowY(1) + 7} y2={rowY(1) + 7} className="sc-link" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} />
              <motion.circle cx={x(90)} cy={rowY(1) + 7} r={5} className="sc-bar good" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} />
            </>
          );
        }}
      </Plot>
      <Legend
        items={[
          ["s1 box", "Install blocked"],
          ["good-box", "Temporary unit built"],
          ["ref", "Running until the proper part arrives"],
        ]}
      />
    </>
  );
}

// ---------- Card previews ----------

// A small sketch of each story's chart, shown on the closed card.
const sparks: Record<string, ReactNode> = {
  "ex-holiday": (
    <>
      <path d="M0,12 L25,11 L50,8 L75,10 L100,12" className="spk-faint" />
      <path d="M0,12 L20,17 L40,25 L55,33 L65,38 L80,24 L100,14" className="spk-line" />
      <circle cx={65} cy={38} r={3} className="spk-fill" />
    </>
  ),
  "ex-spike": (
    <>
      {[12, 11, 12, 12, 20, 22, 20, 12].map((h, i) => (
        <rect key={i} x={i * 12.5 + 2} width={8} y={42 - h * 1.6} height={h * 1.6} rx={2} className={i >= 4 && i <= 6 ? "spk-fill" : "spk-soft"} />
      ))}
      <path d="M0,22.8 L100,22.8" className="spk-faint" />
    </>
  ),
  "ex-suppliers": (
    <>
      <rect x={58} width={26} y={0} height={42} className="spk-soft" />
      <path d="M0,8 L58,41 L84,41 L84,5 L100,11" className="spk-line" />
      <path d="M58,41 L58,24 L84,41" className="spk-line" />
    </>
  ),
  "ex-cost": (
    <>
      <rect x={4} width={18} y={2} height={40} rx={2} className="spk-fill" />
      <rect x={29} width={18} y={2} height={4} rx={1} className="spk-soft" />
      <rect x={54} width={18} y={6} height={6} rx={1} className="spk-soft" />
      <rect x={79} width={18} y={12} height={30} rx={2} className="spk-fill" />
    </>
  ),
  "ex-weldsaver": (
    <>
      <rect x={2} width={96} y={8} height={8} rx={2} className="spk-soft" />
      <rect x={2} width={10} y={26} height={8} rx={2} className="spk-fill" />
      <path d="M12,30 L96,30" className="spk-line" />
    </>
  ),
  "ex-timesheets": (
    <>
      <path d="M8,21 L92,21" className="spk-line" />
      {[8, 29, 50, 71, 92].map((x) => (
        <circle key={x} cx={x} cy={21} r={5} className="spk-fill" />
      ))}
    </>
  ),
  "ex-handover": (
    <>
      <rect x={0} width={100} y={4} height={38} className="spk-soft" />
      <path d="M0,42 L15,38 L30,32 L45,26 L60,18 L75,10 L100,4 L100,42 Z" className="spk-fill" />
    </>
  ),
  "ex-odoo": (
    <>
      {[0, 1, 2, 3].flatMap((r) =>
        [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={8 + c * 24} y={2 + r * 10.5} width={14} height={7} rx={2} className={r === 0 ? "spk-fill" : "spk-soft"} />),
      )}
    </>
  ),
  "ex-cad": (
    <>
      <path d="M0,4 L100,4" className="spk-faint" />
      <path d="M0,18 L100,18" className="spk-faint" />
      <path d="M0,38 L12,38 L12,28 L28,28 L28,18 L42,18 L42,28 L58,28 L58,18 L80,18 L80,38 L100,38" className="spk-line" />
    </>
  ),
  "ex-ai": (
    <>
      <circle cx={50} cy={21} r={16} className="spk-line" />
      {[0, 90, 180, 270].map((a) => (
        <circle key={a} cx={50 + 16 * Math.cos((a * Math.PI) / 180)} cy={21 + 16 * Math.sin((a * Math.PI) / 180)} r={4} className="spk-fill" />
      ))}
    </>
  ),
  "ex-arrival": (
    <>
      {[58, 38, 18].map((w, i) => (
        <rect key={i} x={0} y={2 + i * 10.5} width={w} height={6} rx={3} className="spk-soft" />
      ))}
      <rect x={0} y={33.5} width={66} height={6} rx={3} className="spk-fill" />
    </>
  ),
};

export function Spark({ id }: { id: string }) {
  if (!sparks[id]) return null;
  return (
    <svg className="exc-spark" viewBox="0 0 100 42" aria-hidden="true">
      {sparks[id]}
    </svg>
  );
}
