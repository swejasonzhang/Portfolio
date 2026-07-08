"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import YinYang from "./YinYang";

/**
 * The signature mark: a yin-yang that tilts toward the cursor and rotates
 * slowly on its own. Kept deliberately lightweight — no blurred halos or
 * blend layers — so it stays smooth. Still, mark and motion, on reduced-motion.
 */
export default function InteractiveYinYang({ size = 300 }: { size?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 120, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [14, -14]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-14, 14]), spring);

  function handleMove(e: React.PointerEvent) {
    if (reduce) return;
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
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, perspective: 900 }}
    >
      <motion.div
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          width: size,
          height: size,
        }}
      >
        <YinYang
          className={`h-full w-full drop-shadow-[0_0_35px_rgba(255,255,255,0.14)] ${
            reduce ? "" : "animate-spin-slow"
          }`}
        />
      </motion.div>
    </div>
  );
}
