"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Collapse from "./Collapse";
import { profile } from "@/content/site";
import ThemeToggle from "./ThemeToggle";
import { media } from "./LoopVideo";

const links = [
  { id: "builds", label: "Builds" },
  { id: "experience", label: "Resume" },
  { id: "skywater", label: "SkyWater" },
  { id: "mino", label: "Mino" },
  { id: "belong", label: "Belong" },
  { id: "rbr", label: "RBR" },
  { id: "multitask", label: "Multitask" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <motion.header
      className={`nav ${scrolled ? "nav-scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav-inner">
        <a href="#top" className="nav-logo" aria-label="Back to top">
          <span className="grad-text">{initials}</span>
        </a>

        <nav className="nav-links" aria-label="Sections">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? "active" : ""}>
              {active === l.id && (
                <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="nav-label">{l.label}</span>
            </a>
          ))}
        </nav>

        {/* The résumé and LinkedIn stay one tap away on every screen. */}
        <div className="nav-right">
          {profile.resumeUrl && (
            <a href={media(profile.resumeUrl)} className="nav-resume" download>
              Résumé <span aria-hidden>↓</span>
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} className="nav-icon" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-3.95v-11Z" />
              </svg>
            </a>
          )}
          <ThemeToggle />
          <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          <span className={open ? "x" : ""} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Collapse as="nav" className="nav-mobile-wrap" duration={0.3}>
            <div className="nav-mobile">
            {links.map((l, i) => (
              <motion.a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                {l.label}
              </motion.a>
            ))}
            <div className="nav-mobile-direct">
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                  LinkedIn ↗
                </a>
              )}
              <a href={`mailto:${profile.email}`} onClick={() => setOpen(false)}>
                Email
              </a>
            </div>
            </div>
          </Collapse>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
