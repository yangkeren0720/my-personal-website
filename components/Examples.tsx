"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";

// Flip cards: the front names the example and its headline number; the back
// plays the story as Signal → Action → Result with the number animating in.

type Company = "SkyWater" | "Mino" | "Belong" | "RBR";

type Example = {
  id: string;
  company: Company;
  title: string;
  // text replaces the counter when the result is not a single number.
  metric: { from: number; to: number; prefix?: string; suffix?: string; text?: string; label: string };
  steps: [string, string, string];
};

const examples: Example[] = [
  {
    id: "ex-runout",
    company: "SkyWater",
    title: "The shortage the ERP hid",
    metric: { from: 0, to: 0, text: "~1 bottle", label: "at the low point, no stop" },
    steps: ["A single-source delivery slipped; the ERP still looked fine.", "Rebuilt the run-out date from daily use, open POs and confirmed dates.", "Daily control across four teams; production never stopped."],
  },
  {
    id: "ex-transition",
    company: "SkyWater",
    title: "Four recovery paths at once",
    metric: { from: 0, to: 4, label: "paths run in parallel" },
    steps: ["New packaging arrived late and failed its first qualification.", "Supplier stock, other sites, alternate batch and re-qualification, together.", "Inventory hit zero; the line kept running."],
  },
  {
    id: "ex-cmp",
    company: "SkyWater",
    title: "Took over with no handover",
    metric: { from: 0, to: 0, text: "Stable", label: "MRP planning after the reset" },
    steps: ["Inherited CMP planning after a layoff, with no documentation.", "Worked backward from ERP history, lead times and min/max settings.", "Reset the parameters; planning stabilized."],
  },
  {
    id: "ex-zerobin",
    company: "SkyWater",
    title: "A report that hid new items",
    metric: { from: 100, to: 250, prefix: "~", label: "materials now visible" },
    steps: ["The shortage report filtered on past usage.", "New materials with no history never appeared.", "Rebuilt the logic so new risks show up early."],
  },
  {
    id: "ex-holiday",
    company: "SkyWater",
    title: "The holiday that didn't happen",
    metric: { from: 0, to: 0, text: "3–4 wks", label: "coverage rebuilt from 1.2" },
    steps: ["Planned for the usual December shutdown; the fab kept running.", "Pulled orders forward before supplier closures, within freezer limits.", "Lowest point 1.2 weeks; rebuilt to 3–4 weeks of coverage."],
  },
  {
    id: "ex-spike",
    company: "SkyWater",
    title: "Usage spiked without warning",
    metric: { from: 0, to: 0, text: "Pull-in", label: "plan rebuilt on actual use" },
    steps: ["December usage jumped past the forecast.", "Showed the coverage impact and asked the supplier for a pull-in.", "Re-planned on actual use and set up earlier usage alerts."],
  },
  {
    id: "ex-eol",
    company: "SkyWater",
    title: "Sizing an end-of-life buy",
    metric: { from: 200, to: 300, label: "bottles, aligned (in progress)" },
    steps: ["A chemical is ending; shelf life is six months.", "Weighed usage spikes and qualification risk against expiry.", "Challenged the 200 baseline; the team aligned on 300."],
  },
  {
    id: "ex-suppliers",
    company: "SkyWater",
    title: "Suppliers as risk partners",
    metric: { from: 0, to: 0, text: "Run-out date", label: "in every escalation" },
    steps: ["Shortages go badly when the ask is just 'urgent'.", "Share forecasts early; escalate with a run-out date and a specific ask.", "Faster, more useful supplier responses."],
  },
  {
    id: "ex-capacity",
    company: "Mino",
    title: "Labor planned like supply",
    metric: { from: 0, to: 20, prefix: "~", label: "workers mobilized overnight" },
    steps: ["Forecast said ~100 workers in a tight labor market.", "Built a 200 upside case; vendors held 100 more on call, unpaid.", "Customer needed ~20 more next day: delivered."],
  },
  {
    id: "ex-cost",
    company: "Mino",
    title: "Cut cost without squeezing price",
    metric: { from: 0, to: 20, prefix: "−", suffix: "%", label: "cost, no schedule impact" },
    steps: ["A big install quote: rentals, labor and service.", "Used our own equipment and matched skill level to each task.", "About 20% cheaper; supplier relationship stayed strong."],
  },
  {
    id: "ex-invoices",
    company: "Mino",
    title: "From email chasing to one queue",
    metric: { from: 0, to: 50, prefix: "−", suffix: "%", label: "missed invoices" },
    steps: ["POs, approvals and invoices lived in email and spreadsheets.", "Taught myself SharePoint and Power Automate after hours.", "One shared queue; still in use after I moved on."],
  },
  {
    id: "ex-timesheets",
    company: "Mino",
    title: "Paper timesheets to a real system",
    metric: { from: 0, to: 0, text: "1 system", label: "hours, approvals and invoices together" },
    steps: ["Contract worker hours were on paper, checked by hand.", "Mapped projects, breaks, approvals and invoices with IT.", "Purchasing could check every supplier invoice against hours."],
  },
  {
    id: "ex-handover",
    company: "Mino",
    title: "Trained my replacement first",
    metric: { from: 0, to: 0, text: "No gap", label: "in purchasing coverage" },
    steps: ["I was moving from materials to manpower purchasing.", "Taught the why behind each order, with real examples.", "Handed over gradually; no gap in coverage."],
  },
  {
    id: "ex-odoo",
    company: "Belong",
    title: "Choosing and designing the ERP",
    metric: { from: 0, to: 160, label: "page design, 114-task plan" },
    steps: ["Paper and Excel; repeated entry and no price-change alerts.", "Compared Odoo, NetSuite, SAP and custom; US and China leaders approved Odoo.", "Wrote the 160-page design; build underway."],
  },
  {
    id: "ex-cad",
    company: "Belong",
    title: "Licensing done right, for less",
    metric: { from: 0, to: 40, prefix: "~", suffix: "%", label: "below the highest quote" },
    steps: ["Engineering software was being used without enough licenses.", "Sized real demand, compared subscription vs perpetual, ran quotes.", "~$100K over 3 years; managers confirmed compliance."],
  },
  {
    id: "ex-ai",
    company: "RBR",
    title: "A platform built by directing AI",
    metric: { from: 0, to: 18, label: "AI features in production" },
    steps: ["Leasing ran on spreadsheets and four vendor tools.", "Directed AI to build one system; cross-checked every output.", "Live dashboards and 18 AI features, about $300 a month."],
  },
  {
    id: "ex-arrival",
    company: "RBR",
    title: "A small fix for a long day",
    metric: { from: 0, to: 0, text: "1 bag", label: "waiting for every new arrival" },
    steps: ["Interns arrived after long flights, with no car and no food.", "Started leaving a snack bag in each new room.", "“You don't know how much it meant to me.”"],
  },
];

