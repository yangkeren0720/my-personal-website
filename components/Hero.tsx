"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/content/site";
import PlaceholderBadge from "./PlaceholderBadge";

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

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease }}
        >
          <a href="#work" className="btn btn-primary">
            See my work <span aria-hidden>→</span>
          </a>
          <a href="#contact" className="btn">
            Get in touch
          </a>
          <span className={`hero-loc ${profile.locationPlaceholder ? "placeholder" : ""}`}>
            ◎ {profile.location}
            <PlaceholderBadge show={profile.locationPlaceholder} />
          </span>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
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
