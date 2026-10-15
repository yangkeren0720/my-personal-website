"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Counter from "./Counter";
import Reveal from "./Reveal";

// RBR's whole lease lifecycle, from a visitor finding a room to rent
// collection and move-out. The counts come from the RBR platform's own code
// (Oct 2026): the automatic emails it sends, its Claude features, its three
// Claude robots that log in to the rent collection app, and the eight lease
// scenarios its Lease Flows settings page maps step by step.

const ease = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_MS = 5200;

type Audience = "applicant" | "tenant" | "office";
type Stage = {
  name: string;
  line: string;
  emails: [string, Audience][];
  claude: string[];
  robots: string[];
  rules: string[];
  note?: string;
};

const stages: Stage[] = [
  {
    name: "Find a room",
    line: "Visitors take the Room Match quiz and ask questions. Claude answers from public facts and drafts WhatsApp replies for us to approve.",
    emails: [
      ["Room Match results", "applicant"],
      ["New Room Match interest", "office"],
    ],
    claude: ["Answers quiz questions", "Drafts WhatsApp replies", "Learns from past chats", "Follows our reply playbook"],
    robots: [],
    rules: ["Room Match quiz finished"],
  },
  {
    name: "Apply",
    line: "An online application that saves and resumes. The office hears about it at once.",
    emails: [
      ["Link to finish a saved draft", "applicant"],
      ["Thank you for your application", "applicant"],
      ["New tenant application", "office"],
    ],
    claude: ["Tidies the interest list"],
    robots: [],
    rules: ["Application sent", "Application status changes"],
  },
  {
    name: "Lease",
    line: "The Lease Generator builds the lease from clause templates, the room's floor plan and the agreed rent and dates. The owner signs first, then the tenant.",
    emails: [],
    claude: ["Drafts lease changes and addenda"],
    robots: [],
    rules: [],
    note: "The e-signature service sends its own signing emails.",
  },
  {
    name: "Signed",
    line: "The signed lease is saved with its PDF, the room shows Filled, and the tenant gets everything they need.",
    emails: [
      ["Welcome + rent app guide + signed lease", "tenant"],
      ["Welcome email failed", "office"],
    ],
    claude: ["Reads signed lease PDFs", "Finds the sign dates"],
    robots: [],
    rules: ["Lease signed by everyone"],
  },
  {
    name: "Into the rent app",
    line: "A Claude robot logs in to the rent collection app, adds the tenant, the lease, rent from the start, the deposit invoice and the signed PDF, then double-checks every field.",
    emails: [
      ["Robot report after each run", "office"],
      ["Daily or weekly robot report", "office"],
      ["Robot signed out", "office"],
    ],
    claude: ["Drives the browser", "Follows our entry rules", "Learns from earlier leases"],
    robots: ["Signed leases robot"],
    rules: [],
  },
  {
    name: "Move-in",
    line: "An email with the door code, Wi-Fi, lock how-to and checklist. A robot requests the move-in inspection in the rent app.",
    emails: [["Move-in email", "tenant"]],
    claude: ["Drives the browser", "Follows our inspection rules", "Learns from earlier inspections"],
    robots: ["Move-in inspections robot"],
    rules: ["Lease start (move-in)"],
  },
  {
    name: "Collect rent",
    line: "The rent app bills every month and tenants pay online. Renewals carry the deposit over, and a rent that stops mid-month is prorated before the invoice goes out.",
    emails: [],
    claude: ["Drives the browser", "Follows our proration rules", "Learns from earlier last months"],
    robots: ["Last-month rent robot", "Signed leases robot (renewals)"],
    rules: ["Every week", "Every month"],
  },
  {
    name: "Move-out",
    line: "An early move-out moves the end date. A cancelled lease is deleted or ended depending on the deposit. Deposits due back are reported every Monday.",
    emails: [["Weekly deposit refund report", "office"]],
    claude: [],
    robots: ["Signed leases robot (end dates)", "Last-month rent robot (lost discount)"],
    rules: ["Lease end (move-out)", "Deposit not refunded"],
    note: "The same robots and Claude features as above.",
  },
];

const audienceLabel: Record<Audience, string> = { applicant: "To applicant", tenant: "To tenant", office: "To office" };

type Lane = "me" | "site" | "robot";
const laneLabel: Record<Lane, string> = { me: "Me", site: "Website", robot: "Claude robot" };

type Scenario = { name: string; steps: [Lane, string][]; extra?: ReactNode };

