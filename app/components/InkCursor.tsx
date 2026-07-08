"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "framer-motion";

/**
 * A single drop of ink that trails the pointer and stretches like liquid in
 * the direction of movement. Pure motion-values (no React re-renders), so it
 * stays smooth. mix-blend-difference keeps it visible on any shade.
 * Desktop / fine-pointer only, and off entirely for reduced motion.
 */
export default function InkCursor() {
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Tight spring: nearly glued to the pointer, just enough smoothing for the
  // liquid feel without any perceptible lag.
  const sx = useSpring(x, { stiffness: 1500, damping: 40, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 1500, damping: 40, mass: 0.25 });

  const vx = useVelocity(sx);
  const vy = useVelocity(sy);
  const angle = useTransform([vx, vy], ([a, b]: number[]) =>
    a === 0 && b === 0 ? 0 : (Math.atan2(b, a) * 180) / Math.PI
  );
  const speed = useTransform([vx, vy], ([a, b]: number[]) => Math.hypot(a, b));
  const stretchX = useTransform(speed, [0, 2200], [1, 1.7], { clamp: true });
  const squashY = useTransform(speed, [0, 2200], [1, 0.7], { clamp: true });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference">
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div style={{ rotate: angle, scaleX: stretchX, scaleY: squashY }}>
          <div className="h-4 w-4 rounded-full bg-white" />
        </motion.div>
      </motion.div>
    </div>
  );
}
