"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { motion } from "framer-motion";

// Opens to the content's measured height in pixels. Animating to height "auto"
// makes Framer Motion measure the page and put the scroll position back, which
// stops any smooth scroll under way (a menu link, a story link), so avoid "auto".
export default function Collapse({
  children,
  className,
  style,
  as = "div",
  duration = 0.4,
  exitDuration = duration,
  ref,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "nav";
  duration?: number;
  exitDuration?: number;
  ref?: Ref<HTMLDivElement>;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setH(Math.ceil(el.getBoundingClientRect().height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const M = as === "nav" ? motion.nav : motion.div;
  return (
    <M
      ref={ref}
      className={className}
      style={{ overflow: "hidden", ...style }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: h, opacity: 1 }}
      exit={{ height: 0, opacity: 0, transition: { duration: exitDuration } }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      <div ref={inner} style={{ display: "flow-root" }}>
        {children}
      </div>
    </M>
  );
}
