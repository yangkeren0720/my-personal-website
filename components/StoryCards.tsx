"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

// Flip cards for each employer's extra stories. The front names the story and
// its headline number; the back plays it as Signal → Action → Result.

type Company = "SkyWater" | "Mino" | "Belong" | "RBR";

type Story = {
  id: string;
  company: Company;
  title: string;
  // text replaces the counter when the result is not a single number.
  metric: { from: number; to: number; prefix?: string; suffix?: string; text?: string; label: string };
  steps: [string, string, string];
};

const stories: Story[] = [
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
    id: "ex-suppliers",
    company: "SkyWater",
    title: "Suppliers as risk partners",
    metric: { from: 0, to: 0, text: "Run-out date", label: "in every escalation" },
    steps: ["Shortages go badly when the ask is just 'urgent'.", "Share forecasts early; escalate with a run-out date and a specific ask.", "Faster, more useful supplier responses."],
  },
  {
    id: "ex-cost",
    company: "Mino",
    title: "Cut cost without squeezing price",
    metric: { from: 0, to: 20, prefix: "−", suffix: "%", label: "cost, no schedule impact" },
    steps: ["A big install quote: rentals, labor and service.", "Used our own equipment and matched skill level to each task.", "About 20% cheaper; supplier relationship stayed strong."],
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
    metric: { from: 0, to: 0, text: "~$300/mo", label: "of AI to build and run it" },
    steps: ["Leasing ran on spreadsheets and separate tools.", "Directed AI to build one system; cross-checked every output.", "Live dashboards and AI assistants, about $300 a month."],
  },
  {
    id: "ex-arrival",
    company: "RBR",
    title: "A small fix for a long day",
    metric: { from: 0, to: 0, text: "1 bag", label: "waiting for every new arrival" },
    steps: ["Interns arrived after long flights, with no car and no food.", "Started leaving a snack bag in each new room.", "“You don't know how much it meant to me.”"],
  },
];

// Cards for one employer. A link to #ex-<id> flips that card and scrolls to it.
export default function StoryCards({ company }: { company: Company }) {
  const shown = stories.filter((s) => s.company === company);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const onHash = () => {
      const id = location.hash.slice(1);
      if (shown.some((s) => s.id === id)) {
        setOpen(id);
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ex-grid">
      {shown.map((s, n) => (
        <Reveal key={s.id} delay={n * 0.06}>
          <FlipCard ex={s} forceOpen={open === s.id} />
        </Reveal>
      ))}
    </div>
  );
}

function FlipCard({ ex, forceOpen }: { ex: Story; forceOpen: boolean }) {
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
          <div className="flip-face flip-back">{flipped && <StoryPlay ex={ex} />}</div>
        </motion.div>
      </button>
    </div>
  );
}

const stepNames = ["Signal", "Action", "Result"];

function StoryPlay({ ex }: { ex: Story }) {
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

function CountTo({ from, to, prefix = "", suffix = "", text }: Story["metric"]) {
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
