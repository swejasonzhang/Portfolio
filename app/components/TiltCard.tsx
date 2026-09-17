"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 3D tilt + a cursor spotlight, transform-only. Active for hover-capable
 * pointers only, so a tap on touch never leaves a card tilted or lit.
 */
export default function TiltCard({
  children,
  className = "",
  max = 6,
  spot = "light",
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  /** Spotlight color: light on ink plates, dark on the paper band. */
  spot?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setFine(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const active = fine && !reduce;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const lx = useMotionValue(0);
  const ly = useMotionValue(0);
  const glow = useMotionValue(0);

  const tiltSpring = { stiffness: 170, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), tiltSpring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), tiltSpring);
  const sx = useSpring(lx, { stiffness: 300, damping: 30 });
  const sy = useSpring(ly, { stiffness: 300, damping: 30 });
  const glowS = useSpring(glow, { stiffness: 200, damping: 30 });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !active || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    lx.set(e.clientX - r.left);
    ly.set(e.clientY - r.top);
    glow.set(1);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      style={active ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={`relative ${className}`}
    >
      {children}
      {active && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <motion.div
            className={`absolute left-0 top-0 h-[440px] w-[440px] rounded-full ${
              spot === "dark"
                ? "bg-[radial-gradient(circle,rgba(0,0,0,0.07),transparent_65%)]"
                : "bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_65%)]"
            }`}
            style={{
              x: sx,
              y: sy,
              translateX: "-50%",
              translateY: "-50%",
              opacity: glowS,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
