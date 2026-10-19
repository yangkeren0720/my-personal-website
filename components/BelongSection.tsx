"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Reveal from "./Reveal";
import CompanyHead, { SubHead } from "./CompanyHead";
import StoryCards from "./StoryCards";

// Everything from the Belong Office Manager job, and nothing else: the departments
// Eva oversees, the ERP roadmap she is leading, and her Belong stories.

const ease = [0.22, 1, 0.36, 1] as const;

const departments = [
  { name: "Operations", what: "Sets day-to-day priorities and manages performance" },
  { name: "Purchasing", what: "Direct procurement, suppliers, import/export, customs and freight" },
  { name: "HR", what: "Full-cycle hiring, onboarding, training, employee relations" },
  { name: "IT", what: "Odoo ERP project lead, software licensing, AI tools" },
  { name: "Warehouse", what: "Receiving, inventory and outbound" },
];

const phases = [
  { name: "Purchasing, project inventory, purchasing accounting", state: "In build" },
  { name: "Full accounting", state: "Planned" },
  { name: "Sales and CRM", state: "Planned" },
  { name: "HR and people", state: "Planned" },
];

// The implementation plan behind the roadmap (from the 114-task Gantt).
const planChips = [
  { value: "114", label: "tasks" },
  { value: "13", label: "modules" },
  { value: "22", label: "alert rules" },
  { value: "~22", label: "weeks, buffer included" },
];

export default function BelongSection() {
  return (
    <section id="belong" className="co-section">
      <div className="container">
        <CompanyHead
          co="belong"
          company="Belong Automotive Technology"
          role="Office Manager, part-time"
          period="Feb 2026 – now"
          title={
            <>
              Five departments, <em>one</em> manager.
            </>
          }
          about="A Tier 1 automotive supplier that designs, builds, programs and commissions robotic car-body lines (welding, assembly and joining) for North American automakers, including EV programs."
          summary="I report to the US CEO, work with US and China leadership, bring AI into operations and administration, and teach my team to use it properly."
          kpis={[
            { value: 5, label: "departments I oversee" },
            { value: 160, label: "page ERP design I wrote" },
            { value: 114, label: "task implementation plan" },
          ]}
        />
        <SubHead>What I oversee</SubHead>
        <DeptMap />
        <SubHead>How a purchase will move through the ERP</SubHead>
        <ErpFlow />
        <SubHead>The ERP I'm leading, in four phases</SubHead>
        <Roadmap />
        <SubHead>Running the office</SubHead>
        <OfficeOps />
        <SubHead id="belong-ai" built="I rolled this out">AI in operations and administration</SubHead>
        <BelongAI />
        <SubHead id="belong-stories">Belong stories</SubHead>
        <StoryCards company="Belong" />
      </div>
    </section>
  );
}

function DeptMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });
  return (
    <div className="dept card" ref={ref}>
      <motion.div className="dept-top" initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease }}>
        US CEO · US and China leadership
      </motion.div>
      <motion.span className="dept-stem" initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}} transition={{ delay: 0.3, duration: 0.4 }} />
      <motion.div className="dept-me" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.55, type: "spring", stiffness: 260, damping: 18 }}>
        <strong>Me</strong>
        <span>Office Manager · 5 direct reports</span>
      </motion.div>
      <motion.span className="dept-stem" initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}} transition={{ delay: 0.8, duration: 0.4 }} />
      <motion.span className="dept-rail" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ delay: 1, duration: 0.6, ease }} />
      <div className="dept-row">
        {departments.map((d, n) => (
          <motion.div key={d.name} className="dept-card" initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.2 + n * 0.12, duration: 0.45, ease }}>
            <strong>{d.name}</strong>
            <span>{d.what}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });
  return (
    <Reveal className="roadmap card">
      <div ref={ref} className="roadmap-track">
        <motion.span className="roadmap-fill" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ delay: 0.2, duration: 1.2, ease }} />
        {phases.map((p, n) => (
          <motion.div key={p.name} className={`roadmap-phase ${p.state === "In build" ? "now" : ""}`} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + n * 0.25, duration: 0.45, ease }}>
            <span className="roadmap-dot">{n + 1}</span>
            <strong>Phase {n + 1}</strong>
            <span className="roadmap-name">{p.name}</span>
            <em>{p.state}</em>
          </motion.div>
        ))}
      </div>
      <div className="roadmap-chips">
        {planChips.map((c, n) => (
          <motion.span key={c.label} className="roadmap-chip" initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.3 + n * 0.12, duration: 0.4, ease }}>
            <b>{c.value}</b> {c.label}
          </motion.span>
        ))}
      </div>
      <p className="roadmap-note">
        Supply chain first: it carries the most risk and it's where I know the work best. The design includes about 22 alert rules, budget alerts near 80% and
        three-way matching. Odoo was chosen over NetSuite, SAP and a custom build.
      </p>
    </Reveal>
  );
}

