"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Pulls its child a few pixels toward the pointer, the way a System prompt
 * leans toward a hand reaching for it. Mouse only; nothing on touch or for
 * reduced motion (MotionConfig handles the latter).
 */
export default function Magnetic({ children, strength = 0.22, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 16, mass: 0.6 });
  return (
    <motion.span
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
