"use client";

import { motion } from "framer-motion";
import { supplyChain } from "@/content/site";
import Reveal from "./Reveal";
import FlowViz from "./FlowViz";

export default function SupplyChain() {
  return (
    <section id="supply-chain">
      <div className="container">
        <Reveal>
          <span className="eyebrow">01 · Supply chain</span>
          <h2 className="section-title">{supplyChain.title}</h2>
          <p className="ai-intro">{supplyChain.intro}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <FlowViz />
        </Reveal>
        <div className="cap-chips">
          {supplyChain.capabilities.map((c, i) => (
            <motion.span
              key={c.title}
              className="cap-chip"
              title={c.body}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="cap-num">0{i + 1}</span>
              {c.title}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
