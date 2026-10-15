"use client";

import { motion } from "framer-motion";
import { supplyChain } from "@/content/site";
import Reveal from "./Reveal";

export default function SupplyChain() {
  return (
    <section id="supply-chain">
      <div className="container">
        <Reveal>
          <span className="eyebrow">01 · Supply chain</span>
          <h2 className="section-title">{supplyChain.title}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="ai-intro">{supplyChain.intro}</p>
        </Reveal>
        <div className="cap-grid">
          {supplyChain.capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              className="cap card"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <span className="cap-num">0{i + 1}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
