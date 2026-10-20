"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";
import Counter from "./Counter";
import LoopVideo from "./LoopVideo";
import { builds } from "@/content/site";

// Two skills, one method: the three-beat title, planning proof on the left,
// builder proof on the right, the loop both share in the middle, then
// problem / built / result cards. Planning numbers name their
// employer; builder proof is RBR, this site and Mino's pre-AI workflow only.
// Nothing here ties AI or tool-building to SkyWater.

const ease = [0.22, 1, 0.36, 1] as const;

export default function Builds() {
  return (
    <section id="builds" className="builds">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Two skills, one method</span>
          <Beats />
        </Reveal>

        <div className="builds-split">
          <Reveal className="card builds-plan">
            <h3>Planning at scale</h3>
            <ul>
              {builds.planning.map((p) => (
                <li key={p.label}>
                  <strong>
                    {p.prefix}
                    <Counter to={p.value} suffix={p.suffix} />
                  </strong>
                  <span>
                    {p.label} <em>{p.org}</em>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="builds-loop-wrap" delay={0.08}>
            <MethodLoop />
          </Reveal>

          <Reveal className="builds-tiles" delay={0.16}>
            {builds.tiles.map((t) => (
              <a key={t.label} href={t.href} className="card builds-tile">
                <LoopVideo className="builds-video" src={t.video} poster={t.poster} label={`Screen recording: ${t.label}`} />
                <span className="builds-tile-text">
                  <strong>{t.label}</strong>
                  <b>{t.number}</b>
                  <small>{t.detail}</small>
                </span>
              </a>
            ))}
          </Reveal>
        </div>

        <ProofCards />

        <Reveal>
          <HowIBuild />
        </Reveal>

        <Reveal className="builds-before">
          <span className="builds-before-tag">Before AI</span>
          {builds.beforeAI.map((b) => (
            <span key={b} className="builds-before-item">
              {b}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// The four steps both jobs share, lit one after another around a ring.
function MethodLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px 0px -60px 0px" });
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setStep((s) => (s + 1) % builds.method.length), 1600);
    return () => clearInterval(t);
  }, [inView]);
  const n = builds.method.length;
  return (
    <div className="method-loop" ref={ref} aria-label={`One method: ${builds.method.join(", then ")}`}>
      <svg viewBox="0 0 200 200" aria-hidden>
        <circle cx="100" cy="100" r="78" className="method-ring" />
        <motion.circle
          cx="100"
          cy="100"
          r="78"
          className="method-ring-on"
          pathLength={1}
          initial={false}
          animate={{ pathLength: (step + 1) / n }}
          transition={{ duration: 0.6, ease }}
          transform="rotate(-90 100 100)"
        />
      </svg>
      {builds.method.map((m, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <span
            key={m}
            className={`method-step ${i === step ? "on" : ""}`}
            style={{ left: `${50 + Math.cos(a) * 39}%`, top: `${50 + Math.sin(a) * 39}%` }}
          >
            {m}
          </span>
        );
      })}
      <span className="method-core">Same loop for a supplier or a build</span>
    </div>
  );
}

// Spec, build, cross-check, verify, ship: each step lights in turn.
function HowIBuild() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  return (
    <div className="how-build" ref={ref}>
      <ol>
        {builds.how.map((h, i) => (
          <motion.li
            key={h.label}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.22, duration: 0.5, ease }}
            className={h.mine ? "mine" : ""}
          >
            <strong>{h.label}</strong>
            <span>{h.who}</span>
          </motion.li>
        ))}
      </ol>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.4 }}>
        {builds.howNote}
      </motion.p>
    </div>
  );
}

// "I plan the supply. I solve the constraint. I build the tools." Each beat
// rises in turn with the employer it comes from underneath.
function Beats() {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  return (
    <h2 className="section-title beats" ref={ref}>
      {builds.beats.map((b, i) => (
        <motion.span
          key={b.text}
          className={`beat ${i === builds.beats.length - 1 ? "last" : ""}`}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 + i * 0.35, duration: 0.6, ease }}
        >
          <span className="beat-text">{b.text}</span>
          <small className="beat-org">{b.org}</small>
        </motion.span>
      ))}
    </h2>
  );
}

// Problem, then what was built, then the result: three steps light in turn
// on each card, then the result counts up.
function ProofCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  return (
    <div className="proof" ref={ref}>
      <span className="proof-head">Problem → Built → Result</span>
      <div className="proof-grid">
        {builds.proof.map((p, ci) => (
          <motion.a
            key={p.org}
            href={p.href}
            className="card proof-card"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: ci * 0.15, duration: 0.6, ease }}
          >
            <span className="proof-org">
              <strong>{p.org}</strong> {p.note}
            </span>
            <ol className="proof-steps">
              {[
                { k: "Problem", v: p.problem },
                { k: "Built", v: p.built },
              ].map((st, si) => (
                <motion.li
                  key={st.k}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + ci * 0.15 + si * 0.3, duration: 0.5, ease }}
                >
                  <span>{st.k}</span>
                  {st.v}
                </motion.li>
              ))}
            </ol>
            <span className="proof-result">
              <strong>
                {p.result.prefix}
                <Counter to={p.result.value} suffix={p.result.suffix} />
              </strong>
              <small>{p.result.label}</small>
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
