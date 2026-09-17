"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import YinYang from "./YinYang";

/**
 * The signature mark: a yin-yang that tilts toward the cursor, rotates slowly
 * on its own and gets a kick from scroll velocity. Transform-only, no halos,
 * no blend layers. Pointer and scroll motion are gated on reduced-motion.
 */
export default function InteractiveYinYang() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 120, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [14, -14]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-14, 14]), spring);

  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const kick = useSpring(useTransform(v, [-3000, 3000], [-30, 30]), {
    stiffness: 80,
    damping: 20,
  });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className="relative aspect-square w-full overflow-visible"
      style={{ perspective: 900 }}
    >
      {/* Orbit rings */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%] rounded-full border border-white/10 animate-spin-slower"
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/70" />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-26%] hidden rounded-full border border-dashed border-white/[0.08] lg:block"
      />

      <motion.div
        className="h-full w-full"
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          rotate: reduce ? 0 : kick,
        }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
      >
        <YinYang className={`h-full w-full ${reduce ? "" : "animate-spin-slow"}`} />
      </motion.div>
    </div>
  );
}
