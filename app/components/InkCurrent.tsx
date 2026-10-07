"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Stroke = {
  x: number;
  y: number;
  len: number;
  speed: number;
  band: 0 | 1;
  phase: number;
  alpha: number;
  red: boolean;
};

/**
 * The koi, felt rather than seen: a field of short ink strokes drifting in two
 * opposing currents, upper band flowing right, lower band flowing left. The
 * pointer parts the current around it; a press drops ink and sends a ripple
 * outward. Canvas 2D, no libraries. Density scales with viewport; the loop
 * pauses offscreen and in hidden tabs; reduced motion renders one still frame.
 */
export default function InkCurrent({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let visible = true;
    let t = 0;
    let strokes: Stroke[] = [];
    const ripples: { x: number; y: number; t: number }[] = [];
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const count = () => (w < 768 ? 150 : w < 1280 ? 300 : 440);

    const make = (anywhere: boolean): Stroke => {
      const band: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
      const y = band === 0 ? h * (0.06 + Math.random() * 0.44) : h * (0.5 + Math.random() * 0.44);
      return {
        x: anywhere ? Math.random() * w : band === 0 ? -60 : w + 60,
        y,
        len: 14 + Math.random() * 48,
        speed: 0.22 + Math.random() * 0.6,
        band,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.05 + Math.random() * 0.13,
        red: Math.random() < 0.025,
      };
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strokes = Array.from({ length: count() }, () => make(true));
      ctx.fillStyle = "#0c0b0a";
      ctx.fillRect(0, 0, w, h);
      if (reduce) still();
    };

    const draw = (s: Stroke, vx: number, vy: number, boost: number) => {
      const m = Math.max(0.3, Math.hypot(vx, vy));
      const a = Math.min(0.6, s.alpha + boost * 0.35);
      ctx.strokeStyle = s.red
        ? `rgba(168,50,31,${Math.min(0.8, a + 0.25)})`
        : `rgba(239,232,218,${a})`;
      ctx.lineWidth = s.red ? 1.6 : 1 + boost;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - (vx / m) * s.len, s.y - (vy / m) * s.len);
      ctx.stroke();
    };

    /** One frame, no trails: the reduced-motion rendering. */
    const still = () => {
      ctx.fillStyle = "#0c0b0a";
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const s of strokes) {
        const dir = s.band === 0 ? 1 : -1;
        draw(s, dir * s.speed, Math.sin(s.phase) * 0.25, 0.1);
      }
    };

    const frame = () => {
      if (!running) return;
      if (!visible || document.hidden) {
        raf = requestAnimationFrame(frame);
        return;
      }
      t += 1 / 60;

      // Trails: a thin wash of ink each frame.
      ctx.fillStyle = "rgba(12,11,10,0.14)";
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";

      for (const s of strokes) {
        const dir = s.band === 0 ? 1 : -1;
        const wave = Math.sin(t * 0.7 + s.phase + s.x * 0.004);
        let vx = dir * s.speed;
        let vy = wave * 0.22;
        let boost = 0;

        // The pointer parts the water.
        if (pointer.active) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const R = 170;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / R;
            vx += (dx / d) * f * 2.4 + pointer.vx * 0.05 * f;
            vy += (dy / d) * f * 2.4 + pointer.vy * 0.05 * f;
            boost = f;
          }
        }

        // Ripples from a press.
        for (const r of ripples) {
          const age = t - r.t;
          const radius = age * 240;
          const dx = s.x - r.x;
          const dy = s.y - r.y;
          const d = Math.hypot(dx, dy) || 1;
          const ring = Math.abs(d - radius);
          if (ring < 30 && age < 1.6) {
            const f = (1 - ring / 30) * (1 - age / 1.6);
            vx += (dx / d) * f * 3.2;
            vy += (dy / d) * f * 3.2;
            boost = Math.max(boost, f);
          }
        }

        s.x += vx;
        s.y += vy;
        if (s.x > w + 70 || s.x < -70 || s.y < -50 || s.y > h + 50) Object.assign(s, make(false));
        draw(s, vx, vy, boost);
      }

      for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t > 1.6) ripples.splice(i, 1);
      pointer.vx *= 0.9;
      pointer.vy *= 0.9;
      raf = requestAnimationFrame(frame);
    };

    const toLocal = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (!fine || e.pointerType !== "mouse") return;
      const p = toLocal(e);
      pointer.vx = p.x - pointer.x;
      pointer.vy = p.y - pointer.y;
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      ripples.push({ x: p.x, y: p.y, t });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    resize();
    if (!reduce) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown, { passive: true });
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
    />
  );
}
