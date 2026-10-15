"use client";

import { motion } from "framer-motion";
import { ai } from "@/content/site";
import Reveal from "./Reveal";
import AIDemos from "./AIDemos";

// AI demos and guardrails, shown inside the RBR section.
export default function AISection() {
  return (
    <div className="rbr-ai">
        <Reveal delay={0.1}>
          <AIDemos />
        </Reveal>

        <Reveal className="ai-guard">
          <span className="ai-guard-label">Guardrails built in</span>
          <div className="ai-guard-list">
            {ai.guardrails.map((g, i) => (
              <motion.span
                key={g}
                className="ai-guard-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.07, type: "spring", stiffness: 300, damping: 20 }}
              >
                <span aria-hidden>✓</span> {g}
              </motion.span>
            ))}
          </div>
        </Reveal>

    </div>
  );
}
