"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";
import CompanyHead, { SubHead } from "./CompanyHead";
import StoryCards from "./StoryCards";
import Fold from "./Fold";
import { CardHead, Toggle } from "./PlanningLab";

// Everything from the Mino Automation Purchasing Analyst job, and nothing else:
// the program timeline, labor capacity, the invoice workflow and program spend.

const ease = [0.22, 1, 0.36, 1] as const;

// Months since Jun 2021.
const START = { y: 2021, m: 6 };
const END = { y: 2023, m: 10 };
const mo = (y: number, m: number) => (y - START.y) * 12 + (m - START.m);
const TOTAL = mo(END.y, END.m);

const programs = [
  { name: "Rivian", place: "Normal, IL", from: mo(2021, 6), to: mo(2022, 2), facts: "900+ requisition lines · $10M · 372 robots · 300+ technicians" },
  { name: "Tesla Megapack", place: "Lathrop, CA", from: mo(2022, 2), to: mo(2022, 4), facts: "Spare parts, long-lead buys, turnkey commissioning" },
  { name: "Faraday Future FF91", place: "Hanford, CA", from: mo(2022, 4), to: mo(2023, 1), facts: "54 robots · 7 lines · 51 trades sourced" },
  { name: "Tesla Cybertruck", place: "Austin, TX", from: mo(2022, 9), to: mo(2023, 9), facts: "179 trades · 34+ equipment rentals · −20% labor cost" },
];
const years = [2022, 2023];

export default function MinoSection() {
  return (
    <section id="mino" className="co-section mino viz-root">
      <div className="container">
        <CompanyHead
          co="mino"
          company="Mino Automation USA"
          role="Purchasing Analyst"
          period="Jun 2021 – Oct 2023"
          title={
            <>
              Supplying EV line <em>build-outs</em>.
            </>
          }
          about="Builds automated production lines for car makers: robotic welding lines for car bodies (body-in-white) and EV battery and powertrain assembly lines."
          summary="Purchasing and capacity planning for automation lines built for Tesla, Rivian and Faraday Future."
          kpis={[
            { value: 900, suffix: "+", label: "material requisition lines for the Rivian build" },
            { value: 179, label: "skilled trades staffed for the Cybertruck build" },
            { value: 50, suffix: "%", label: "fewer missed invoices after my approval workflow" },
          ]}
        />
        <SubHead>Program timeline</SubHead>
        <Reveal>
          <Gantt />
        </Reveal>
        <Fold
          name="Mino"
          parts={[
            { label: "Capacity and workflow", id: "mino-workflow" },
            { label: "Where the spend went", id: "mino-spend" },
            { label: "More stories", id: "mino-stories" },
          ]}
        >
        <SubHead id="mino-workflow" built="I built the workflow, before AI">Capacity and workflow</SubHead>
        <div className="mino-grid">
          <Reveal className="card mino-card lab-anchor">
            <span id="capacity" className="anchor-offset" />
            <Capacity />
          </Reveal>
          <Reveal className="card mino-card lab-anchor" delay={0.08}>
            <span id="invoice-flow" className="anchor-offset" />
            <InvoiceFlow />
          </Reveal>
        </div>
        <SubHead id="mino-spend">Where the spend went</SubHead>
        <Reveal className="card mino-card mino-spend lab-anchor">
          <span id="ev-programs" className="anchor-offset" />
          <ProgramSpend />
        </Reveal>
        <SubHead id="mino-stories">More Mino stories</SubHead>
        <StoryCards company="Mino" />
        </Fold>
      </div>
    </section>
  );
}

function Gantt() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });
  const [hover, setHover] = useState<number | null>(null);
  const pct = (m: number) => `${(m / TOTAL) * 100}%`;
  return (
    <div className="gantt card" ref={ref}>
      <div className="gantt-head">
        <span />
        <div className="gantt-years">
          {years.map((y) => (
            <span key={y} style={{ left: pct(mo(y, 1)) }}>
              {y}
            </span>
          ))}
        </div>
      </div>
      {programs.map((p, n) => (
        <div key={p.name} className={`gantt-row ${hover === n ? "on" : ""}`} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)}>
          <div className="gantt-label">
            <strong>{p.name}</strong>
            <span>{p.place}</span>
          </div>
          <div className="gantt-lane">
            {years.map((y) => (
              <i key={y} className="gantt-grid" style={{ left: pct(mo(y, 1)) }} />
            ))}
            <motion.span
              className="gantt-bar"
              style={{ left: pct(p.from) }}
              initial={{ width: "0%" }}
              animate={{ width: inView ? pct(p.to - p.from) : "0%" }}
              transition={{ delay: 0.2 + n * 0.25, duration: 0.8, ease }}
            />
            <motion.span className="gantt-facts" style={{ left: pct(p.from) }} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 0.8 + n * 0.25 }}>
              {p.facts}
            </motion.span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 200 worker dots: 100 planned, 100 reserved as backup, then ~20 called up.
