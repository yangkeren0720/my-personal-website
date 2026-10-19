"use client";

import type { ReactNode } from "react";
import Reveal from "./Reveal";
import Counter from "./Counter";

// The opening of each employer section: who, what role and when, what the
// company does, then the headline numbers for that job only.

type Kpi = { value: number; prefix?: string; suffix?: string; decimals?: number; label: string };

export default function CompanyHead({
  co,
  company,
  role,
  period,
  title,
  about,
  summary,
  kpis,
}: {
  co: "skywater" | "mino" | "belong" | "rbr";
  company: string;
  role: string;
  period: string;
  title: ReactNode;
  about?: string;
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
        {about && (
          <p className="co-about">
            <span>The company</span>
            {about}
          </p>
        )}
        <p className="co-summary">{summary}</p>
      </Reveal>
      {kpis && (
        <div className="co-kpis">
          {kpis.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.08} className="co-kpi">
              <strong>
                {k.prefix}
                <Counter to={k.value} suffix={k.suffix} decimals={k.decimals} />
              </strong>
              <span>{k.label}</span>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

// `built` adds a small pill for work Eva built herself (never in SkyWater).
export function SubHead({ id, built, children }: { id?: string; built?: string; children: ReactNode }) {
  return (
    <h3 className="sub-head" id={id}>
      {children}
      {built && <span className="built-badge">{built}</span>}
    </h3>
  );
}
