"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * The System cursor. Replaces the native pointer on fine-pointer devices: a
 * rotated square with corner ticks and a center dot, a slowly turning outer
 * frame, a ghost that trails behind, and a label that reads SELECT over
 * anything interactive or ARISE over the opening scene. It takes the color of
 * the gate it is over.
 *
 * Built for smoothness: position runs through springs on the compositor,
 * color is one CSS variable on the root, and the label is written directly,
 * so moving the mouse never re-renders React or reads layout.
 */
export default function Reticle() {
  const [on, setOn] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const labelEl = useRef<HTMLSpanElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 48, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 700, damping: 48, mass: 0.35 });
  const gx = useSpring(x, { stiffness: 170, damping: 24, mass: 0.6 });
  const gy = useSpring(y, { stiffness: 170, damping: 24, mass: 0.6 });
  const scaleT = useMotionValue(1);
  const scale = useSpring(scaleT, { stiffness: 260, damping: 24 });
  const opT = useMotionValue(0);
  const opacity = useSpring(opT, { stiffness: 220, damping: 30 });

  useEffect(() => {
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setOn(true);
    const root = document.documentElement;
    root.classList.add("has-reticle");

    let mode = "";
    let color = "";
    let pressed = false;
    const apply = () => {
      const base = mode === "select" ? 1.7 : mode === "pulse" ? 1.35 : 1;
      scaleT.set(base * (pressed ? 0.78 : 1));
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      opT.set(1);
    };
    // Section colors are fixed per gate class, so read them from the class, not computed style.
    const GATE_COLOR: Record<string, string> = {
      "gate-blue": "#6cbcff",
      "gate-red": "#ff4d64",
      "gate-violet": "#a184ff",
      "gate-silver": "#c9d3e6",
      "gate-cyan": "#4fd8f2",
    };
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el) return;
      const next = el.closest("a, button, [role=button], summary, input, textarea, select, label")
        ? "select"
        : el.closest("[data-cursor=pulse]")
          ? "pulse"
          : "";
      if (next !== mode) {
        mode = next;
        if (labelEl.current) labelEl.current.textContent = mode === "select" ? "Select" : mode === "pulse" ? "Arise" : "";
        apply();
      }
      const section = el.closest("[class*='gate-']");
      const cls = section ? [...section.classList].find((c) => c in GATE_COLOR) : undefined;
      const nextColor = cls ? GATE_COLOR[cls] : "#6cbcff";
      if (nextColor !== color && host.current) {
        color = nextColor;
        host.current.style.setProperty("--rc", color);
      }
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

  return (
    <div ref={host} aria-hidden="true" style={{ ["--rc" as string]: "#6cbcff" }}>
      {/* ghost trail */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[89] will-change-transform"
        style={{ x: gx, y: gy, translateX: "-50%", translateY: "-50%", opacity }}
      >
        <span className="block h-4 w-4 rotate-45 border border-[var(--rc)] opacity-40 transition-colors duration-500" />
      </motion.div>

      {/* reticle */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] will-change-transform"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", opacity }}
      >
        <motion.div style={{ scale }} className="relative h-6 w-6 text-[var(--rc)] transition-colors duration-500">
          <span className="absolute -inset-2 rotate-45 border border-dashed border-current opacity-35 motion-safe:animate-ring-spin" />
          <span className="absolute inset-0 rotate-45 border border-current shadow-[0_0_14px_currentColor]" />
          <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 -translate-y-full bg-current" />
          <span className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 translate-y-full bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-1.5 -translate-x-full -translate-y-1/2 bg-current" />
          <span className="absolute right-0 top-1/2 h-px w-1.5 -translate-y-1/2 translate-x-full bg-current" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-current shadow-[0_0_8px_currentColor]" />
        </motion.div>
        <span ref={labelEl} className="hud absolute left-5 top-5 whitespace-nowrap text-[var(--rc)] transition-colors duration-500" />
      </motion.div>
    </div>
  );
}
