import * as THREE from "three";

/** World layout: the figure stands at the origin facing +z; the rift opens behind it. */
export const RIFT = new THREE.Vector3(4.6, 0, -11);
export const RIFT_LIGHT = new THREE.Vector3(4.6, 4.8, -11);

/** Linear-light palette. */
export const C = {
  base: new THREE.Color(0.0075, 0.0085, 0.016),
  armor: new THREE.Color(0.012, 0.013, 0.022),
  skin: new THREE.Color(0.004, 0.0045, 0.008),
  rim: new THREE.Color(0.42, 0.74, 1.25),
  aura: new THREE.Color(0.46, 0.26, 1.05),
  fog: new THREE.Color(0.0026, 0.0036, 0.0085),
};

/** Uniforms every material shares, so one update reaches the whole scene. */
export const shared = {
  uTime: { value: 0 },
  uPulse: { value: 99 },
  uRift: { value: RIFT_LIGHT.clone() },
  uFog: { value: C.fog.clone() },
  uFogD: { value: 0.034 },
  uWind: { value: 0.055 },
  /** Device pixels per CSS pixel, for point sizes. */
  uPx: { value: 1 },
};

/** ACES-style filmic curve and gamma, shared by every fragment shader (the renderer outputs linear). */
export const TONEMAP = /* glsl */ `
vec3 tonemap(vec3 c) {
  c = (c * (2.51 * c + .03)) / (c * (2.43 * c + .59) + .14);
  return pow(clamp(c, 0., 1.), vec3(1. / 2.2));
}`;

export const FOG = /* glsl */ `
uniform vec3 uFog;
uniform float uFogD;
vec3 applyFog(vec3 c, vec3 w) {
  float d = length(w - cameraPosition);
  float f = 1. - exp(-pow(d * uFogD, 1.35));
  f = max(f, (1. - smoothstep(0., 1.1, w.y)) * .5);
  return mix(c, uFog, clamp(f, 0., 1.));
}`;

/** Deterministic hash and smooth 1D noise for building geometry. */
export function hash1(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
export function noise1(x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash1(i) * (1 - u) + hash1(i + 1) * u;
}
export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Catmull-Rom through keyed values at arbitrary knots. */
export function spline(knots: number[], values: number[], x: number) {
  const n = knots.length;
  if (x <= knots[0]) return values[0];
  if (x >= knots[n - 1]) return values[n - 1];
  let i = 0;
  while (x > knots[i + 1]) i++;
  const t = (x - knots[i]) / (knots[i + 1] - knots[i]);
  const p0 = values[Math.max(0, i - 1)];
  const p1 = values[i];
  const p2 = values[i + 1];
  const p3 = values[Math.min(n - 1, i + 2)];
  const m1 = (p2 - p0) * 0.5;
  const m2 = (p3 - p1) * 0.5;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * p1 + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2 + (t3 - t2) * m2;
}

/** A tileable fbm noise texture, generated once on the CPU (single channel). */
export function noiseTexture(size = 256, period = 6, octaves = 4) {
  const data = new Uint8Array(size * size);
  const h = (x: number, y: number, p: number) => hash1(((x % p) + p) % p * 57.13 + (((y % p) + p) % p) * 311.71 + p * 7.3);
  const vnoise = (x: number, y: number, p: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = h(xi, yi, p);
    const b = h(xi + 1, yi, p);
    const c = h(xi, yi + 1, p);
    const d = h(xi + 1, yi + 1, p);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      let s = 0;
      let amp = 0.5;
      let p = period;
      let norm = 0;
      for (let o = 0; o < octaves; o++) {
        s += amp * vnoise((x / size) * p, (y / size) * p, p);
        norm += amp;
        amp *= 0.5;
        p *= 2;
      }
      data[y * size + x] = Math.round((s / norm) * 255);
    }
  const tex = new THREE.DataTexture(data, size, size, THREE.RedFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}
