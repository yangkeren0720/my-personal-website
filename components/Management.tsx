"use client";

import { motion } from "framer-motion";
import { management, principles } from "@/content/site";
import Reveal from "./Reveal";

export default function Management() {
  return (
    <section id="management">
      <div className="container">
        <Reveal>
          <span className="eyebrow">03 · Management</span>
          <h2 className="section-title">{management.title}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="ai-intro">{management.intro}</p>
        </Reveal>
        <div className="mgmt-grid">
          {management.areas.map((a, i) => (
            <motion.div
              key={a.title}
              className="mgmt card"
              initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </motion.div>
          ))}
        </div>
        <Reveal>
          <h3 className="mgmt-sub">How I work</h3>
        </Reveal>
        <div className="principles">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              className="principle card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <span className="principle-num">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
