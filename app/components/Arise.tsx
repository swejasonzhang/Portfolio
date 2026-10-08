"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE_INOUT, EASE_OUT } from "../lib/motion";

const LINES = ["Player detected.", "Loading gates 00 → 05."];
const HOLD_MS = 2250;
const SAFETY_MS = 5200;

/**
 * The entrance: a black System screen types two lines and fills a bar, the
 * word ARISE flashes, then the screen parts top and bottom to reveal the gate.
 * Total ≈ 2.25s hold + 0.95s part. INTRO_DELAY in lib/motion is tuned to it.
 */
export default function Arise() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [stage, setStage] = useState<"load" | "arise">("load");
  const released = useRef(false);

  const p = useMotionValue(0);
  const pct = useTransform(p, (v) => String(Math.round(Math.max(0, Math.min(100, v)))).padStart(3, "0"));
  const scaleX = useTransform(p, [0, 100], [0, 1]);

  const release = useCallback(() => {
    if (released.current) return;
    released.current = true;
    document.body.style.overflow = "";
    document.querySelectorAll("main, header, nav").forEach((el) => el.removeAttribute("inert"));
  }, []);

  useEffect(() => {
    if (reduce) {
      setShow(false);
      release();
      return;
    }
    document.body.style.overflow = "hidden";
    document.querySelectorAll("main, header, nav").forEach((el) => el.setAttribute("inert", ""));
    const controls = animate(p, 100, { duration: 1.5, ease: EASE_OUT });
    const arise = window.setTimeout(() => setStage("arise"), 1450);
    const hide = window.setTimeout(() => setShow(false), HOLD_MS);
    const safety = window.setTimeout(release, SAFETY_MS);
    return () => {
      controls.stop();
      window.clearTimeout(arise);
      window.clearTimeout(hide);
      window.clearTimeout(safety);
      release();
    };
  }, [reduce, p, release]);

  return (
    <AnimatePresence onExitComplete={release}>
      {show && (
        <motion.div
          role="status"
          aria-label="Loading"
          className="screen-fallback fixed inset-0 z-[100] motion-reduce:hidden"
        >
          {/* two halves of the screen, parting like a gate */}
          <motion.div
            className="scanlines absolute inset-x-0 top-0 h-1/2 bg-void"
            exit={{ y: "-100%", transition: { duration: 0.95, ease: EASE_INOUT } }}
          />
          <motion.div
            className="scanlines absolute inset-x-0 bottom-0 h-1/2 bg-void"
            exit={{ y: "100%", transition: { duration: 0.95, ease: EASE_INOUT } }}
          />
          <motion.span
            aria-hidden="true"
            className="rule-glow absolute inset-x-0 top-1/2"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          />

          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="relative z-10 flex h-full flex-col items-center justify-center px-6"
          >
            {stage === "load" ? (
              <div className="relative w-[min(22rem,90vw)] border border-sys/50 bg-panel shadow-glow">
                <span aria-hidden="true" className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-sys-bright" />
                <span aria-hidden="true" className="absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-sys-bright" />
                <span aria-hidden="true" className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-sys-bright" />
                <span aria-hidden="true" className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-sys-bright" />
                <div className="border-b border-line px-4 py-2.5 hud text-sys">[Notification]</div>
                <div className="space-y-2 p-5 font-mono text-xs text-ice-2">
                  {LINES.map((l, i) => (
                    <motion.p
                      key={l}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 + i * 0.5, duration: 0.35 } }}
                    >
                      <span className="text-sys">›</span> {l}
                      {i === LINES.length - 1 && (
                        <span aria-hidden="true" className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-sys animate-blink" />
                      )}
                    </motion.p>
                  ))}
                  <div aria-hidden="true" className="pt-2">
                    <div className="flex justify-between hud text-mute">
                      <span>Loading</span>
                      <span>
                        <motion.span className="tabular-nums text-ice">{pct}</motion.span>%
                      </span>
                    </div>
                    <div className="mt-2 h-px w-full bg-line">
                      <motion.div className="h-full w-full origin-left bg-sys" style={{ scaleX }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.p
                aria-hidden="true"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: [0, 1, 0.6, 1], scale: 1, transition: { duration: 0.7, ease: "linear" } }}
                className="glow-text font-display text-display-xl uppercase tracking-[0.08em] text-ice"
              >
                Arise
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
