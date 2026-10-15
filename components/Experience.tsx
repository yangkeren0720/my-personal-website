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
          <span className="eyebrow">Experience</span>
          <h2 className="section-title">
            Where I&apos;ve <em>been</em> building.
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
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
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
              <div className={`timeline-card card ${job.placeholder ? "placeholder" : ""}`}>
                <div className="timeline-head">
                  <span className="timeline-period">{job.period}</span>
                  <PlaceholderBadge show={job.placeholder} />
                </div>
                <h3>{job.title}</h3>
                <p className="timeline-org">{job.org}</p>
                <p className="timeline-summary">{job.summary}</p>
                {job.highlights.length > 0 && (
                  <ul>
                    {job.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
