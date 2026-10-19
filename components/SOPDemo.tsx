"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import { useWidth } from "./PlanningLab";

// A small S&OP dashboard visitors can play with. One sample material, 12
// weeks: move demand, supplier delay and the safety-stock target, and the
// projection, status and recommended action update. Sample data only; not
// tied to any employer.

const WEEKS = 12;
const START_ON_HAND = 420;
const DEMAND = [90, 95, 100, 92, 105, 110, 98, 104, 112, 108, 100, 115];
const POS = [
  { week: 3, qty: 350 },
  { week: 6, qty: 350 },
  { week: 9, qty: 350 },
  { week: 12, qty: 300 },
];

type Week = { week: number; demand: number; receipt: number; onHand: number };

function project(demandPct: number, delay: number): Week[] {
  let onHand = START_ON_HAND;
  return DEMAND.map((d, i) => {
    const week = i + 1;
    const demand = Math.round(d * (1 + demandPct / 100));
    const receipt = POS.filter((p) => p.week + delay === week).reduce((s, p) => s + p.qty, 0);
    onHand = onHand + receipt - demand;
    return { week, demand, receipt, onHand };
  });
}

const roundUp = (n: number) => Math.ceil(n / 10) * 10;

export default function SOPDemo() {
  const [demandPct, setDemandPct] = useState(0);
  const [delay, setDelay] = useState(0);
  const [ssWeeks, setSsWeeks] = useState(2);
  const [hover, setHover] = useState<number | null>(null);
  const [ref, w] = useWidth<HTMLDivElement>();

  const weeks = useMemo(() => project(demandPct, delay), [demandPct, delay]);
  const avgDemand = weeks.reduce((s, x) => s + x.demand, 0) / WEEKS;
  const safety = Math.round(ssWeeks * avgDemand);
  const firstOut = weeks.find((x) => x.onHand <= 0);
  const firstBelow = weeks.find((x) => x.onHand < safety);
  const gap = Math.max(0, ...weeks.map((x) => safety - x.onHand));
  const low = weeks.reduce((m, x) => (x.onHand < m.onHand ? x : m), weeks[0]);
  const status = firstOut ? "critical" : firstBelow ? "warning" : "good";
  const statusText = firstOut
    ? `Run-out in week ${firstOut.week}`
    : firstBelow
      ? `Below safety stock in week ${firstBelow.week}`
      : "Covered all 12 weeks";
  const action = firstBelow
    ? `Pull in ${roundUp(gap)} units before week ${firstBelow.week}`
    : "No action: keep the current POs";

  // Chart geometry
  const H = 240;
  const pad = { l: 40, r: 12, t: 16, b: 34 };
  const iw = w - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const maxY = Math.max(700, ...weeks.map((x) => x.onHand));
  const minY = Math.min(0, ...weeks.map((x) => x.onHand));
  const x = (wk: number) => pad.l + ((wk - 1) / (WEEKS - 1)) * iw;
  const y = (v: number) => pad.t + ih - ((v - minY) / (maxY - minY)) * ih;
  const ticks = [0, 200, 400, 600].filter((t) => t <= maxY);
  const path = weeks.map((p, i) => `${i ? "L" : "M"}${x(p.week)},${y(p.onHand)}`).join(" ");
  const hw = hover !== null ? weeks[hover] : null;

  return (
    <section id="sop-demo" className="sop-demo viz-root">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Try it</span>
          <h2 className="section-title">
            An S&amp;OP dashboard I <em>built</em>. Break it.
          </h2>
        </Reveal>

        <Reveal className="card lab-card sop-card">
          <div className="sop-controls">
            <Slider label="Demand change" value={demandPct} min={-20} max={40} step={5} fmt={(v) => `${v > 0 ? "+" : ""}${v}%`} onChange={setDemandPct} />
            <Slider label="Supplier delay" value={delay} min={0} max={3} step={1} fmt={(v) => `${v} wk`} onChange={setDelay} />
            <Slider label="Safety stock" value={ssWeeks} min={1} max={4} step={1} fmt={(v) => `${v} wk`} onChange={setSsWeeks} />
          </div>

          <div className="lab-kpis sop-kpis">
            <div>
              <strong className={status === "good" ? "good" : status === "critical" ? "bad" : "warn"}>
                <StatusIcon status={status} /> {statusText}
              </strong>
              <span>status</span>
            </div>
            <div>
              <strong className={low.onHand <= 0 ? "bad" : ""}>{low.onHand <= 0 ? `Short ${-low.onHand}` : low.onHand}</strong>
              <span>lowest point, units (week {low.week})</span>
            </div>
            <div>
              <strong>{action}</strong>
              <span>recommended action</span>
            </div>
          </div>

          <div className="lab-chart" ref={ref} onMouseLeave={() => setHover(null)}>
            <svg width={w} height={H} role="img" aria-label={`Projected on hand over 12 weeks. ${statusText}. ${action}.`}>
              <rect className="lab-band" x={pad.l} y={y(safety)} width={iw} height={Math.max(0, y(minY) - y(safety))} />
              {ticks.map((t) => (
                <g key={t}>
                  <line className="lab-grid-line" x1={pad.l} x2={pad.l + iw} y1={y(t)} y2={y(t)} />
                  <text className="lab-axis" x={pad.l - 8} y={y(t) + 4} textAnchor="end">
                    {t}
                  </text>
                </g>
              ))}
              <line className="lab-ref" x1={pad.l} x2={pad.l + iw} y1={y(safety)} y2={y(safety)} />
              <text className="lab-ref-label" x={pad.l + iw} y={y(safety) - 6} textAnchor="end">
                Safety stock {safety}
              </text>
              {weeks.map((p) =>
                p.week % (w < 480 ? 2 : 1) === 0 || p.week === 1 ? (
                  <text key={p.week} className="lab-axis" x={x(p.week)} y={H - 12} textAnchor="middle">
                    {w < 480 ? p.week : `Wk ${p.week}`}
                  </text>
                ) : null
              )}
              {weeks
                .filter((p) => p.receipt)
                .map((p) => (
                  <g key={`po${p.week}`}>
                    <path className="sop-po" d={`M${x(p.week)},${y(minY) - 2} l-5,8 h10 z`} transform={`translate(0,${-8})`} />
                  </g>
                ))}
              <path className="lab-line s1" d={path} />
              {hw && <line className="lab-cross" x1={x(hw.week)} x2={x(hw.week)} y1={pad.t} y2={pad.t + ih} />}
              {weeks.map((p) => (
                <circle
                  key={p.week}
                  className={`lab-dot ${p.onHand <= 0 ? "sop-out" : p.onHand < safety ? "sop-low" : "s1"}`}
                  cx={x(p.week)}
                  cy={y(p.onHand)}
                  r={hover === p.week - 1 ? 6 : 4.5}
                />
              ))}
              {weeks.map((p, i) => (
                <rect
                  key={`hit${p.week}`}
                  x={x(p.week) - iw / (WEEKS - 1) / 2}
                  y={pad.t}
                  width={iw / (WEEKS - 1)}
                  height={ih}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onTouchStart={() => setHover(i)}
                />
              ))}
            </svg>
            {hw && (
              <div className="lab-tip" style={{ left: Math.min(Math.max(x(hw.week), 90), w - 90) }}>
                <b>Week {hw.week}</b> · {hw.onHand <= 0 ? <span className="bad">short {-hw.onHand}</span> : `${hw.onHand} on hand`} · demand {hw.demand}
                {hw.receipt ? ` · PO +${hw.receipt}` : ""}
              </div>
            )}
          </div>

          <div className="lab-legend">
            <span>
              <i className="sw s1" /> Projected on hand (units)
            </span>
            <span>
              <i className="sw ref" /> Safety stock
            </span>
            <span>
              <i className="sw sop-po-sw" /> PO arrives
            </span>
            <span>
              <i className="sw sop-low-sw" /> Below safety
            </span>
            <span>
              <i className="sw stockout" /> Run-out
            </span>
          </div>
        </Reveal>
        <p className="lab-note">Sample data for one made-up material. Built by me with Claude Code and Codex; not from any employer.</p>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, step, fmt, onChange }: { label: string; value: number; min: number; max: number; step: number; fmt: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <label className="sop-slider">
      <span>
        {label} <b>{fmt(value)}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function StatusIcon({ status }: { status: string }) {
  return <span aria-hidden className="sop-icon">{status === "good" ? "✓" : status === "critical" ? "✕" : "!"}</span>;
}
