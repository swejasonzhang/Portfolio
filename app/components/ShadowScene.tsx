"use client";

import { useEffect, useRef, useState } from "react";
import { getProgress, useGateTracker } from "../lib/level";
import { GATES } from "../lib/gates";
import type { SceneAPI } from "../scene/createScene";

/** Scene brightness per gate: full in the opening and the ending, lowered under reading text. */
const DIM = [1, 0.55, 0.62, 0.52, 0.95];
const N = GATES.length;

/**
 * The live three.js scene behind the whole page (app/scene): one figure
 * before a rift, in mist. The camera glides continuously with the scroll and
 * never quite stops; cloth, smoke, mist and embers keep moving.
 *
 * three.js loads after first paint, in its own chunk, and the canvas fades in
 * once the first frame is drawn. Resolution adapts to the device: it starts
 * at the screen's own pixel density (capped at 2) and steps down only if
 * frames run long. Paused in hidden tabs. Under reduced motion it draws a
 * still frame per gate. Without WebGL the page keeps its gradient backdrop.
 */
export default function ShadowScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useGateTracker();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let scene: SceneAPI | null = null;
    let raf = 0;
    let running = true;
    let cssW = 0;
    let cssH = 0;
    // Retina density on desktop; phones are already dense, so 1.5x with antialiasing is sharp and lighter.
    let ratio = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    // The display's own frame interval, measured before the scene starts drawing (see probe below).
    let budget = 22;

    const resize = (force = false) => {
      if (!scene) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Phones resize as the URL bar moves; ignore small height changes.
      if (!force && w === cssW && Math.abs(h - cssH) < 140) return;
      cssW = w;
      cssH = h;
      scene.resize(w, h, ratio);
    };
    const onResize = () => resize();
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !scene) return;
      scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    const onDown = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (scene && el?.closest("[data-cursor=pulse]") && !el.closest("a, button")) scene.pulse();
    };

    let last = 0;
    let acc = 0;
    let frames = 0;
    let slow = 0;
    let lastStill = -1;
    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!scene || document.hidden) {
        last = now;
        return;
      }
      const p = getProgress();
      const i = Math.min(N - 2, Math.floor(p));
      const f = Math.min(1, p - i);
      if (shadeRef.current) shadeRef.current.style.opacity = (1 - (DIM[i] + (DIM[i + 1] - DIM[i]) * f)).toFixed(3);

      if (reduce) {
        // One still frame per gate, nothing animated.
        const g = Math.round(p);
        if (g !== lastStill) {
          lastStill = g;
          scene.setProgress(g);
          scene.render(10, true);
        }
        return;
      }

      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      scene.setProgress(p);
      scene.render(dt);

      // Adaptive resolution: only when frames take longer than the display itself allows,
      // for two windows in a row. A display capped at 30 fps (Low Power Mode) is not "slow".
      acc += Math.min(dt * 1000, 60);
      frames++;
      if (frames === 45) {
        const avg = acc / frames;
        acc = 0;
        frames = 0;
        slow = avg > budget ? slow + 1 : 0;
        if (slow >= 2 && ratio > 1) {
          slow = 0;
          ratio = Math.max(1, +(ratio - 0.25).toFixed(2));
          resize(true);
        }
      }
    };

    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      setFailed(true);
    };

    // three.js arrives in its own chunk after first paint; the page never waits for it.
    const start = window.setTimeout(() => {
      import("../scene/createScene")
        .then(({ createScene }) => {
          if (!running) return;
          try {
            scene = createScene(canvas, { coarse });
          } catch {
            setFailed(true);
            return;
          }
          resize(true);
          scene.setProgress(getProgress());
          scene.render(0, reduce);
          setReady(true);
          if (reduce) {
            raf = requestAnimationFrame(frame);
            return;
          }
          // Probe the display: a dozen idle frames tell us its real refresh interval.
          const gaps: number[] = [];
          let prev = 0;
          const probe = (now: number) => {
            if (!running) return;
            if (prev) gaps.push(now - prev);
            prev = now;
            if (gaps.length < 12) {
              raf = requestAnimationFrame(probe);
              return;
            }
            gaps.sort((a, b) => a - b);
            budget = Math.max(22, gaps[gaps.length >> 1] * 1.35);
            raf = requestAnimationFrame(frame);
          };
          raf = requestAnimationFrame(probe);
        })
        .catch(() => setFailed(true));
    }, 50);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    return () => {
      running = false;
      window.clearTimeout(start);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("webglcontextlost", onLost);
      scene?.dispose();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {!failed && (
        <canvas
          ref={canvasRef}
          className={`block h-full w-full transition-opacity duration-[1600ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div ref={shadeRef} className="absolute inset-0 bg-void will-change-[opacity]" style={{ opacity: 0 }} />
    </div>
  );
}
