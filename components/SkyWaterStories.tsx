"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

// Material-planning stories from Infineon / SkyWater, in order, each with a
// small animated visual. Material and supplier names are left out on purpose.

const ease = [0.22, 1, 0.36, 1] as const;

type Story = {
  key: string;
  short: string;
  title: string;
  tag: string;
  lines: [string, string, string];
  visual: "start" | "reset" | "report" | "runout" | "parallel" | "buffer";
};

const stories: Story[] = [
  {
    key: "start",
    short: "Joined",
    title: "Material Planner, wafer fab",
    tag: "Dec 2023 · Infineon",
    lines: ["Specialty gases, CMP slurry, photoresists, process chemicals.", "Forecast from the production plan and actual use.", "Inventory under tight storage limits."],
    visual: "start",
  },
  {
    key: "reset",
    short: "MRP reset",
    title: "Took over a category with no handover",
    tag: "Ownership",
    lines: ["Inherited CMP planning with no documentation.", "Rebuilt min/max and lead times from ERP history.", "Moved items from manual release to MRP; planning stabilized."],
    visual: "reset",
  },
  {
    key: "report",
    short: "Risk report",
    title: "Fixed a report that hid new materials",
    tag: "Dive Deep",
    lines: ["The zero-bin report relied on past usage.", "New items with no history never showed up.", "Widened it to all ~5,000 reorder-point items."],
    visual: "report",
  },
  {
    key: "runout",
    short: "Run-out",
    title: "Caught a shortage the ERP was hiding",
    tag: "Dive Deep",
    lines: ["A supplier slipped; the ERP still looked fine.", "Rebuilt the run-out date from daily use and open POs.", "Daily control: low point ~1 bottle, zero downtime."],
    visual: "runout",
  },
  {
    key: "parallel",
    short: "Transition",
    title: "Four recovery paths, run in parallel",
    tag: "Bias for Action",
    lines: ["A packaging change failed its first qualification.", "Supplier stock, other sites, alternate batch, re-qualification.", "Inventory hit zero; production never stopped."],
    visual: "parallel",
  },
  {
    key: "buffer",
    short: "End-of-life",
    title: "Sized an end-of-life buy",
    tag: "Are Right, A Lot · in progress",
    lines: ["A chemical is being phased out; shelf life is six months.", "Too little risks a stop; too much expires.", "Challenged the 200 baseline and aligned the team on 300."],
    visual: "buffer",
  },
];

const CYCLE = 6500;

// The six-step story timeline, shown inside the SkyWater section.
export default function SkyWaterTimeline() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px 0px -120px 0px" });

  // Auto-advance only on wide screens. On phones the stacked panels differ in
  // height, so they change only when tapped and the page never jumps mid-scroll.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!auto || !inView || !wide) return;
    const t = setTimeout(() => setI((n) => (n + 1) % stories.length), CYCLE);
    return () => clearTimeout(t);
  }, [i, auto, inView, wide]);

  const s = stories[i];
  return (
        <div className="story" ref={ref}>
          <div className="story-track" role="tablist">
            <div className="story-rail" aria-hidden>
              <motion.div className="story-rail-fill" animate={{ width: `${(i / (stories.length - 1)) * 100}%` }} transition={{ duration: 0.6, ease }} />
            </div>
            {stories.map((st, n) => (
              <button
                key={st.key}
                role="tab"
                aria-selected={n === i}
                className={`story-node ${n === i ? "on" : ""} ${n < i ? "done" : ""}`}
                onClick={() => {
                  setI(n);
                  setAuto(false);
                }}
              >
                <span className="story-dot">{n + 1}</span>
                <span className="story-short">{st.short}</span>
              </button>
            ))}
          </div>

          {/* Panels overlap while swapping, so the page below never jumps. */}
          <div className="story-stage">
          <AnimatePresence initial={false}>
            <motion.div key={s.key} className="story-panel card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }} transition={{ duration: 0.4, delay: 0.1, ease }}>
              <div className="story-text">
                <span className="story-tag">{s.tag}</span>
                <h3>{s.title}</h3>
                <ol>
                  {s.lines.map((l, n) => (
                    <motion.li key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + n * 0.12 }}>
                      <span>{["Situation", "Action", "Result"][n]}</span>
                      {l}
                    </motion.li>
                  ))}
                </ol>
              </div>
              <div className="story-visual">{inView && <Visual kind={s.visual} />}</div>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
  );
}

export function Visual({ kind }: { kind: Story["visual"] }) {
  switch (kind) {
    case "start":
      return <StartVisual />;
    case "reset":
      return <ResetVisual />;
    case "report":
      return <ReportVisual />;
    case "runout":
      return <RunoutVisual />;
    case "parallel":
      return <ParallelVisual />;
    case "buffer":
      return <BufferVisual />;
  }
}

const pop = (d = 0) => ({ initial: { opacity: 0, scale: 0.7 }, animate: { opacity: 1, scale: 1 }, transition: { delay: d, type: "spring" as const, stiffness: 260, damping: 18 } });

function StartVisual() {
  const items = ["Specialty gases", "CMP slurry", "Photoresists", "Process chemicals"];
  return (
    <div className="v-start">
      <motion.div className="v-hub" {...pop(0)}>
        Fab
        <br />
        production
      </motion.div>
      {items.map((t, n) => (
        <motion.div key={t} className={`v-sat v-sat-${n}`} {...pop(0.25 + n * 0.15)}>
          {t}
        </motion.div>
      ))}
    </div>
  );
}

