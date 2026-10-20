"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import { Toggle, useWidth } from "./PlanningLab";

// A small S&OP planning board visitors can play with. One made-up material,
// 16 weeks starting today. Drag the delivery dots (left/right = date, up/down
// = quantity), pick when a usage change starts, set lead time, safety stock
// and storage space, then let Auto-plan fix the plan. Sample data and sample
// costs only; not tied to any employer.

const WEEKS = 16;
const START_ON_HAND = 420;
const LOT = 50; // order multiple
const MAX_QTY = 800;
const BASE = [96, 100, 104, 98, 102, 110, 106, 100, 108, 112, 104, 100, 110, 116, 108, 104];
const AVG = BASE.reduce((s, d) => s + d, 0) / WEEKS;
// Sample $ per unit
const COST = { hold: 1, overflow: 3, expedite: 5, lost: 40 };

type PO = { id: number; week: number; qty: number; orig: number };
type Params = { pct: number; from: number; lead: number; ss: number; cap: number };
type Row = { i: number; demand: number; receipt: number; end: number; lost: number; overflow: number; safety: number };
type ScenarioKey = "base" | "surge" | "slip" | "slow";

const START_POS: PO[] = [
  { id: 1, week: 2, qty: 350, orig: 2 },
  { id: 2, week: 5, qty: 350, orig: 5 },
  { id: 3, week: 8, qty: 350, orig: 8 },
  { id: 4, week: 11, qty: 350, orig: 11 },
  { id: 5, week: 14, qty: 300, orig: 14 },
];
const DEFAULTS: Params = { pct: 0, from: 4, lead: 4, ss: 2, cap: 900 };

const SCENARIOS: Record<ScenarioKey, { label: string; params: Partial<Params>; pos: PO[] }> = {
  base: { label: "Base", params: {}, pos: START_POS },
  surge: { label: "Demand ↑", params: { pct: 35, from: 5 }, pos: START_POS },
  slip: {
    label: "Supplier late",
    params: {},
    pos: START_POS.map((p) => (p.id === 1 ? { ...p, week: 4, qty: 200 } : p.id === 2 ? { ...p, week: 7 } : p)),
  },
  slow: { label: "Demand ↓", params: { pct: -25, from: 3 }, pos: START_POS },
};

const usageAt = (i: number, p: Params) => (i >= p.from ? 1 + p.pct / 100 : 1);
const isExpedite = (po: PO, lead: number) => po.week < lead && po.week < po.orig;

function simulate(pos: PO[], p: Params): Row[] {
  let oh = START_ON_HAND;
  return BASE.map((b, i) => {
    const demand = Math.round(b * usageAt(i, p));
    const receipt = pos.filter((po) => po.week === i).reduce((s, po) => s + po.qty, 0);
    const avail = oh + receipt;
    const served = Math.min(demand, avail);
    oh = avail - served;
    return {
      i,
      demand,
      receipt,
      end: oh,
      lost: demand - served,
      overflow: Math.max(0, oh - p.cap),
      safety: Math.round(p.ss * AVG * usageAt(i, p)),
    };
  });
}

// Keep what is already inside lead time, re-plan everything after it:
// at each week that would drop below safety stock, bring in enough (in lots
// of 50, within storage space) to cover safety stock plus two weeks.
// Run-outs inside lead time get an expedited delivery.
function autoPlan(pos: PO[], p: Params): PO[] {
  const frozen = pos.filter((po) => po.week < p.lead).map((po) => ({ ...po }));
  const reuse = pos.filter((po) => po.week >= p.lead).sort((a, b) => a.week - b.week);
  let nextId = Math.max(0, ...pos.map((po) => po.id)) + 1;
  const plan = [...frozen];
  const added: PO[] = [];
  for (let n = 0; n < 24; n++) {
    const rows = simulate(plan, p);
    const b = rows.find((r) => (r.i >= p.lead ? r.end < r.safety : r.lost > 0));
    if (!b) break;
    const target = b.safety + 2 * AVG * usageAt(b.i, p);
    const room = Math.floor((p.cap - b.end) / LOT) * LOT;
    let qty = Math.ceil((target - b.end) / LOT) * LOT;
    qty = Math.max(LOT, Math.min(qty, Math.max(LOT, room)));
    const same = plan.find((po) => po.week === b.i);
    if (same) {
      if (same.qty >= MAX_QTY) break;
      same.qty = Math.min(MAX_QTY, same.qty + qty);
    } else {
      const po = { id: 0, week: b.i, qty: Math.min(MAX_QTY, qty), orig: b.i >= p.lead ? b.i : 99 };
      plan.push(po);
      added.push(po);
    }
  }
  // Reuse the old ids so the dots glide to their new spots.
  added.sort((a, b) => a.week - b.week).forEach((po, k) => (po.id = reuse[k]?.id ?? nextId++));
  return plan;
}

