"use client";

import { motion } from "framer-motion";
import { management, principles } from "@/content/site";
import Reveal from "./Reveal";
import VendorHub from "./VendorHub";

export default function Management() {
  return (
    <section id="management">
      <div className="container">
        <Reveal>
          <span className="eyebrow">03 · Management</span>
          <h2 className="section-title">{management.title}</h2>
          <p className="ai-intro">{management.intro}</p>
        </Reveal>
        <div className="mgmt-layout">
          <Reveal delay={0.1}>
            <VendorHub />
          </Reveal>
          <div className="mgmt-tiles">
            {management.areas.map((a, i) => (
              <motion.div
                key={a.title}
                className="mgmt-tile card"
                title={a.body}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 6 }}
              >
                <span className="cap-num">0{i + 1}</span>
                <h3>{a.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
        <Reveal>
          <h3 className="mgmt-sub">How I work</h3>
        </Reveal>
        <div className="cap-chips">
          {principles.map((p, i) => (
            <motion.span
              key={p.title}
              className="cap-chip"
              title={p.body}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {p.title}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
