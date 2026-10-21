"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

// Keeps the default scroll short: an employer's deeper charts and stories sit
// closed behind one bar listing what is inside. Closed content stays in the
// page (hidden and inert), so a link that points inside opens the fold at once
// and then lands on its target, the same as before the fold existed.
// Opens to a measured pixel height, never "auto" (see Collapse.tsx).
export default function Fold({ name, parts, children }: { name: string; parts: { label: string; id: string }[]; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  // "toggle" animates a button press; "follow" tracks size changes inside an
  // open fold (a story card opening) with no lag; "jump" opens at once for a link.
  const [mode, setMode] = useState<"toggle" | "follow" | "jump">("toggle");
  const [shown, setShown] = useState(false);
  const [h, setH] = useState(0);
  const openRef = useRef(false);
  openRef.current = open;

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el || !shown) return;
    const measure = () => setH(Math.ceil(el.getBoundingClientRect().height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [shown]);

  useEffect(() => {
    const inside = (id: string) => {
      const el = id ? document.getElementById(id) : null;
      return el && box.current?.contains(el) ? el : null;
    };
    // Open with no animation, wait for the layout, then jump straight to the
    // target. A smooth scroll over this distance gets cut short while the
    // charts inside lay themselves out, so the jump is instant.
    const jumpTo = (id: string, setHash: boolean) => {
      setShown(true);
      setMode("jump");
      setOpen(true);
      const land = () => {
        const el = document.getElementById(id);
        const top = el?.getBoundingClientRect().top ?? 0;
        if (el && (top < 0 || top > 160)) el.scrollIntoView({ behavior: "instant", block: "start" });
      };
      setTimeout(() => {
        if (setHash && location.hash !== `#${id}`) location.hash = id;
        requestAnimationFrame(land);
        // Charts above the target may still be laying out; land once more.
        setTimeout(land, 450);
      }, 120);
    };
    const onClick = (e: MouseEvent) => {
      if (openRef.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement).closest?.("a[href^='#']");
      const id = a ? decodeURIComponent(a.getAttribute("href")!.slice(1)) : "";
      if (!inside(id)) return;
      e.preventDefault();
      jumpTo(id, true);
    };
    const onHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!openRef.current && inside(id)) jumpTo(id, false);
    };
    onHash();
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const toggle = () => {
    setMode("toggle");
    if (!open) setShown(true);
    setOpen(!open);
  };

  return (
    <div className={`fold ${open ? "open" : ""}`}>
      <div className="fold-bar">
        <button type="button" className="fold-btn" onClick={toggle} aria-expanded={open}>
          <span>{open ? `Show less of ${name}` : `See more from ${name}`}</span>
          <i aria-hidden>{open ? "↑" : "↓"}</i>
        </button>
        <div className="fold-parts">
          {parts.map((p) => (
            <a key={p.id} href={`#${p.id}`}>
              {p.label}
            </a>
          ))}
        </div>
      </div>
      <motion.div
        ref={box}
        className="fold-body"
        style={{ overflow: open && mode === "follow" ? "visible" : "clip" }}
        initial={false}
        animate={{ height: open ? h : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: mode === "toggle" ? 0.5 : 0, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (open) setMode("follow");
          else setShown(false);
        }}
        inert={!open}
      >
        <div ref={inner} style={{ display: shown ? "flow-root" : "none" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
