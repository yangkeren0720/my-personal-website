"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Reveal from "./Reveal";

// Four small planning demos tied to Eva's material-planning and purchasing
// work. Every number here is made up and labeled as sample data.

const ease = [0.22, 1, 0.36, 1] as const;

function useWidth<T extends HTMLElement>() {
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

export default function PlanningLab() {
  return (
    <section id="planning" className="lab viz-root">
      <div className="container">
        <Reveal>
          <span className="eyebrow">SkyWater · the planning, as charts</span>
          <h2 className="section-title">
            How I keep a fab <em>supplied</em>.
          </h2>
        </Reveal>
        <div className="lab-grid">
          <Reveal className="lab-card card lab-anchor">
            <span id="safety-stock" className="anchor-offset" />
            <SafetyStock />
          </Reveal>
          <Reveal className="lab-card card lab-anchor" delay={0.08}>
            <span id="early-warning" className="anchor-offset" />
            <EarlyWarning />
          </Reveal>
          <Reveal className="lab-card card lab-anchor" delay={0.08}>
            <span id="risk-heatmap" className="anchor-offset" />
            <RiskHeatmap />
          </Reveal>
          <Reveal className="lab-card card lab-anchor" delay={0.16}>
            <span id="eol-buy" className="anchor-offset" />
            <EndOfLife />
          </Reveal>
        </div>
        <p className="lab-note">
          Sample data, shaped like real planning work. No employer data is shown.{" "}
          <a href="#experience" className="back-link">← Back to resume</a>
        </p>
      </div>
    </section>
  );
}

function CardHead({ title, sub, children }: { title: string; sub: string; children?: React.ReactNode }) {
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

function Toggle<T extends string>({ value, options, onChange, id }: { value: T; options: { key: T; label: string }[]; onChange: (v: T) => void; id: string }) {
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
  const inView = useInView(wrap, { once: true, margin: "-60px" });
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

function EarlyWarning() {
  const [wrap, W] = useWidth<HTMLDivElement>();
  const inView = useInView(wrap, { once: true, margin: "-60px" });
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (step >= model.length - 1) {
      const t = setTimeout(() => setStep(0), 3500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 380);
    return () => clearTimeout(t);
  }, [inView, step]);

  const H = 200;
  const pad = { l: 32, r: 12, t: 16, b: 24 };
  const max = 32;
  const x = (i: number) => pad.l + (i / (model.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const line = (vals: number[], upto: number) =>
    vals
      .slice(0, upto + 1)
      .map((v, i) => {
        // the restock is a vertical jump, not a slope
        if (i === ARRIVE) return `L${x(i).toFixed(1)},${y(vals[i - 1]).toFixed(1)} L${x(i).toFixed(1)},${y(v).toFixed(1)}`;
        return `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      })
      .join(" ");

  return (
    <>
      <CardHead title="Stockout, caught early" sub="Bottles of a single-source chemical, week by week" />
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
          {[0, 10, 20, 30].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="lab-grid-line" />
              <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" className="lab-axis">
                {v}
              </text>
            </g>
          ))}
          <path d={line(erp, step)} className="lab-line s1" />
          <path d={line(model, step)} className="lab-line hl" />
          {step >= ALERT && (
            <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
              <line x1={x(ALERT)} x2={x(ALERT)} y1={pad.t} y2={H - pad.b} className="lab-marker" />
              <text x={x(ALERT) + 6} y={pad.t + 10} className="lab-ref-label strong">
                ⚠ Alert raised
              </text>
            </motion.g>
          )}
          {step >= ARRIVE - 1 && (
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: `${x(ARRIVE - 1)}px ${y(1)}px` }}>
              <circle cx={x(ARRIVE - 1)} cy={y(1)} r={6} className="lab-dot hl" />
              <text x={x(ARRIVE - 1) + 10} y={y(1) - 10} className="lab-ref-label strong">
                1 bottle left
              </text>
            </motion.g>
          )}
          {step >= ARRIVE && (
            <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={x(ARRIVE) - 8} y={y(14)} textAnchor="end" className="lab-ref-label strong">
              ✓ Restock in
            </motion.text>
          )}
          {[0, 4, 8, 12].map((i) => (
            <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="lab-axis">
              W{i + 1}
            </text>
          ))}
          {model.map((_, i) => (
            <rect key={i} x={x(i) - W / model.length / 2} y={0} width={W / model.length} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
          {hover !== null && hover <= step && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="lab-cross" pointerEvents="none" />}
        </svg>
        {hover !== null && hover <= step && (
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

/* ---------- 3. Supply risk heatmap: weeks of supply by material ---------- */

const materials = ["Specialty gas A", "Specialty gas B", "CMP slurry", "Photoresist", "Developer", "Process acid", "Solvent", "Etch gas"];
const WEEKS = 12;
// Deterministic sample weeks-of-supply values (0-10), with a few risk pockets.
const wos = materials.map((_, m) =>
  Array.from({ length: WEEKS }, (_, w) => {
    const base = 6 + 3 * Math.sin(m * 1.7 + w * 0.6);
    const dip = (m === 3 && w > 4 && w < 8) || (m === 1 && w > 7) || (m === 6 && w < 3) ? -5 : 0;
    return Math.max(0, Math.min(10, Math.round(base + dip)));
  })
);
const seq = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95"];
const colorFor = (v: number) => seq[Math.min(seq.length - 1, Math.floor((v / 10) * (seq.length - 1) + 0.0001))];

function RiskHeatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hover, setHover] = useState<{ m: number; w: number } | null>(null);
  const risky = wos.flat().filter((v) => v < 2).length;

  return (
    <>
      <CardHead title="Supply risk at a glance" sub="Weeks of supply per material, next 12 weeks" />
      <div className="lab-kpis">
        <div>
          <strong>{materials.length * WEEKS}</strong>
          <span>material-weeks checked</span>
        </div>
        <div>
          <strong className="bad">{risky}</strong>
          <span>flagged under 2 weeks</span>
        </div>
      </div>
      <div className="heat" ref={ref} onMouseLeave={() => setHover(null)}>
        {materials.map((name, m) => (
          <div key={name} className="heat-row">
            <span className="heat-label">{name}</span>
            {wos[m].map((v, w) => (
              <motion.span
                key={w}
                className={`heat-cell ${v < 2 ? "risk" : ""} ${hover && hover.m === m && hover.w === w ? "on" : ""}`}
                style={{ background: colorFor(v) }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: (m + w) * 0.025, duration: 0.3 }}
                onMouseEnter={() => setHover({ m, w })}
              >
                {v < 2 && <span aria-hidden>!</span>}
              </motion.span>
            ))}
          </div>
        ))}
        <div className="heat-row heat-axis">
          <span className="heat-label" />
          {Array.from({ length: WEEKS }, (_, w) => (
            <span key={w} className="heat-tick">
              {w % 3 === 0 ? `W${w + 1}` : ""}
            </span>
          ))}
        </div>
        <AnimatePresence>
          {hover && (
            <motion.div className="heat-tip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <b>{materials[hover.m]}</b> · week {hover.w + 1} · {wos[hover.m][hover.w]} {wos[hover.m][hover.w] === 1 ? "week" : "weeks"} of supply
              {wos[hover.m][hover.w] < 2 && <span className="bad"> · at risk</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="lab-legend">
        <span className="heat-scale">
          0
          {seq.map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
          10+ weeks
        </span>
        <span>
          <i className="sw stockout" /> ! under 2 weeks
        </span>
      </div>
    </>
  );
}

/* ---------- 4. EV program purchasing: where the spend went ---------- */

const programs = {
  rivian: { label: "Rivian", lines: "3,400+ PO lines", total: "$10M", split: [["Robots & tooling", 46], ["Contract labor", 28], ["Equipment rental", 12], ["Spare parts", 9], ["Services", 5]] },
  cyber: { label: "Cybertruck", lines: "179 trades staffed", total: "−20% labor cost", split: [["Contract labor", 52], ["Equipment rental", 21], ["Robots & tooling", 14], ["Services", 8], ["Spare parts", 5]] },
  ff: { label: "Faraday Future", lines: "54 robots, 7 lines", total: "51 trades sourced", split: [["Contract labor", 38], ["Services", 24], ["Robots & tooling", 20], ["Equipment rental", 11], ["Spare parts", 7]] },
  mega: { label: "Megapack", lines: "Long-lead parts", total: "Turnkey commissioning", split: [["Spare parts", 36], ["Services", 30], ["Equipment rental", 16], ["Contract labor", 12], ["Robots & tooling", 6]] },
} as const;
type Program = keyof typeof programs;

export function ProgramSpend() {
  const [prog, setProg] = useState<Program>("rivian");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hover, setHover] = useState<string | null>(null);
  const p = programs[prog];
  const max = Math.max(...p.split.map(([, v]) => v));

  return (
    <>
      <CardHead title="EV line build-outs" sub="Purchasing mix by program (share of spend)">
        <Toggle id="pg" value={prog} onChange={setProg} options={(Object.keys(programs) as Program[]).map((k) => ({ key: k, label: programs[k].label }))} />
      </CardHead>
      <div className="lab-kpis">
        <div>
          <motion.strong key={prog + "a"} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            {p.total}
          </motion.strong>
          <span>{prog === "rivian" ? "purchased" : "highlight"}</span>
        </div>
        <div>
          <motion.strong key={prog + "b"} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            {p.lines}
          </motion.strong>
          <span>scope</span>
        </div>
      </div>
      <div className="spend" ref={ref} onMouseLeave={() => setHover(null)}>
        {/* keyed by category so bars glide to new widths and positions */}
        {p.split.map(([name, v], i) => (
          <motion.div layout key={name} className={`spend-row ${hover === name ? "on" : ""}`} transition={{ layout: { duration: 0.5, ease } }} onMouseEnter={() => setHover(name)}>
            <span className="spend-label">{name}</span>
            <span className="spend-track">
              <motion.span className={`spend-fill ${i === 0 ? "hl" : ""}`} initial={{ width: 0 }} animate={{ width: inView ? `${(v / max) * 100}%` : 0 }} transition={{ duration: 0.7, delay: inView ? i * 0.06 : 0, ease }} />
            </span>
            <span className="spend-v">{v}%</span>
          </motion.div>
        ))}
      </div>
      <div className="lab-legend">
        <span>
          <i className="sw hl" /> Largest category
        </span>
        <span>Totals are from my resume; the category split is sample data.</span>
      </div>
    </>
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
