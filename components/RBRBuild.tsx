"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { rbrPlatform } from "@/content/site";
import Counter from "./Counter";
import Reveal from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;
const STEP_MS = 2600;

// How the RBR platform is built: the stack, its size in numbers, and the
// build-and-review loop every change goes through (the steps light up in turn).
export default function RBRBuild() {
  const { stack, numbers, loop } = rbrPlatform;
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px 0px -80px 0px" });

  useEffect(() => {
    if (!auto || !inView) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % loop.length), STEP_MS);
    return () => clearTimeout(t);
  }, [step, auto, inView, loop.length]);

  return (
    <div className="rbr-build">
      <div className="rbr-stack">
        {stack.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.06} className="rbr-stack-group">
            <span className="rbr-stack-label">{g.group}</span>
            <div className="rbr-stack-items">
              {g.items.map((item, j) => (
                <motion.span
                  key={item}
                  className="tag"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.06 + j * 0.05, duration: 0.4, ease }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="rbr-numbers">
        {numbers.map((n, i) => (
          <Reveal key={n.label} delay={i * 0.06} className="rbr-number">
            <strong>
              {n.prefix}
              <Counter to={n.value} />
            </strong>
            <span>{n.label}</span>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="rbr-loop" ref={ref}>
          <ol className="rbr-loop-steps">
            {loop.map((s, i) => (
              <li key={s.step}>
                <button
                  type="button"
                  className={i === step ? "on" : i < step ? "done" : ""}
                  aria-pressed={i === step}
                  onClick={() => {
                    setStep(i);
                    setAuto(false);
                  }}
                >
                  <span className="rbr-loop-n">{i + 1}</span>
                  {s.step}
                </button>
              </li>
            ))}
          </ol>
          <div className="rbr-loop-track" aria-hidden>
            <motion.span className="rbr-loop-fill" animate={{ width: `${((step + 1) / loop.length) * 100}%` }} transition={{ duration: 0.6, ease }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              className="rbr-loop-body"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease }}
            >
              {loop[step].body}
            </motion.p>
          </AnimatePresence>
          <span className="rbr-loop-again">↻ Repeats for every change</span>
        </div>
      </Reveal>
    </div>
  );
}
