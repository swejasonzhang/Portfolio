import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { bake, deformedSphere, finalize, gridSurface, M, taperedTube, type Part } from "./geometry";
import { C, FOG, noise1, shared, smooth, spline, TONEMAP } from "./shared";

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;

/* ------------------------------------------------------------------ */
/*  Material                                                           */
/* ------------------------------------------------------------------ */

const VERT = /* glsl */ `
uniform float uTime;
uniform float uWind;
attribute float aFlex;
attribute float aEdge;
attribute float aVoid;
varying vec3 vW;
varying vec3 vN;
varying float vEdge;
varying float vVoid;
void main() {
  vec3 p = position;
  float f = aFlex * aFlex;
  float ph = p.y * 1.15 + p.x * .8 + p.z * .6;
  vec3 sway = vec3(
    sin(uTime * .52 + ph) * .55 + sin(uTime * 1.17 + ph * 2.3) * .2 - .25,
    sin(uTime * .9 + ph * 1.7) * .07,
    sin(uTime * .41 + ph * .7) * .4 - .35);
  p += sway * f * uWind;
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vEdge = aEdge;
  vVoid = aVoid;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uRimCol;
uniform vec3 uAuraCol;
uniform float uRim;
uniform float uSheen;
uniform float uAura;
uniform float uInner;
uniform float uEdgeGlow;
uniform float uRimPow;
uniform float uRimFrom;
uniform float uTime;
uniform float uPulse;
uniform vec3 uRift;
varying vec3 vW;
varying vec3 vN;
varying float vEdge;
varying float vVoid;
${TONEMAP}
${FOG}
void main() {
  vec3 N = normalize(vN);
  float inner = 1.;
  if (!gl_FrontFacing) { N = -N; inner = uInner; }
  vec3 V = normalize(cameraPosition - vW);
  vec3 L = normalize(uRift - vW);
  float ndl = dot(N, L);
  float ndv = max(dot(N, V), 0.);
  float fres = pow(1. - ndv, uRimPow);
  // The rift behind the figure lights every edge that faces it.
  float rim = fres * smoothstep(uRimFrom, .55, ndl);
  // A faint cold key from the upper front keeps the folds and plates readable.
  vec3 K = normalize(vec3(-.45, .7, .55));
  float key = max(dot(N, K), 0.);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.), 40.) * uSheen * smoothstep(-.1, .35, ndl);
  vec3 HK = normalize(K + V);
  float specK = pow(max(dot(N, HK), 0.), 60.) * uSheen * .35;
  float flare = exp(-uPulse * 1.1);
  vec3 c = uBase * (.3 + 1.1 * key + .5 * max(ndl, 0.));
  c += uRimCol * (rim * uRim + spec + specK * .4);
  float breathe = .6 + .4 * sin(uTime * 1.1 + vW.y * 2.6);
  float upper = smoothstep(2.5, 4.4, vW.y);
  c += uAuraCol * pow(1. - ndv, 2.6) * uAura * upper * breathe * (1. + 2.5 * flare);
  c += uRimCol * vEdge * uEdgeGlow * (1. + 2. * flare);
  c *= inner * (1. - vVoid);
  gl_FragColor = vec4(tonemap(applyFog(c, vW)), 1.);
}`;

