"use client";

import { motion, useReducedMotion } from "framer-motion";
import { rbrPlatform } from "@/content/site";
import Reveal from "./Reveal";
import LoopVideo from "./LoopVideo";

// Two phones side by side: the public site on a phone and the native admin
// app, each playing a real recording and floating gently out of step.
export default function RBRDevices() {
  const reduce = useReducedMotion();
  return (
    <div className="rbr-devices">
      {rbrPlatform.devices.map((d, i) => (
        <Reveal key={d.title} delay={i * 0.12} className="rbr-device">
          <motion.div
            className={`phone phone-${d.kind}`}
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, delay: i * 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="phone-screen">
              {d.kind === "web" && (
                <div className="phone-status" aria-hidden>
                  <span className="phone-island" />
                </div>
              )}
              <LoopVideo className="phone-video" src={d.video} poster={d.poster} label={`Screen recording: ${d.title}`} />
            </div>
          </motion.div>
          <div className="rbr-device-text">
            <strong>{d.title}</strong>
            <p>{d.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
