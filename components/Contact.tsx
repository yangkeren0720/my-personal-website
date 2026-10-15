"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { profile } from "@/content/site";
import Reveal from "./Reveal";

export default function Contact() {
  const links = [
    profile.email && { label: "Email", href: `mailto:${profile.email}` },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.github && { label: "GitHub", href: profile.github },
    profile.resumeUrl && { label: "Résumé", href: profile.resumeUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  const primary = links[0];

  return (
    <section id="contact" className="contact">
      <div className="contact-glow" aria-hidden />
      <div className="container contact-inner">
        <Reveal>
          <span className="eyebrow">Contact</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="contact-title">
            Hiring for supply chain
            <br />
            <span className="grad-text">or S&amp;OP planning?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="contact-text">
            I&apos;m always happy to talk about supply chain and S&amp;OP planning roles, putting AI to work in operations, or how I automated a business from the ground up.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="contact-links">
          {primary && <Magnetic href={primary.href} label={primary.label === "Email" ? "Say hello" : primary.label} />}
          {links.slice(1).map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="btn">
              {l.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// A button that leans toward the pointer when it gets close.
function Magnetic({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noreferrer"
      className="btn btn-primary btn-magnetic"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {label} <span aria-hidden>→</span>
    </motion.a>
  );
}
