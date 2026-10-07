"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import BrushEdge from "./BrushEdge";
import Seal from "./Seal";
import { EASE_INOUT, EASE_OUT } from "../lib/motion";

const HOLD_MS = 950;
const SAFETY_MS = 3000;

/**
 * The loader: a sheet of paper is stamped, then pulled away like a brush
 * stroke to uncover the ink beneath. Total ≈ 0.95s hold + 0.7s lift, which
 * INTRO_DELAY in lib/motion is tuned against.
 */
export default function Stamp() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(true);
  const released = useRef(false);

  const release = useCallback(() => {
    if (released.current) return;
    released.current = true;
    document.body.style.overflow = "";
    document.querySelectorAll("main, header, nav").forEach((el) => {
      el.removeAttribute("inert");
    });
  }, []);

  useEffect(() => {
    if (reduced) {
      setShow(false);
      release();
      return;
    }
    document.body.style.overflow = "hidden";
    document.querySelectorAll("main, header, nav").forEach((el) => {
      el.setAttribute("inert", "");
    });
    const hide = window.setTimeout(() => setShow(false), HOLD_MS);
    const safety = window.setTimeout(release, SAFETY_MS);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(safety);
      release();
    };
  }, [reduced, release]);

  return (
    <AnimatePresence onExitComplete={release}>
      {show && (
        <motion.div
          role="status"
          aria-label="Loading"
          exit={{ y: "-100%", transition: { duration: 0.7, ease: EASE_INOUT } }}
          className="sheet-fallback fixed inset-0 z-[100] bg-washi text-sumi motion-reduce:hidden"
        >
          <div aria-hidden="true" className="grain-dark absolute inset-0 opacity-[0.07]" />

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ scale: 1.35, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: -3 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.15 }}
            >
              <Seal className="h-20 w-20" tilt={false} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.4 } }}
              className="mt-6 font-mono text-2xs uppercase tracking-kicker text-ash-2"
            >
              Jason Zhang — Software Engineer · Builder · Founder
            </motion.p>
          </div>

          <BrushEdge flip className="absolute inset-x-0 -bottom-6 text-washi md:-bottom-8" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