const companies: ("All" | Company)[] = ["All", "SkyWater", "Mino", "Belong", "RBR"];
const companyNames: Record<Company, string> = { SkyWater: "SkyWater", Mino: "Mino Automation", Belong: "Belong", RBR: "RBR Property Management" };
const companyRoles: Record<Company, string> = {
  SkyWater: "Material Planner · wafer fab · 2023–now",
  Mino: "Purchasing Analyst · EV line build-outs · 2020–2023",
  Belong: "Manager · 2026–now",
  RBR: "Co-Owner · side business",
};

export default function Examples() {
  const [filter, setFilter] = useState<"All" | Company>("All");
  const shown = examples.filter((e) => filter === "All" || e.company === filter);

  // Opening a link like #ex-odoo flips that card and clears the filter.
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const onHash = () => {
      const id = location.hash.slice(1);
      // Links like #stories-mino show just that company's cards.
      const co = companies.find((c) => c !== "All" && `stories-${c.toLowerCase()}` === id);
      if (co) {
        setFilter(co);
        document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (examples.some((e) => e.id === id)) {
        setFilter("All");
        setOpen(id);
        // The filter change moves cards around, so scroll once the grid settles.
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 450);
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <section id="examples" className="examples">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Examples</span>
          <h2 className="section-title">
            {examples.length} stories. <em>Tap</em> any card.
          </h2>
        </Reveal>
        <div className="ex-filter" role="tablist">
          {companies.map((c) => (
            <button key={c} role="tab" aria-selected={filter === c} className={filter === c ? "on" : ""} onClick={() => setFilter(c)}>
              {filter === c && <motion.span layoutId="ex-pill" className="ex-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span>
                {c}
                {c !== "All" && <small> {examples.filter((e) => e.company === c).length}</small>}
              </span>
            </button>
          ))}
        </div>
        <motion.div layout className="ex-grid">
          <AnimatePresence mode="popLayout">
            {shown.flatMap((e, n) => {
              // In the All view each employer gets its own heading, so stories never blur together.
              const head =
                filter === "All" && (n === 0 || shown[n - 1].company !== e.company) ? (
                  <motion.div key={`h-${e.company}`} layout className={`ex-group co-${e.company.toLowerCase()}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <strong>{companyNames[e.company]}</strong>
                    <span>{companyRoles[e.company]}</span>
                  </motion.div>
                ) : null;
              const card = (
                <motion.div key={e.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                  <FlipCard ex={e} forceOpen={open === e.id} />
                </motion.div>
              );
              return head ? [head, card] : [card];
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function FlipCard({ ex, forceOpen }: { ex: Example; forceOpen: boolean }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    if (forceOpen) setFlipped(true);
  }, [forceOpen]);
  return (
    <div id={ex.id} className={`flip co-${ex.company.toLowerCase()}`}>
      <button className="flip-btn" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} aria-label={`${ex.title}: ${flipped ? "show summary" : "play the story"}`}>
        <motion.div className="flip-inner" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flip-face flip-front">
            <span className="flip-co">{ex.company}</span>
            <h3>{ex.title}</h3>
            <div className="flip-metric">
              <strong>{ex.metric.text ?? `${ex.metric.prefix ?? ""}${ex.metric.to}${ex.metric.suffix ?? ""}`}</strong>
              <span>{ex.metric.label}</span>
            </div>
            <span className="flip-hint">Tap to play the story ↻</span>
          </div>
          <div className="flip-face flip-back">{flipped && <Story ex={ex} />}</div>
        </motion.div>
      </button>
    </div>
  );
}

const stepNames = ["Signal", "Action", "Result"];

function Story({ ex }: { ex: Example }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [400, 1500, 2600, 3700].map((t, n) => setTimeout(() => setStep(n + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="story-mini">
      <div className="story-mini-head">
        <span className="story-mini-title">{ex.title}</span>
      </div>
      <ol>
        {ex.steps.map((s, n) => (
          <li key={n} className={step > n ? "in" : ""}>
            <span className="story-mini-dot">{step > n + 1 || (n === 2 && step > 3) ? "✓" : n + 1}</span>
            <div>
              <em>{stepNames[n]}</em>
              <motion.p initial={{ opacity: 0, x: -8 }} animate={step > n ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.35 }}>
                {s}
              </motion.p>
            </div>
          </li>
        ))}
      </ol>
      <div className="story-mini-metric">
        {step >= 4 ? <CountTo {...ex.metric} /> : <span className="story-mini-wait">…</span>}
        <span>{ex.metric.label}</span>
      </div>
    </div>
  );
}

function CountTo({ from, to, prefix = "", suffix = "", text }: Example["metric"]) {
  const [v, setV] = useState(from);
  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setV(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to]);
  const decimals = Number.isInteger(to) && Number.isInteger(from) ? 0 : 1;
  if (text)
    return (
      <motion.strong initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
        {text}
      </motion.strong>
    );
  return (
    <motion.strong initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </motion.strong>
  );
}
