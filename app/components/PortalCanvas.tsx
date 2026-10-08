"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Orbiter = { a: number; r: number; speed: number; size: number; hue: number; wobble: number };
type Shade = { x: number; y: number; vy: number; size: number; alpha: number; drift: number };
type Eyes = { x: number; y: number; gap: number; blink: number; next: number; life: number; born: number; violet: boolean };

/**
 * The gate: a dark portal ringed by orbiting motes of system light, with
 * shadows rising from the floor toward it. The pointer bends the ring; a
 * press sends a pulse through it. Canvas 2D, no libraries. Pauses offscreen
 * and in hidden tabs; reduced motion renders one still frame.
 */
export default function PortalCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, running = true, visible = true, t = 0;
    let cx = 0, cy = 0, R = 0;
    let orbiters: Orbiter[] = [];
    let shades: Shade[] = [];
    let eyes: Eyes[] = [];
    const pulses: { t: number }[] = [];
    const pointer = { x: 0, y: 0, active: false };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const seed = () => {
      const n = w < 768 ? 140 : 240;
      orbiters = Array.from({ length: n }, () => ({
        a: Math.random() * Math.PI * 2,
        r: 0.86 + Math.random() * 0.3,
        speed: (0.0011 + Math.random() * 0.0022) * (Math.random() < 0.5 ? 1 : -1),
        size: 0.6 + Math.random() * 1.6,
        hue: Math.random(),
        wobble: Math.random() * Math.PI * 2,
      }));
      const m = w < 768 ? 40 : 90;
      shades = Array.from({ length: m }, () => makeShade(true));
      eyes = Array.from({ length: w < 768 ? 3 : 6 }, () => makeEyes(true));
    };

    // Shadows in the dark, watching: pairs of glowing eyes that blink, fade and move on.
    const makeEyes = (first: boolean): Eyes => ({
      x: w * (0.06 + Math.random() * 0.88),
      y: h * (0.58 + Math.random() * 0.36),
      gap: 8 + Math.random() * 7,
      blink: 0,
      next: t + 1.5 + Math.random() * 4,
      life: 7 + Math.random() * 8,
      born: first ? t - Math.random() * 6 : t,
      violet: Math.random() < 0.7,
    });

    const makeShade = (anywhere: boolean): Shade => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 20,
      vy: 0.11 + Math.random() * 0.3,
      size: 1 + Math.random() * 3,
      alpha: 0.08 + Math.random() * 0.25,
      drift: Math.random() * Math.PI * 2,
    });

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
      const mobile = w < 1024;
      cx = mobile ? w * 0.5 : w * 0.7;
      cy = mobile ? h * 0.36 : h * 0.5;
      R = mobile ? Math.min(w, h) * 0.3 : Math.min(w, h) * 0.34;
      seed();
      ctx.fillStyle = "#06070b";
      ctx.fillRect(0, 0, w, h);
      if (reduce) still();
    };

    const color = (hue: number, a: number) =>
      hue < 0.6 ? `rgba(88,166,255,${a})` : hue < 0.9 ? `rgba(124,92,255,${a})` : `rgba(230,236,255,${a})`;

    const drawRing = (glow: number) => {
      // inner void
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.82, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(4,5,9,0.9)";
      ctx.fill();
      // rim: three concentric strokes fading outward stand in for a glow
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.82 + i * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(88,166,255,${(0.55 - i * 0.17) * (0.7 + glow * 0.6)})`;
        ctx.lineWidth = i === 0 ? 1.5 : 1;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.16, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(124,92,255,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawFrame = (dt: number, trails: boolean) => {
      if (trails) {
        ctx.fillStyle = "rgba(6,7,11,0.16)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "#06070b";
        ctx.fillRect(0, 0, w, h);
      }

      // shadows rising
      for (const s of shades) {
        s.y -= s.vy * dt;
        s.x += Math.sin(t * 0.8 + s.drift) * 0.25 * dt;
        // pulled gently toward the gate as they rise
        s.x += (cx - s.x) * 0.0012 * dt;
        if (s.y < -20) Object.assign(s, makeShade(false));
        ctx.fillStyle = `rgba(124,92,255,${s.alpha * 0.5})`;
        ctx.fillRect(s.x - s.size, s.y - s.size, s.size * 2, s.size * 2);
        ctx.fillStyle = `rgba(179,157,255,${s.alpha})`;
        ctx.fillRect(s.x - s.size * 0.4, s.y - s.size * 0.4, s.size * 0.8, s.size * 0.8);
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

      let glow = 0;
      for (const p of pulses) {
        const age = t - p.t;
        glow = Math.max(glow, Math.max(0, 1 - age / 2));
      }
      drawRing(glow);

      // orbiting motes
      for (const o of orbiters) {
        o.a += o.speed * dt;
        const wob = Math.sin(t * 0.7 + o.wobble) * 0.03;
        let rr = R * (o.r + wob);
        // pulses push the ring outward briefly
        for (const p of pulses) {
          const age = t - p.t;
          if (age < 2) rr += Math.sin(Math.min(1, age / 2) * Math.PI) * 18 * (1 - age / 2);
        }
        let x = cx + Math.cos(o.a) * rr;
        let y = cy + Math.sin(o.a) * rr;
        let boost = 0;
        if (pointer.active) {
          const dx = x - pointer.x, dy = y - pointer.y;
          const d2 = dx * dx + dy * dy, RR = 180;
          if (d2 < RR * RR) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / RR;
            x += (dx / d) * f * 26;
            y += (dy / d) * f * 26;
            boost = f;
          }
        }
        const a = 0.35 + boost * 0.5 + glow * 0.3;
        ctx.fillStyle = color(o.hue, Math.min(1, a));
        const s = o.size + boost * 1.5;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }

      for (let i = pulses.length - 1; i >= 0; i--) if (t - pulses[i].t > 2.2) pulses.splice(i, 1);
    };

    const still = () => {
      t = 10;
      drawFrame(1, false);
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
    const onDown = () => {
      pulses.push({ t });
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
