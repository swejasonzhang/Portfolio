"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Mode = "idle" | "select" | "pulse";

/**
 * The System cursor. Replaces the native pointer on fine-pointer devices: a
 * rotated square with corner ticks and a center dot, a slowly turning outer
 * frame, a ghost that trails behind, and a HUD label that reads SELECT over
 * anything interactive or PULSE over the awakening field. It takes the color
 * of the gate it is over. Off entirely for reduced motion.
 */
export default function Reticle() {
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [color, setColor] = useState("#58a6ff");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.3 });
  const gx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const gy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });
  const scaleT = useMotionValue(1);
  const scale = useSpring(scaleT, { stiffness: 320, damping: 26 });
  const opT = useMotionValue(0);
  const opacity = useSpring(opT, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setOn(true);
    const root = document.documentElement;
    root.classList.add("has-reticle");

    let current: Mode = "idle";
    let pressed = false;
    const apply = () => {
      const base = current === "idle" ? 1 : current === "select" ? 1.7 : 1.35;
      scaleT.set(base * (pressed ? 0.78 : 1));
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      opT.set(1);
    };
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const interactive = el?.closest("a, button, [role=button], summary, input, textarea, select, label");
      const pulse = el?.closest("[data-cursor=pulse]");
      current = interactive ? "select" : pulse ? "pulse" : "idle";
      setMode(current);
      const section = el?.closest("section, [data-gate]");
      const gate = section ? getComputedStyle(section).getPropertyValue("--gate").trim() : "";
      setColor(gate || "#58a6ff");
      apply();
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pressed = true;
      apply();
    };
    const up = () => {
      pressed = false;
      apply();
    };
    const leave = () => opT.set(0);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    root.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.removeEventListener("mouseleave", leave);
      root.classList.remove("has-reticle");
    };
  }, [x, y, scaleT, opT]);

  if (!on) return null;

  const label = mode === "select" ? "Select" : mode === "pulse" ? "Pulse" : "";

  return (
    <>
      {/* ghost trail */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[89]"
        style={{ x: gx, y: gy, translateX: "-50%", translateY: "-50%", opacity }}
      >
        <span
          className="block h-4 w-4 rotate-45 border opacity-40"
          style={{ borderColor: color }}
        />
      </motion.div>

      {/* reticle */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90]"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", opacity }}
      >
        <motion.div style={{ scale }} className="relative h-6 w-6">
          {/* slow outer frame */}
          <span
            className="absolute -inset-2 rotate-45 border opacity-35 motion-safe:animate-ring-spin"
            style={{ borderColor: color, borderStyle: "dashed" }}
          />
          {/* main diamond */}
          <span
            className="absolute inset-0 rotate-45 border"
            style={{ borderColor: color, boxShadow: `0 0 14px ${color}66, inset 0 0 8px ${color}22` }}
          />
          {/* corner ticks (cardinal points of the diamond) */}
          <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 -translate-y-full" style={{ background: color }} />
          <span className="absolute left-1/2 bottom-0 h-1.5 w-px -translate-x-1/2 translate-y-full" style={{ background: color }} />
          <span className="absolute left-0 top-1/2 h-px w-1.5 -translate-x-full -translate-y-1/2" style={{ background: color }} />
          <span className="absolute right-0 top-1/2 h-px w-1.5 translate-x-full -translate-y-1/2" style={{ background: color }} />
          {/* center */}
          <span
            className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          />
        </motion.div>
        {label && (
          <span
            className="hud absolute left-5 top-5 whitespace-nowrap"
            style={{ color, textShadow: `0 0 10px ${color}66` }}
          >
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