const scenarios: Scenario[] = [
  {
    name: "New lease",
    steps: [
      ["me", "Build the lease and send it to sign"],
      ["site", "Owner signs, then the tenant"],
      ["site", "Saves the lease and PDF; welcome email"],
      ["robot", "Adds tenant, lease, rent, deposit and PDF"],
      ["site", "Move-in email: code, Wi-Fi, checklist"],
      ["robot", "Requests the move-in inspection"],
      ["me", "Only if a robot gets stuck"],
    ],
  },
  {
    name: "Renewal",
    steps: [
      ["me", "Press Renew, check it, send it"],
      ["site", "Deposit carries over"],
      ["site", "Second lease saved, no welcome email"],
      ["robot", "Renews the lease in the rent app"],
      ["site", "Notes the deposit carried over"],
      ["me", "Only if the robot can't renew"],
    ],
  },
  {
    name: "Switch room, new lease",
    steps: [
      ["me", "Pick the new room, dates and rent"],
      ["me", "Answer any overlap, one at a time"],
      ["site", "Frees the room, carries the deposit"],
      ["me", "Check and send the new lease"],
      ["site", "New room shows Pending Lease"],
      ["site", "Old lease ends the day before"],
      ["robot", "Moves the tenant into the new unit"],
      ["robot", "Extends or cancels the old leases"],
      ["robot", "Charges a lost discount, if chosen"],
      ["robot", "Prorates the old lease's last month"],
      ["robot", "Ends the old lease the day before"],
      ["site", "Move-in email and inspection again"],
    ],
  },
  {
    name: "Switch room, just move",
    steps: [
      ["me", "Pick the new room and the date"],
      ["me", "Answer overlaps and discounts"],
      ["site", "Same lease carries on in the new room"],
      ["me", "Move the unit in the rent app"],
      ["robot", "Nothing to add"],
    ],
  },
  {
    name: "Move out early",
    steps: [
      ["me", "Enter the last day"],
      ["me", "Charge a lost discount, or not"],
      ["site", "Ends the lease, reopens the room"],
      ["robot", "Cancels any later lease"],
      ["robot", "Adds the discount difference"],
      ["robot", "Prorates the last month"],
      ["robot", "Moves the end date"],
      ["me", "Return the deposit"],
    ],
  },
  {
    name: "Last month's rent",
    steps: [
      ["site", "Works out the prorated rent"],
      ["robot", "Before the invoice: one-time charges"],
      ["robot", "Invoice out, unpaid: lowers it"],
      ["me", "Already paid: refund or deduct"],
    ],
    extra: (
      <div className="fx ltr-fx">
        <span className="fx-name">Last month's rent</span>
        <div className="fx-expr">
          Rent = Monthly rent × <span className="fx-frac"><span>Days lived</span><span>Days in month</span></span>
        </div>
        <div className="fx-line">
          $900 × 18 ÷ 31 = <b>$522.58</b> <span className="ltr-sample">sample</span>
        </div>
      </div>
    ),
  },
  {
    name: "Void or cancel",
    steps: [
      ["me", "Void an unsigned lease, with a reason"],
      ["site", "Applicant and room go back"],
      ["robot", "Nothing to undo"],
      ["me", "Cancel a signed lease, with a reason"],
      ["site", "Frees the room; Undo kept"],
      ["robot", "Deletes it, or ends it"],
    ],
    extra: (
      <div className="ltr-decide">
        <span>In the rent app, the robot checks the deposit:</span>
        <span className="ltr-branch">
          <b>Not paid</b> → delete the lease
        </span>
        <span className="ltr-branch">
          <b>Paid</b> → end it on the cancel day
        </span>
        <span className="ltr-branch">
          <b>Unclear</b> → change nothing, ask me
        </span>
      </div>
    ),
  },
  {
    name: "Whole house",
    steps: [
      ["me", "Set the whole-house rent and options"],
      ["site", "One lease; every room moves together"],
      ["site", "Emails adjust: tenants set up utilities"],
      ["robot", "Moves in on the house's unit"],
      ["robot", "Inspects every room"],
      ["robot", "Last month works the same"],
    ],
  },
];

const allSteps = scenarios.flatMap((s) => s.steps);
const laneCount = (lane: Lane) => allSteps.filter(([l]) => l === lane).length;

const robots = [
  {
    name: "Signed leases robot",
    jobs: ["Adds new leases with the signed PDF", "Renews leases, deposit carried over", "Moves tenants for room switches", "Changes end dates; ends or deletes cancelled leases"],
  },
  {
    name: "Move-in inspections robot",
    jobs: ["Requests each move-in inspection", "Whole-house inspections, every room"],
  },
  {
    name: "Last-month rent robot",
    jobs: ["Prorates a last month that stops mid-month", "Lowers an unpaid invoice, or asks before a refund", "Adds a lost long-term discount as one charge"],
  },
];