function ResetVisual() {
  // Min/max bars snapping from wrong settings to usage-based ones.
  const rows = [
    ["Slurry A", 30, 70, 55, 95],
    ["Slurry B", 20, 50, 35, 80],
    ["Pad cleaner", 40, 60, 25, 55],
    ["Filter", 10, 30, 20, 45],
  ] as const;
  return (
    <div className="v-reset">
      <div className="v-cap">
        min/max per item: <span className="v-old">before</span> → <span className="v-new">after</span>
      </div>
      {rows.map(([name, a, b, c, d], n) => (
        <div key={name} className="v-reset-row">
          <span>{name}</span>
          <span className="v-reset-track">
            <motion.span className="v-reset-bar" initial={{ left: `${a}%`, width: `${b - a}%` }} animate={{ left: `${c}%`, width: `${d - c}%` }} transition={{ delay: 0.8 + n * 0.2, duration: 0.8, ease }} />
          </span>
        </div>
      ))}
      <motion.div className="v-badge" {...pop(2)}>
        MRP planning ✓
      </motion.div>
    </div>
  );
}

function ReportVisual() {
  const [n, setN] = useState(250);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1600);
        setN(Math.round((250 + 4750 * (1 - Math.pow(1 - p, 3))) / 10) * 10);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 700);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="v-report">
      <div className="v-report-grid">
        {Array.from({ length: 50 }, (_, k) => (
          <motion.span key={k} className={k < 20 ? "old" : "new"} initial={{ opacity: k < 20 ? 1 : 0, scale: k < 20 ? 1 : 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k < 20 ? 0 : 0.7 + (k - 20) * 0.04 }} />
        ))}
      </div>
      <div className="v-big">
        <span className="v-num">{n === 5000 ? "~5,000" : n.toLocaleString()}</span>
        <span>items checked weekly</span>
      </div>
      <div className="v-legend">
        <span>
          <i className="old" /> had usage history
        </span>
        <span>
          <i className="new" /> new items, now included
        </span>
      </div>
    </div>
  );
}

function RunoutVisual() {
  // Two run-out dates for the same material: the ERP view vs. the model.
  return (
    <div className="v-runout">
      <div className="v-cap">When will we run out?</div>
      {[
        { label: "ERP view", weeks: 9, cls: "s1", note: "after the next delivery" },
        { label: "Daily-use model", weeks: 4, cls: "hl", note: "before the next delivery" },
      ].map((r, n) => (
        <div key={r.label} className="v-runout-row">
          <span className="v-runout-label">{r.label}</span>
          <span className="v-runout-track">
            <motion.span className={`v-runout-bar ${r.cls}`} initial={{ width: "0%" }} animate={{ width: `${(r.weeks / 10) * 100}%` }} transition={{ delay: 0.3 + n * 0.5, duration: 0.9, ease }} />
            <span className="v-delivery" style={{ left: "60%" }} />
          </span>
          <motion.span className="v-runout-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + n * 0.5 }}>
            {r.note}
          </motion.span>
        </div>
      ))}
      <div className="v-delivery-key">┆ next confirmed delivery</div>
      <motion.div className="v-result" {...pop(2.2)}>
        <strong>~1 bottle</strong> at the low point · <strong>0</strong> production stops
      </motion.div>
    </div>
  );
}

function ParallelVisual() {
  const paths = [
    { name: "Supplier stock", got: "2 bottles", ok: true },
    { name: "Other sites", got: "22 found, batch-checked", ok: true },
    { name: "Alternate batch", got: "6 usable", ok: true },
    { name: "Re-qualify new package", got: "passed", ok: true },
  ];
  return (
    <div className="v-parallel">
      <div className="v-cap">Recovery paths, all started at once</div>
      {paths.map((p, n) => (
        <div key={p.name} className="v-par-row">
          <span className="v-par-name">{p.name}</span>
          <span className="v-par-track">
            <motion.span className="v-par-bar" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ delay: 0.3, duration: 1 + n * 0.45, ease: "easeInOut" }} />
          </span>
          <motion.span className="v-par-got" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 + n * 0.45 }}>
            ✓ {p.got}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function BufferVisual() {
  return (
    <div className="v-buffer">
      <div className="v-eq">
        <motion.div className="v-eq-box" {...pop(0.2)}>
          <strong>200</strong>
          <span>engineering baseline</span>
        </motion.div>
        <motion.span className="v-eq-op" {...pop(0.6)}>
          +
        </motion.span>
        <motion.div className="v-eq-box hl" {...pop(0.9)}>
          <strong>100</strong>
          <span>risk buffer I proposed</span>
        </motion.div>
        <motion.span className="v-eq-op" {...pop(1.3)}>
          =
        </motion.span>
        <motion.div className="v-eq-box total" {...pop(1.6)}>
          <strong>300</strong>
          <span>bottles requested</span>
        </motion.div>
      </div>
      <div className="v-scale">
        <span>Too little: run out if use spikes or qualification slips</span>
        <span className="v-scale-bar">
          <motion.i initial={{ left: "20%" }} animate={{ left: "55%" }} transition={{ delay: 2, duration: 0.8, ease }} />
        </span>
        <span>Too much: bottles expire in six months</span>
      </div>
    </div>
  );
}
