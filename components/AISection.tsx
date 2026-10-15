"use client";

import { motion } from "framer-motion";
import { ai } from "@/content/site";
import Reveal from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

const icons: Record<string, React.ReactNode> = {
  chat: <path d="M4 5h16v10H9l-5 4V5z" />,
  robot: (
    <>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 4v4M9 13h.01M15 13h.01M9 16h6" />
    </>
  ),
  doc: <path d="M7 3h7l4 4v14H7V3zm7 0v4h4M10 12h5M10 16h5" />,
  pen: <path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  spark: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />,
};

export default function AISection() {
  return (
    <section id="ai" className="ai-section">
      <div className="ai-orbit" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="container">
        <Reveal>
          <span className="eyebrow">02 · AI integration</span>
          <h2 className="section-title ai-title">{ai.title}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="ai-intro">{ai.intro}</p>
        </Reveal>

        <div className="ai-grid">
          {ai.uses.map((u, i) => (
            <motion.div
              key={u.title}
              className="ai-card"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease }}
              whileHover={{ y: -6 }}
            >
              <div className="ai-card-inner">
                <span className="ai-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {icons[u.icon]}
                  </svg>
                </span>
                <h3>{u.title}</h3>
                <p>{u.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

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

        <Reveal className="ai-built">
          <p>{ai.builtWith}</p>
        </Reveal>
      </div>
    </section>
  );
}
