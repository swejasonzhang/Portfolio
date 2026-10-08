"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Mote = {
  x: number;
  y: number;
  vy: number;
  sway: number;
  size: number;
  a: number;
  hue: number;
  tw: number;
};

/**
 * The air of the System, behind every gate: a slow field of mana motes
 * drifting upward, two breathing pools of blue and violet light, a faint grid
 * and scanlines. Fixed, cheap, paused in hidden tabs; reduced motion renders
 * one still frame.
 */
export default function ManaField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let t = 0;
    let motes: Mote[] = [];

    const make = (anywhere: boolean): Mote => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      vy: 0.05 + Math.random() * 0.14,
      sway: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 1.6,
      a: 0.15 + Math.random() * 0.45,
      hue: Math.random(),
      tw: Math.random() * Math.PI * 2,
    });

    const draw = (dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (animate) {
          m.y -= m.vy * dt;
          m.x += Math.sin(t * 0.5 + m.sway) * 0.15 * dt;
          if (m.y < -10) Object.assign(m, make(false));
        }
        const tw = 0.6 + 0.4 * Math.sin(t * 0.8 + m.tw);
        const a = m.a * tw;
        const c = m.hue < 0.65 ? "88,166,255" : "124,92,255";
        ctx.fillStyle = `rgba(${c},${a * 0.3})`;
        ctx.fillRect(m.x - m.size * 2, m.y - m.size * 2, m.size * 4, m.size * 4);
        ctx.fillStyle = `rgba(${c},${a})`;
        ctx.fillRect(m.x - m.size / 2, m.y - m.size / 2, m.size, m.size);
      }
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: w < 768 ? 28 : 70 }, () => make(true));
      if (reduce) {
        t = 3;
        draw(1, false);
      }
    };

    let last = performance.now();
    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;
      if (!document.hidden) {
        t += dt / 60;
        draw(dt, true);
      }
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("resize", resize);
    resize();
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-void">
      <div className="absolute -right-[20vw] -top-[20vh] h-[80vh] w-[80vw] bg-[radial-gradient(closest-side,rgba(124,92,255,0.16),transparent)] motion-safe:animate-breathe" />
      <div className="absolute -bottom-[25vh] -left-[20vw] h-[80vh] w-[80vw] bg-[radial-gradient(closest-side,rgba(88,166,255,0.12),transparent)] motion-safe:animate-breathe [animation-delay:-4.5s]" />
      <div className="grid-sys absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_70%_at_50%_40%,black,transparent)]" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="scanlines absolute inset-0 opacity-70" />
    </div>
  );
}