function material(o: { base: THREE.Color; rim: number; sheen: number; aura: number; inner: number; edge?: number; rimPow?: number; rimFrom?: number }) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: THREE.DoubleSide,
    uniforms: {
      ...shared,
      uBase: { value: o.base },
      uRimCol: { value: C.rim },
      uAuraCol: { value: C.aura },
      uRim: { value: o.rim },
      uSheen: { value: o.sheen },
      uAura: { value: o.aura },
      uInner: { value: o.inner },
      uEdgeGlow: { value: o.edge ?? 0 },
      uRimPow: { value: o.rimPow ?? 3.4 },
      uRimFrom: { value: o.rimFrom ?? -0.4 },
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Cloth                                                              */
/* ------------------------------------------------------------------ */

/** The long coat: shoulders to floor, closed to the waist, open and tattered below. */
function coat(): Part {
  const K = [0, 0.05, 0.17, 0.35, 0.44, 0.7, 1];
  const Y = [3.62, 3.46, 3.04, 2.36, 2.06, 1.1, 0.04];
  const RX = [0.46, 0.98, 0.84, 0.64, 0.72, 1.05, 1.42];
  const RZ = [0.3, 0.46, 0.45, 0.37, 0.43, 0.66, 0.9];
  const cols = 180;
  const rows = 130;
  const STRIPS = 23;
  return finalize(
    gridSurface(
      cols,
      rows,
      (u, v, out) => {
        const w = 0.42 * smooth(0.34, 1, v) + 0.06 * smooth(0.34, 0.5, v);
        const th = w + u * (TAU - 2 * w);
        const fold =
          0.55 * Math.sin(7 * th + v * 2.2) + 0.3 * Math.sin(13 * th + 1.7 + v * 1.3) + 0.15 * Math.sin(23 * th + 4.1);
        const amp = 0.012 + 0.09 * smooth(0.36, 1, v);
        const rx = spline(K, RX, v) * (1 + amp * fold);
        const rz = spline(K, RZ, v) * (1 + amp * fold);
        // Tattered hem: the lowest band is cut into uneven strips.
        const strip = Math.floor((th / TAU) * STRIPS);
        const ragged = 0.34 * Math.pow(noise1(strip * 3.7 + 1.3), 1.6) + 0.1 * noise1(th * 31);
        const y = spline(K, Y, v) + ragged * smooth(0.72, 1, v);
        // The hem trails back and the front edges fold outward a little.
        const lapel = 0.06 * smooth(0.34, 0.6, v) * Math.pow(Math.max(0, Math.cos(th)), 6);
        out.set(Math.sin(th) * (rx + lapel), y, Math.cos(th) * rz - 0.2 * v * v);
        return smooth(0.34, 1, v);
      },
      {
        skip: (i, j) => {
          const v = j / rows;
          if (v < 0.86) return false;
          const w = 0.42 * smooth(0.34, 1, v) + 0.06;
          const th = w + (i / cols) * (TAU - 2 * w);
          const f = ((th / TAU) * STRIPS) % 1;
          return f < 0.12;
        },
        seam: (j) => j / rows < 0.34,
      }
    )
  );
}

/** The cape behind: from the shoulders to the ground, widening, trailing, tattered. */
function cape(): Part {
  const cols = 90;
  const rows = 110;
  const STRIPS = 15;
  return finalize(
    gridSurface(
      cols,
      rows,
      (u, v, out) => {
        const s = u * 2 - 1;
        const strip = Math.floor(u * STRIPS);
        const ragged = 0.42 * Math.pow(noise1(strip * 5.1 + 9.2), 1.5) + 0.08 * noise1(u * 47);
        const width = 0.92 + 0.95 * Math.pow(v, 0.85);
        const x = s * width + 0.035 * Math.sin(s * 11 + v * 3) * v;
        const y = 3.6 - v * 3.62 + ragged * smooth(0.75, 1, v);
        const wrap = 0.3 * (1 - s * s) * (1 - 0.4 * v);
        const z = -0.2 - wrap - 0.75 * Math.pow(v, 1.5) - 0.07 * Math.sin(s * 9 + v * 2.4) * v;
        out.set(x, y, z);
        return Math.pow(v, 1.15);
      },
      {
        skip: (i, j) => {
          if (j / rows < 0.84) return false;
          return ((i / cols) * STRIPS) % 1 < 0.14;
        },
      }
    )
  );
}

/** A short capelet over the shoulders, its hem cut into points. */
function mantle(): Part {
  const cols = 160;
  const rows = 40;
  return finalize(
    gridSurface(
      cols,
      rows,
      (u, v, out) => {
        const th = u * TAU;
        const rx = 0.3 + (1.13 - 0.3) * Math.pow(v, 0.8);
        const rz = 0.27 + (0.62 - 0.27) * Math.pow(v, 0.8);
        const point = Math.abs(((th / TAU) * 9 + 0.5) % 1 - 0.5) * 2;
        const y = 3.8 - v * 0.46 - 0.2 * Math.pow(1 - point, 2) * smooth(0.6, 1, v);
        const fold = 1 + 0.035 * Math.sin(th * 9 + 0.8) * v;
        out.set(Math.sin(th) * rx * fold, y, Math.cos(th) * rz * fold - 0.04);
        return 0.25 * v;
      },
      { seam: () => true }
    )
  );
}

/** Wide sleeves with a ragged cuff. */
function sleeve(side: number): Part {
  const pts =
    side > 0
      ? [V(0.9, 3.44, 0), V(1.0, 3.0, 0.03), V(1.12, 2.5, 0.1), V(1.16, 2.1, 0.2), V(1.18, 1.98, 0.27)]
      : [V(-0.9, 3.44, 0), V(-1.0, 3.0, -0.01), V(-1.1, 2.5, 0.04), V(-1.13, 2.1, 0.12), V(-1.14, 1.98, 0.17)];
  return finalize(
    taperedTube(
      pts,
      (t, a) => {
        const flare = 0.2 - 0.03 * t + 0.12 * smooth(0.45, 1, t);
        const rag = t > 0.88 ? -0.03 * noise1(a * 5 + side * 3) : 0;
        return flare * (1 + 0.09 * Math.sin(a * 6 + t * 5) * (0.3 + t)) + rag;
      },
      { radial: 40, segments: 60, flex: (t) => 0.2 * t }
    )
  );
}

/** A long cloth panel hanging from the belt over the legs, pointed and ragged at the bottom. */
function tabard(): Part {
  const cols = 24;
  const rows = 70;
  return finalize(
    gridSurface(cols, rows, (u, v, out) => {
      const s = u * 2 - 1;
      const w = 0.2 + 0.07 * v;
      const point = (1 - Math.abs(s)) * 0.28 * smooth(0.82, 1, v);
      const rag = 0.05 * noise1(u * 9 + 2.1) * smooth(0.85, 1, v);
      const y = 2.26 - v * 2.05 - point + rag;
      out.set(s * w, y, 0.42 + 0.06 * v + 0.03 * (1 - s * s) + 0.04 * Math.sin(v * 4));
      return Math.pow(v, 1.1);
    })
  );
}

/** A raised trim along both front edges of the open coat and around the hem, so the opening reads crisply. */
function coatTrim(): Part[] {
  const K = [0, 0.05, 0.17, 0.35, 0.44, 0.7, 1];
  const Y = [3.62, 3.46, 3.04, 2.36, 2.06, 1.1, 0.04];
  const RX = [0.46, 0.98, 0.84, 0.64, 0.72, 1.05, 1.42];
  const RZ = [0.3, 0.46, 0.45, 0.37, 0.43, 0.66, 0.9];
  const parts: Part[] = [];
  for (const side of [-1, 1]) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) {
      const v = 0.36 + (i / 24) * 0.5;
      const w = 0.42 * smooth(0.34, 1, v) + 0.06 * smooth(0.34, 0.5, v);
      const th = side > 0 ? w : TAU - w;
      const fold = 0.55 * Math.sin(7 * th + v * 2.2) + 0.3 * Math.sin(13 * th + 1.7 + v * 1.3) + 0.15 * Math.sin(23 * th + 4.1);
      const amp = 0.012 + 0.09 * smooth(0.36, 1, v);
      const lapel = 0.06 * smooth(0.34, 0.6, v) * Math.pow(Math.max(0, Math.cos(th)), 6);
      const rx = spline(K, RX, v) * (1 + amp * fold) + lapel;
      const rz = spline(K, RZ, v) * (1 + amp * fold);
      pts.push(V(Math.sin(th) * rx, spline(K, Y, v), Math.cos(th) * rz - 0.2 * v * v));
    }
    parts.push(finalize(taperedTube(pts, () => 0.022, { radial: 10, segments: 60, flex: (t) => 0.6 + 0.4 * t })));
  }
  return parts;
}

