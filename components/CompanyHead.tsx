"use client";

import type { ReactNode } from "react";
import Reveal from "./Reveal";
import Counter from "./Counter";

// The opening of each employer section: who, what role and when, then the
// headline numbers for that job only.

type Kpi = { value: number; prefix?: string; suffix?: string; label: string };

export default function CompanyHead({
  co,
  company,
  role,
  period,
  title,
  summary,
  kpis,
}: {
  co: "skywater" | "mino" | "belong" | "rbr";
  company: string;
  role: string;
  period: string;
  title: ReactNode;
  summary: string;
  kpis?: Kpi[];
}) {
  return (
    <div className={`co-head co-${co}`}>
      <Reveal>
        <div className="co-badge">
          <strong>{company}</strong>
          <span>
            {role} · {period}
          </span>
        </div>
        <h2 className="section-title">{title}</h2>
        <p className="co-summary">{summary}</p>
      </Reveal>
      {kpis && (
        <div className="co-kpis">
          {kpis.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.08} className="co-kpi">
              <strong>
                {k.prefix}
                <Counter to={k.value} suffix={k.suffix} />
              </strong>
              <span>{k.label}</span>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

export function SubHead({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 className="sub-head" id={id}>
      {children}
    </h3>
  );
}
