"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";

// How Eva runs three roles at once: routine tasks from each role flow to
// automations and AI agents, and only the judgment calls reach her.
// The task stream is a sample week for illustration; the automations listed
// under it are the real ones.

const ease = [0.22, 1, 0.36, 1] as const;

type RoleKey = "skywater" | "belong" | "rbr";
const roles: { key: RoleKey; company: string; role: string; load: string; y: number }[] = [
  { key: "skywater", company: "SkyWater", role: "Material Planner", load: "Full-time", y: 17 },
  { key: "belong", company: "Belong", role: "Manager", load: "Part-time", y: 50 },
  { key: "rbr", company: "RBR", role: "Co-Owner", load: "Side business", y: 83 },
];
const roleY = Object.fromEntries(roles.map((r) => [r.key, r.y])) as Record<RoleKey, number>;

// auto: handled by an automation or AI agent; me: a decision Eva makes.
const tasks: { role: RoleKey; label: string; auto: boolean }[] = [
  { role: "skywater", label: "Weekly supply-risk check", auto: true },
  { role: "rbr", label: "Tenant reply draft", auto: true },
  { role: "belong", label: "Vendor quote decision", auto: false },
  { role: "skywater", label: "Run-out date update", auto: true },
  { role: "rbr", label: "Lease entry in vendor tool", auto: true },
  { role: "skywater", label: "Supplier escalation", auto: false },
  { role: "belong", label: "ERP design review", auto: false },
  { role: "rbr", label: "Lease PDF to record", auto: true },
  { role: "skywater", label: "MRP order release", auto: true },
  { role: "rbr", label: "Room availability question", auto: true },
  { role: "belong", label: "Hiring decision", auto: false },
  { role: "skywater", label: "Shortage report refresh", auto: true },
  { role: "rbr", label: "Pricing decision", auto: false },
  { role: "skywater", label: "End-of-life buy call", auto: false },
];

const AUTO_Y = 27;
const ME_Y = 73;
const SPAWN_MS = 850;
const TRAVEL_S = 2.6;

type Token = { id: number; t: number; toMe: boolean };

export default function Multitask() {
  return (
    <section id="multitask" className="multitask">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Multitasking, by automation</span>
          <h2 className="section-title">
            Three roles. <em>One</em> week.
          </h2>
          <p className="mt-lede">I hand the routine work to automations and AI agents, and keep the judgment calls for myself.</p>
        </Reveal>
        <Reveal>
          <Router />
        </Reveal>
        <Automations />
      </div>
    </section>
  );
}