// How AI is used in Belong's operations and administration: AI drafts, Eva checks.
const aiFlow = ["Recorded meeting", "AI drafts notes and plan updates", "I check the notes and the logic", "Shared with the team"];
const aiUses: { area: string; title: string; body: string; example?: string; team?: boolean }[] = [
  {
    area: "Operations",
    title: "Meetings to plan updates",
    body: "Weekly ERP meetings with the developers are recorded. AI drafts the notes and proposed plan updates; nothing goes out until I've checked it.",
    example: "Three process meetings became one design document and workflow minutes, in English and Chinese.",
  },
  {
    area: "Operations",
    title: "Research for decisions",
    body: "AI organizes research and lays out options and cost assumptions side by side, as in the four-way ERP comparison, so management gets a clear choice.",
    example: "Software license quotes from two vendors, subscription vs perpetual, in one table.",
  },
  {
    area: "Operations",
    title: "A faster ERP build",
    body: "AI helps the software developers move faster on the ERP integration and on gathering the migration documents.",
    example: "The purchase data clean-up template went through five versions before migration.",
  },
  {
    area: "Administration",
    title: "Legal documents and applications",
    body: "I handle the company's legal paperwork. AI helps me organize the documents and track the paperwork for each application.",
  },
  {
    area: "Team",
    title: "Teaching my team to use AI",
    body: "I'm rolling AI out to my team and teaching each person how to use it properly, so each of them can work more as a decision maker.",
    team: true,
  },
];

function BelongAI() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });
  return (
    <div className="bai" ref={ref}>
      <ol className="bai-flow">
        {aiFlow.map((step, n) => (
          <motion.li key={step} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 + n * 0.3, duration: 0.45, ease }} className={n === 1 ? "ai" : n === 2 ? "me" : ""}>
            <span className="bai-n">{n + 1}</span>
            {step}
          </motion.li>
        ))}
      </ol>
      <div className="bai-uses">
        {aiUses.map((u, n) => (
          <Reveal key={u.title} delay={n * 0.08} className={`bai-use card ${u.team ? "wide" : ""}`}>
            <span className="bai-tag">{u.area}</span>
            <strong>{u.title}</strong>
            <p>{u.body}</p>
            {u.example && <p className="bai-example">{u.example}</p>}
            {u.team && <TeamDots />}
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// Who on the team uses AI today: 6 of 20, all of administration and operations.
function TeamDots() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px -40px 0px" });
  return (
    <div className="bai-team" ref={ref}>
      <div className="bai-dots" role="img" aria-label="6 of 20 people on my team use AI: all of administration and operations. The other 14 are engineers on site.">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.i key={i} className={i < 6 ? "on" : ""} initial={{ opacity: 0, scale: 0.4 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }} />
        ))}
      </div>
      <div className="bai-team-key" aria-hidden>
        <span>
          <i className="on" /> 6 use AI now: all of administration and operations
        </span>
        <span>
          <i /> 14 engineers on site
        </span>
      </div>
    </div>
  );
}

