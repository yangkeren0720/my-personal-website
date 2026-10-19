"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/content/site";
import PlaceholderBadge from "./PlaceholderBadge";
import Counter from "./Counter";
import { media } from "./LoopVideo";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRoleIndex((i) => (i + 1) % profile.roles.length), 2600);
    return () => clearInterval(t);
  }, []);

  const words = profile.name.split(" ");

  return (
    <section id="top" ref={ref} className="hero">
      <motion.div className="hero-blobs" style={{ y: blobY }} aria-hidden>
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </motion.div>
      <div className="hero-grid" aria-hidden />

      <motion.div className="container hero-inner" style={{ y, opacity }}>
        {profile.status && (
        <motion.div
          className="hero-status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          <span className="pulse" /> {profile.status}
        </motion.div>
        )}

        <h1 className="hero-name" aria-label={profile.name}>
          {words.map((word, wi) => (
            <span key={wi} className="hero-word">
              {word.split("").map((ch, ci) => (
                <motion.span
                  key={ci}
                  className="hero-char"
                  initial={{ y: "110%", rotate: 8 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.45 + wi * 0.25 + ci * 0.045, ease }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>
        <motion.p
          className="hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7, ease }}
        >
          {profile.title}
        </motion.p>
        {profile.nativeName && (
          <motion.p className="hero-native" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {profile.nativeName}
          </motion.p>
        )}

        <motion.div
          className="hero-role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <span className="hero-role-prefix">{profile.rolePrefix}</span>
          <span className="hero-role-slot">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                className="grad-text"
                initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -28, opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease }}
              >
                {profile.roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <div className="hero-stats">
          {profile.heroStats.map((st, i) => (
            <motion.div
              key={st.label}
              className="hero-stat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.1, duration: 0.7, ease }}
            >
              <strong>
                {st.prefix}
                <Counter to={st.value} suffix={st.suffix} />
              </strong>
              <span>{st.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="hero-builds">
          {profile.builds.map((b, i) => (
            <motion.a
              key={b.label}
              href={b.href}
              className="hero-build"
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.45 + i * 0.12, duration: 0.6, ease }}
            >
              <BuildIcon kind={b.label} />
              <span>
                <strong>{b.label}</strong>
                <small>{b.detail}</small>
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8, ease }}
        >
          <a href="#experience" className="btn btn-primary">
            See my work <span aria-hidden>→</span>
          </a>
          <a href="#contact" className="btn">
            Get in touch
          </a>
          {profile.resumeUrl && (
            <a href={media(profile.resumeUrl)} className="btn" download>
              Résumé (PDF) <span aria-hidden>↓</span>
            </a>
          )}
          <span className={`hero-loc ${profile.locationPlaceholder ? "placeholder" : ""}`}>
            ◎ {profile.location}
            <PlaceholderBadge show={profile.locationPlaceholder} />
          </span>
        </motion.div>
      </motion.div>

      <motion.a
        href="#experience"
        className="scroll-cue"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span />
      </motion.a>
    </section>
  );
}

// Small line icons for the "who also builds" chips.
function BuildIcon({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {kind === "Software" && <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />}
      {kind === "Websites" && (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
        </>
      )}
      {kind === "Dashboards" && <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />}
    </svg>
  );
}