function Router() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px 0px -80px 0px" });
  const [mode, setMode] = useState<"hand" | "auto">("auto");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [counts, setCounts] = useState({ auto: 0, me: 0 });
  const next = useRef(0);
  const uid = useRef(0);

  // Reset the tallies whenever the mode changes so each view tells its own story.
  useEffect(() => {
    setCounts({ auto: 0, me: 0 });
    setTokens([]);
  }, [mode]);

  useEffect(() => {
    if (!inView) return;
    const spawn = () => {
      const t = next.current % tasks.length;
      next.current += 1;
      uid.current += 1;
      const toMe = mode === "hand" || !tasks[t].auto;
      setTokens((list) => [...list.slice(-10), { id: uid.current, t, toMe }]);
    };
    spawn();
    const iv = setInterval(spawn, SPAWN_MS);
    return () => clearInterval(iv);
  }, [inView, mode]);

  const arrive = (tok: Token) => {
    setTokens((list) => list.filter((x) => x.id !== tok.id));
    setCounts((c) => (tok.toMe ? { ...c, me: c.me + 1 } : { ...c, auto: c.auto + 1 }));
  };

  const total = counts.auto + counts.me;
  const meShare = total ? Math.round((counts.me / total) * 100) : mode === "hand" ? 100 : 0;
  const overloaded = mode === "hand";

  return (
    <div className="mt-router card viz-root" ref={ref}>
      <div className="mt-top">
        <div className="mt-toggle" role="tablist" aria-label="Show the week">
          {(
            [
              ["hand", "All by hand"],
              ["auto", "With automation"],
            ] as const
          ).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={mode === k} className={mode === k ? "on" : ""} onClick={() => setMode(k)}>
              {mode === k && <motion.span layoutId="mt-pill" className="mt-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className={`mt-gauge ${overloaded ? "bad" : "ok"}`}>
          <span className="mt-gauge-label">Tasks landing on me</span>
          <span className="mt-gauge-track">
            <motion.span className="mt-gauge-fill" animate={{ width: `${meShare}%` }} transition={{ duration: 0.5, ease }} />
          </span>
          <strong>{meShare}%</strong>
          <span className="mt-gauge-state">{overloaded ? "⚠ Overloaded" : "✓ Focused on decisions"}</span>
        </div>
      </div>

      <div className="mt-stage">
        <svg className="mt-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {roles.map((r) =>
            [AUTO_Y, ME_Y].map((dy) => (
              <path
                key={r.key + dy}
                d={`M26,${r.y} C50,${r.y} 50,${dy} 74,${dy}`}
                className={`mt-path ${dy === AUTO_Y && overloaded ? "off" : ""}`}
                vectorEffect="non-scaling-stroke"
              />
            ))
          )}
        </svg>

        {roles.map((r) => (
          <div key={r.key} className={`mt-role co-${r.key}`} style={{ top: `${r.y}%` }}>
            <strong>{r.company}</strong>
            <span>{r.role}</span>
            <em>{r.load}</em>
          </div>
        ))}

        <div className={`mt-dest mt-dest-auto ${overloaded ? "idle" : ""}`} style={{ top: `${AUTO_Y}%` }}>
          <span className="mt-dest-icon" aria-hidden>
            ⚙
          </span>
          <div>
            <strong>Automations &amp; AI agents</strong>
            <span>
              <b>{counts.auto}</b> handled{overloaded ? " · switched off" : ""}
            </span>
          </div>
        </div>
        <div className={`mt-dest mt-dest-me ${overloaded ? "busy" : ""}`} style={{ top: `${ME_Y}%` }}>
          <span className="mt-dest-icon" aria-hidden>
            ✦
          </span>
          <div>
            <strong>Me</strong>
            <span>
              <b>{counts.me}</b> {overloaded ? (counts.me === 1 ? "task, every one" : "tasks, every one") : counts.me === 1 ? "judgment call" : "judgment calls"}
            </span>
          </div>
        </div>

        {tokens.map((tok) => {
            const task = tasks[tok.t];
            const ry = roleY[task.role];
            const dy = tok.toMe ? ME_Y : AUTO_Y;
            return (
              <motion.div
                key={tok.id}
                className={`mt-token co-${task.role} ${tok.toMe ? "me" : "auto"}`}
                initial={{ left: "26%", top: `${ry}%`, opacity: 0 }}
                animate={{ left: ["26%", "50%", "74%"], top: [`${ry}%`, `${(ry + dy) / 2}%`, `${dy}%`], opacity: [0, 1, 1, 0] }}
                transition={{ duration: TRAVEL_S, ease: "easeInOut", times: [0, 0.5, 1], opacity: { duration: TRAVEL_S, times: [0, 0.12, 0.88, 1] } }}
                onAnimationComplete={() => arrive(tok)}
              >
                <span className="mt-token-in">{task.label}</span>
              </motion.div>
            );
          })}
      </div>
      <p className="mt-note">Sample week for illustration. The automations below are real.</p>
    </div>
  );
}

const automations: { key: RoleKey; company: string; role: string; items: { text: string; state: "Live" | "In build" }[] }[] = [
  {
    key: "skywater",
    company: "SkyWater",
    role: "Material Planner · full-time",
    items: [
      { text: "Weekly weeks-of-supply risk dashboard for S&OP", state: "Live" },
      { text: "Depletion model that recalculates run-out dates", state: "Live" },
      { text: "MRP auto-release in place of manual orders", state: "Live" },
      { text: "Shortage-risk report that now catches new items", state: "Live" },
    ],
  },
  {
    key: "belong",
    company: "Belong",
    role: "Manager · part-time",
    items: [
      { text: "Odoo ERP for purchasing, inventory and approvals", state: "In build" },
      { text: "Price-change alerts and clear approval paths", state: "In build" },
    ],
  },
  {
    key: "rbr",
    company: "RBR",
    role: "Co-Owner · side business",
    items: [
      { text: "AI drafts tenant replies; a person approves each one", state: "Live" },
      { text: "AI agents enter leases in a vendor tool with no API", state: "Live" },
      { text: "Signed lease PDFs read into records, no retyping", state: "Live" },
      { text: "Plain-English questions answered from live data", state: "Live" },
    ],
  },
];

function Automations() {
  return (
    <>
      <div className="mt-autos">
        {automations.map((a, ai) => (
          <Reveal key={a.key} delay={ai * 0.08} className={`mt-auto card co-${a.key}`}>
            <div className="mt-auto-head">
              <strong>{a.company}</strong>
              <span>{a.role}</span>
            </div>
            <ul>
              {a.items.map((it, n) => (
                <motion.li key={it.text} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + n * 0.1 }}>
                  <span className={`mt-state ${it.state === "Live" ? "live" : "build"}`}>
                    <i aria-hidden />
                    {it.state}
                  </span>
                  {it.text}
                </motion.li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <p className="mt-foot">
        I&apos;ve worked this way at every job. At Mino, a Power Automate approval workflow I built cut missed invoices 50% and stayed in use after I left.
      </p>
    </>
  );
}
