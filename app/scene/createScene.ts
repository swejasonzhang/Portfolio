import * as THREE from "three";
import { aura, buildEnvironment, eyeGlow } from "./environment";
import { buildFigure } from "./figure";
import { noiseTexture, shared, spline } from "./shared";

/**
 * The scene behind the page, in three.js: one figure before a rift, in mist.
 * The camera glides around the figure as the visitor scrolls (a continuous
 * orbit through five framings, one per gate), always eased, always drifting
 * a little; the cloth, smoke, mist and embers never stop moving.
 */

type Shot = { az: number; el: number; dist: number; fy: number; shift: number };

/** One framing per gate. `shift` moves the figure sideways on screen (positive: to the right). */
const WIDE: Shot[] = [
  { az: -0.24, el: 0.05, dist: 12.6, fy: 3.0, shift: 2.4 },
  { az: 0.6, el: 0.26, dist: 11.2, fy: 3.35, shift: 2.0 },
  { az: 1.2, el: 0.06, dist: 11.6, fy: 2.95, shift: 2.3 },
  { az: 0.45, el: 0.4, dist: 13.6, fy: 2.7, shift: 2.1 },
  { az: -0.55, el: -0.06, dist: 10.6, fy: 3.6, shift: 2.3 },
];
const NARROW: Shot[] = WIDE.map((s) => ({ ...s, dist: s.dist * 1.42, fy: s.fy - 0.15, shift: 0 }));
const KNOTS = [0, 1, 2, 3, 4];

export type SceneAPI = {
  /** Continuous position through the gates, 0..4. */
  setProgress(p: number): void;
  /** Pointer in -1..1 (x right, y down). */
  setPointer(x: number, y: number): void;
  pulse(): void;
  resize(width: number, height: number, pixelRatio: number): void;
  /** Advance and draw one frame. `dt` in seconds; `frozen` holds all ambient motion still. */
  render(dt: number, frozen?: boolean): void;
  dispose(): void;
};

export function createScene(canvas: HTMLCanvasElement, opts: { coarse: boolean; antialias?: boolean }): SceneAPI {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: opts.antialias ?? true,
    alpha: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x05060a, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 400);
  const noise = noiseTexture(256, 8, 5);

  const figure = buildFigure();
  figure.group.add(aura(figure.auraAnchors, opts.coarse ? 70 : 140, noise));
  figure.group.add(eyeGlow(figure.eyes));
  scene.add(figure.group);
  const env = buildEnvironment(noise, { embers: opts.coarse ? 160 : 320 });
  for (const o of env.objects) scene.add(o);

  let progress = 0;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let time = 6;
  let pulseAt = -100;
  let aspect = 1;
  let wide = 1;
  const cur: Shot = { ...WIDE[0] };
  let first = true;
  const focus = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  const target = (): Shot => {
    const keys = (k: keyof Shot) =>
      spline(KNOTS, WIDE.map((s) => s[k]), progress) * wide + spline(KNOTS, NARROW.map((s) => s[k]), progress) * (1 - wide);
    return { az: keys("az"), el: keys("el"), dist: keys("dist"), fy: keys("fy"), shift: keys("shift") };
  };

  return {
    setProgress(p) {
      progress = Math.min(4, Math.max(0, p));
    },
    setPointer(x, y) {
      ptr.tx = x;
      ptr.ty = y;
    },
    pulse() {
      pulseAt = time;
    },
    resize(width, height, pixelRatio) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      aspect = width / height;
      wide = Math.min(1, Math.max(0, (aspect - 0.75) / 0.75));
      camera.aspect = aspect;
      camera.fov = aspect < 1 ? 40 : 33;
      camera.updateProjectionMatrix();
      shared.uPx.value = pixelRatio;
    },
    render(dt, frozen = false) {
      if (!frozen) time += dt;
      shared.uTime.value = time;
      shared.uPulse.value = time - pulseAt;

      // Ease the camera toward its framing for this point in the page.
      const t = target();
      const k = first ? 1 : 1 - Math.exp(-dt * 2.4);
      first = false;
      (Object.keys(t) as (keyof Shot)[]).forEach((key) => (cur[key] += (t[key] - cur[key]) * k));
      ptr.x += (ptr.tx - ptr.x) * (1 - Math.exp(-dt * 2));
      ptr.y += (ptr.ty - ptr.y) * (1 - Math.exp(-dt * 2));

      // Always drifting, ever so slightly.
      const drift = frozen ? 0 : 1;
      const az = cur.az + drift * 0.03 * Math.sin(time * 0.11) + ptr.x * 0.04;
      const el = cur.el + drift * 0.015 * Math.sin(time * 0.13 + 1) - ptr.y * 0.025;
      const dist = cur.dist + drift * 0.18 * Math.sin(time * 0.07 + 2);
      focus.set(0, cur.fy + drift * 0.04 * Math.sin(time * 0.17), 0);
      camera.position.set(
        focus.x + dist * Math.sin(az) * Math.cos(el),
        focus.y + dist * Math.sin(el),
        focus.z + dist * Math.cos(az) * Math.cos(el)
      );
      right.subVectors(focus, camera.position).normalize().cross(up).normalize();
      camera.lookAt(focus.clone().addScaledVector(right, -cur.shift));

      // The figure breathes and sways a hair.
      figure.group.rotation.y = drift * 0.025 * Math.sin(time * 0.16);
      figure.group.scale.set(1, 1 + drift * 0.004 * Math.sin(time * 0.9), 1);

      env.update(camera, aspect);
      renderer.render(scene, camera);
    },
    dispose() {
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      noise.dispose();
      renderer.dispose();
    },
  };
}
