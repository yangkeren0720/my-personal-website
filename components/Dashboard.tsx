"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { data, houses, terms, type Term } from "@/content/dashboard";
import { dashboards } from "@/content/site";
import Reveal from "./Reveal";
import Counter from "./Counter";

const ease = [0.22, 1, 0.36, 1] as const;

// Width of an element, kept in sync so SVG text stays crisp at any size.
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

type Focus = "occupancy" | "houses" | "cost" | null;

export default function Dashboard() {
  const [term, setTerm] = useState<Term>("Spring 2027");
  const d = data[term];
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-120px" });

  const openTotal = d.openRooms.reduce((a, b) => a + b, 0);
  const occupancy = d.occupancyByWeek[d.occupancyByWeek.length - 1];
  const signed = d.pipeline[d.pipeline.length - 1].count;
  const aiCost = d.aiCostByDay.reduce((a, b) => a + b, 0);
  const topHouse = d.openRooms.indexOf(Math.max(...d.openRooms));

  const questions = useMemo(
    () => [
      {
        q: `Which site has the most available inventory for ${term}?`,
        a: `${houses[topHouse]} has ${d.openRooms[topHouse]} room${d.openRooms[topHouse] === 1 ? "" : "s"} available, the most of any site.`,
        focus: "houses" as Focus,
      },
      {
        q: `What is our capacity utilization for ${term}?`,
        a: `${occupancy}% occupied, up ${occupancy - d.occupancyByWeek[0]} points over the last 12 weeks.`,
        focus: "occupancy" as Focus,
      },
      {
        q: "What did AI cost us in the last 30 days?",
        a: `$${aiCost.toFixed(2)} across every AI workflow, about $${(aiCost / 30).toFixed(2)} a day.`,
        focus: "cost" as Focus,
      },
    ],
    [term, d, topHouse, occupancy, aiCost]
  );

  // The AI box types a question, shows the answer and points at the chart that holds it.
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState(0);
  const [answered, setAnswered] = useState(false);
  const current = questions[qi % questions.length];

  useEffect(() => {
    setTyped(0);
    setAnswered(false);
  }, [qi, term]);

  useEffect(() => {
    if (!inView) return;
    if (typed < current.q.length) {
      const t = setTimeout(() => setTyped((n) => n + 1), 28);
      return () => clearTimeout(t);
    }
    if (!answered) {
      const t = setTimeout(() => setAnswered(true), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setQi((i) => i + 1), 4200);
    return () => clearTimeout(t);
  }, [inView, typed, answered, current.q.length]);

  const focus: Focus = answered ? current.focus : null;

  return (
    <section id="dashboards">
      <div className="container">
        <Reveal>
          <span className="eyebrow">01 · Supply chain dashboards</span>
          <h2 className="section-title">
            Dashboards for <em>supply & demand</em> planning.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="ai-intro">{dashboards.intro}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="viz-root dash" ref={rootRef}>
            <div className="dash-top">
              <div className="dash-title">
                <span className="dash-dot" /> Supply & demand overview
                <span className="dash-sample">Sample data</span>
              </div>
              <div className="dash-filter" role="tablist" aria-label="Term">
                {terms.map((t) => (
                  <button key={t} role="tab" aria-selected={t === term} className={t === term ? "on" : ""} onClick={() => setTerm(t)}>
                    {t === term && <motion.span layoutId="term-pill" className="dash-filter-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="dash-ask" aria-live="polite">
              <span className="dash-ask-icon" aria-hidden>
                ✦
              </span>
              <div className="dash-ask-body">
                <span className="dash-ask-q">
                  {current.q.slice(0, typed)}
                  {typed < current.q.length && <span className="caret" />}
                </span>
                <AnimatePresence mode="wait">
                  {answered && (
                    <motion.span
                      key={current.a}
                      className="dash-ask-a"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      {current.a}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="dash-kpis">
              <Kpi label="Capacity utilization" value={occupancy} suffix="%" focus={focus === "occupancy"} />
              <Kpi label="Available inventory" value={openTotal} />
              <Kpi label="Orders fulfilled" value={signed} />
              <Kpi label="Avg. lead time (days)" value={d.daysToSign} decimals={1} />
            </div>

            <div className="dash-grid">
              <Panel title="Capacity utilization by week" sub="% of rooms leased" focus={focus === "occupancy"} wide>
                <AreaChart values={d.occupancyByWeek} />
              </Panel>
              <Panel title="Available inventory by site" sub={term} focus={focus === "houses"}>
                <HouseBars values={d.openRooms} highlight={focus === "houses" ? topHouse : -1} />
              </Panel>
              <Panel title="AI cost per day" sub="last 30 days, all workflows" focus={focus === "cost"} wide>
                <CostBars values={d.aiCostByDay} />
              </Panel>
              <Panel title="Demand pipeline" sub="this term">
                <Funnel stages={d.pipeline} />
              </Panel>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

function Kpi({ label, value, suffix = "", decimals = 0, focus }: { label: string; value: number; suffix?: string; decimals?: number; focus?: boolean }) {
  return (
    <div className={`dash-kpi ${focus ? "focus" : ""}`}>
      <span className="dash-kpi-label">{label}</span>
      <span className="dash-kpi-value">
        {decimals ? <AnimatedDecimal value={value} /> : <Counter key={value} to={value} suffix={suffix} />}
      </span>
    </div>
  );
}

function AnimatedDecimal({ value }: { value: number }) {
  return (
    <motion.span key={value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {value.toFixed(1)}
    </motion.span>
  );
}

function Panel({ title, sub, focus, wide, children }: { title: string; sub: string; focus?: boolean; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={`dash-panel ${wide ? "wide" : ""} ${focus ? "focus" : ""}`}>
      <div className="dash-panel-head">
        <span className="dash-panel-title">{title}</span>
        <span className="dash-panel-sub">{sub}</span>
      </div>
      {children}
    </div>
  );
}

// Single-series area chart with a crosshair tooltip.
function AreaChart({ values }: { values: number[] }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const h = 190;
  const pad = { l: 34, r: 12, t: 12, b: 24 };
  const iw = Math.max(0, w - pad.l - pad.r);
  const ih = h - pad.t - pad.b;
  const x = (i: number) => pad.l + (i / (values.length - 1)) * iw;
  const y = (v: number) => pad.t + ih - (v / 100) * ih;
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const area = `${line} L${x(values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (values.length - 1));
    setHover(Math.max(0, Math.min(values.length - 1, i)));
  };

  return (
    <div ref={ref} className="chart">
      {w > 0 && (
        <svg width={w} height={h} role="img" aria-label={`Occupancy by week, from ${values[0]}% to ${values[values.length - 1]}%`}>
          <defs>
            <linearGradient id="occ-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--series-1)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--series-1)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} className="grid" />
              <text x={pad.l - 8} y={y(t) + 4} className="tick" textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          {values.map((_, i) =>
            i % 3 === 0 || i === values.length - 1 ? (
              <text key={i} x={x(i)} y={h - 6} className="tick" textAnchor="middle">
                W{i + 1}
              </text>
            ) : null
          )}
          <motion.path key={`a${line}`} d={area} fill="url(#occ-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
          <motion.path
            key={line}
            d={line}
            fill="none"
            stroke="var(--series-1)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease }}
          />
          <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r={4} fill="var(--series-1)" stroke="var(--surface-1)" strokeWidth={2} />
          <text x={x(values.length - 1) - 8} y={y(values[values.length - 1]) - 10} className="label" textAnchor="end">
            {values[values.length - 1]}%
          </text>
          {hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} className="crosshair" />
              <circle cx={x(hover)} cy={y(values[hover])} r={5} fill="var(--series-1)" stroke="var(--surface-1)" strokeWidth={2} />
            </g>
          )}
          <rect x={pad.l} y={pad.t} width={iw} height={ih} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
        </svg>
      )}
      {hover !== null && w > 0 && (
        <div className="tooltip" style={{ left: Math.min(Math.max(x(hover), 60), w - 60), top: y(values[hover]) - 46 }}>
          <strong>{values[hover]}%</strong> week {hover + 1}
        </div>
      )}
    </div>
  );
}

// Horizontal bars, one per house. The AI answer highlights its bar.
function HouseBars({ values, highlight }: { values: number[]; highlight: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(6, ...values);
  return (
    <div className="hbars" role="list">
      {houses.map((h, i) => (
        <div
          key={h}
          role="listitem"
          className={`hbar ${highlight === i ? "hl" : ""} ${hover === i ? "hov" : ""}`}
          onPointerEnter={() => setHover(i)}
          onPointerLeave={() => setHover(null)}
          aria-label={`${h}: ${values[i]} open rooms`}
        >
          <span className="hbar-name">{h}</span>
          <span className="hbar-track">
            <motion.span
              className="hbar-fill"
              initial={false}
              animate={{ width: `${(values[i] / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.05, ease }}
            />
          </span>
          <span className="hbar-val">{values[i]}</span>
        </div>
      ))}
    </div>
  );
}

// Ordered stages, each a darker-to-lighter step of one hue.
function Funnel({ stages }: { stages: { stage: string; count: number }[] }) {
  const max = stages[0].count;
  return (
    <div className="funnel">
      {stages.map((s, i) => (
        <div key={s.stage} className="funnel-row">
          <span className="funnel-label">{s.stage}</span>
          <span className="funnel-track">
            <motion.span
              className={`funnel-fill f${i}`}
              initial={false}
              animate={{ width: `${(s.count / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.08, ease }}
            />
          </span>
          <span className="funnel-val">
            {s.count}
            {i > 0 && <em>{Math.round((s.count / stages[i - 1].count) * 100)}%</em>}
          </span>
        </div>
      ))}
    </div>
  );
}

// Vertical bars for daily AI cost, with a hover tooltip per day.
function CostBars({ values }: { values: number[] }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const h = 150;
  const pad = { l: 34, r: 8, t: 10, b: 22 };
  const iw = Math.max(0, w - pad.l - pad.r);
  const ih = h - pad.t - pad.b;
  const top = 4;
  const slot = iw / values.length;
  const bw = Math.max(2, slot - 2);
  const y = (v: number) => pad.t + ih - (v / top) * ih;

  return (
    <div ref={ref} className="chart">
      {w > 0 && (
        <svg width={w} height={h} role="img" aria-label="AI cost per day for the last 30 days">
          {[0, 2, 4].map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} className="grid" />
              <text x={pad.l - 8} y={y(t) + 4} className="tick" textAnchor="end">
                ${t}
              </text>
            </g>
          ))}
          {values.map((v, i) => {
            const bx = pad.l + i * slot + 1;
            const bh = y(0) - y(v);
            const r = Math.min(4, bw / 2, bh);
            return (
              <g key={i} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                <rect x={pad.l + i * slot} y={pad.t} width={slot} height={ih} fill="transparent" />
                <motion.path
                  initial={false}
                  animate={{
                    d: `M${bx},${y(0)} L${bx},${y(v) + r} Q${bx},${y(v)} ${bx + r},${y(v)} L${bx + bw - r},${y(v)} Q${bx + bw},${y(v)} ${bx + bw},${y(v) + r} L${bx + bw},${y(0)} Z`,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.012, ease }}
                  fill="var(--series-1)"
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
              </g>
            );
          })}
          {[0, 9, 19, 29].map((i) => (
            <text key={i} x={pad.l + i * slot + slot / 2} y={h - 6} className="tick" textAnchor="middle">
              D{i + 1}
            </text>
          ))}
        </svg>
      )}
      {hover !== null && w > 0 && (
        <div className="tooltip" style={{ left: Math.min(Math.max(pad.l + hover * slot + slot / 2, 60), w - 60), top: y(values[hover]) - 46 }}>
          <strong>${values[hover].toFixed(2)}</strong> day {hover + 1}
        </div>
      )}
    </div>
  );
}
