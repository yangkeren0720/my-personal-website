"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { featured } from "@/content/site";
import Collapse from "./Collapse";
import Reveal from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_MS = 6000;

// Featured project: tabs on the left, an animated mock of each screen on the right.
// The RBR platform tour, shown inside the RBR section.
export default function Showcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance only on wide screens; on phones the tab text wraps to
  // different heights, so tabs change only when tapped.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (paused || !wide) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % featured.features.length), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [active, paused, wide]);

  const current = featured.features[active];

  return (
    <div className="rbr-platform">
        <Reveal delay={0.1}>
          <p className="showcase-lead">
            <strong>{featured.tagline}.</strong> {featured.description}
          </p>
          <div className="tag-row">
            {featured.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="showcase" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="showcase-tabs" role="tablist">
            {featured.features.map((f, i) => (
              <button
                key={f.title}
                role="tab"
                aria-selected={i === active}
                className={`showcase-tab ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="showcase-tab-title">
                  <span className="showcase-tab-num">0{i + 1}</span>
                  {f.title}
                </span>
                <AnimatePresence initial={false}>
                  {i === active && (
                    <Collapse>
                      <p>{f.body}</p>
                    </Collapse>
                  )}
                </AnimatePresence>
                {i === active && (
                  <motion.span
                    key={`bar-${active}-${paused}`}
                    className="showcase-tab-bar"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused || !wide ? 0 : 1 }}
                    transition={{ duration: paused || !wide ? 0.2 : AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          <Reveal className="browser" delay={0.15}>
            <div className="browser-bar">
              <span className="dot r" />
              <span className="dot y" />
              <span className="dot g" />
              <span className="browser-url">rbrpmrealty.com/{current.screen === "admin" || current.screen === "lease" ? "admin" : current.screen}</span>
            </div>
            <div className="browser-body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.screen}
                  className="screen"
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 0.98 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <Screen kind={current.screen} />
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {featured.link && (
          <Reveal className="showcase-link">
            <a href={featured.link} target="_blank" rel="noreferrer" className="btn">
              Visit the live site <span aria-hidden>↗</span>
            </a>
          </Reveal>
        )}
    </div>
  );
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const item = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

// Stylized illustrations of each screen. These are drawings, not screenshots.
function Screen({ kind }: { kind: string }) {
  if (kind === "houses") {
    return (
      <motion.div className="mock mock-houses" variants={stagger} initial="initial" animate="animate">
        {["Maple House", "Cedar House", "Oak Court", "Willow Place"].map((h, i) => (
          <motion.div key={h} className="mock-house" variants={item}>
            <div className={`mock-img h${i}`} />
            <div className="mock-line w70" />
            <div className="mock-row">
              <span className="mock-chip ok">{4 - (i % 3)} rooms open</span>
              <span className="mock-line w30" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }
  if (kind === "apply") {
    const steps = ["Profile", "Room", "Documents", "Review"];
    return (
      <motion.div className="mock mock-apply" variants={stagger} initial="initial" animate="animate">
        <motion.div className="mock-steps" variants={item}>
          {steps.map((s, i) => (
            <span key={s} className={`mock-step ${i < 2 ? "done" : i === 2 ? "now" : ""}`}>
              {s}
            </span>
          ))}
        </motion.div>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="mock-field" variants={item}>
            <div className="mock-line w30" />
            <div className="mock-input" />
          </motion.div>
        ))}
        <motion.div className="mock-upload" variants={item}>
          <motion.div
            className="mock-upload-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
          />
          <span>passport.pdf</span>
        </motion.div>
        <motion.span className="mock-saved" variants={item}>
          ✓ Draft saved
        </motion.span>
      </motion.div>
    );
  }
  if (kind === "lease") {
    const flow = ["Application linked", "Rent agreed", "Lease generated", "Sent via DocuSign", "Signed → lease saved"];
    return (
      <motion.div className="mock mock-lease" variants={stagger} initial="initial" animate="animate">
        {flow.map((s, i) => (
          <motion.div key={s} className="mock-flow" variants={item}>
            <motion.span
              className="mock-flow-dot"
              initial={{ scale: 0.4, background: "rgba(var(--fg-rgb),0.15)" }}
              animate={{ scale: 1, background: "#ff9a62" }}
              transition={{ delay: 0.4 + i * 0.35, duration: 0.3 }}
            />
            <span>{s}</span>
            {i < flow.length - 1 && <span className="mock-flow-line" />}
          </motion.div>
        ))}
      </motion.div>
    );
  }
  // admin
  const rows = [
    [10, 70],
    [0, 55],
    [30, 60],
    [5, 90],
    [45, 50],
    [20, 65],
  ];
  return (
    <motion.div className="mock mock-admin" variants={stagger} initial="initial" animate="animate">
      <motion.div className="mock-side" variants={item}>
        {["Leases", "Calendar", "Properties", "Move-ins", "Emails"].map((l, i) => (
          <span key={l} className={i === 1 ? "on" : ""}>
            {l}
          </span>
        ))}
      </motion.div>
      <div className="mock-cal">
        {rows.map(([start, width], i) => (
          <motion.div key={i} className="mock-cal-row" variants={item}>
            <span className="mock-cal-room">BR{i + 1}</span>
            <div className="mock-cal-track">
              <motion.span
                className={`mock-cal-bar c${i % 3}`}
                style={{ left: `${start}%` }}
                initial={{ width: "0%" }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