function Capacity() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const times = [400, 2000, 3600];
    const timers = times.map((t, n) => setTimeout(() => setPhase(n + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [inView]);
  const captions = ["", "Forecast: ~100 workers at peak", "My upside case: +100 kept on call, not paid for", "Customer asks for ~20 more by tomorrow: done"];
  return (
    <div ref={ref} className="mino-inner">
      <div className="lab-head">
        <div>
          <h3>Labor capacity, planned like supply</h3>
          <p>Tesla-related automation build · each dot is one skilled worker</p>
        </div>
      </div>
      <div className="lab-kpis">
        <div>
          <strong>100</strong>
          <span>planned</span>
        </div>
        <div>
          <strong>+100</strong>
          <span>backup access</span>
        </div>
        <div>
          <strong className="good">~20</strong>
          <span>mobilized next day</span>
        </div>
      </div>
      <div className="dots" aria-label="100 planned workers, 100 reserved as backup, about 20 of the reserve mobilized the next day">
        {Array.from({ length: 200 }, (_, k) => {
          const planned = k < 100;
          const called = !planned && k < 120;
          const cls = planned ? (phase >= 1 ? "planned" : "") : phase >= 2 ? (called && phase >= 3 ? "called" : "reserve") : "";
          return <motion.i key={k} className={`dot ${cls}`} initial={false} animate={{ scale: cls ? 1 : 0.5 }} transition={{ delay: planned ? k * 0.006 : (k - 100) * 0.006 }} />;
        })}
      </div>
      <motion.p key={phase} className="dots-caption" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {captions[phase]}
      </motion.p>
      <div className="lab-legend">
        <span>
          <i className="sw dot-key planned" /> Planned
        </span>
        <span>
          <i className="sw dot-key reserve" /> Reserved with vendors
        </span>
        <span>
          <i className="sw dot-key called" /> Mobilized overnight
        </span>
      </div>
    </div>
  );
}

const steps = ["Request", "Approve", "PO", "Invoice", "Paid"];
function InvoiceFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px 0px -60px 0px" });
  return (
    <div ref={ref} className="mino-inner">
      <div className="lab-head">
        <div>
          <h3>From email chasing to one workflow</h3>
          <p>Self-taught SharePoint + Power Automate, built after hours</p>
        </div>
      </div>
      <div className="lab-kpis">
        <div>
          <strong className="good">−50%</strong>
          <span>missed invoices</span>
        </div>
        <div>
          <strong>1</strong>
          <span>shared queue</span>
        </div>
      </div>
      <div className="flowline">
        <div className="flowline-before">
          <span className="flowline-cap">Before</span>
          {["email", "spreadsheet", "email", "?"].map((t, n) => (
            <motion.span key={n} className="scrap" animate={inView ? { rotate: [n * 7 - 10, n * 7 - 6, n * 7 - 10], y: [0, -3, 0] } : {}} transition={{ duration: 2 + n * 0.3, repeat: Infinity }}>
              {t}
            </motion.span>
          ))}
        </div>
        <div className="flowline-after">
          <span className="flowline-cap">After</span>
          <div className="flow-steps">
            {steps.map((s, n) => (
              <span key={s} className="flow-step">
                {s}
              </span>
            ))}
            {inView && <motion.span className="flow-token" animate={{ left: ["0%", "100%"] }} transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }} />}
          </div>
        </div>
      </div>
      <div className="lab-legend">
        <span>Owner, status and next step visible for every request. Mockup, not a live capture.</span>
      </div>
    </div>
  );
}

// EV program purchasing: where the spend went, by program.

const spendByProgram = {
  rivian: { label: "Rivian", lines: "900+ requisition lines", total: "$10M", split: [["Robots & tooling", 46], ["Contract labor", 28], ["Equipment rental", 12], ["Spare parts", 9], ["Services", 5]] },
  cyber: { label: "Cybertruck", lines: "179 trades staffed", total: "−20% labor cost", split: [["Contract labor", 52], ["Equipment rental", 21], ["Robots & tooling", 14], ["Services", 8], ["Spare parts", 5]] },
  ff: { label: "Faraday Future", lines: "54 robots, 7 lines", total: "51 trades sourced", split: [["Contract labor", 38], ["Services", 24], ["Robots & tooling", 20], ["Equipment rental", 11], ["Spare parts", 7]] },
  mega: { label: "Megapack", lines: "Long-lead parts", total: "Turnkey commissioning", split: [["Spare parts", 36], ["Services", 30], ["Equipment rental", 16], ["Contract labor", 12], ["Robots & tooling", 6]] },
} as const;
type Program = keyof typeof spendByProgram;

function ProgramSpend() {
  const [prog, setProg] = useState<Program>("rivian");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const [hover, setHover] = useState<string | null>(null);
  const p = spendByProgram[prog];
  const max = Math.max(...p.split.map(([, v]) => v));

  return (
    <>
      <CardHead title="EV line build-outs" sub="Purchasing mix by program (share of spend)">
        <Toggle id="pg" value={prog} onChange={setProg} options={(Object.keys(spendByProgram) as Program[]).map((k) => ({ key: k, label: spendByProgram[k].label }))} />
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
              <motion.span className={`spend-fill ${i === 0 ? "hl" : ""}`} initial={{ width: "0%" }} animate={{ width: inView ? `${(v / max) * 100}%` : "0%" }} transition={{ duration: 0.7, delay: inView ? i * 0.06 : 0, ease }} />
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
