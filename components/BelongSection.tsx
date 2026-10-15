"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";
import CompanyHead, { SubHead } from "./CompanyHead";
import StoryCards from "./StoryCards";

// Everything from the Belong Manager job, and nothing else: the departments
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

export default function BelongSection() {
  return (
    <section id="belong" className="co-section">
      <div className="container">
        <CompanyHead
          co="belong"
          company="Belong Automotive Technology"
          role="Manager, part-time"
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
        <SubHead>The ERP I'm leading, in four phases</SubHead>
        <Roadmap />
        <SubHead id="belong-ai">AI in operations and administration</SubHead>
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
        <span>Manager · 5 direct reports</span>
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
      <p className="roadmap-note">
        Supply chain first: it carries the most risk and it's where I know the work best. The design includes about 22 alert rules, budget alerts near 80% and
        three-way matching. Odoo was chosen over NetSuite, SAP and a custom build.
      </p>
    </Reveal>
  );
}

// How AI is used in Belong's operations and administration: AI drafts, Eva checks.
const aiFlow = ["Recorded meeting", "AI drafts notes and plan updates", "I check the notes and the logic", "Shared with the team"];
const aiUses: { area: string; title: string; body: string; team?: boolean }[] = [
  {
    area: "Operations",
    title: "Meetings to plan updates",
    body: "Weekly ERP meetings with the developers are recorded. AI drafts the notes and proposed plan updates; nothing goes out until I've checked it.",
  },
  {
    area: "Operations",
    title: "Research for decisions",
    body: "AI organizes research and lays out options and cost assumptions side by side, as in the four-way ERP comparison, so management gets a clear choice.",
  },
  {
    area: "Operations",
    title: "A faster ERP build",
    body: "AI helps the software developers move faster on the ERP integration and on gathering the migration documents.",
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
