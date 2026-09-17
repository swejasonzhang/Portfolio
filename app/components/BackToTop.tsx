"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import YinYang from "./YinYang";

export default function BackToTop() {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const rotate = useTransform(spring, [0, 1], [0, 360]);

  const [past, setPast] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setPast(v > 700));

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const show = past && !footerVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          whileTap={{ scale: 0.92 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flash-frame fixed z-40 flex h-11 w-11 items-center justify-center text-white transition-colors hover:bg-white hover:text-black right-[max(1.5rem,env(safe-area-inset-right))] bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          <motion.span style={{ rotate: reduce ? 0 : rotate }} className="block">
            <YinYang outline className="h-5 w-5" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
