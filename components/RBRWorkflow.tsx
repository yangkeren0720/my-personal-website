"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionStyle } from "framer-motion";
import { rbrPlatform } from "@/content/site";

type Mode = "before" | "now";
const ease = [0.22, 1, 0.36, 1] as const;
// How long the token takes to cross all five steps in each mode.
const RUN_MS: Record<Mode, number> = { before: 7000, now: 2400 };

// A value-stream map of one new lease: a token walks through the five steps,
// lingering on each in proportion to its hands-on minutes, first "by hand" and
// then "now", while a clock adds up the minutes.
export default function RBRWorkflow() {
  const steps = rbrPlatform.workflow;
  const max = Math.max(...steps.map((s) => s.before));
  const total = (m: Mode) => steps.reduce((a, s) => a + s[m], 0);

  const [mode, setMode] = useState<Mode>("before");
  // The transforms below read the mode from here so they always use the current one.
  const modeRef = useRef<Mode>(mode);
  modeRef.current = mode;
  const [auto, setAuto] = useState(true);
  const [active, setActive] = useState(-1);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px 0px -80px 0px" });

  // 0..1 share of the minutes spent so far in the current mode.
  const spent = useMotionValue(0);
  const pos = useTransform(spent, (f) => {
    // Where the token sits along the five steps for that share of the minutes.
    const mins = steps.map((s) => Math.max(s[modeRef.current], 0.4));
    const sum = mins.reduce((a, b) => a + b, 0);
    let m = f * sum;
    for (let i = 0; i < mins.length; i += 1) {
      if (m <= mins[i]) return (i + m / mins[i]) / steps.length;
      m -= mins[i];
    }
    return 1;
  });
  const left = useTransform(pos, (p) => `${p * 100}%`);
  const clock = useTransform(spent, (f) => Math.round(f * total(modeRef.current)));
  useMotionValueEvent(pos, "change", (p) => setActive(p >= 1 ? steps.length - 1 : Math.floor(p * steps.length)));

  useEffect(() => {
    if (reduce) {
      spent.set(1);
      return;
    }
    if (!inView) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    spent.set(0);
    const run = animate(spent, 1, { duration: RUN_MS[mode] / 1000, ease: "linear" });
    run.then(() => {
      if (stopped || !auto) return;
      timer = setTimeout(() => setMode((m) => (m === "before" ? "now" : "before")), mode === "before" ? 1200 : 2600);
    });
    return () => {
      stopped = true;
      run.stop();
      clearTimeout(timer);
    };
  }, [mode, inView, auto, reduce, spent]);

  const pick = (m: Mode) => {
    setAuto(false);
    setMode(m);
  };

  return (
    <div className="wf" ref={ref}>
      <div className="wf-head">
        <div className="wf-modes" role="group" aria-label="Show hands-on time">
          <button type="button" className={mode === "before" ? "on" : ""} aria-pressed={mode === "before"} onClick={() => pick("before")}>
            By hand
          </button>
          <button type="button" className={mode === "now" ? "on" : ""} aria-pressed={mode === "now"} onClick={() => pick("now")}>
            Now
          </button>
        </div>
        <div className={`wf-clock ${mode}`} aria-live="off">
          <motion.strong>{clock}</motion.strong>
          <span>min of hands-on work per new lease</span>
        </div>
      </div>

      <div className="wf-track">
        <div className="wf-line" aria-hidden>
          <motion.span className={`wf-token ${mode}`} style={{ left, "--wf-p": left } as MotionStyle} />
        </div>
        <ol className="wf-steps">
          {steps.map((s, i) => (
            <li key={s.step} className={`wf-step ${i === active ? "on" : ""} ${i < active ? "done" : ""}`}>
              <span className="wf-n">{i + 1}</span>
              <strong>{s.step}</strong>
              <span className={`wf-who wf-who-${s.who.toLowerCase()}`}>{s.who}</span>
              <div className="wf-bars">
                <div className={`wf-bar hand ${mode === "before" ? "lit" : ""}`}>
                  <motion.i initial={{ width: 0 }} animate={{ width: inView || reduce ? `${(s.before / max) * 100}%` : 0 }} transition={{ duration: 0.8, delay: i * 0.08, ease }} />
                  <span>{s.before} min</span>
                </div>
                <div className={`wf-bar now ${mode === "now" ? "lit" : ""}`}>
                  <motion.i initial={{ width: 0 }} animate={{ width: inView || reduce ? `${Math.max((s.now / max) * 100, s.now ? 3 : 0)}%` : 0 }} transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease }} />
                  <span>{s.now} min</span>
                </div>
              </div>
              <p>{s.how}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="wf-total">
        <span>
          <b className="hand">About 1 h 40 min</b> by hand
        </span>
        <span className="wf-arrow" aria-hidden>
          →
        </span>
        <span>
          <b className="now">about 15 min</b> now, per new lease
        </span>
        <span className="wf-note">Rough estimates from each step's checklist, not a stopwatch.</span>
      </div>
    </div>
  );
}
