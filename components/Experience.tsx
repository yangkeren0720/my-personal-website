"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { experience } from "@/content/site";
import Reveal from "./Reveal";
import PlaceholderBadge from "./PlaceholderBadge";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <section id="experience">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Resume</span>
          <h2 className="section-title">
            Where I&apos;ve <em>worked</em>.
          </h2>
        </Reveal>

        <div className="timeline" ref={ref}>
          <div className="timeline-track" aria-hidden>
            <motion.div className="timeline-fill" style={{ scaleY: scrollYProgress }} />
          </div>

          {experience.map((job, i) => (
            <motion.article
              key={i}
              className="timeline-item"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="timeline-dot"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
              />
              <div className={`timeline-card card ${job.placeholder ? "placeholder" : ""} ${job.kind === "education" ? "edu" : ""}`}>
                <div className="timeline-head">
                  <span className="timeline-period">{job.period}</span>
                  <PlaceholderBadge show={job.placeholder} />
                </div>
                <h3>{job.title}</h3>
                <p className="timeline-org">
                  {job.org}
                  {job.place && <span className="timeline-place"> · {job.place}</span>}
                </p>
                <p className="timeline-summary">{job.summary}</p>
                {job.programs && (
                  <div className="timeline-programs">
                    {job.programs.map((p, pi) => (
                      <motion.span
                        key={p.name}
                        className="timeline-program"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + pi * 0.08 }}
                      >
                        <strong>{p.name}</strong>
                        <span>
                          {p.place} · {p.period}
                        </span>
                      </motion.span>
                    ))}
                  </div>
                )}
                {job.highlights.length > 0 && (
                  <ul>
                    {job.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </ul>
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
          ))}
        </div>
      </div>
    </section>
  );
}
