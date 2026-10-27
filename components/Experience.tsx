"use client";

import { Fragment, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll } from "framer-motion";
import { experience, leadership, skills, systems } from "@/content/site";
import Collapse from "./Collapse";
import Reveal from "./Reveal";
import PlaceholderBadge from "./PlaceholderBadge";
import ProgramPanel from "./ProgramPanel";
import CareerGlance from "./CareerGlance";

// A click on a linked card's empty space (not a chip, link or selected text)
// goes to that employer's section, same as its main button.
function openSection(e: React.MouseEvent, href: string) {
  const t = e.target as HTMLElement;
  if (t.closest("a, button, .timeline-programs, .prog-wrap") || window.getSelection()?.toString()) return;
  const el = document.querySelector(href);
  if (!el) return;
  history.pushState(null, "", href);
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  // Which chip is open, as "jobIndex:name"; one at a time across the resume.
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section id="experience">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Resume</span>
          <h2 className="section-title">
            Where I&apos;ve <em>worked</em>.
          </h2>
        </Reveal>

        <Reveal>
          <CareerGlance />
        </Reveal>

        {/* For the people-manager reader: one row, each chip tagged and linked to its proof. */}
        <Reveal className="lead-strip">
          <span className="lead-label">How I lead</span>
          <div className="lead-row">
            {leadership.map((l) => (
              <a key={l.label} href={l.href} className={`lead-chip co-${l.org.toLowerCase()}`}>
                <strong>{l.value}</strong>
                <span>{l.label}</span>
                <em>{l.org}</em>
              </a>
            ))}
          </div>
        </Reveal>

        <div className="timeline" ref={ref}>
          <div className="timeline-track" aria-hidden>
            <motion.div className="timeline-fill" style={{ scaleY: scrollYProgress }} />
          </div>

          {experience.map((job, i) => (
            <Fragment key={i}>
            {job.groupLabel && <div className="timeline-group">{job.groupLabel}</div>}
            <motion.article
              id={job.id}
              className="timeline-item"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="timeline-dot"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
              />
              <div
                className={`timeline-card card ${job.placeholder ? "placeholder" : ""} ${job.kind === "education" ? "edu" : ""} ${job.section ? "linked" : ""}`}
                onClick={job.section ? (e) => openSection(e, job.section!.href) : undefined}
              >
                <div className="timeline-head">
                  <span className="timeline-period">{job.period}</span>
                  {job.load && <span className={`timeline-load ${job.load === "Full-time" ? "full" : ""}`}>{job.load}</span>}
                  <PlaceholderBadge show={job.placeholder} />
                </div>
                <h3>{job.title}</h3>
                {job.scope && <p className="timeline-scope">{job.scope}</p>}
                <p className="timeline-org">
                  {job.org}
                  {job.place && <span className="timeline-place"> · {job.place}</span>}
                </p>
                <p className="timeline-summary">{job.summary}</p>
                {job.section && (
                  <a href={job.section.href} className="btn btn-primary timeline-section-btn">
                    {job.section.label} <span aria-hidden>→</span>
                  </a>
                )}
                {job.programs && (
                  <>
                    {job.programsLabel && <span className="timeline-programs-label">{job.programsLabel}</span>}
                    <div className="timeline-programs">
                      {job.programs.map((p, pi) => {
                        const key = `${i}:${p.name}`;
                        const on = openKey === key;
                        return (
                          <motion.button
                            type="button"
                            key={p.name}
                            className={`timeline-program ${on ? "on" : ""}`}
                            aria-expanded={on}
                            onClick={() => setOpenKey(on ? null : key)}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + pi * 0.08 }}
                          >
                            <strong>{p.name}</strong>
                            <span>
                              {p.place} · {p.period}
                            </span>
                            <i className="timeline-program-cue" aria-hidden>
                              {on ? "−" : "+"}
                            </i>
                          </motion.button>
                        );
                      })}
                    </div>
                    <AnimatePresence initial={false} mode="wait">
                      {job.programs.map((p) =>
                        openKey === `${i}:${p.name}` ? (
                          <Collapse key={p.name} className="prog-wrap" duration={0.35}>
                            <ProgramPanel p={p} onClose={() => setOpenKey(null)} />
                          </Collapse>
                        ) : null
                      )}
                    </AnimatePresence>
                  </>
                )}
                {job.highlights.length > 0 && (
                  <Highlights items={job.highlights} co={job.section?.href.slice(1)} />
                )}
                {job.links && (
                  <div className="timeline-links">
                    {job.links.map((l) => (
                      <a key={l.label} href={l.href} className="timeline-link">
                        {l.label} <span aria-hidden>→</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
            </Fragment>
          ))}
        </div>

        <Reveal className="skills-row">
          <span className="skills-label">Skills</span>
          {skills.map((sk) => <Chip key={sk.label} {...sk} />)}
        </Reveal>
        <Reveal className="skills-row systems-row">
          <span className="skills-label">Systems</span>
          {systems.map((sk) => <Chip key={sk.label} {...sk} />)}
        </Reveal>
      </div>
    </section>
  );
}

// Resume bullets. Each **phrase** becomes a bold keyword with a highlighter band
// in the employer's color that draws in, one after another, once the list is in view.
function Highlights({ items, co }: { items: string[]; co?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });
  let n = 0;
  return (
    <ul ref={ref} className={`hi-list ${co ? `co-${co}` : ""} ${seen ? "drawn" : ""}`}>
      {items.map((h, i) => (
        <li key={i}>
          {h.split(/\*\*(.+?)\*\*/).map((part, k) =>
            k % 2 ? (
              <strong key={k} className="hi" style={{ "--d": `${n++ * 120}ms` } as React.CSSProperties}>
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </li>
      ))}
    </ul>
  );
}

// A skill or tool; with a link it jumps to the work that backs it.
function Chip({ label, href }: { label: string; href?: string }) {
  return href ? (
    <a href={href} className="skill-chip linked">
      {label} <span aria-hidden>→</span>
    </a>
  ) : (
    <span className="skill-chip">{label}</span>
  );
}