/** Two straps crossing the chest, buckled at the center. */
function straps(): Part[] {
  const parts: Part[] = [];
  for (const s of [-1, 1]) {
    const pts = [V(s * 0.62, 3.42, 0.3), V(s * 0.25, 3.05, 0.45), V(-s * 0.18, 2.68, 0.43), V(-s * 0.5, 2.38, 0.36)];
    parts.push(finalize(taperedTube(pts, () => 0.03, { radial: 10, segments: 40, scaleY: 0.4 })));
  }
  const buckle = new THREE.BoxGeometry(0.11, 0.11, 0.03);
  buckle.deleteAttribute("uv");
  bake(buckle, M.chain(M.rot(0, 0, Math.PI / 4), M.at(0, 2.87, 0.465)));
  parts.push(finalize(buckle.toNonIndexed()));
  return parts;
}

/** Two clasps where the cape meets the shoulders, joined by a short chain. */
function clasps(): Part[] {
  const parts: Part[] = [];
  for (const s of [-1, 1]) {
    const disc = new THREE.CylinderGeometry(0.075, 0.075, 0.03, 32, 1);
    disc.deleteAttribute("uv");
    bake(disc, M.chain(M.rot(Math.PI / 2, 0, 0), M.at(s * 0.36, 3.56, 0.36)));
    parts.push(finalize(disc.toNonIndexed()));
  }
  const chain: THREE.Vector3[] = [V(-0.32, 3.55, 0.37), V(0, 3.44, 0.42), V(0.32, 3.55, 0.37)];
  parts.push(finalize(taperedTube(chain, () => 0.013, { radial: 8, segments: 24, flex: () => 0.15 })));
  return parts;
}

