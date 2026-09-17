"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import YinYang from "./YinYang";
import { EASE_INOUT, EASE_OUT } from "../lib/motion";

const INERT_SELECTOR = "main, header, footer";

export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  // Motion values drive the counter and bar: no per-frame React state.
  const p = useMotionValue(0);
  const pct = useTransform(p, (v) =>
    String(Math.round(Math.max(0, Math.min(100, v)))).padStart(3, "0")
  );
  const scaleX = useTransform(p, [0, 100], [0, 1]);

  useEffect(() => {
    if (reduce) {
      setShow(false);
      return;
    }

    document.body.style.overflow = "hidden";
    document.querySelectorAll(INERT_SELECTOR).forEach((el) => {
      (el as HTMLElement).inert = true;
    });

    const controls = animate(p, 100, { duration: 0.9, ease: EASE_OUT });
    controls.then(() => setShow(false));
    return () => controls.stop();
  }, [reduce, p]);

  const release = () => {
    document.body.style.overflow = "";
    document.querySelectorAll(INERT_SELECTOR).forEach((el) => {
      (el as HTMLElement).inert = false;
    });
  };

  return (
    <AnimatePresence onExitComplete={release}>
      {show && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[100] motion-reduce:hidden"
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-ink"
            exit={{ y: "-100%", transition: { duration: 0.6, ease: EASE_INOUT } }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-ink"
            exit={{ y: "100%", transition: { duration: 0.6, ease: EASE_INOUT } }}
          />

          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="relative z-10 flex h-full flex-col items-center justify-center gap-8"
          >
            <motion.div
              initial={{ rotate: -120, scale: 0.9 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{ duration: 1.1, ease: EASE_OUT }}
              className="text-white"
            >
              <YinYang className="h-20 w-20" />
            </motion.div>

            <div aria-hidden="true" className="flex w-56 flex-col gap-2">
              <div className="flex justify-between font-mono text-2xs uppercase tracking-label text-gray-400">
                <span>Loading</span>
                <span>
                  <motion.span className="tabular-nums text-gray-200">
                    {pct}
                  </motion.span>
                  %
                </span>
              </div>
              <div className="h-px w-full bg-white/10">
                <motion.div
                  className="h-full w-full origin-left bg-white"
                  style={{ scaleX }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
