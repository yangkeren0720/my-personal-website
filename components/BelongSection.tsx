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
  { name: "IT", what: "Odoo ERP project lead; engineering-software licensing" },
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
          summary="I report to the US CEO and work with US and China leadership."
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
        <span>Manager</span>
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