/* ------------------------------------------------------------------ */
/*  Head                                                               */
/* ------------------------------------------------------------------ */

/** The hood: a deep, peaked cowl with the face opening cut away. */
function hood(): Part {
  return finalize(
    deformedSphere(
      96,
      72,
      (p) => {
        const u = p.clone();
        // Peak, pulled up and back.
        const peak = smooth(0.15, 1, u.y) * smooth(-0.6, 1, -u.z);
        p.set(u.x * 0.44, u.y * 0.5, u.z * 0.46);
        p.y += 0.2 * peak;
        p.z -= 0.34 * peak * peak;
        p.x *= 1 - 0.35 * peak;
        // The lower hood opens over the shoulders.
        const low = smooth(-0.2, -1, u.y);
        p.x *= 1 + 0.55 * low;
        p.z *= 1 + 0.35 * low;
        // Cloth folds around the cowl.
        const a = Math.atan2(u.x, u.z);
        p.multiplyScalar(1 + 0.025 * Math.sin(a * 7 + u.y * 3) * (0.4 + 0.6 * low));
        // The face: pressed deep into the cowl, a smooth recess that falls into darkness.
        const e = (u.x / 0.56) ** 2 + ((u.y + 0.06) / 0.62) ** 2;
        const pit = smooth(1, 0.35, e) * smooth(0.05, 0.6, u.z);
        p.z -= 0.36 * pit;
        p.x *= 1 - 0.12 * pit;
        // The brow juts forward over the face and the cheeks fold in, so the face sits in shadow.
        const brow = smooth(0.25, 0.6, u.y) * smooth(1.6, 1.0, e) * smooth(0.2, 0.7, u.z);
        p.z += 0.11 * brow;
        p.y -= 0.03 * brow;
        const cheek = smooth(-0.1, -0.55, u.y) * smooth(1.6, 1.0, e) * smooth(0.2, 0.7, u.z);
        p.z -= 0.05 * cheek;
        p.add(V(0, 4.2, 0.02));
      },
      undefined,
      (u) => smooth(1.6, 0.9, (u.x / 0.56) ** 2 + ((u.y + 0.12) / 0.66) ** 2) * smooth(-0.2, 0.3, u.z)
    ),
    (p) => 0.08 * smooth(4.0, 4.9, p.y)
  );
}

/** A high collar rising behind the head, its top edge cut into spikes. */
function collar(): Part {
  const g: THREE.BufferGeometry = new THREE.CylinderGeometry(0.58, 0.4, 0.62, 96, 8, true, 0.9, TAU - 1.8);
  g.deleteAttribute("uv");
  const p = g.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const a = Math.atan2(x, z);
    const top = smooth(0.1, 0.31, y);
    const spike = Math.pow(Math.abs(Math.sin(a * 3.5)), 5) * 0.12;
    p.setXYZ(i, x, y + top * spike, z);
  }
  g.computeVertexNormals();
  bake(g, M.at(0, 4.0, -0.04));
  return finalize(g.toNonIndexed());
}

/* ------------------------------------------------------------------ */
/*  Armor                                                              */
/* ------------------------------------------------------------------ */

