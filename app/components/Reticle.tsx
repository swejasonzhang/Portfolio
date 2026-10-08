"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A System reticle that rides with the native pointer: a rotated square with a
 * center dot, swelling over anything interactive. Fine pointers only; off for
 * reduced motion. The native cursor stays visible.
 */
export default function Reticle() {
  const [on, setOn] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.3 });
  const scaleT = useMotionValue(1);
  const scale = useSpring(scaleT, { stiffness: 300, damping: 24 });
  const opT = useMotionValue(0);
  const opacity = useSpring(opT, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setOn(true);

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      opT.set(1);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest("a, button, [role=button], summary");
      scaleT.set(t ? 1.8 : 1);
    };
    const leave = () => opT.set(0);
    const root = document.documentElement;

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    root.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      root.removeEventListener("mouseleave", leave);
    };
  }, [x, y, scaleT, opT]);

  if (!on) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", opacity }}
    >
      <motion.div style={{ scale }} className="relative h-5 w-5">
        <span className="absolute inset-0 rotate-45 border border-sys/80 shadow-glow" />
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-sys-bright" />
      </motion.div>
    </motion.div>
  );
}
