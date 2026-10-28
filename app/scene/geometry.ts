import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * Every part is built as plain geometry with `position`, `normal`, `aFlex`
 * (0 = rigid, 1 = moves with the wind) and `aEdge` (glowing edges), then baked
 * into world space and merged per material, so the whole figure is a handful
 * of draw calls.
 */
export type Part = THREE.BufferGeometry;

export function finalize(g: THREE.BufferGeometry, flex: number | ((p: THREE.Vector3) => number) = 0, edge = 0): Part {
  g.deleteAttribute("uv");
  if (g.index) g = g.toNonIndexed();
  const pos = g.getAttribute("position");
  if (!g.getAttribute("normal")) g.computeVertexNormals();
  if (!g.getAttribute("aFlex")) {
    const f = new Float32Array(pos.count);
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) f[i] = typeof flex === "number" ? flex : flex(v.fromBufferAttribute(pos, i));
    g.setAttribute("aFlex", new THREE.BufferAttribute(f, 1));
  }
  if (!g.getAttribute("aEdge")) g.setAttribute("aEdge", new THREE.BufferAttribute(new Float32Array(pos.count).fill(edge), 1));
  if (!g.getAttribute("aVoid")) g.setAttribute("aVoid", new THREE.BufferAttribute(new Float32Array(pos.count), 1));
  return g;
}

/**
 * A grid surface p(u, v) with per-vertex flex. Quads can be skipped (for slits
 * and tatters). `seam` averages the normals of the first and last columns
 * for closed surfaces.
 */
export function gridSurface(
  cols: number,
  rows: number,
  fn: (u: number, v: number, out: THREE.Vector3) => number,
  opts: { skip?: (i: number, j: number) => boolean; seam?: (j: number) => boolean } = {}
): Part {
  const verts = (cols + 1) * (rows + 1);
  const pos = new Float32Array(verts * 3);
  const flex = new Float32Array(verts);
  const v3 = new THREE.Vector3();
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++) {
      const k = j * (cols + 1) + i;
      flex[k] = fn(i / cols, j / rows, v3);
      pos[k * 3] = v3.x;
      pos[k * 3 + 1] = v3.y;
      pos[k * 3 + 2] = v3.z;
    }
  const idx: number[] = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      if (opts.skip?.(i, j)) continue;
      const a = j * (cols + 1) + i;
      const b = a + 1;
      const c = a + cols + 1;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aFlex", new THREE.BufferAttribute(flex, 1));
  g.setIndex(idx);
  g.computeVertexNormals();
  if (opts.seam) {
    const n = g.getAttribute("normal") as THREE.BufferAttribute;
    for (let j = 0; j <= rows; j++) {
      if (!opts.seam(j)) continue;
      const a = j * (cols + 1);
      const b = a + cols;
      const x = n.getX(a) + n.getX(b);
      const y = n.getY(a) + n.getY(b);
      const z = n.getZ(a) + n.getZ(b);
      const l = Math.hypot(x, y, z) || 1;
      n.setXYZ(a, x / l, y / l, z / l);
      n.setXYZ(b, x / l, y / l, z / l);
    }
  }
  const out = g.toNonIndexed();
  const count = out.getAttribute("position").count;
  out.setAttribute("aEdge", new THREE.BufferAttribute(new Float32Array(count), 1));
  out.setAttribute("aVoid", new THREE.BufferAttribute(new Float32Array(count), 1));
  return out;
}

/** A tube along a smooth curve whose radius varies along its length. */
export function taperedTube(
  points: THREE.Vector3[],
  radius: (t: number, a: number) => number,
  opts: { radial?: number; segments?: number; flex?: (t: number) => number; scaleY?: number } = {}
): Part {
  const radial = opts.radial ?? 24;
  const segments = opts.segments ?? 48;
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
  const frames = curve.computeFrenetFrames(segments, false);
  return gridSurface(
    radial,
    segments,
    (u, v, out) => {
      const j = Math.round(v * segments);
      const p = curve.getPointAt(v);
      const a = u * Math.PI * 2;
      const r = radius(v, a);
      const n = frames.normals[j];
      const b = frames.binormals[j];
      out.copy(p).addScaledVector(n, Math.cos(a) * r).addScaledVector(b, Math.sin(a) * r * (opts.scaleY ?? 1));
      return opts.flex ? opts.flex(v) : 0;
    },
    { seam: () => true }
  );
}

/**
 * A smooth shape built from a unit sphere: `fn` moves each vertex (it receives
 * the unit-sphere position), `keep` can cut triangles away (tested on the
 * unit-sphere centroid). Normals are computed on the welded mesh, so the
 * surface stays smooth.
 */
export function deformedSphere(
  w: number,
  h: number,
  fn: (p: THREE.Vector3) => void,
  keep?: (c: THREE.Vector3) => boolean,
  voidFn?: (unit: THREE.Vector3) => number
): Part {
  const raw = new THREE.SphereGeometry(1, w, h);
  raw.deleteAttribute("uv");
  raw.deleteAttribute("normal");
  const g = mergeVertices(raw, 1e-5);
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const unit = (pos.array as Float32Array).slice();
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    fn(v);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const index = g.index!.array;
  const nrm = g.getAttribute("normal") as THREE.BufferAttribute;
  const outP: number[] = [];
  const outN: number[] = [];
  const outV: number[] = [];
  const c = new THREE.Vector3();
  const uv3 = new THREE.Vector3();
  for (let t = 0; t < index.length; t += 3) {
    if (keep) {
      c.set(0, 0, 0);
      for (let k = 0; k < 3; k++) {
        const i = index[t + k] * 3;
        c.x += unit[i] / 3;
        c.y += unit[i + 1] / 3;
        c.z += unit[i + 2] / 3;
      }
      if (!keep(c)) continue;
    }
    for (let k = 0; k < 3; k++) {
      const i = index[t + k];
      outP.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      outN.push(nrm.getX(i), nrm.getY(i), nrm.getZ(i));
      outV.push(voidFn ? voidFn(uv3.set(unit[i * 3], unit[i * 3 + 1], unit[i * 3 + 2])) : 0);
    }
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(new Float32Array(outP), 3));
  out.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(outN), 3));
  out.setAttribute("aVoid", new THREE.BufferAttribute(new Float32Array(outV), 1));
  return out;
}

export function bake(g: THREE.BufferGeometry, m: THREE.Matrix4) {
  g.applyMatrix4(m);
  return g;
}

export const M = {
  at: (x: number, y: number, z: number) => new THREE.Matrix4().makeTranslation(x, y, z),
  rot: (x: number, y: number, z: number) => new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(x, y, z)),
  scale: (x: number, y: number, z: number) => new THREE.Matrix4().makeScale(x, y, z),
  /** Applied in the order given: chain(a, b) applies a, then b. */
  chain: (...ms: THREE.Matrix4[]) => ms.reduce((acc, m) => acc.premultiply(m), new THREE.Matrix4()),
};
