"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";

// Four small SkyWater material-planning demos. Mino work lives in
// MinoSection.tsx. Every number here is made up and labeled as sample data.

const ease = [0.22, 1, 0.36, 1] as const;

export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(520);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

// The SkyWater planning charts, shown inside the SkyWater section.
export default function PlanningCharts() {
  return (
      <div id="planning" className="lab viz-root">
        <div className="lab-grid">
          <Reveal className="lab-card card lab-anchor">
            <span id="safety-stock" className="anchor-offset" />
            <SafetyStock />
          </Reveal>
          <Reveal className="lab-card card lab-anchor" delay={0.08}>
            <span id="early-warning" className="anchor-offset" />
            <EarlyWarning />
          </Reveal>
          <Reveal className="lab-card card lab-anchor lab-wide">
            <span id="woi" className="anchor-offset" />
            <WOIView />
          </Reveal>
          <Reveal className="lab-card card lab-anchor lab-wide">
            <span id="eol-buy" className="anchor-offset" />
            <EndOfLife />
          </Reveal>
        </div>
        <p className="lab-note">Sample data, shaped like real planning work. No employer data is shown.</p>
      </div>
  );
}

export function CardHead({ title, sub, children }: { title: string; sub: string; children?: React.ReactNode }) {
  return (
    <div className="lab-head">
      <div>
        <h3>{title}</h3>
        <p>{sub}</p>
      </div>
      {children}
    </div>
  );
}

