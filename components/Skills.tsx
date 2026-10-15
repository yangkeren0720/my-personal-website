"use client";

import { skills } from "@/content/site";
import Reveal from "./Reveal";

export default function Skills() {
  const half = Math.ceil(skills.length / 2);
  const rows = [skills.slice(0, half), skills.slice(half)];

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Toolbox</span>
          <h2 className="section-title">
            What I <em>work</em> with.
          </h2>
        </Reveal>
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className={`marquee ${ri % 2 ? "reverse" : ""}`}>
          <div className="marquee-track">
            {/* Repeated so the loop is seamless */}
            {[...row, ...row, ...row, ...row].map((s, i) => (
              <span key={i} className="marquee-item">
                {s}
                <span className="marquee-sep" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
