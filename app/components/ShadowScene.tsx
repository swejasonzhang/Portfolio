"use client";

import { useEffect, useRef } from "react";
import { getProgress, useGateTracker } from "../lib/level";
import { GATES } from "../lib/gates";

/**
 * The scene behind the whole page. Each gate has a still, rendered offline
 * from the procedural shader in lib/sceneShader at 2x supersampling, so the
 * silhouettes are clean and the GPU does no 3D work while you read. On the
 * page the stills cross-fade as you scroll, drift slowly, and lean a little
 * toward the pointer. Every moving property is opacity or transform, which
 * the compositor handles off the main thread, so scrolling never waits on it.
 *
 * Embers: one small canvas of a few dozen sparks rising, paused when the tab
 * is hidden, absent under reduced motion. Pressing in the opening fades in
 * the "eyes ignite" frame of the army.
 */

const N = GATES.length;
/** Scene brightness per gate: full in the opening and the ending, lowered under reading text. */
const DIM = [1, 0.5, 0.56, 0.48, 0.95];

export default function ShadowScene() {
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const arise = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const embers = useRef<HTMLCanvasElement>(null);
  useGateTracker();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0;
    let running = true;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    let ariseUntil = 0;
    let ariseO = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onDown = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (el?.closest("[data-cursor=pulse]") && !el.closest("a, button")) ariseUntil = performance.now() + 2600;
    };

    // Embers: cheap 2D sparks at a fixed small count.
    const canvas = embers.current;
    const ctx = canvas?.getContext("2d") ?? null;
    type Spark = { x: number; y: number; vy: number; vx: number; r: number; a: number; tw: number; violet: boolean };
    let sparks: Spark[] = [];
    let cw = 0;
    let ch = 0;
    const seed = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = cw < 768 ? 16 : 30;
      sparks = Array.from({ length: count }, () => ({
        x: Math.random() * cw,
        y: Math.random() * ch,
        vy: 6 + Math.random() * 16,
        vx: (Math.random() - 0.5) * 4,
        r: 0.7 + Math.random() * 1.2,
        a: 0.25 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
        violet: Math.random() < 0.3,
      }));
    };
    seed();
    let lastW = window.innerWidth;
    const onResize = () => {
      // Phones resize as the URL bar moves; reseed only on a real width change.
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        seed();
      }
    };

    // Decode every still in the background once the page is idle, one at a time,
    // so no gate crossing ever waits on a 4K image decode.
    const warm = new Array(N).fill(false);
    let warmTimer = 0;
    const idle = (fn: () => void): number =>
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(fn, { timeout: 1500 })
        : (setTimeout(fn, 300) as unknown as number);
    const warmUp = (k: number) => {
      if (!running || k > N) return;
      const host = k === N ? arise.current : layers.current[k];
      const img = host?.querySelector("img");
      const done = () => {
        if (k < N) warm[k] = true;
        warmTimer = idle(() => warmUp(k + 1));
      };
      if (img) img.decode().then(done, done);
      else done();
    };
    warmTimer = window.setTimeout(() => idle(() => warmUp(0)), 1200);

    const opac = new Array(N).fill(-1);
    let last = performance.now();
    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // The two stills on screen, and how far between them.
      const p = Math.min(N - 1, Math.max(0, getProgress()));
      const i = Math.min(N - 2, Math.floor(p));
      const f = p - i;
      ptr.x += (ptr.tx - ptr.x) * 0.045;
      ptr.y += (ptr.ty - ptr.y) * 0.045;

      let topTransform = "";
      for (let k = 0; k < N; k++) {
        const el = layers.current[k];
        if (!el) continue;
        // Decoded neighbours stay faintly present (invisible to the eye) so their tiles
        // are already rasterized when they fade in.
        const o = k === i ? 1 - f : k === i + 1 ? f : warm[k] && Math.abs(k - i) <= 2 ? 0.002 : 0;
        if (Math.abs(o - opac[k]) > 0.001) {
          el.style.opacity = o.toFixed(3);
          opac[k] = o;
        }
        if (o > 0 && !reduce) {
          // Slow breathing drift and pointer parallax; the outgoing still pushes in a little.
          const s = 1.06 + 0.01 * Math.sin(t * 0.11 + k) + (k === i ? f * 0.03 : 0);
          const dx = (fine ? -ptr.x * 14 : 0) + Math.sin(t * 0.07 + k * 1.7) * 6;
          const dy = (fine ? -ptr.y * 9 : 0) + Math.cos(t * 0.09 + k) * 4;
          const tr = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
          el.style.transform = tr;
          if (k === 0) topTransform = tr;
        }
      }

      const dim = DIM[i] + (DIM[i + 1] - DIM[i]) * f;
      if (shade.current) shade.current.style.opacity = (1 - dim).toFixed(3);

      if (arise.current && !reduce) {
        const target = i === 0 && f < 0.5 && now < ariseUntil ? 1 : 0;
        const next = ariseO + (target - ariseO) * (target ? 0.1 : 0.025);
        if (Math.abs(next - ariseO) > 0.001 || (next > 0 && next < 0.002)) {
          ariseO = next < 0.002 ? 0 : next;
          arise.current.style.opacity = ariseO.toFixed(3);
          if (topTransform) arise.current.style.transform = topTransform;
        }
      }

      if (!ctx || reduce) return;
      ctx.clearRect(0, 0, cw, ch);
      for (const s of sparks) {
        s.y -= s.vy * dt;
        s.x += s.vx * dt + Math.sin(t * 0.6 + s.tw) * 0.15;
        if (s.y < -10) {
          s.y = ch + 10;
          s.x = Math.random() * cw;
        }
        ctx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(t * 1.3 + s.tw));
        ctx.fillStyle = s.violet ? "#a184ff" : "#9fd2ff";
        ctx.fillRect(s.x, s.y, s.r, s.r * 2.2);
      }
      ctx.globalAlpha = 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(frame);
    return () => {
      running = false;
      window.clearTimeout(warmTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const still = (k: number | "arise") => {
    const d = k === "arise" ? "d-0-arise" : `d-${k}`;
    const m = k === "arise" ? "m-0-arise" : `m-${k}`;
    return (
      <picture>
        <source media="(max-aspect-ratio: 3/4)" srcSet={`/scene/${m}.webp`} />
        <img
          src={`/scene/${d}.webp`}
          alt=""
          decoding="async"
          fetchPriority={k === 0 ? "high" : "low"}
          className="h-full w-full object-cover"
        />
      </picture>
    );
  };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-void">
      {Array.from({ length: N }, (_, k) => (
        <div
          key={k}
          ref={(el) => {
            layers.current[k] = el;
          }}
          className="absolute inset-0 will-change-[opacity,transform]"
          style={{ opacity: k === 0 ? 1 : 0, transform: "scale(1.06)" }}
        >
          {still(k)}
        </div>
      ))}
      <div ref={arise} className="absolute inset-0 will-change-[opacity,transform]" style={{ opacity: 0, transform: "scale(1.06)" }}>
        {still("arise")}
      </div>
      <div ref={shade} className="absolute inset-0 bg-void will-change-[opacity]" style={{ opacity: 0 }} />
      <canvas ref={embers} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
