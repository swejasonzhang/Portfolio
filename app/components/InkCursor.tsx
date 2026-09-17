"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

type Mode = "idle" | "link" | "hi" | "drag" | "view" | "flip";

const LABELS: Partial<Record<Mode, string>> = {
  drag: "drag",
  view: "view",
  flip: "flip",
  hi: "hello",
};

const SCALES: Record<Mode, number> = {
  idle: 1,
  link: 2.2,
  hi: 3.5,
  drag: 3.5,
  view: 3.5,
  flip: 3.5,
};

/**
 * A single drop of ink that trails the pointer and stretches like liquid in
 * the direction of movement. Pure motion values (no per-frame re-renders).
 * The difference blend is scoped to the dot itself. Fine-pointer only, and
 * off entirely for reduced motion.
 */
export default function InkCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
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

  // Stable targets (not recreated per render); the springs follow them.
  const scaleTarget = useMotionValue(1);
  const opacityTarget = useMotionValue(1);
  const labelTarget = useMotionValue(0);
  const scale = useSpring(scaleTarget, { stiffness: 300, damping: 25 });
  const opacity = useSpring(opacityTarget, { stiffness: 300, damping: 30 });
  const labelOpacity = useSpring(labelTarget, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    setEnabled(true);
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let mode: Mode = "idle";
    let pressed = false;

    const apply = () => {
      scaleTarget.set(SCALES[mode] * (pressed ? 0.85 : 1));
      const text = LABELS[mode];
      labelTarget.set(text ? 1 : 0);
      if (text) setLabel(text);
    };

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest(
        "[data-cursor], a, button, [role=button]"
      );
      const attr = t?.getAttribute("data-cursor");
      const next = (attr ?? (t ? "link" : "idle")) as Mode;
      mode = next in SCALES ? next : "link";
      apply();
    };
    const down = () => {
      pressed = true;
      apply();
    };
    const up = () => {
      pressed = false;
      apply();
    };
    const leave = () => opacityTarget.set(0);
    const enter = () => opacityTarget.set(1);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    root.addEventListener("mouseleave", leave);
    root.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.removeEventListener("mouseleave", leave);
      root.removeEventListener("mouseenter", enter);
      root.classList.remove("has-custom-cursor");
    };
  }, [x, y, scaleTarget, opacityTarget, labelTarget]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", opacity }}
    >
      <motion.div style={{ rotate: angle, scaleX: stretchX, scaleY: squashY }}>
        <motion.div className="h-4 w-4 rounded-full bg-white" style={{ scale }} />
      </motion.div>
      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-black"
        style={{ opacity: labelOpacity }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
