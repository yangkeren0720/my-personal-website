"use client";

import { about, stats, statsNote } from "@/content/site";
import Reveal from "./Reveal";
import Counter from "./Counter";
import PlaceholderBadge from "./PlaceholderBadge";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <Reveal>
          <span className="eyebrow">About</span>
          <h2 className="section-title">
            Supply chain thinking, <em>applied</em> to a real business.
          </h2>
        </Reveal>

        <div className="about-grid">
          <div className="about-text">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <div className="about-facts">
            {about.facts.map((f, i) => (
              <Reveal key={f.label} delay={0.1 + i * 0.08} y={20}>
                <div className={`fact ${f.placeholder ? "placeholder" : ""}`}>
                  <span className="fact-label">
                    {f.label}
                    <PlaceholderBadge show={f.placeholder} />
                  </span>
                  <span className="fact-value">{f.value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="stat card">
              <span className="stat-value grad-text">
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
        <p className="stats-note">{statsNote}</p>

      </div>
    </section>
  );
}
