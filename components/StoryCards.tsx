"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Collapse from "./Collapse";
import Reveal from "./Reveal";
import { ArrivalTimeline, BuildLoop, CostWaterfall, ErpGrid, HandoverChart, HolidayChart, RepairChart, RunoutChart, SeatsChart, SpikeChart, Spark, TimesheetFlow } from "./StoryCharts";

// Story cards for each employer. A card names the story and its headline
// number; opening it shows the full story under the row: a chart, the formula
// with worked numbers, and Signal → Action → Result.
// Numbers come from Eva's story bank; anything else is sample and says so.
// SkyWater stories never mention AI or automation (SkyWater doesn't allow AI).

type Company = "SkyWater" | "Mino" | "Belong" | "RBR";

type Formula = { name: string; expr: ReactNode; lines: ReactNode[] };

type Story = {
  id: string;
  company: Company;
  title: string;
  metric: { value: string; label: string };
  context: string;
  facts: [string, string][];
  chartTitle: string;
  chart: () => ReactNode;
  formulas: Formula[];
  steps: [string, string, string];
  note?: string;
};

// A fraction, typeset.
const F = (num: ReactNode, den: ReactNode) => (
  <span className="fx-frac">
    <span>{num}</span>
    <span>{den}</span>
  </span>
);

const stories: Story[] = [
  {
    id: "ex-holiday",
    company: "SkyWater",
    title: "The holiday that didn't happen",
    metric: { value: "3–4 wks", label: "coverage rebuilt from 1.2" },
    context: "My forecast assumed the usual December shutdown. SkyWater kept the fab running, while suppliers closed for 2–3 weeks and cold storage limited how much I could pull in.",
    facts: [
      ["1.2 wks", "lowest coverage"],
      ["2–3 wks", "supplier closures"],
      ["3–4 wks", "coverage rebuilt"],
    ],
    chartTitle: "Weeks of inventory, plan vs actual",
    chart: () => <HolidayChart />,
    formulas: [
      {
        name: "Weeks of inventory",
        expr: <>WOI = {F("On hand", "Avg weekly use")}</>,
        lines: [<>Lowest point: 30 ÷ 25 = <b>1.2 wks</b></>],
      },
      {
        name: "How much to pull in",
        expr: <>Pull-in = (Target WOI − WOI) × Weekly use</>,
        lines: [<>(3.5 − 1.2) × 25 ≈ <b>58 units</b></>, <>…as long as cold storage has room</>],
      },
    ],
    steps: ["Planned for the usual December shutdown; the fab kept running.", "Checked freezer space, pulled orders forward before supplier closures, re-planned on the real production schedule.", "Lowest point 1.2 weeks; rebuilt to 3–4 weeks. I now confirm the holiday schedule early."],
    note: "Units are sample. The 1.2-week low, 2–3-week closures and 3–4-week rebuild are real.",
  },
  {
    id: "ex-spike",
    company: "SkyWater",
    title: "Usage spiked without warning",
    metric: { value: "Pull-in", label: "plan rebuilt on actual use" },
    context: "I'd released an order on historical usage. In December, actual use jumped past the forecast before anyone warned planning.",
    facts: [
      ["+50%", "usage vs forecast"],
      ["Pull-in", "asked of the supplier"],
      ["New plan", "built on actual use"],
    ],
    chartTitle: "Weekly usage vs forecast",
    chart: () => <SpikeChart />,
    formulas: [
      {
        name: "Coverage",
        expr: <>Coverage = {F("On hand", "Weekly use")}</>,
        lines: [<>Planned: 40 ÷ 10 = 4.0 wks</>, <>Actual: 40 ÷ 16 = <b>2.5 wks</b></>],
      },
      {
        name: "Next order, on actual use",
        expr: <>Order = Weekly use × Weeks − (On hand + On order)</>,
        lines: [<>16 × 6 wks − (40 + 20) = <b>36 units</b></>],
      },
    ],
    steps: ["December usage jumped past the forecast.", "Showed the team the coverage impact; asked the supplier for a pull-in.", "Re-planned next month on actual use; agreed on earlier notice of usage changes."],
    note: "All quantities are sample; the story is real.",
  },
  {
    id: "ex-suppliers",
    company: "SkyWater",
    title: "Suppliers as risk partners",
    metric: { value: "Run-out date", label: "in every escalation" },
    context: "A shortage goes badly when the only message to the supplier is “urgent.” I give them the date we run out and exactly what would close the gap.",
    facts: [
      ["Run-out date", "in every escalation"],
      ["1 ask", "units and date"],
      ["Early", "forecasts shared"],
    ],
    chartTitle: "Stock on hand vs the supplier's date",
    chart: () => <RunoutChart />,
    formulas: [
      {
        name: "Run-out date",
        expr: <>Run-out = Today + {F("On hand", "Daily use")}</>,
        lines: [<>Day 0 + 84 ÷ 6 = <b>day 14</b></>],
      },
      {
        name: "The specific ask",
        expr: <>Ask = (Promised day − Run-out day) × Daily use</>,
        lines: [<>(21 − 14) × 6 = <b>42 units by day 14</b></>],
      },
    ],
    steps: ["Shortages go badly when the ask is just “urgent.”", "Share forecasts early; escalate with a run-out date and a specific ask.", "Faster, more useful supplier responses."],
    note: "All quantities are sample.",
  },
  {
    id: "ex-cost",
    company: "Mino",
    title: "Cut cost without squeezing price",
    metric: { value: "−20%", label: "cost, no schedule impact" },
    context: "A large automation install quote covered equipment rental, labor and service, on a tight schedule. I reviewed it line by line before the supplier meeting.",
    facts: [
      ["~20%", "lower cost"],
      ["0", "schedule impact"],
      ["Line by line", "contract review"],
    ],
    chartTitle: "From quote to final cost",
    chart: () => <CostWaterfall />,
    formulas: [
      {
        name: "Where the savings came from",
        expr: <>Savings = Rental removed + Σ Hours × (Rate quoted − Rate needed)</>,
        lines: [<>8% + 12% ≈ <b>20% of the quote</b></>, <>Engineering checked both changes first</>],
      },
    ],
    steps: ["A big install quote: equipment rental, labor and service.", "Used our own air skaters instead of renting; matched each role's skill level to its task.", "About 20% cheaper, on schedule; the supplier relationship stayed strong."],
    note: "The split between the two levers is sample; ~20% total and no schedule impact are real.",
  },
  {
    id: "ex-timesheets",
    company: "Mino",
    title: "Paper timesheets to a real system",
    metric: { value: "1 system", label: "hours, approvals and invoices together" },
    context: "Contract workers' hours were on paper and checked by hand, and suppliers were paid from those sheets.",
    facts: [
      ["Paper → 1 system", "for every timesheet"],
      ["2", "approvals per sheet"],
      ["Every invoice", "checked against hours"],
    ],
    chartTitle: "One timesheet, start to paid",
    chart: () => <TimesheetFlow />,
    formulas: [
      {
        name: "Billable hours",
        expr: <>Hours = Σ (Out − In − Unpaid break)</>,
        lines: [<>17:00 − 7:00 − 0:30 = 9.5 h a day</>, <>9.5 × 5 days = <b>47.5 h</b></>],
      },
      {
        name: "Invoice check",
        expr: <>Billed hours = Approved hours</>,
        lines: [<>47.5 = 47.5 → <b>pay</b></>],
      },
    ],
    steps: ["Contract worker hours were on paper, checked by hand.", "Mapped projects, breaks, approvals and invoices with IT, using my computer-science minor.", "Purchasing could check every supplier invoice against approved hours."],
    note: "Times and hours are sample.",
  },
  {
    id: "ex-handover",
    company: "Mino",
    title: "Trained my replacement first",
    metric: { value: "No gap", label: "in purchasing coverage" },
    context: "I was moving from materials purchasing to manpower purchasing, and materials couldn't go uncovered.",
    facts: [
      ["0", "gaps in coverage"],
      ["Real orders", "used to teach"],
      ["Step by step", "handover"],
    ],
    chartTitle: "Who handled material purchasing, week by week",
    chart: () => <HandoverChart />,
    formulas: [
      {
        name: "Coverage",
        expr: <>Coverage = My share + New hire's share</>,
        lines: [<>Week 4: 60% + 40% = <b>100%</b></>, <>Week 8: 0% + 100% = <b>100%</b></>],
      },
    ],
    steps: ["I was moving from materials to manpower purchasing.", "Taught the why behind each order with real examples, then handed over gradually.", "The new hire ran it independently; no gap in coverage."],
    note: "The weekly split is sample.",
  },
  {
    id: "ex-odoo",
    company: "Belong",
    title: "Choosing and designing the ERP",
    metric: { value: "160", label: "page design, 114-task plan" },
    context: "Belong ran on paper and Excel, with repeated entry, hard-to-trace approvals and no price-change alerts. I compared four options over a 3–5 year horizon.",
    facts: [
      ["4", "options compared"],
      ["160", "page design"],
      ["114", "task plan"],
      ["~22", "alert rules"],
    ],
    chartTitle: "The four options against my four tests",
    chart: () => <ErpGrid />,
    formulas: [
      {
        name: "3–5 year cost",
        expr: <>Cost = Users × $/user/mo × 12 × Years + Setup + Upkeep</>,
        lines: [<>20 × $60 × 12 × 5 = <b>$72,000</b> in subscriptions</>, <>+ setup and upkeep, compared per option</>],
      },
      {
        name: "Budget alert",
        expr: <>Alert when {F("Spent", "Budget")} ≥ 80%</>,
        lines: [<>$8,200 ÷ $10,000 = 82% → <b>alert</b></>],
      },
      {
        name: "Three-way match",
        expr: <>PO = Receipt = Bill</>,
        lines: [<>100 × $12 = 100 × $12 = $1,200 → <b>pay</b></>],
      },
    ],
    steps: ["Paper and Excel; repeated entry and no price-change alerts.", "Compared Odoo, NetSuite, SAP and a custom build; US and China leaders approved Odoo.", "Wrote the 160-page design and a 114-task plan; build underway, supply chain first."],
    note: "Headcount and dollar examples are sample; $60/user/month was the price in my evaluation. 160 pages, 114 tasks and ~22 alert rules are real.",
  },
  {
    id: "ex-cad",
    company: "Belong",
    title: "Licensing done right, for less",
    metric: { value: "~40%", label: "below the highest quote" },
    context: "Engineering software was in use without enough licenses. I sized real demand before buying anything.",
    facts: [
      ["3", "floating seats"],
      ["~$100K", "over 3 years"],
      ["~40%", "below the highest quote"],
    ],
    chartTitle: "People using it at once, then the quotes",
    chart: () => <SeatsChart />,
    formulas: [
      {
        name: "Seats to buy",
        expr: <>Seats = Peak concurrent users</>,
        lines: [<>Peak 3 across 4–5 projects → <b>3 floating seats</b></>],
      },
      {
        name: "Vs the highest quote",
        expr: <>Savings = 1 − {F("Chosen", "Highest")}</>,
        lines: [<>1 − $100K ÷ $167K ≈ <b>40%</b></>],
      },
    ],
    steps: ["Engineering software was being used without enough licenses.", "Sized real demand, compared subscription vs perpetual, ran competing quotes.", "~$100K over 3 years for 3 seats; managers confirmed compliance."],
    note: "The daily usage curve is sample, and $167K is worked back from ~40%. 3 seats and ~$100K over 3 years are real.",
  },
  {
    id: "ex-repair",
    company: "Belong",
    title: "The cheapest rate wasn't the cheapest repair",
    metric: { value: "17", label: "vendors asked for one repair" },
    context: "A large machining center in our warehouse wouldn't power on. I sent the repair out for quotes and compared what each one would really cost, travel included, not just the hourly rate.",
    facts: [
      ["17", "vendors contacted"],
      ["4", "quotes back"],
      ["2", "staffing scenarios"],
      ["40 hrs", "on-site work"],
    ],
    chartTitle: "Total cost vs a local baseline (100%), two ways to staff it",
    chart: () => <RepairChart />,
    formulas: [
      {
        name: "Real cost of a visit",
        expr: <>Total = Labor + Travel + Lodging</>,
        lines: [<>Same 40 hours on site, but travel ran from about 1 hour to 2 days each way</>],
      },
      {
        name: "Vs the baseline",
        expr: <>Index = {F("Vendor total", "40 hrs × local rate")}</>,
        lines: [<>Lowest hourly rate, far away: <b>~3×</b> the baseline with two technicians</>, <>Nearest vendor: <b>~1.2×</b> with one technician</>],
      },
    ],
    steps: ["An older machining center was down and needed a specialist.", "Contacted 17 vendors by email and web form, got 4 quotes, built two staffing scenarios.", "The nearest vendor was lowest in both; one technician over four days beat two over two days for every vendor."],
    note: "Vendors are unnamed and costs are shown as a share of the baseline. Vendor counts, hours and the ratios come from my RFQ summary.",
  },
  {
    id: "ex-ai",
    company: "RBR",
    title: "A platform built by directing AI",
    metric: { value: "~$300/mo", label: "of AI to build and run it" },
    context: "Leasing ran on spreadsheets and separate tools. I'm not a programmer, so I build with Claude Code and Codex, have each check the other's work, and check it all against real records.",
    facts: [
      ["~$300/mo", "AI cost"],
      ["6", "modules running"],
      ["Claude Code + Codex", "each checks the other"],
    ],
    chartTitle: "How I build, and what's running",
    chart: () => <BuildLoop />,
    formulas: [
      {
        name: "Ship rule",
        expr: <>Mismatches = System records − Source records</>,
        lines: [<>312 − 312 = 0 → <b>ship</b></>, <>Anything else → fix first</>],
      },
    ],
    steps: ["Leasing ran on spreadsheets and separate tools.", "Built one system with Claude Code and Codex, each checking the other; I check every output against real records.", "Live dashboards and AI assistants, about $300 a month."],
    note: "Record counts are sample; ~$300/month is real.",
  },
  {
    id: "ex-arrival",
    company: "RBR",
    title: "A small fix for a long day",
    metric: { value: "1 bag", label: "waiting for every new arrival" },
    context: "Interns arrived after long international flights, with no car and no food, and still had to unpack.",
    facts: [
      ["1 bag", "per new arrival"],
      ["Low cost", "nobody asked for it"],
    ],
    chartTitle: "An arrival day, and the energy left",
    chart: () => <ArrivalTimeline />,
    formulas: [],
    steps: ["Interns arrived after long flights, with no car and no food.", "Started leaving a snack bag in each new room.", "“You don't know how much it meant to me.”"],
  },
];

