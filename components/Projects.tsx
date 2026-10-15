"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { projects, type Project } from "@/content/site";
import Reveal from "./Reveal";
import PlaceholderBadge from "./PlaceholderBadge";

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">More projects</span>
          <h2 className="section-title">
            Other things I&apos;ve <em>made</em>.
          </h2>
        </Reveal>
        <div className="projects">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <TiltCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Card that tilts toward the pointer and lights up where it is hovered.
function TiltCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glow = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(320px circle at ${x} ${y}, ${project.accent}22, transparent 60%)`
  );

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const href = project.link || project.repo;

  return (
    <motion.div
      ref={ref}
      className={`project card ${project.placeholder ? "placeholder" : ""}`}
      style={{ rotateX, rotateY, transformPerspective: 900, ["--accent-local" as string]: project.accent }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div className="project-glow" style={{ background: glow }} />
      <span className="project-tagline">
        {project.tagline}
        <PlaceholderBadge show={project.placeholder} />
      </span>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="tag-row">
        {project.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      {href && (
        <a href={href} target="_blank" rel="noreferrer" className="project-link">
          {project.link ? "Visit" : "Source"} <span aria-hidden>↗</span>
        </a>
      )}
    </motion.div>
  );
}
