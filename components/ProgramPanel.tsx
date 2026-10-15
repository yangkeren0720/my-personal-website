"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Program } from "@/content/site";
import { Visual } from "./SkyWaterStories";

// The panel a resume chip opens: what the job was, what Eva did (revealed
// step by step), the headline numbers, and one visual.

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProgramPanel({ p, onClose }: { p: Program; onClose: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [250, 1000, 1750].map((t, n) => setTimeout(() => setStep(n + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="prog-panel viz-root">
      <div className="prog-head">
        <div>
          <strong>{p.name}</strong>
          <span>
            {p.place} · {p.period}
          </span>
        </div>
        <button type="button" className="prog-close" onClick={onClose} aria-label={`Close ${p.name}`}>
          ×
        </button>
      </div>
      <p className="prog-job">{p.job}</p>
      <div className="prog-body">
        <div className="prog-text">
          <div className="prog-kpis">
            {p.kpis.map((k, n) => (
              <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + n * 0.1, ease }}>
                <strong>{k.value}</strong>
                <span>{k.label}</span>
              </motion.div>
            ))}
          </div>
          <span className="prog-cap">What I did</span>
          <ol className="prog-steps">
            {p.did.map((d, n) => (
              <li key={n} className={step > n ? "in" : ""}>
                <span className="prog-dot">{step > n ? "✓" : n + 1}</span>
                <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: step > n ? 1 : 0.25, x: step > n ? 0 : -8 }} transition={{ duration: 0.4, ease }}>
                  {d}
                </motion.p>
              </li>
            ))}
          </ol>
        </div>
        <div className="prog-visual">
          {p.crew && <Crew crew={p.crew} />}
          {p.flow && <Flow steps={p.flow} />}
          {p.visual && <Visual kind={p.visual} />}
        </div>
      </div>
    </div>
  );
}

// Who was sourced, by trade: one hue, bars grow in order, counts tick up.
function Crew({ crew }: { crew: { label: string; n: number }[] }) {
  const total = crew.reduce((a, c) => a + c.n, 0);
  const max = Math.max(...crew.map((c) => c.n));
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="crew" onMouseLeave={() => setHover(null)}>
      <div className="crew-cap">
        Crew I sourced · <Count to={total} delay={0.3} /> people
      </div>
      {crew.map((c, n) => (
        <div key={c.label} className={`crew-row ${hover === c.label ? "on" : ""} ${hover && hover !== c.label ? "dim" : ""}`} onMouseEnter={() => setHover(c.label)}>
          <span className="crew-label">{c.label}</span>
          <span className="crew-track">
            <motion.span className="crew-bar" initial={{ width: 0 }} animate={{ width: `${Math.max(2, (c.n / max) * 100)}%` }} transition={{ delay: 0.3 + n * 0.12, duration: 0.7, ease }} />
          </span>
          <span className="crew-n">
            <Count to={c.n} delay={0.3 + n * 0.12} />
          </span>
        </div>
      ))}
    </div>
  );
}

function Flow({ steps }: { steps: string[] }) {
  const [lit, setLit] = useState(0);
  useEffect(() => {
    const timers = steps.map((_, n) => setTimeout(() => setLit(n + 1), 400 + n * 650));
    return () => timers.forEach(clearTimeout);
  }, [steps]);
  return (
    <div className="pflow">
      {steps.map((s, n) => (
        <div key={s} className={`pflow-step ${lit > n ? "on" : ""} ${n === steps.length - 1 ? "last" : ""}`}>
          <span className="pflow-dot">{lit > n ? "✓" : n + 1}</span>
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
}

function Count({ to, delay = 0 }: { to: number; delay?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / 900);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [to, delay]);
  return <>{v.toLocaleString()}</>;
}
