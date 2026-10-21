"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

// `from` starts the count at the "before" number of a comparison stat, so a
// label like "up from 86%" never sits beside a smaller number mid-count.
export default function Counter({ to, from = 0, suffix = "", decimals = 0 }: { to: number; from?: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Vertical-only margin: a narrow "0" near the left edge on phones would never count as in view.
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Number(v.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [inView, from, to, decimals]);

  return (
    <span ref={ref}>
      {value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