const guards = [
  "Claude never sees the password",
  "Can only open the rent app",
  "Saves only through one guarded step",
  "Practice mode first, then Live",
  "Double-checks every save, field by field",
  "Anything that doesn't match: stop and ask",
];

function Icon({ kind }: { kind: "mail" | "spark" | "robot" | "rule" }) {
  const p = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (kind === "mail")
    return (
      <svg {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  if (kind === "spark")
    return (
      <svg {...p}>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
      </svg>
    );
  if (kind === "robot")
    return (
      <svg {...p}>
        <rect x="4" y="8" width="16" height="12" rx="3" />
        <path d="M12 4v4M9 13h.01M15 13h.01M9 17h6" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M12 8v4l3 2" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export default function LeaseToRent() {
  return (
    <div className="ltr viz-root co-rbr">
      <div className="ltr-kpis">
        {[
          [8, "lease scenarios, mapped step by step"],
          [12, "automatic emails along the way"],
          [18, "Claude API features at work"],
          [3, "Claude robots that log in to the rent app"],
        ].map(([n, label], i) => (
          <Reveal key={label as string} delay={i * 0.08} className="co-kpi">
            <strong>
              <Counter to={n as number} />
            </strong>
            <span>{label}</span>
          </Reveal>
        ))}
      </div>
      <StepSplit />
      <Track />
      <Scenarios />
      <Robots />
    </div>
  );
}

// 54 steps across the eight scenarios, by who does them.
function StepSplit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const total = allSteps.length;
  const parts: [Lane, number][] = [
    ["robot", laneCount("robot")],
    ["site", laneCount("site")],
    ["me", laneCount("me")],
  ];
  return (
    <div className="ltr-split" ref={ref}>
      <div className="ltr-split-head">
        <strong>{total} steps</strong> across the eight scenarios, by who does them
      </div>
      <div className="ltr-split-bar" role="img" aria-label={parts.map(([l, n]) => `${laneLabel[l]}: ${n}`).join(", ")}>
        {parts.map(([lane, n], i) => (
          <motion.span
            key={lane}
            className={`lane-${lane}`}
            initial={{ width: "0%" }}
            animate={{ width: inView ? `${(n / total) * 100}%` : "0%" }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.25, ease }}
          />
        ))}
      </div>
      <div className="ltr-split-legend">
        {parts.map(([lane, n]) => (
          <span key={lane}>
            <i className={`lane-dot lane-${lane}`} /> {laneLabel[lane]} <b>{n}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

// The lifecycle, one stage at a time; it plays through by itself on wide screens.
function Track() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [hover, setHover] = useState(false);
  const [wide, setWide] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px 0px -120px 0px" });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const playing = wide && inView && !held && !hover;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % stages.length), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [active, playing]);

  const s = stages[active];
  return (
    <div className="ltr-track-wrap" ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="ltr-track" role="tablist" aria-label="From finding a room to move-out">
        <div className="ltr-rail" aria-hidden="true">
          <motion.div className="ltr-rail-fill" animate={{ scaleX: active / (stages.length - 1) }} transition={{ duration: 0.6, ease }} />
        </div>
        {stages.map((st, i) => (
          <button
            key={st.name}
            role="tab"
            aria-selected={i === active}
            aria-controls="ltr-stage-panel"
            className={`ltr-stop ${i === active ? "on" : ""} ${i < active ? "past" : ""}`}
            onClick={() => {
              setActive(i);
              setHeld(true);
            }}
          >
            <span className="ltr-node">{i + 1}</span>
            <span className="ltr-stop-name">{st.name}</span>
            <span className="ltr-badges" aria-hidden="true">
              {st.emails.length > 0 && (
                <span>
                  <Icon kind="mail" />
                  {st.emails.length}
                </span>
              )}
              {st.claude.length > 0 && (
                <span>
                  <Icon kind="spark" />
                  {st.claude.length}
                </span>
              )}
              {st.robots.length > 0 && (
                <span>
                  <Icon kind="robot" />
                </span>
              )}
            </span>
            {i === active && playing && (
              <motion.span className="ltr-timer" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }} />
            )}
          </button>
        ))}
      </div>

      <div className="ltr-panel" id="ltr-stage-panel" role="tabpanel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
            <div className="ltr-panel-head">
              <span className="ltr-panel-num">{String(active + 1).padStart(2, "0")}</span>
              <div>
                <h4>{s.name}</h4>
                <p>{s.line}</p>
              </div>
            </div>
            <div className="ltr-cols">
              <Col icon="mail" title={`Automatic emails · ${s.emails.length}`} empty={s.note && s.emails.length === 0 ? s.note : "None at this step"}>
                {s.emails.map(([name, to], i) => (
                  <motion.li key={name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
                    <span>{name}</span>
                    <em className={`aud aud-${to}`}>{audienceLabel[to]}</em>
                  </motion.li>
                ))}
              </Col>
              <Col icon="spark" title={`Claude API features · ${s.claude.length}`} empty={s.note && s.claude.length === 0 ? s.note : "None at this step"}>
                {s.claude.map((c, i) => (
                  <motion.li key={c} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }}>
                    <span>{c}</span>
                  </motion.li>
                ))}
              </Col>
              <Col icon="robot" title="Claude robots in the rent app" empty="None at this step">
                {s.robots.map((r, i) => (
                  <motion.li key={r} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.08 }}>
                    <span>{r}</span>
                  </motion.li>
                ))}
              </Col>
            </div>
            {s.rules.length > 0 && (
              <div className="ltr-rules">
                <Icon kind="rule" /> My own email rules can also fire on: {s.rules.map((r) => <span key={r}>{r}</span>)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="ltr-foot">Plus one Claude feature across all of it: ask the business a question and get the answer from live data.</p>
    </div>
  );
}

function Col({ icon, title, empty, children }: { icon: "mail" | "spark" | "robot"; title: string; empty: string; children: ReactNode[] }) {
  return (
    <div className="ltr-col">
      <div className="ltr-col-title">
        <Icon kind={icon} /> {title}
      </div>
      {children.length > 0 ? <ul>{children}</ul> : <p className="ltr-none">{empty}</p>}
    </div>
  );
}

// Each lease scenario as three lanes: what I do, what the website does, what the robots do.
function Scenarios() {
  const [pick, setPick] = useState(0);
  const sc = scenarios[pick];
  return (
    <div className="ltr-scen">
      <div className="ltr-scen-head">
        <h4>8 lease scenarios, step by step</h4>
        <p>Pick one to see who does each step.</p>
      </div>
      <div className="ltr-tabs" role="tablist" aria-label="Lease scenarios">
        {scenarios.map((s, i) => (
          <button key={s.name} role="tab" aria-selected={i === pick} className={i === pick ? "on" : ""} onClick={() => setPick(i)}>
            {s.name} <em>{s.steps.length}</em>
          </button>
        ))}
      </div>
      <div className="ltr-lanes" role="tabpanel" aria-label={sc.name}>
        {(["me", "site", "robot"] as Lane[]).map((lane, li) => (
          <div key={lane} className={`ltr-lane-head lane-${lane}`} style={{ gridColumn: li + 1 }}>
            <i className={`lane-dot lane-${lane}`} /> {laneLabel[lane]}
          </div>
        ))}
        {sc.steps.map(([lane, text], i) => (
            <motion.div
              key={`${pick}-${i}`}
              className={`ltr-step lane-${lane}`}
              style={{ gridRow: i + 2, gridColumn: { me: 1, site: 2, robot: 3 }[lane] }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3, ease }}
            >
              <span className="ltr-step-n">{i + 1}</span>
              <span className="ltr-step-body">
                <span className="ltr-step-lane">{laneLabel[lane]}</span>
                <span className="ltr-step-text">{text}</span>
              </span>
            </motion.div>
          ))}
      </div>
      {sc.extra && (
        <motion.div key={pick} className="ltr-extra" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {sc.extra}
        </motion.div>
      )}
    </div>
  );
}

function Robots() {
  return (
    <div className="ltr-robots">
      <div className="ltr-scen-head">
        <h4>3 Claude robots in the rent collection app</h4>
        <p>The app has no API, so Claude drives a browser. They check at 9 AM and 3 PM, and right after a lease is signed.</p>
      </div>
      <div className="ltr-robot-grid">
        {robots.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.08} className="ltr-robot">
            <div className="ltr-robot-top">
              <span className="ltr-robot-icon">
                <Icon kind="robot" />
              </span>
              <strong>{r.name}</strong>
            </div>
            <ul>
              {r.jobs.map((j) => (
                <li key={j}>{j}</li>
              ))}
            </ul>
            <div className="ltr-modes">
              Switch: <span>Off</span> → <span>Practice</span> → <span>Live</span>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="ltr-runs">
        <strong>10 kinds of runs:</strong> 5 that change records, and 5 read-only ones: a double-check after every save, a look-up, and 3 learning runs that study our earlier records.
      </div>
      <div className="ltr-guards">
        {guards.map((g, i) => (
          <Reveal key={g} delay={i * 0.05} className="ai-guard-item">
            ✓ {g}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