export function Toggle<T extends string>({ value, options, onChange, id }: { value: T; options: { key: T; label: string }[]; onChange: (v: T) => void; id: string }) {
  return (
    <div className="lab-toggle" role="tablist">
      {options.map((o) => (
        <button key={o.key} role="tab" aria-selected={value === o.key} className={value === o.key ? "on" : ""} onClick={() => onChange(o.key)}>
          {value === o.key && <motion.span layoutId={`lab-pill-${id}`} className="lab-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- 1. Safety stock: old min/max vs rebuilt from usage ---------- */

const usage = [18, 22, 20, 25, 19, 31, 24, 17, 21, 28, 35, 22, 19, 23, 26, 30, 21, 18, 24, 33, 27, 20, 22, 25, 29, 21];
const LEAD = 4;
const policies = {
  old: { label: "Old min/max", rop: 60, qty: 70, start: 90, ss: 0 },
  new: { label: "Rebuilt from usage", rop: 115, qty: 100, start: 120, ss: 15 },
};
type Policy = keyof typeof policies;

function simulate(p: Policy) {
  const { rop, qty, start } = policies[p];
  let oh = start;
  let pipe: { at: number; q: number }[] = [];
  return usage.map((d, w) => {
    pipe = pipe.filter((o) => (o.at === w ? ((oh += o.q), false) : true));
    const short = Math.max(0, d - oh);
    oh = Math.max(0, oh - d);
    const onOrder = pipe.reduce((a, o) => a + o.q, 0);
    if (oh + onOrder <= rop) pipe.push({ at: w + LEAD, q: qty });
    return { w, oh, short };
  });
}

function SafetyStock() {
  const [policy, setPolicy] = useState<Policy>("old");
  const [wrap, W] = useWidth<HTMLDivElement>();
  const inView = useInView(wrap, { once: true, margin: "-60px 0px -60px 0px" });
  const [hover, setHover] = useState<number | null>(null);
  const data = useMemo(() => simulate(policy), [policy]);
  const stockouts = data.filter((d) => d.short > 0).length;

  const H = 200;
  const pad = { l: 32, r: 10, t: 12, b: 24 };
  const max = 130;
  const x = (i: number) => pad.l + (i / (usage.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.oh).toFixed(1)}`).join(" ");
  const p = policies[policy];

  return (
    <>
      <CardHead title="Safety stock, rebuilt" sub="On-hand units for one material over 26 weeks">
        <Toggle id="ss" value={policy} onChange={setPolicy} options={(Object.keys(policies) as Policy[]).map((k) => ({ key: k, label: policies[k].label }))} />
      </CardHead>
      <div className="lab-kpis">
        <div>
          <motion.strong key={policy + "s"} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={stockouts ? "bad" : "good"}>
            {stockouts}
          </motion.strong>
          <span>stockout weeks</span>
        </div>
        <div>
          <motion.strong key={policy + "r"} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {p.rop}
          </motion.strong>
          <span>reorder point</span>
        </div>
      </div>
      <div ref={wrap} className="lab-chart" onMouseLeave={() => setHover(null)}>
        <svg width={W} height={H} role="img" aria-label={`On-hand inventory with ${p.label}: ${stockouts} stockout weeks. Sample data.`}>
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="lab-grid-line" />
              <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" className="lab-axis">
                {v}
              </text>
            </g>
          ))}
          <motion.line x1={pad.l} x2={W - pad.r} initial={false} animate={{ y1: y(p.rop), y2: y(p.rop) }} className="lab-ref" />
          <motion.text x={W - pad.r} initial={false} animate={{ y: y(p.rop) - 6 }} textAnchor="end" className="lab-ref-label">
            reorder point
          </motion.text>
          {p.ss > 0 && <rect x={pad.l} width={W - pad.l - pad.r} y={y(p.ss)} height={y(0) - y(p.ss)} className="lab-band" />}
          <motion.path
            d={path}
            animate={{ d: path }}
            initial={{ pathLength: 0, d: path }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ d: { duration: 0.7, ease }, pathLength: { duration: 1.4, ease } }}
            className="lab-line s1"
          />
          {inView &&
            data.map((d, i) =>
              d.short > 0 ? (
                <motion.g key={`${policy}-${i}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 + i * 0.03 }} style={{ transformOrigin: `${x(i)}px ${y(0)}px` }}>
                  <circle cx={x(i)} cy={y(0)} r={5} className="lab-stockout" />
                </motion.g>
              ) : null
            )}
          {[0, 8, 16, 25].map((i) => (
            <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="lab-axis">
              W{i + 1}
            </text>
          ))}
          {/* hover targets wider than the marks */}
          {data.map((d, i) => (
            <rect key={i} x={x(i) - (W / usage.length) / 2} y={0} width={W / usage.length} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
          {hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="lab-cross" />
              <circle cx={x(hover)} cy={y(data[hover].oh)} r={5} className="lab-dot s1" />
            </g>
          )}
        </svg>
        {hover !== null && (
          <div className="lab-tip" style={{ left: Math.min(Math.max(x(hover), 70), W - 70) }}>
            <b>Week {hover + 1}</b> · {data[hover].oh} on hand
            {data[hover].short > 0 && <span className="bad"> · short {data[hover].short}</span>}
          </div>
        )}
      </div>
      <div className="lab-legend">
        <span>
          <i className="sw s1" /> On hand
        </span>
        <span>
          <i className="sw ref" /> Reorder point
        </span>
        <span>
          <i className="sw stockout" /> Stockout week
        </span>
        {p.ss > 0 && (
          <span>
            <i className="sw band" /> Safety stock
          </span>
        )}
      </div>
    </>
  );
}

/* ---------- 2. Early warning: the ERP said fine, the model said otherwise ---------- */

const erp = [26, 26, 25, 26, 25, 25, 26, 25, 25, 26, 26, 26, 26];
const model = [24, 21, 18, 15, 12, 10, 7, 5, 3, 1, 30, 27, 24];
const ALERT = 1;
const ARRIVE = 10;
const DRAW = 3.2; // seconds to draw all 13 weeks

function EarlyWarning() {
  const [wrap, W] = useWidth<HTMLDivElement>();
  const inView = useInView(wrap, { once: true, margin: "-60px 0px -60px 0px" });
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  const H = 200;
  const pad = { l: 32, r: 12, t: 16, b: 24 };
  const max = 32;
  const x = (i: number) => pad.l + (i / (model.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  // When the reveal reaches week i, so markers appear as the lines pass them.
  const at = (i: number) => (i / (model.length - 1)) * DRAW;
  const line = (vals: number[]) =>
    vals
      .map((v, i) => {
        // the restock is a vertical jump, not a slope
        if (i === ARRIVE) return `L${x(i).toFixed(1)},${y(vals[i - 1]).toFixed(1)} L${x(i).toFixed(1)},${y(v).toFixed(1)}`;
        return `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      })
      .join(" ");
  const show = (i: number) => ({ initial: { opacity: 0 }, animate: { opacity: inView ? 1 : 0 }, transition: { delay: at(i), duration: 0.35 } });

  return (
    <>
      <CardHead title="Stockout, caught early" sub="Bottles of a single-source chemical, week by week">
        <button type="button" className="lab-replay" onClick={() => setRun((r) => r + 1)} aria-label="Replay the chart">
          ↻ Replay
        </button>
      </CardHead>
      <div className="lab-kpis">
        <div>
          <strong>{ARRIVE - ALERT} wks</strong>
          <span>of warning</span>
        </div>
        <div>
          <strong className="good">0</strong>
          <span>production stops</span>
        </div>
      </div>
      <div ref={wrap} className="lab-chart" onMouseLeave={() => setHover(null)}>
        <svg width={W} height={H} role="img" aria-label="The ERP showed about 25 bottles all along; the depletion model showed stock falling to 1 bottle before the restock arrived in week 11. Sample data.">
          <defs>
            <clipPath id="ew-reveal">
              <motion.rect key={run} x={0} y={0} height={H} initial={{ width: 0 }} animate={{ width: inView ? W : 0 }} transition={{ duration: DRAW + 0.2, ease: "linear" }} />
            </clipPath>
          </defs>
          {[0, 10, 20, 30].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="lab-grid-line" />
              <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" className="lab-axis">
                {v}
              </text>
            </g>
          ))}
          <g clipPath="url(#ew-reveal)">
            <path d={line(erp)} className="lab-line s1" />
            <path d={line(model)} className="lab-line hl" />
          </g>
          <g key={run}>
            <motion.g {...show(ALERT)}>
              <line x1={x(ALERT)} x2={x(ALERT)} y1={pad.t} y2={H - pad.b} className="lab-marker" />
              <text x={x(ALERT) + 6} y={pad.t + 10} className="lab-ref-label strong">
                ⚠ Alert raised
              </text>
            </motion.g>
            <motion.g {...show(ARRIVE - 1)}>
              <circle cx={x(ARRIVE - 1)} cy={y(1)} r={6} className="lab-dot hl" />
              <line x1={x(ARRIVE - 1) - 34} y1={y(10) + 4} x2={x(ARRIVE - 1) - 5} y2={y(1) - 5} className="lab-leader" />
              <text x={x(ARRIVE - 1) - 38} y={y(10)} textAnchor="end" className="lab-ref-label strong">
                1 bottle left
              </text>
            </motion.g>
            <motion.text {...show(ARRIVE)} x={x(ARRIVE) - 8} y={y(14)} textAnchor="end" className="lab-ref-label strong">
              ✓ Restock in
            </motion.text>
          </g>
          {[0, 4, 8, 12].map((i) => (
            <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="lab-axis">
              W{i + 1}
            </text>
          ))}
          {model.map((_, i) => (
            <rect key={i} x={x(i) - W / model.length / 2} y={0} width={W / model.length} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="lab-cross" pointerEvents="none" />}
        </svg>
        {hover !== null && (
          <div className="lab-tip" style={{ left: Math.min(Math.max(x(hover), 80), W - 80) }}>
            <b>Week {hover + 1}</b> · ERP {erp[hover]} · actual {model[hover]}
          </div>
        )}
      </div>
      <div className="lab-legend">
        <span>
          <i className="sw s1" /> What the ERP showed
        </span>
        <span>
          <i className="sw hl" /> Depletion model (actual use + open POs)
        </span>
      </div>
    </>
  );
}

/* ---------- 3. Weeks of inventory (WOI) per material ---------- */

const WOI_MIN = 2;
const WOI_TARGET = [4, 6] as const;
const WOI_SCALE = 8;
const WOI_WEEKS = 12;
// Projected WOI (on hand ÷ average weekly use) for the next 12 weeks. Sample data.
const woiData: { name: string; woi: number[] }[] = [
  { name: "Specialty gas A", woi: [5.2, 4.8, 4.4, 5.6, 5.2, 4.8, 4.4, 5.6, 5.2, 4.8, 4.4, 5.6] },
  { name: "Specialty gas B", woi: [6.4, 6.0, 5.5, 5.0, 4.6, 4.1, 3.6, 3.2, 2.7, 2.3, 1.8, 1.4] },
  { name: "CMP slurry", woi: [4.5, 4.1, 3.7, 5.2, 4.8, 4.4, 4.0, 5.5, 5.1, 4.7, 4.3, 5.8] },
  { name: "Photoresist", woi: [3.1, 2.6, 2.1, 1.6, 1.2, 3.8, 3.4, 4.1, 3.7, 4.3, 3.9, 4.5] },
  { name: "Developer", woi: [7.8, 7.5, 7.2, 6.9, 6.6, 6.3, 6.0, 5.7, 5.4, 5.1, 4.8, 4.5] },
  { name: "Process acid", woi: [5.0, 4.6, 4.2, 3.8, 5.4, 5.0, 4.6, 4.2, 5.8, 5.4, 5.0, 4.6] },
  { name: "Solvent", woi: [1.8, 1.4, 4.9, 4.5, 4.1, 3.7, 5.2, 4.8, 4.4, 4.0, 5.5, 5.1] },
  { name: "Etch gas", woi: [4.9, 4.6, 4.3, 4.0, 3.7, 3.4, 3.1, 4.6, 4.3, 4.0, 3.7, 3.4] },
];
type WoiStatus = "min" | "low" | "ok" | "high";
const woiStatus = (v: number): WoiStatus => (v < WOI_MIN ? "min" : v < WOI_TARGET[0] ? "low" : v <= WOI_TARGET[1] ? "ok" : "high");
const woiLabel: Record<WoiStatus, string> = { min: "Below minimum", low: "Below target", ok: "On target", high: "Above target" };
const woiIcon: Record<WoiStatus, string> = { min: "⚠", low: "↓", ok: "✓", high: "↑" };
const pctOf = (v: number) => `${(Math.min(v, WOI_SCALE) / WOI_SCALE) * 100}%`;

function WOIView() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const [week, setWeek] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [sel, setSel] = useState(3);
  const [hover, setHover] = useState<number | null>(null);

  // Step through the projection once, then stop on the last week.
  useEffect(() => {
    if (!inView || !playing) return;
    if (week >= WOI_WEEKS - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setWeek((w) => w + 1), week === 0 ? 1400 : 950);
    return () => clearTimeout(t);
  }, [inView, playing, week]);

  const statuses = woiData.map((m) => woiStatus(m.woi[week]));
  const count = (st: WoiStatus[]) => statuses.filter((x) => st.includes(x)).length;

  return (
    <>
      <CardHead title="Weeks of inventory (WOI)" sub="On hand ÷ average weekly use, per material, projected 12 weeks" />
      <div className="woi-layout">
        <div className="woi-main">
          <div className="lab-kpis">
            <div>
              <strong className="bad">{count(["min"])}</strong>
              <span>below 2-wk minimum</span>
            </div>
            <div>
              <strong>{count(["low"])}</strong>
              <span>below 4-wk target</span>
            </div>
            <div>
              <strong>{count(["ok", "high"])}</strong>
              <span>at or above target</span>
            </div>
          </div>

          <div className="woi-week">
            <button
              type="button"
              className="lab-replay"
              onClick={() => {
                if (!playing && week >= WOI_WEEKS - 1) setWeek(0);
                setPlaying((p) => !p);
              }}
              aria-label={playing ? "Pause" : "Play the 12 weeks"}
            >
              {playing ? "❚❚ Pause" : "▶ Play"}
            </button>
            <input
              type="range"
              min={0}
              max={WOI_WEEKS - 1}
              value={week}
              aria-label="Week"
              onChange={(e) => {
                setWeek(Number(e.target.value));
                setPlaying(false);
              }}
            />
            <span className="woi-week-label">Week {week + 1}</span>
          </div>

          <div className="woi" ref={ref} onMouseLeave={() => setHover(null)}>
            <div className="woi-row woi-axis" aria-hidden>
              <span />
              <span className="woi-track">
                {[0, 2, 4, 6, 8].map((t) => (
                  <i key={t} style={{ left: pctOf(t) }}>
                    {t}
                    {t === 8 ? "+ wks" : ""}
                  </i>
                ))}
              </span>
              <span />
            </div>
            {woiData.map((m, n) => {
              const v = m.woi[week];
              const st = statuses[n];
              return (
                <button type="button" key={m.name} className={`woi-row ${sel === n ? "sel" : ""} ${hover === n ? "on" : ""}`} onClick={() => setSel(n)} onMouseEnter={() => setHover(n)} aria-pressed={sel === n}>
                  <span className="woi-name">{m.name}</span>
                  <span className="woi-track">
                    <i className="woi-band" style={{ left: pctOf(WOI_TARGET[0]), width: `${((WOI_TARGET[1] - WOI_TARGET[0]) / WOI_SCALE) * 100}%` }} />
                    <motion.span className={`woi-bar ${st}`} initial={{ width: 0 }} animate={{ width: inView ? pctOf(v) : 0 }} transition={{ duration: 0.6, ease, delay: week === 0 ? n * 0.06 : 0 }} />
                    <i className="woi-min" style={{ left: pctOf(WOI_MIN) }} />
                  </span>
                  <span className={`woi-val ${st}`} title={woiLabel[st]}>
                    <b aria-hidden>{woiIcon[st]}</b> {v.toFixed(1)}
                    <span className="sr-only"> weeks, {woiLabel[st].toLowerCase()}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="woi-side">
          <WoiTrend m={hover ?? sel} week={week} />

          <div className="lab-legend">
            <span>
              <i className="sw band" /> Target 4–6 wks
            </span>
            <span>
              <i className="sw ref" /> 2-wk minimum
            </span>
            <span>
              <i className="sw woi-key min" /> ⚠ Below minimum
            </span>
            <span>
              <i className="sw woi-key low" /> ↓ Below target
            </span>
            <span>
              <i className="sw woi-key ok" /> ✓ On target
            </span>
            <span>
              <i className="sw woi-key high" /> ↑ Above target
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// One material's WOI over the 12 weeks, against the target band and minimum.
function WoiTrend({ m, week }: { m: number; week: number }) {
  const [wrap, W] = useWidth<HTMLDivElement>();
  const H = W > 440 ? 230 : 130;
  const pad = { l: 28, r: 12, t: 10, b: 20 };
  const vals = woiData[m].woi;
  const x = (i: number) => pad.l + (i / (WOI_WEEKS - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - Math.min(v, WOI_SCALE) / WOI_SCALE) * (H - pad.t - pad.b);
  const d = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const low = vals.reduce((a, v, i) => (v < vals[a] ? i : a), 0);
  return (
    <div className="woi-trend" ref={wrap}>
      <div className="woi-trend-head">
        <b>{woiData[m].name}</b> · week {week + 1}: {vals[week].toFixed(1)} wks, {woiLabel[woiStatus(vals[week])].toLowerCase()} · lowest {vals[low].toFixed(1)} in week {low + 1}
      </div>
      <svg width={W} height={H} role="img" aria-label={`${woiData[m].name} weeks of inventory over 12 weeks, lowest ${vals[low].toFixed(1)} in week ${low + 1}. Sample data.`}>
        <rect x={pad.l} width={W - pad.l - pad.r} y={y(WOI_TARGET[1])} height={y(WOI_TARGET[0]) - y(WOI_TARGET[1])} className="lab-band" />
        <line x1={pad.l} x2={W - pad.r} y1={y(WOI_MIN)} y2={y(WOI_MIN)} className="lab-ref" />
        {[0, 2, 4, 6, 8].map((t) => (
          <text key={t} x={pad.l - 6} y={y(t) + 4} textAnchor="end" className="lab-axis">
            {t}
          </text>
        ))}
        <motion.path key={m} d={d} className="lab-line s1" initial={{ pathLength: 0, d }} animate={{ pathLength: 1, d }} transition={{ duration: 0.9, ease }} />
        <line x1={x(week)} x2={x(week)} y1={pad.t} y2={H - pad.b} className="lab-cross" />
        {vals.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === week ? 5 : 3} className={`woi-dot ${woiStatus(v)}`} />
        ))}
        {[0, 3, 6, 9].map((i) => (
          <text key={i} x={x(i)} y={H - 4} textAnchor="middle" className="lab-axis">
            W{i + 1}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ---------- 5. End-of-life buy: 200 or 300 bottles? ---------- */

const EOL_WEEKS = 26; // six-month shelf life
function eolUsage(slip: boolean) {
  // ~36/week (one spike) until the replacement qualifies, then tapering off.
  const qualify = slip ? 7 : 4;
  return Array.from({ length: EOL_WEEKS }, (_, w) => {
    const spike = w === 2 ? 6 : 0;
    return w < qualify ? 36 + spike : Math.max(0, 36 - (w - qualify + 1) * 12);
  });
}
function eolPath(start: number, use: number[]) {
  let left = start;
  return use.map((u) => (left = Math.max(0, left - u)));
}

function EndOfLife() {
  const [slip, setSlip] = useState<"plan" | "slip">("plan");
  const [wrap, W] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const use = useMemo(() => eolUsage(slip === "slip"), [slip]);
  const a = useMemo(() => eolPath(200, use), [use]);
  const b = useMemo(() => eolPath(300, use), [use]);
  const outA = a.findIndex((v) => v === 0);
  const outB = b.findIndex((v) => v === 0);
  const ranOut = (arr: number[], idx: number) => idx >= 0 && use.slice(idx + 1).some((u) => u > 0);
  const aOut = ranOut(a, outA);
  const bOut = ranOut(b, outB);

  const H = 200;
  const pad = { l: 34, r: 12, t: 12, b: 24 };
  const max = 300;
  const x = (i: number) => pad.l + (i / (EOL_WEEKS - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const line = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const pA = line(a);
  const pB = line(b);

  return (
    <>
      <CardHead title="End-of-life buy: 200 or 300?" sub="Bottles left for a chemical being phased out">
        <Toggle
          id="eol"
          value={slip}
          onChange={setSlip}
          options={[
            { key: "plan", label: "Qualifies on plan" },
            { key: "slip", label: "Qualification slips" },
          ]}
        />
      </CardHead>
      <div className="lab-kpis">
        <div>
          <motion.strong key={slip + "a"} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={aOut ? "bad" : "good"}>
            {aOut ? `Wk ${outA + 1}` : "OK"}
          </motion.strong>
          <span>200 bottles {aOut ? "run out" : "cover it"}</span>
        </div>
        <div>
          <motion.strong key={slip + "b"} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={bOut ? "bad" : "good"}>
            {bOut ? `Wk ${outB + 1}` : "OK"}
          </motion.strong>
          <span>300 bottles {bOut ? "run out" : "cover it"}</span>
        </div>
      </div>
      <div ref={wrap} className="lab-chart" onMouseLeave={() => setHover(null)}>
        <svg width={W} height={H} role="img" aria-label={`Bottles left with 200 vs 300 bottles when qualification ${slip === "slip" ? "slips" : "is on plan"}. Sample data.`}>
          {[0, 100, 200, 300].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="lab-grid-line" />
              <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" className="lab-axis">
                {v}
              </text>
            </g>
          ))}
          <motion.path d={pA} initial={{ d: pA }} animate={{ d: pA }} transition={{ duration: 0.7, ease }} className="lab-line s1" />
          <motion.path d={pB} initial={{ d: pB }} animate={{ d: pB }} transition={{ duration: 0.7, ease }} className="lab-line hl" />
          {aOut && <motion.circle key={"a" + slip} initial={{ scale: 0 }} animate={{ scale: 1 }} cx={x(outA)} cy={y(0)} r={5} className="lab-stockout" style={{ transformOrigin: `${x(outA)}px ${y(0)}px` }} />}
          {bOut && <motion.circle key={"b" + slip} initial={{ scale: 0 }} animate={{ scale: 1 }} cx={x(outB)} cy={y(0)} r={5} className="lab-stockout" style={{ transformOrigin: `${x(outB)}px ${y(0)}px` }} />}
          <line x1={x(EOL_WEEKS - 1)} x2={x(EOL_WEEKS - 1)} y1={pad.t} y2={H - pad.b} className="lab-marker" />
          <text x={x(EOL_WEEKS - 1) - 6} y={pad.t + 10} textAnchor="end" className="lab-ref-label strong">
            shelf life ends
          </text>
          {[0, 8, 16, 25].map((i) => (
            <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="lab-axis">
              W{i + 1}
            </text>
          ))}
          {a.map((_, i) => (
            <rect key={i} x={x(i) - W / EOL_WEEKS / 2} y={0} width={W / EOL_WEEKS} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="lab-cross" pointerEvents="none" />}
        </svg>
        {hover !== null && (
          <div className="lab-tip" style={{ left: Math.min(Math.max(x(hover), 90), W - 90) }}>
            <b>Week {hover + 1}</b> · used {use[hover]} · left: {a[hover]} vs {b[hover]}
          </div>
        )}
      </div>
      <div className="lab-legend">
        <span>
          <i className="sw s1" /> Buy 200 (baseline)
        </span>
        <span>
          <i className="sw hl" /> Buy 300 (with my buffer)
        </span>
        <span>
          <i className="sw stockout" /> Runs out
        </span>
      </div>
    </>
  );
}
