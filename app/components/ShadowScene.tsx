"use client";

import { useEffect, useRef, useState } from "react";
import { SCENE_FRAG, SCENE_VERT } from "../lib/sceneShader";
import { getProgress, useGateTracker } from "../lib/level";
import { GATES } from "../lib/gates";
import ManaField from "./ManaField";

/** Scene brightness per gate: full in the opening and the ending, lowered under reading text. */
const DIM = [1, 0.44, 0.5, 0.42, 0.92];

/**
 * One continuous environment behind the whole page, rendered in a single
 * fragment shader (see lib/sceneShader). The camera moves through it as the
 * visitor descends the gates; the pointer shifts it slightly; a press in the
 * opening sends a wave of light through the army's eyes.
 *
 * It never blocks the page: it starts after first paint, fades in, lowers its
 * own resolution when frames run long, caps touch devices at 30 fps, pauses in
 * hidden tabs, renders a still frame under reduced motion, and falls back to a
 * 2D particle field without WebGL.
 */
export default function ShadowScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"gl" | "fallback">("gl");
  const [ready, setReady] = useState(false);
  useGateTracker();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setMode("fallback");
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, SCENE_VERT);
    const fs = compile(gl.FRAGMENT_SHADER, SCENE_FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setMode("fallback");
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setMode("fallback");
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(program, n);
    const U = {
      res: u("uRes"),
      time: u("uTime"),
      sec: u("uSec"),
      ptr: u("uPtr"),
      pulse: u("uPulse"),
      dim: u("uDim"),
      steps: u("uSteps"),
      wide: u("uWide"),
    };

    const baseScale = coarse ? 0.42 : 0.68;
    let scale = baseScale;
    let steps = coarse ? 64 : 84;
    let w = 0;
    let h = 0;
    let cssW = 0;
    let cssH = 0;

    const size = (force = false) => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      // Phones resize the viewport as the URL bar moves; ignore small height changes.
      if (!force && nw === cssW && Math.abs(nh - cssH) < 140) return;
      cssW = nw;
      cssH = nh;
      w = Math.max(1, Math.round(nw * scale));
      h = Math.max(1, Math.round(nh * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    size(true);

    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    let pulseAt = -100;
    const start = performance.now();
    const onDown = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (el?.closest("[data-cursor=pulse]") && !el.closest("a, button")) {
        pulseAt = (performance.now() - start) / 1000;
      }
    };
    const onResize = () => size();

    const floor = coarse ? 0.34 : 0.5;
    let slowWindows = 0;
    let raf = 0;
    let running = true;
    let last = 0;
    let frame = 0;
    let acc = 0;
    let lastProgress = -1;
    let first = true;

    const draw = (t: number) => {
      const p = getProgress();
      const i = Math.min(GATES.length - 1, Math.floor(p));
      const f = p - i;
      const dim = DIM[i] + (DIM[Math.min(DIM.length - 1, i + 1)] - DIM[i]) * f;
      ptr.x += (ptr.tx - ptr.x) * 0.04;
      ptr.y += (ptr.ty - ptr.y) * 0.04;
      gl.uniform2f(U.res, w, h);
      gl.uniform1f(U.time, reduce ? 6 : t);
      gl.uniform1f(U.sec, reduce ? Math.round(p) : p);
      gl.uniform2f(U.ptr, reduce ? 0 : ptr.x, reduce ? 0 : ptr.y);
      gl.uniform1f(U.pulse, reduce ? 99 : t - pulseAt);
      gl.uniform1f(U.dim, dim);
      gl.uniform1f(U.steps, steps);
      gl.uniform1f(U.wide, Math.min(1, Math.max(0, (cssW / cssH - 0.75) / 0.75)));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (first) {
        first = false;
        setReady(true);
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const t = (now - start) / 1000;
      if (reduce) {
        // One still frame per gate, nothing animated.
        const p = Math.round(getProgress());
        if (p !== lastProgress) {
          lastProgress = p;
          draw(t);
        }
        return;
      }
      frame++;
      if (coarse && frame % 2 === 1) return;
      const dt = last ? now - last : 16;
      last = now;
      draw(t);
      // Adaptive quality: average frame time over a window, step resolution down or back up.
      // Outliers (a tab switch, a screenshot) are clamped, and it takes two slow windows to step down.
      acc += Math.min(dt, 60);
      const span = coarse ? 30 : 45;
      if (frame % (coarse ? 60 : 45) === 0) {
        const avg = acc / span;
        acc = 0;
        const budget = coarse ? 40 : 24;
        slowWindows = avg > budget ? slowWindows + 1 : 0;
        if (slowWindows >= 2 && scale > floor) {
          slowWindows = 0;
          scale = Math.max(floor, scale - 0.06);
          steps = Math.max(56, steps - 8);
          size(true);
        } else if (avg < budget * 0.6 && scale < baseScale) {
          scale = Math.min(baseScale, scale + 0.04);
          size(true);
        }
      }
    };

    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      setMode("fallback");
    };

    // Start after the first paint so the scene never delays the page.
    const idle = window.setTimeout(() => {
      raf = requestAnimationFrame(loop);
    }, 60);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", onResize);
    canvas.addEventListener("webglcontextlost", onLost);
    return () => {
      running = false;
      window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  if (mode === "fallback") return <ManaField />;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 bg-void">
      <canvas
        ref={ref}
        className={`h-full w-full transition-opacity duration-[1800ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      />
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
