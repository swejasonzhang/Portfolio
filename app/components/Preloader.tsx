"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import YinYang from "./YinYang";

export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (reduce) {
      setInstant(true);
      setShow(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(timer);
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: instant ? 0 : 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -120, opacity: 0 }}
            animate={{ scale: 1, rotate: 360, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <YinYang className="h-20 w-20 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