function pauldron(side: number): Part[] {
  const parts: Part[] = [];
  // One domed shell over the shoulder whose surface steps outward in four overlapping bands (lames).
  const tilt = -side * 0.36;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  parts.push(
    finalize(
      deformedSphere(
        64,
        40,
        (p) => {
          const u = p.clone();
          const band = ((1 - u.y) * 2.2) % 1;
          const step = 1 + 0.07 * band - 0.07 * smooth(0.9, 1, band);
          const flare = 1 + 0.09 * smooth(0.3, -0.3, u.y);
          let x = u.x * 0.45 * step * flare;
          const y = u.y * 0.37;
          const z = u.z * 0.43 * step * flare;
          // Push the dome outward so it caps the shoulder rather than the neck.
          x += side * 0.06 * (1 - u.y);
          p.set(x * ct - y * st, x * st + y * ct, z).add(V(side * 0.92, 3.52, 0.02));
        },
        (c) => c.y > -0.32
      )
    )
  );
  // Two spikes per shoulder for the silhouette.
  for (const [len, lift, out] of [
    [0.55, 0.0, 0.0],
    [0.36, -0.16, 0.12],
  ]) {
    let g: THREE.BufferGeometry = new THREE.ConeGeometry(0.06, len, 16, 1);
    g.deleteAttribute("uv");
    bake(g, M.chain(M.at(0, len / 2, 0), M.rot(0.15, 0, -side * (0.55 + out * 2)), M.at(side * (1.0 + out), 3.82 + lift, -0.04)));
    g = g.toNonIndexed();
    parts.push(finalize(g));
  }
  return parts;
}

/** Plated gauntlet and a closed hand. */
function gauntlet(side: number, wrist: THREE.Vector3, dir: THREE.Vector3): Part[] {
  const parts: Part[] = [];
  const start = wrist.clone().addScaledVector(dir, -0.42);
  parts.push(
    finalize(
      taperedTube([start, start.clone().lerp(wrist, 0.5), wrist], (t) => 0.115 - 0.02 * t + 0.012 * (Math.sin(t * 18) > 0.6 ? 1 : 0), {
        radial: 28,
        segments: 36,
      })
    )
  );
  const hand = deformedSphere(24, 18, (p) => p.set(p.x * 0.058, p.y * 0.105, p.z * 0.062));
  bake(hand, M.at(wrist.x + side * 0.005, wrist.y - 0.05, wrist.z + 0.02));
  parts.push(finalize(hand));
  return parts;
}

/** Legs and boots, seen through the open coat. */
function legs(): Part[] {
  const parts: Part[] = [];
  for (const s of [-1, 1]) {
    parts.push(
      finalize(
        taperedTube([V(s * 0.2, 2.2, 0), V(s * 0.24, 1.2, 0.07), V(s * 0.27, 0.22, 0.02)], (t) => 0.14 - 0.045 * t, {
          radial: 24,
          segments: 40,
        })
      )
    );
    const boot = deformedSphere(24, 16, (p) => p.set(p.x * 0.11, p.y * 0.09, p.z * 0.22));
    bake(boot, M.at(s * 0.27, 0.08, 0.08));
    parts.push(finalize(boot));
    const knee = deformedSphere(24, 16, (p) => p.set(p.x * 0.13, p.y * 0.12, p.z * 0.07), (c) => c.z > 0);
    bake(knee, M.at(s * 0.24, 1.22, 0.14));
    parts.push(finalize(knee));
  }
  return parts;
}

/* ------------------------------------------------------------------ */
/*  Blade                                                              */
/* ------------------------------------------------------------------ */

