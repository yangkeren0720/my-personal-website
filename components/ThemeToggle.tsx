"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Theme = "light" | "dark";

// Sun/moon switch. The starting theme comes from the time of day (set in
// app/layout.tsx); clicking saves the visitor's own choice.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const flip = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  return (
    <button className="theme-toggle" onClick={flip} aria-label={theme === "light" ? "Switch to night mode" : "Switch to day mode"} title={theme === "light" ? "Night mode" : "Day mode"}>
      <AnimatePresence mode="wait" initial={false}>
        {theme && (
          <motion.svg
            key={theme}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {theme === "light" ? (
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
            ) : (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </>
            )}
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