// The five purchase types in the ERP design, and how each one moves from request to payment.
type Step = { name: string; alt?: string };
const flowSteps: Step[] = [{ name: "Request" }, { name: "Quote" }, { name: "PO" }, { name: "Receive" }, { name: "Bill" }, { name: "3-way match" }, { name: "Pay" }];
const purchaseTypes: { name: string; rule: string; swap?: Record<number, string>; skip?: number[] }[] = [
  { name: "Standard / material", rule: "Material arrives on site, the coordinator checks it against the packing list and the PO, and the system pays only when PO, receipt and bill agree." },
  { name: "Labor", rule: "A blanket PO caps hours and travel per person. Each child PO is checked three ways: this person's hours, their travel, and the blanket total. Any failure blocks it.", swap: { 2: "Blanket PO", 3: "Timesheet" } },
  { name: "Rental", rule: "A blanket PO per vendor. Each child PO must come from a real vendor invoice, and payment is locked to it.", swap: { 2: "Blanket PO", 3: "Invoice", 4: "Child PO" } },
  { name: "Site emergency", rule: "Small, urgent buys skip the quote step; anything larger goes back to the standard flow. A receipt or photo is still required and still matched.", skip: [1] },
  { name: "Office / other", rule: "Office supplies take a short path, but still roll up to a budget and get matched before payment." },
];

function ErpFlow() {
  const [pick, setPick] = useState(0);
  const [lit, setLit] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px 0px -80px 0px" });
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setLit((n) => (n + 1) % (flowSteps.length + 2)), 650);
    return () => clearInterval(t);
  }, [inView]);
  const type = purchaseTypes[pick];
  return (
    <div className="eflow card" ref={ref}>
      <div className="eflow-types" role="tablist" aria-label="Purchase types">
        {purchaseTypes.map((t, n) => (
          <button key={t.name} role="tab" aria-selected={n === pick} className={n === pick ? "on" : ""} onClick={() => { setPick(n); setLit(0); }}>
            {t.name}
          </button>
        ))}
      </div>
      <ol className="eflow-steps">
        {flowSteps.map((s, i) => {
          const skipped = type.skip?.includes(i);
          const label = type.swap?.[i] ?? s.name;
          return (
            <li key={i} className={`${skipped ? "skip" : ""} ${!skipped && lit > i ? "on" : ""} ${i === 5 ? "gate" : ""}`}>
              <span className="eflow-dot">{i + 1}</span>
              <AnimatePresence mode="wait">
                <motion.span key={label + pick} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                  {label}
                </motion.span>
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
      <AnimatePresence mode="wait">
        <motion.p key={pick} className="eflow-rule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <strong>{type.name}:</strong> {type.rule}
        </motion.p>
      </AnimatePresence>
      <p className="eflow-note">Every purchase rolls up to its project, so cost by project comes straight from the ERP. Today this runs on chat, spreadsheets and email.</p>
    </div>
  );
}

// What else lands on the Office Manager's desk, kept general.
const ops = [
  { icon: "🛡️", title: "Business insurance", body: "Annual renewal across liability, workers' comp and commercial auto, organized into one bilingual index; certificates for customers." },
  { icon: "🦺", title: "Safety training", body: "OSHA 10 and 30-hour certificates tracked for the crew going on site." },
  { icon: "🔧", title: "Facilities and vendors", body: "Cleaning, equipment rental, inspections and machine repair, quoted and compared before anyone is booked." },
  { icon: "📄", title: "Legal and compliance paperwork", body: "I handle the company's legal paperwork and keep every document organized and easy to find." },
];

function OfficeOps() {
  return (
    <div className="ops">
      {ops.map((o, n) => (
        <Reveal key={o.title} delay={n * 0.08} className="ops-item card">
          <span className="ops-icon" aria-hidden>{o.icon}</span>
          <strong>{o.title}</strong>
          <p>{o.body}</p>
        </Reveal>
      ))}
    </div>
  );
}
