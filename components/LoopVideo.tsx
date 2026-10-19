"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// GitHub Pages without the custom domain serves the site from /<repo>.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const media = (path: string) => `${base}${path}`;

type Props = {
  src: string;
  poster: string;
  label: string;
  className?: string;
  loop?: boolean;
  onEnded?: () => void;
  // 0..1 while playing, for a progress bar.
  onProgress?: (p: number) => void;
  onError?: () => void;
};

// A muted screen recording that loads and plays only while it is on screen.
// Visitors who turn on "reduce motion" see the still frame and a play button.
export default function LoopVideo({ src, poster, label, className, loop = true, onEnded, onProgress, onError }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "200px 0px 200px 0px" });
  const reduce = useReducedMotion();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (inView) setLoad(true);
  }, [inView]);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce || !load) return;
    v.muted = true;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce, load]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !onProgress) return;
    let raf = 0;
    const tick = () => {
      if (v.duration) onProgress(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onProgress]);

  return (
    <video
      ref={ref}
      className={className}
      src={load ? media(src) : undefined}
      poster={media(poster)}
      aria-label={label}
      muted
      playsInline
      loop={loop}
      preload="none"
      controls={!!reduce}
      onEnded={onEnded}
      onError={onError}
    />
  );
}