function blade(hand: THREE.Vector3, tip: THREE.Vector3): Part[] {
  const dir = tip.clone().sub(hand).normalize();
  const len = tip.distanceTo(hand) - 0.08;
  const segs = 60;
  const pos: number[] = [];
  const edge: number[] = [];
  // Cross-section: a flattened diamond (edge, spine, edge, spine).
  const ring = (t: number) => {
    const w = 0.066 * (t < 0.86 ? 1 - 0.18 * t : (1 - 0.18 * 0.86) * (1 - (t - 0.86) / 0.14));
    const th = 0.017 * (1 - 0.5 * t);
    return [
      [w, 0, 1],
      [0, th, 0],
      [-w, 0, 1],
      [0, -th, 0],
    ];
  };
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs;
    const t1 = (i + 1) / segs;
    const a = ring(t0);
    const b = ring(t1);
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      const quad = [
        [a[k], -t0 * len],
        [b[k], -t1 * len],
        [a[k2], -t0 * len],
        [a[k2], -t0 * len],
        [b[k], -t1 * len],
        [b[k2], -t1 * len],
      ] as const;
      for (const [c, y] of quad) {
        pos.push(c[0], y - 0.08, c[1]);
        edge.push(c[2]);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("aEdge", new THREE.BufferAttribute(new Float32Array(edge), 1));
  g.computeVertexNormals();
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, -1, 0), dir);
  const twist = new THREE.Quaternion().setFromAxisAngle(dir, 0.9);
  const m = new THREE.Matrix4().compose(hand, twist.multiply(q), V(1, 1, 1));
  bake(g, m);
  const parts: Part[] = [finalize(g)];
  // Guard and grip.
  const guardDir = new THREE.Vector3(1, 0, 0).applyQuaternion(twist);
  const g0 = hand.clone().addScaledVector(dir, 0.08);
  parts.push(
    finalize(
      taperedTube(
        [g0.clone().addScaledVector(guardDir, -0.17).addScaledVector(dir, -0.04), g0, g0.clone().addScaledVector(guardDir, 0.17).addScaledVector(dir, -0.04)],
        (t) => 0.026 * (1 - 0.5 * Math.abs(t - 0.5)),
        { radial: 12, segments: 24 }
      )
    )
  );
  parts.push(finalize(taperedTube([hand.clone().addScaledVector(dir, -0.2), hand.clone().addScaledVector(dir, 0.06)], () => 0.024, { radial: 12, segments: 8 })));
  return parts;
}

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export type Figure = {
  group: THREE.Group;
  eyes: THREE.Vector3[];
  /** Points on the upper body that the aura rises from. */
  auraAnchors: THREE.Vector3[];
};

export function buildFigure(): Figure {
  const rightWrist = V(1.19, 1.86, 0.3);
  const leftWrist = V(-1.14, 1.86, 0.2);
  const hand = V(1.2, 1.72, 0.33);
  const tip = V(1.55, 0.03, 0.74);

  const cloth = [coat(), cape(), mantle(), sleeve(1), sleeve(-1), hood(), tabard()];
  const armor = [
    ...pauldron(1),
    ...pauldron(-1),
    collar(),
    ...coatTrim(),
    ...clasps(),
    ...straps(),
    ...gauntlet(1, rightWrist, V(0.02, -1, 0.15).normalize()),
    ...gauntlet(-1, leftWrist, V(-0.01, -1, 0.1).normalize()),
  ];
  // The last gauntlet part on each side is the hand: [.., rightTube, rightHand, leftTube, leftHand].
  const hands = armor.splice(armor.length - 1, 1).concat(armor.splice(armor.length - 2, 1));
  const dark = [...legs(), ...hands];
  const steel = blade(hand, tip);

  const group = new THREE.Group();
  const add = (parts: Part[], mat: THREE.Material) => {
    const merged = mergeGeometries(parts, false);
    if (!merged) throw new Error("figure: could not merge parts");
    merged.computeBoundingSphere();
    group.add(new THREE.Mesh(merged, mat));
  };
  add(cloth, material({ base: C.base, rim: 1.0, sheen: 0.06, aura: 0.22, inner: 0.18, rimPow: 4.6, rimFrom: -0.05 }));
  add(armor, material({ base: C.armor, rim: 1.4, sheen: 1.1, aura: 0.12, inner: 0.25, rimPow: 3.2 }));
  add(dark, material({ base: C.skin, rim: 0.55, sheen: 0.15, aura: 0.0, inner: 0.3 }));

  add(steel, material({ base: C.armor, rim: 1.5, sheen: 1.6, aura: 0.05, inner: 0.4, edge: 0.55 }));

  return {
    group,
    eyes: [V(-0.085, 4.18, 0.25), V(0.085, 4.18, 0.25)],
    auraAnchors: [
      V(-0.95, 3.7, 0),
      V(0.95, 3.7, 0),
      V(-0.5, 4.05, -0.1),
      V(0.5, 4.05, -0.1),
      V(0, 4.6, -0.3),
      V(-1.15, 2.6, 0.05),
      V(1.15, 2.6, 0.1),
      V(-0.7, 3.2, -0.3),
      V(0.7, 3.2, -0.3),
    ],
  };
}