const money = (n: number) => (n >= 10000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n).toLocaleString("en-US")}`);
const snapQty = (q: number) => Math.min(MAX_QTY, Math.max(LOT, Math.round(q / LOT) * LOT));

export default function SOPDemo() {
  const [scenario, setScenario] = useState<ScenarioKey>("base");
  const [params, setParams] = useState<Params>(DEFAULTS);
  const [pos, setPos] = useState<PO[]>(START_POS);
  const [sel, setSel] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [drag, setDrag] = useState<null | { kind: "po"; id: number } | { kind: "usage" }>(null);
  const [today, setToday] = useState<Date | null>(null);
  const [ref, w] = useWidth<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });

  // Stop the page from scrolling while a finger drags a handle.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const stop = (e: TouchEvent) => {
      if ((e.target as Element).closest?.(".sop-grab")) e.preventDefault();
    };
    el.addEventListener("touchstart", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    return () => {
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, []);

  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setToday(d);
  }, []);

  const set = (patch: Partial<Params>) => setParams((p) => ({ ...p, ...patch }));
  const rows = useMemo(() => simulate(pos, params), [pos, params]);
  const ghost = useMemo(() => simulate(SCENARIOS[scenario].pos, { ...DEFAULTS, ...SCENARIOS[scenario].params, ss: params.ss, cap: params.cap, lead: params.lead }), [scenario, params.ss, params.cap, params.lead]);

  const dateOf = (i: number) => {
    if (!today) return `Wk ${i + 1}`;
    if (i === 0) return "Today";
    const d = new Date(today);
    d.setDate(d.getDate() + 7 * i);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const weekOf = (i: number) => (i === 0 ? "this week" : `wk of ${dateOf(i)}`);

  // KPIs
  const totalDemand = rows.reduce((s, r) => s + r.demand, 0);
  const lost = rows.reduce((s, r) => s + r.lost, 0);
  const fill = 1 - lost / totalDemand;
  const firstOut = rows.find((r) => r.lost > 0);
  const firstLow = rows.find((r) => r.end < r.safety);
  const firstOver = rows.find((r) => r.overflow > 0);
  const lowest = rows.reduce((m, r) => (r.end / (r.demand || 1) < m.end / (m.demand || 1) ? r : m), rows[0]);
  const lowestWos = lowest.end / (AVG * usageAt(lowest.i, params));
  const expedites = pos.filter((po) => isExpedite(po, params.lead));
  const cost =
    rows.reduce((s, r) => s + r.end * COST.hold + r.overflow * COST.overflow + r.lost * COST.lost, 0) +
    expedites.reduce((s, po) => s + po.qty * COST.expedite, 0);
  const status = firstOut ? "critical" : firstLow || firstOver ? "warning" : "good";
  const statusText = firstOut
    ? `Runs out ${weekOf(firstOut.i)}`
    : firstLow
      ? `Below safety ${weekOf(firstLow.i)}`
      : firstOver
        ? `Over storage ${weekOf(firstOver.i)}`
        : "Covered all 16 weeks";

  // Geometry: one SVG, two panels sharing the week axis.
  const narrow = w < 560;
  const pad = { l: 40, r: 14 };
  const iw = w - pad.l - pad.r;
  const step = iw / WEEKS;
  const x = (i: number) => pad.l + step * (i + 0.5);
  const xEdge = (i: number) => pad.l + step * i;
  const main = { t: 30, b: 220 };
  const lane = { t: 252, b: 352 };
  const H = 382;
  const maxY = Math.ceil(Math.max(params.cap + 150, ...rows.map((r) => r.end + 60), ...ghost.map((r) => r.end + 60)) / 250) * 250;
  const minY = -Math.max(0, Math.ceil(Math.max(...rows.map((r) => r.lost)) / 50) * 50);
  const y = (v: number) => main.b - ((v - minY) / (maxY - minY)) * (main.b - main.t);
  const ly = (q: number) => lane.b - (q / MAX_QTY) * (lane.b - lane.t);
  const tickStep = maxY > 1250 ? 500 : 250;
  const ticks = Array.from({ length: Math.floor(maxY / tickStep) + 1 }, (_, k) => k * tickStep);
  const line = (rs: Row[]) => rs.map((r, k) => `${k ? "L" : "M"}${x(r.i).toFixed(1)},${y(r.end).toFixed(1)}`).join(" ");
  const area = `${line(rows)} L${x(WEEKS - 1).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;
  const safetyPath = rows.map((r, k) => `${k ? "L" : "M"}${xEdge(r.i).toFixed(1)},${y(r.safety).toFixed(1)} H${xEdge(r.i + 1).toFixed(1)}`).join(" ");
  const anim = drag ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };
  const labelEvery = narrow ? 4 : 2;
  const hr = hover !== null ? rows[hover] : null;
  const selPo = pos.find((po) => po.id === sel) ?? null;

  // Dragging
  const toLocal = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { px: e.clientX - r.left, py: e.clientY - r.top };
  };
  const weekAt = (px: number) => Math.min(WEEKS - 1, Math.max(0, Math.floor((px - pad.l) / step)));
  const movePo = (id: number, week: number, qty: number) =>
    setPos((ps) => {
      const taken = ps.some((o) => o.id !== id && o.week === week);
      return ps.map((o) => (o.id === id ? { ...o, week: taken ? o.week : week, qty: snapQty(qty) } : o));
    });
  const startDrag = (e: React.PointerEvent, d: NonNullable<typeof drag>) => {
    e.preventDefault();
    svgRef.current?.setPointerCapture(e.pointerId);
    setDrag(d);
    setHover(null);
    if (d.kind === "po") setSel(d.id);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const { px, py } = toLocal(e);
    if (drag.kind === "usage") set({ from: Math.min(WEEKS - 1, Math.max(1, Math.round((px - pad.l) / step))) });
    else movePo(drag.id, weekAt(px), ((lane.b - py) / (lane.b - lane.t)) * MAX_QTY);
  };
  const endDrag = () => setDrag(null);

  const pickScenario = (k: ScenarioKey) => {
    setScenario(k);
    setParams((p) => ({ ...DEFAULTS, ss: p.ss, cap: p.cap, lead: p.lead, ...SCENARIOS[k].params }));
    setPos(SCENARIOS[k].pos.map((po) => ({ ...po })));
    setSel(null);
  };
  const addPo = () => {
    const free = Array.from({ length: WEEKS }, (_, i) => i).filter((i) => i >= params.lead && !pos.some((po) => po.week === i));
    const low = rows.find((r) => r.i >= params.lead && r.end < r.safety && free.includes(r.i));
    const week = low?.i ?? free[0];
    if (week === undefined) return;
    const id = Math.max(0, ...pos.map((po) => po.id)) + 1;
    setPos((ps) => [...ps, { id, week, qty: 300, orig: 99 }]);
    setSel(id);
  };
  const onKey = (e: React.KeyboardEvent, po: PO) => {
    const k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, LOT], ArrowDown: [0, -LOT] }[e.key];
    if (!k) return;
    e.preventDefault();
    movePo(po.id, Math.min(WEEKS - 1, Math.max(0, po.week + k[0])), po.qty + k[1]);
  };

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
          <div className="sop-top">
            <Toggle id="sop-scn" value={scenario} options={(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => ({ key: k, label: SCENARIOS[k].label }))} onChange={pickScenario} />
            <div className="sop-actions">
              <button className={`sop-btn primary${status !== "good" ? " sop-glow" : ""}`} onClick={() => setPos((ps) => autoPlan(ps, params))}>
                ✦ Auto-plan
              </button>
              <button className="sop-btn" onClick={addPo}>
                + Delivery
              </button>
              <button className="sop-btn" onClick={() => pickScenario(scenario)}>
                ↺ Reset
              </button>
            </div>
          </div>

          <div className="sop-controls">
            <Slider label="Usage change" value={params.pct} min={-30} max={60} step={5} fmt={(v) => `${v > 0 ? "+" : ""}${v}%`} onChange={(v) => set({ pct: v })} />
            <Slider label="Starting" value={params.from} min={1} max={WEEKS - 1} step={1} fmt={dateOf} onChange={(v) => set({ from: v })} />
            <Slider label="Lead time" value={params.lead} min={1} max={8} step={1} fmt={(v) => `${v} wk`} onChange={(v) => set({ lead: v })} />
            <Slider label="Safety stock" value={params.ss} min={1} max={4} step={1} fmt={(v) => `${v} wk`} onChange={(v) => set({ ss: v })} />
            <Slider label="Storage space" value={params.cap} min={500} max={1200} step={50} fmt={(v) => `${v}`} onChange={(v) => set({ cap: v })} />
          </div>

          <div className="lab-kpis sop-kpis" aria-live="polite">
            <Kpi cls={status === "good" ? "good" : status === "critical" ? "bad" : "warn"} label="status" k={statusText}>
              <StatusIcon status={status} /> {statusText}
            </Kpi>
            <Kpi cls={fill < 0.98 ? "bad" : fill < 1 ? "warn" : ""} label="fill rate" k={fill.toFixed(3)}>
              {(fill * 100).toFixed(1)}%
            </Kpi>
            <Kpi cls={lowestWos < 1 ? "bad" : lowestWos < params.ss ? "warn" : ""} label={`lowest cover, ${weekOf(lowest.i)}`} k={lowestWos.toFixed(1)}>
              {lowestWos.toFixed(1)} wk
            </Kpi>
            <Kpi cls="" label="16-wk cost (sample $)" k={String(Math.round(cost))}>
              {money(cost)}
            </Kpi>
            <Kpi cls={expedites.length ? "warn" : ""} label="expedites" k={String(expedites.length)}>
              {expedites.length}
            </Kpi>
          </div>

          <div className="lab-chart sop-chart" ref={ref} onMouseLeave={() => setHover(null)}>
            <svg
              ref={svgRef}
              width={w}
              height={H}
              role="img"
              aria-label={`Projected on hand for 16 weeks from today. ${statusText}. Fill rate ${(fill * 100).toFixed(1)} percent.`}
              onPointerMove={onMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className={drag ? "dragging" : ""}
            >
              <defs>
                <pattern id="sop-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" className="sop-hatch-line" />
                </pattern>
                <linearGradient id="sop-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" className="sop-area-top" />
                  <stop offset="1" className="sop-area-bot" />
                </linearGradient>
              </defs>

              {/* Lead time: changes inside it need an expedite */}
              <motion.rect className="sop-frozen" y={main.t - 8} height={lane.b - main.t + 8} x={xEdge(0)} initial={{ width: step * params.lead }} animate={{ width: step * params.lead }} transition={anim} fill="url(#sop-hatch)" />
              <text className="sop-zone-label" x={xEdge(0) + 4} y={lane.t - 8}>
                {narrow ? "Lead time" : "Inside lead time: expedite"}
              </text>

              {/* Main panel */}
              <text className="sop-panel-label" {...(xEdge(params.from) < pad.l + iw - 110 ? { x: pad.l + iw, textAnchor: "end" } : { x: pad.l })} y={main.t - 14}>
                On hand
              </text>
              <rect className="sop-over-band" x={pad.l} width={iw} y={main.t} height={Math.max(0, y(params.cap) - main.t)} />
              {ticks.map((t) => (
                <g key={t}>
                  <line className="lab-grid-line" x1={pad.l} x2={pad.l + iw} y1={y(t)} y2={y(t)} />
                  <text className="lab-axis" x={pad.l - 8} y={y(t) + 4} textAnchor="end">
                    {t}
                  </text>
                </g>
              ))}
              <motion.path className="sop-safety" initial={{ d: safetyPath }} animate={{ d: safetyPath }} transition={anim} />
              <line className="lab-ref cap" x1={pad.l} x2={pad.l + iw} y1={y(params.cap)} y2={y(params.cap)} />
              <text className="lab-ref-label" x={pad.l + iw} y={y(params.cap) - 6} textAnchor="end">
                Storage {params.cap}
              </text>
              <path className="sop-ghost" d={line(ghost)} />
              <motion.path fill="url(#sop-area)" initial={{ d: area, opacity: 0 }} animate={{ d: area, opacity: inView ? 1 : 0 }} transition={anim} />
              <motion.path
                className="lab-line s1"
                initial={{ pathLength: 0, d: line(rows) }}
                animate={{ d: line(rows), pathLength: inView ? 1 : 0 }}
                transition={{ d: anim, pathLength: { duration: 1.2, ease: "easeOut" } }}
              />
              {rows.map((r) =>
                r.lost ? <motion.rect key={`lost${r.i}`} className="sop-lost" x={x(r.i) - step * 0.3} width={step * 0.6} y={y(0)} initial={{ height: 0 }} animate={{ height: y(-r.lost) - y(0) }} transition={anim} rx={2} /> : null
              )}
              {hr && <line className="lab-cross" x1={x(hr.i)} x2={x(hr.i)} y1={main.t} y2={lane.b} />}
              {rows.map((r) => (
                <motion.circle
                  key={r.i}
                  className={`lab-dot ${r.lost ? "sop-out" : r.end < r.safety ? "sop-low" : r.overflow ? "sop-over" : "s1"}`}
                  cx={x(r.i)}
                  initial={{ cy: y(r.end), r: hover === r.i ? 6 : 4 }}
                  animate={{ cy: y(r.end), r: hover === r.i ? 6 : 4 }}
                  transition={anim}
                />
              ))}
              {rows.map((r) => (
                <rect key={`hit${r.i}`} x={xEdge(r.i)} y={main.t} width={step} height={main.b - main.t} fill="transparent" onMouseEnter={() => setHover(r.i)} onClick={() => setHover(r.i)} />
              ))}

              {/* Usage change marker, drag it sideways */}
              <g className={`sop-usage${params.pct ? " on" : ""}`}>
                <motion.line initial={{ x1: xEdge(params.from), x2: xEdge(params.from) }} animate={{ x1: xEdge(params.from), x2: xEdge(params.from) }} transition={anim} y1={main.t - 4} y2={lane.b} />
                <motion.g initial={{ x: xEdge(params.from) }} animate={{ x: xEdge(params.from) }} transition={anim} style={{ y: main.t - 4 }}>
                  <rect className="sop-usage-pill" x={-30} y={-24} width={60} height={22} rx={11} />
                  <text className="sop-usage-text" y={-9} textAnchor="middle">
                    {params.pct > 0 ? "+" : ""}
                    {params.pct}% ⇆
                  </text>
                  <rect
                    className="sop-grab"
                    x={-34}
                    y={-28}
                    width={68}
                    height={lane.b - main.t + 32}
                    fill="transparent"
                    tabIndex={0}
                    role="slider"
                    aria-label="Usage change start week"
                    aria-valuenow={params.from}
                    onPointerDown={(e) => startDrag(e, { kind: "usage" })}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") set({ from: Math.max(1, params.from - 1) });
                      if (e.key === "ArrowRight") set({ from: Math.min(WEEKS - 1, params.from + 1) });
                    }}
                  />
                </motion.g>
              </g>

              {/* Delivery lane: usage bars + draggable deliveries */}
              <text className="sop-panel-label" x={pad.l + iw} y={lane.t - 8} textAnchor="end">
                Deliveries vs usage
              </text>
              {[0, 400, 800].map((t) => (
                <g key={`l${t}`}>
                  <line className="lab-grid-line" x1={pad.l} x2={pad.l + iw} y1={ly(t)} y2={ly(t)} />
                  <text className="lab-axis" x={pad.l - 8} y={ly(t) + 4} textAnchor="end">
                    {t}
                  </text>
                </g>
              ))}
              {rows.map((r) => (
                <motion.rect
                  key={`d${r.i}`}
                  className={`sop-usage-bar${r.i >= params.from && params.pct ? " changed" : ""}`}
                  x={x(r.i) - step * 0.22}
                  width={step * 0.44}
                  initial={{ y: ly(r.demand), height: lane.b - ly(r.demand) }}
                  animate={{ y: ly(r.demand), height: lane.b - ly(r.demand) }}
                  transition={anim}
                  rx={2}
                />
              ))}
              {pos.map((po) => {
                const exp = isExpedite(po, params.lead);
                const active = drag?.kind === "po" && drag.id === po.id;
                return (
                  <motion.g
                    key={po.id}
                    className={`sop-po-dot${exp ? " exp" : ""}${sel === po.id ? " sel" : ""}`}
                    initial={{ x: x(po.week), y: ly(po.qty), scale: 0 }}
                    animate={{ x: x(po.week), y: ly(po.qty), scale: active ? 1.25 : 1 }}
                    transition={anim}
                  >
                    <motion.line className="sop-stem" x1={0} x2={0} y1={0} initial={{ y2: lane.b - ly(po.qty) }} animate={{ y2: lane.b - ly(po.qty) }} transition={anim} />
                    <circle className="sop-po-ring" r={9} />
                    <circle className="sop-po-core" r={5.5} />
                    {(active || sel === po.id) && (
                      <text className="sop-po-label" y={-15} textAnchor="middle">
                        {po.qty} · {dateOf(po.week)}
                      </text>
                    )}
                    <circle
                      r={18}
                      fill="transparent"
                      className="sop-grab"
                      tabIndex={0}
                      role="slider"
                      aria-label={`Delivery ${dateOf(po.week)}, ${po.qty} units. Arrow keys move it.`}
                      aria-valuenow={po.qty}
                      onPointerDown={(e) => startDrag(e, { kind: "po", id: po.id })}
                      onFocus={() => setSel(po.id)}
                      onKeyDown={(e) => onKey(e, po)}
                    />
                  </motion.g>
                );
              })}

              {rows.map((r) =>
                r.i % labelEvery === 0 ? (
                  <text key={`x${r.i}`} className={`lab-axis${r.i === 0 ? " sop-today" : ""}`} x={x(r.i)} y={H - 8} textAnchor="middle">
                    {dateOf(r.i)}
                  </text>
                ) : null
              )}
            </svg>
            {hr && !drag && (
              <div className="lab-tip" style={{ left: Math.min(Math.max(x(hr.i), 110), w - 110) }}>
                <b>{hr.i === 0 ? "This week" : `Week of ${dateOf(hr.i)}`}</b> · {hr.end} on hand · use {hr.demand}
                {hr.receipt ? ` · +${hr.receipt} in` : ""}
                {hr.lost ? <span className="bad"> · short {hr.lost}</span> : ""}
                {hr.overflow ? ` · ${hr.overflow} overflow` : ""}
              </div>
            )}
          </div>

          <div className="sop-sel">
            {selPo ? (
              <>
                <span className="sop-sel-name">
                  <i className={`sw sop-po-sw${isExpedite(selPo, params.lead) ? " exp" : ""}`} /> {dateOf(selPo.week)} · <b>{selPo.qty}</b> units
                  {isExpedite(selPo, params.lead) && <em> expedite +{money(selPo.qty * COST.expedite)}</em>}
                </span>
                <span className="sop-steppers">
                  <button aria-label="Earlier" onClick={() => movePo(selPo.id, Math.max(0, selPo.week - 1), selPo.qty)}>◀</button>
                  <button aria-label="Later" onClick={() => movePo(selPo.id, Math.min(WEEKS - 1, selPo.week + 1), selPo.qty)}>▶</button>
                  <button aria-label="Less" onClick={() => movePo(selPo.id, selPo.week, selPo.qty - LOT)}>−</button>
                  <button aria-label="More" onClick={() => movePo(selPo.id, selPo.week, selPo.qty + LOT)}>+</button>
                  <button
                    className="del"
                    onClick={() => {
                      setPos((ps) => ps.filter((o) => o.id !== selPo.id));
                      setSel(null);
                    }}
                  >
                    Remove
                  </button>
                </span>
              </>
            ) : (
              <span className="sop-hint">
                <span className="sop-hint-dot" /> Drag a delivery: ⇆ date, ⇅ quantity
              </span>
            )}
          </div>

          <div className="lab-legend">
            <span>
              <i className="sw s1" /> On hand
            </span>
            <span>
              <i className="sw ghost" /> Before your changes
            </span>
            <span>
              <i className="sw ref" /> Safety stock
            </span>
            <span>
              <i className="sw sop-po-sw" /> Delivery
            </span>
            <span>
              <i className="sw sop-po-sw exp" /> Expedited
            </span>
            <span>
              <i className="sw sop-low-sw" /> Below safety
            </span>
            <span>
              <i className="sw stockout" /> Short
            </span>
          </div>
        </Reveal>
        <p className="lab-note">
          Sample data and sample costs for one made-up material: holding ${COST.hold}, overflow ${COST.overflow}, expedite ${COST.expedite}, lost sale ${COST.lost} per unit. Orders in lots of {LOT}. Built by me with Claude Code and Codex; not from any employer.
        </p>
      </div>
    </section>
  );
}

function Kpi({ cls, label, k, children }: { cls: string; label: string; k: string; children: React.ReactNode }) {
  return (
    <div>
      <motion.strong key={k} className={cls} initial={{ opacity: 0.35, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {children}
      </motion.strong>
      <span>{label}</span>
    </div>
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