// Cards for one employer. A link to #ex-<id> opens that story and scrolls to it.
export default function StoryCards({ company }: { company: Company }) {
  const shown = stories.filter((s) => s.company === company);
  const [open, setOpen] = useState<string | null>(null);
  const [cols, setCols] = useState(3);
  const grid = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLDivElement>(null);

  // The story opens under the row its card is in, so count the grid's columns.
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCols(getComputedStyle(el).gridTemplateColumns.split(" ").length));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onHash = () => {
      const id = location.hash.slice(1);
      if (shown.some((s) => s.id === id)) {
        setOpen(id);
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    const next = open === id ? null : id;
    setOpen(next);
    if (next) {
      // Bring the opened story into view if it landed below the fold.
      setTimeout(() => {
        const r = detail.current?.getBoundingClientRect();
        if (r && r.top > window.innerHeight * 0.55) window.scrollBy({ top: r.top - 160, behavior: "smooth" });
      }, 420);
    }
  };

  const idx = shown.findIndex((s) => s.id === open);
  const rowEnd = idx < 0 ? 0 : Math.min(shown.length - 1, Math.floor(idx / cols) * cols + cols - 1);
  const story = idx < 0 ? null : shown[idx];

  return (
    <div className="ex-grid" ref={grid}>
      {shown.map((s, n) => (
        <div key={s.id} style={{ order: n * 2 }}>
          <Reveal delay={n * 0.06}>
            <StoryCard ex={s} open={open === s.id} onToggle={() => toggle(s.id)} />
          </Reveal>
        </div>
      ))}
      <AnimatePresence mode="wait" initial={false}>
        {story && (
          <Collapse key={story.id} ref={detail} className="exd-wrap" style={{ order: rowEnd * 2 + 1 }} duration={0.45} exitDuration={0.25}>
            <StoryDetail ex={story} onClose={() => setOpen(null)} />
          </Collapse>
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryCard({ ex, open, onToggle }: { ex: Story; open: boolean; onToggle: () => void }) {
  return (
    <div id={ex.id} className={`exc co-${ex.company.toLowerCase()} ${open ? "open" : ""}`}>
      <button className="exc-btn" onClick={onToggle} aria-expanded={open} aria-controls={`${ex.id}-detail`}>
        <span className="flip-co">{ex.company}</span>
        <h3>{ex.title}</h3>
        <span className="exc-metric">
          <strong>{ex.metric.value}</strong>
          <span>{ex.metric.label}</span>
        </span>
        <span className="exc-hint">{open ? "Close the story ↑" : "See the chart and the math ↓"}</span>
        <Spark id={ex.id} />
      </button>
    </div>
  );
}

const stepNames = ["Signal", "Action", "Result"];

function StoryDetail({ ex, onClose }: { ex: Story; onClose: () => void }) {
  return (
    <section id={`${ex.id}-detail`} className={`exd viz-root co-${ex.company.toLowerCase()}`} aria-label={ex.title}>
      <div className="exd-head">
        <div>
          <span className="flip-co">{ex.company}</span>
          <h3>{ex.title}</h3>
          <p>{ex.context}</p>
        </div>
        <button className="exd-close" onClick={onClose} aria-label="Close the story">
          ×
        </button>
      </div>

      <div className="exd-facts">
        {ex.facts.map(([v, l], i) => (
          <motion.div key={l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
            <strong>{v}</strong>
            <span>{l}</span>
          </motion.div>
        ))}
      </div>

      <div className={`exd-body ${ex.formulas.length ? "" : "solo"}`}>
        <figure className="exd-chart">
          <figcaption>{ex.chartTitle}</figcaption>
          {ex.chart()}
        </figure>
        {ex.formulas.length > 0 && (
          <div className="exd-math">
            <span className="exd-label">The math</span>
            {ex.formulas.map((f, i) => (
              <FormulaBlock key={f.name} f={f} delay={0.4 + i * 0.7} />
            ))}
          </div>
        )}
      </div>

      <ol className="exd-steps">
        {ex.steps.map((s, n) => (
          <motion.li key={n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + n * 0.25 }}>
            <span className="story-mini-dot">{n + 1}</span>
            <div>
              <em>{stepNames[n]}</em>
              <p>{s}</p>
            </div>
          </motion.li>
        ))}
      </ol>
      {ex.note && <p className="exd-note">{ex.note}</p>}
    </section>
  );
}

function FormulaBlock({ f, delay }: { f: Formula; delay: number }) {
  return (
    <div className="fx">
      <span className="fx-name">{f.name}</span>
      <motion.div className="fx-expr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
        {f.expr}
      </motion.div>
      {f.lines.map((l, i) => (
        <motion.div key={i} className="fx-line" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + 0.35 + i * 0.3 }}>
          {l}
        </motion.div>
      ))}
    </div>
  );
}
