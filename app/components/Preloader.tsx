"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import YinYang from "./YinYang";

export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [instant, setInstant] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) {
      setInstant(true);
      setShow(false);
      return;
    }

    document.body.style.overflow = "hidden";

    // Count 0 → 100 over the hold, then reveal the site.
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      // ease-out so it decelerates into 100
      setCount(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const timer = setTimeout(() => setShow(false), 1750);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [reduce]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: instant ? 0 : 0.7,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -120, opacity: 0 }}
            animate={{ scale: 1, rotate: 360, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
          >
            <YinYang className="h-24 w-24" />
          </motion.div>

          <div className="flex w-56 flex-col items-center gap-2">
            <div className="flex w-full items-baseline justify-between font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
              <span>Loading</span>
              <span className="tabular-nums text-gray-300">
                {String(count).padStart(3, "0")}%
              </span>
            </div>
            <div className="h-px w-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${count}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
