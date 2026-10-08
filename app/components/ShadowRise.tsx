"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Shade = { x: number; y: number; vy: number; size: number; alpha: number; drift: number };
type Ember = { x: number; y: number; vy: number; len: number; alpha: number; blue: boolean };
type Eyes = { x: number; y: number; gap: number; blink: number; next: number; life: number; born: number; violet: boolean };

/**
 * Arise: shadows rising from the floor in violet, faster embers of system
 * light streaking up through them, and pairs of eyes blinking in the dark.
 * The pointer parts the shadows; a press sends a pulse of light through the
 * field. Canvas 2D, pauses offscreen and in hidden tabs, still frame under
 * reduced motion. No ring, no portal.
 */
export default function ShadowRise({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, running = true, visible = true, t = 0;
    let shades: Shade[] = [];
    let embers: Ember[] = [];
    let eyes: Eyes[] = [];
    const pulses: { x: number; y: number; t: number }[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const makeShade = (anywhere: boolean): Shade => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 20,
      vy: 0.1 + Math.random() * 0.28,
      size: 1.2 + Math.random() * 3.2,
      alpha: 0.08 + Math.random() * 0.3,
      drift: Math.random() * Math.PI * 2,
    });
    const makeEmber = (anywhere: boolean): Ember => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      vy: 0.6 + Math.random() * 1.1,
      len: 8 + Math.random() * 26,
      alpha: 0.2 + Math.random() * 0.5,
      blue: Math.random() < 0.55,
    });
    const makeEyes = (first: boolean): Eyes => ({
      x: w * (0.06 + Math.random() * 0.88),
      y: h * (0.5 + Math.random() * 0.44),
      gap: 8 + Math.random() * 7,
      blink: 0,
      next: t + 1.5 + Math.random() * 4,
      life: 7 + Math.random() * 8,
      born: first ? t - Math.random() * 6 : t,
      violet: Math.random() < 0.7,
    });

    const seed = () => {
      shades = Array.from({ length: w < 768 ? 70 : 150 }, () => makeShade(true));
      embers = Array.from({ length: w < 768 ? 14 : 34 }, () => makeEmber(true));
      eyes = Array.from({ length: w < 768 ? 3 : 6 }, () => makeEyes(true));
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
      seed();
      ctx.fillStyle = "#06070b";
      ctx.fillRect(0, 0, w, h);
      if (reduce) {
        t = 10;
        drawFrame(1, false);
      }
    };

    const drawFrame = (dt: number, trails: boolean) => {
      ctx.fillStyle = trails ? "rgba(6,7,11,0.16)" : "#06070b";
      ctx.fillRect(0, 0, w, h);

      let glow = 0;
      for (const p of pulses) glow = Math.max(glow, Math.max(0, 1 - (t - p.t) / 2));

      // shadows
      for (const s of shades) {
        s.y -= s.vy * dt;
        s.x += Math.sin(t * 0.6 + s.drift) * 0.22 * dt;
        if (pointer.active) {
          const dx = s.x - pointer.x, dy = s.y - pointer.y;
          const d2 = dx * dx + dy * dy, R = 150;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / R;
            s.x += (dx / d) * f * 2.4 * dt;
            s.y += (dy / d) * f * 1.2 * dt;
          }
        }
        for (const p of pulses) {
          const age = t - p.t;
          const radius = age * 260;
          const dx = s.x - p.x, dy = s.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          const ring = Math.abs(d - radius);
          if (ring < 40 && age < 1.8) {
            const f = (1 - ring / 40) * (1 - age / 1.8);
            s.x += (dx / d) * f * 3 * dt;
            s.y += (dy / d) * f * 3 * dt;
          }
        }
        if (s.y < -30 || s.x < -30 || s.x > w + 30) Object.assign(s, makeShade(false));
        const a = Math.min(0.9, s.alpha + glow * 0.3);
        ctx.fillStyle = `rgba(124,92,255,${a * 0.45})`;
        ctx.fillRect(s.x - s.size, s.y - s.size, s.size * 2, s.size * 2);
        ctx.fillStyle = `rgba(179,157,255,${a})`;
        ctx.fillRect(s.x - s.size * 0.38, s.y - s.size * 0.38, s.size * 0.76, s.size * 0.76);
      }

      // embers: streaks of system light
      ctx.lineCap = "round";
      for (const e of embers) {
        e.y -= e.vy * dt;
        if (e.y < -40) Object.assign(e, makeEmber(false));
        const a = Math.min(1, e.alpha + glow * 0.4);
        ctx.strokeStyle = e.blue ? `rgba(156,208,255,${a})` : `rgba(179,157,255,${a})`;
        ctx.lineWidth = 1 + glow;
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
        ctx.lineTo(e.x, e.y + e.len);
        ctx.stroke();
      }

      // eyes
      for (const e of eyes) {
        const age = t - e.born;
        if (age > e.life) {
          Object.assign(e, makeEyes(false));
          continue;
        }
        const fade = Math.min(1, age / 1.6) * Math.min(1, (e.life - age) / 1.6);
        if (t > e.next) {
          e.blink = 0.16;
          e.next = t + 1.5 + Math.random() * 4;
        }
        const open = e.blink > 0 ? 0.15 : 1;
        e.blink = Math.max(0, e.blink - dt / 60);
        e.y += Math.sin(t * 0.6 + e.gap) * 0.03 * dt;
        const c = e.violet ? "179,157,255" : "156,208,255";
        for (const ex of [e.x - e.gap, e.x + e.gap]) {
          ctx.fillStyle = `rgba(${e.violet ? "124,92,255" : "88,166,255"},${0.16 * fade})`;
          ctx.beginPath();
          ctx.ellipse(ex, e.y, 6, 4 * open + 1, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${c},${0.95 * fade})`;
          ctx.beginPath();
          ctx.ellipse(ex, e.y, 2.4, 1.6 * open + 0.2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = pulses.length - 1; i >= 0; i--) if (t - pulses[i].t > 2.2) pulses.splice(i, 1);
    };

    let last = performance.now();
    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;
      if (!visible || document.hidden) {
        raf = requestAnimationFrame(frame);
        return;
      }
      t += dt / 60;
      drawFrame(dt, true);
      raf = requestAnimationFrame(frame);
    };

    const toLocal = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (!fine || e.pointerType !== "mouse") return;
      const p = toLocal(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      pulses.push({ x: p.x, y: p.y, t });
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
