"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const demos = [
  { key: "chat", label: "Customer replies", caption: "AI drafts, a person approves" },
  { key: "doc", label: "Contract reading", caption: "PDF in, structured record out" },
  { key: "agent", label: "Vendor data entry", caption: "An agent fills a system with no API" },
  { key: "ask", label: "Ask the data", caption: "Plain-English questions, live answers" },
] as const;

type Key = (typeof demos)[number]["key"];
const CYCLE_MS = 7000;

// Four looping mini-demos of how AI is used in the work. Fictional data.
export default function AIDemos() {
  const [active, setActive] = useState<Key>("chat");
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px" });
  const tabsRef = useRef<HTMLDivElement>(null);

  // On phones the tabs scroll sideways; keep the active one visible.
  useEffect(() => {
    const row = tabsRef.current;
    const btn = row?.querySelector<HTMLButtonElement>("button.on");
    if (row && btn && row.scrollWidth > row.clientWidth) row.scrollTo({ left: btn.offsetLeft - row.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    if (!auto || !inView) return;
    const t = setTimeout(() => {
      const i = demos.findIndex((d) => d.key === active);
      setActive(demos[(i + 1) % demos.length].key);
    }, CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, auto, inView]);

  return (
    <div className="aid" ref={ref}>
      <div className="aid-tabs" role="tablist" ref={tabsRef}>
        {demos.map((d) => (
          <button
            key={d.key}
            role="tab"
            aria-selected={active === d.key}
            className={active === d.key ? "on" : ""}
            onClick={() => {
              setActive(d.key);
              setAuto(false);
            }}
          >
            <span className="aid-tab-label">{d.label}</span>
            <span className="aid-tab-cap">{d.caption}</span>
            {active === d.key && auto && (
              <motion.span key={active} className="aid-tab-bar" initial={{ scaleX: 0 }} animate={{ scaleX: inView ? 1 : 0 }} transition={{ duration: CYCLE_MS / 1000, ease: "linear" }} />
            )}
          </button>
        ))}
      </div>
      <div className="aid-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="aid-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease }}
          >
            {inView && active === "chat" && <ChatDemo />}
            {inView && active === "doc" && <DocDemo />}
            {inView && active === "agent" && <AgentDemo />}
            {inView && active === "ask" && <AskDemo />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Steps through a timeline once: returns how many steps have happened.
function useSteps(times: number[]) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const timers = times.map((t, i) => setTimeout(() => setN(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [times]);
  return n;
}

const pop = { initial: { opacity: 0, y: 10, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.35, ease } };

const chatTimes = [300, 1300, 2600, 4300, 5200];
function ChatDemo() {
  const n = useSteps(chatTimes);
  return (
    <div className="demo-chat">
      {n >= 1 && (
        <motion.div className="bubble in" {...pop}>
          Hi! Any rooms near campus for spring? Budget around $900.
        </motion.div>
      )}
      {n >= 2 && n < 3 && (
        <motion.div className="demo-thinking" {...pop}>
          <span className="spark">✦</span> Reading 3 similar past chats and live availability…
        </motion.div>
      )}
      {n >= 3 && (
        <motion.div className="bubble out draft" {...pop}>
          <span className="bubble-label">AI draft</span>
          Yes! Oak House has 2 rooms open for spring at $875 and $920, a 6-minute walk to campus. Want the floor plans?
        </motion.div>
      )}
      {n >= 3 && (
        <motion.div className="demo-actions" {...pop}>
          <span className={`demo-btn ${n >= 4 ? "pressed" : ""}`}>{n >= 5 ? "Sent ✓" : "Approve & send"}</span>
          <span className="demo-btn ghost">Edit</span>
        </motion.div>
      )}
    </div>
  );
}

const docFields = [
  ["Tenant", "Jordan Lee"],
  ["Property", "Oak House · Room 3"],
  ["Lease start", "Jan 10, 2027"],
  ["Lease end", "May 20, 2027"],
  ["Monthly rent", "$875"],
  ["Signed on", "Nov 2, 2026"],
];
const docTimes = [600, 1200, 1800, 2400, 3000, 3600, 4400];
function DocDemo() {
  const n = useSteps(docTimes);
  return (
    <div className="demo-doc">
      <div className="doc-page">
        <div className="doc-title">RESIDENTIAL LEASE AGREEMENT</div>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="doc-line" style={{ width: `${60 + ((i * 37) % 40)}%` }} />
        ))}
        <div className="doc-sign">signed</div>
        <motion.div className="doc-scan" initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: 3.6, ease: "linear", delay: 0.4 }} />
      </div>
      <div className="doc-arrow">→</div>
      <div className="doc-fields">
        {docFields.map(([k, v], i) => (
          <div key={k} className="doc-field">
            <span className="doc-k">{k}</span>
            <AnimatePresence>
              {n > i && (
                <motion.span className="doc-v" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                  {v}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
        {n >= 7 && (
          <motion.div className="doc-done" {...pop}>
            ✓ Record created, no retyping
          </motion.div>
        )}
      </div>
    </div>
  );
}

const agentFields = [
  ["Tenant", "Jordan Lee"],
  ["Unit", "Oak · BR3"],
  ["Inspection", "Move-in"],
  ["Due date", "Jan 10, 2027"],
];
function AgentDemo() {
  const [typed, setTyped] = useState(0); // characters typed across all fields
  const total = agentFields.reduce((a, [, v]) => a + v.length, 0);
  useEffect(() => {
    if (typed >= total + 12) return;
    const t = setTimeout(() => setTyped((c) => c + 1), 55);
    return () => clearTimeout(t);
  }, [typed, total]);

  let left = typed;
  const values = agentFields.map(([, v]) => {
    const take = Math.max(0, Math.min(v.length, left));
    left -= v.length;
    return v.slice(0, take);
  });
  const activeField = values.findIndex((v, i) => v.length < agentFields[i][1].length);
  const done = typed >= total;
  const sent = typed >= total + 10;

  return (
    <div className="demo-agent">
      <div className="agent-window">
        <div className="agent-bar">
          <span>vendor-portal.example.com</span>
          <span className="agent-badge">Practice mode</span>
        </div>
        <div className="agent-form">
          {agentFields.map(([k], i) => (
            <label key={k} className={`agent-field ${activeField === i ? "active" : ""}`}>
              <span>{k}</span>
              <span className="agent-input">
                {values[i]}
                {activeField === i && <span className="caret" />}
              </span>
            </label>
          ))}
          <span className={`demo-btn ${done ? "pressed" : ""}`}>{done ? "Checked, ready to send" : "Request inspection"}</span>
        </div>
      </div>
      <div className="agent-log">
        <div className="agent-log-row">✦ Read the office&apos;s written rules</div>
        {typed > 0 && <div className="agent-log-row">✦ Filling the request in the vendor portal</div>}
        {done && (
          <motion.div className="agent-log-row" {...pop}>
            ✦ Practice run: stopped before the final send
          </motion.div>
        )}
        {sent && (
          <motion.div className="agent-log-row ok" {...pop}>
            ✓ Report emailed to the office
          </motion.div>
        )}
      </div>
    </div>
  );
}

const askQ = "How many rooms are still open for spring, by house?";
const askData = [
  ["Oak", 5],
  ["Birch", 3],
  ["Maple", 2],
  ["Willow", 2],
  ["Cedar", 1],
  ["Aspen", 1],
] as const;
function AskDemo() {
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (typed >= askQ.length + 20) return;
    const t = setTimeout(() => setTyped((c) => c + 1), 35);
    return () => clearTimeout(t);
  }, [typed]);
  const answered = typed >= askQ.length + 8;
  return (
    <div className="demo-ask">
      <div className="ask-input">
        <span className="spark">✦</span>
        {askQ.slice(0, typed)}
        {typed < askQ.length && <span className="caret" />}
      </div>
      {answered && (
        <motion.div className="ask-answer" {...pop}>
          <p>
            <strong>14 rooms</strong> are open for spring. Oak has the most.
          </p>
          <div className="ask-bars">
            {askData.map(([h, v], i) => (
              <div key={h} className="ask-bar-row">
                <span>{h}</span>
                <span className="ask-track">
                  <motion.span
                    className={`ask-fill ${i === 0 ? "hl" : ""}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(v / 5) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease }}
                  />
                </span>
                <span className="ask-v">{v}</span>
              </div>
            ))}
          </div>
          <span className="ask-src">From live data · read-only query</span>
        </motion.div>
      )}
    </div>
  );
}
