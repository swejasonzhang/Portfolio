import * as THREE from "three";
import { FOG, RIFT, RIFT_LIGHT, shared, TONEMAP } from "./shared";

export type Env = {
  objects: THREE.Object3D[];
  /** Per-frame update: billboards face the camera, the sky follows the rift on screen. */
  update(camera: THREE.PerspectiveCamera, aspect: number): void;
};

/** The sky: a full-screen layer behind everything, glowing where the rift is. */
function sky(noise: THREE.Texture) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const mat = new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      ...shared,
      uNoise: { value: noise },
      uRiftScreen: { value: new THREE.Vector2(0.8, 0.5) },
      uRiftVis: { value: 1 },
      uAspect: { value: 1.6 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = position.xy * .5 + .5; gl_Position = vec4(position.xy, .9999, 1.); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uNoise;
      uniform vec2 uRiftScreen;
      uniform float uRiftVis;
      uniform float uAspect;
      uniform float uTime;
      varying vec2 vUv;
      ${TONEMAP}
      void main() {
        vec2 uv = vUv;
        vec3 c = mix(vec3(.0026, .0036, .0085), vec3(.006, .009, .02), smoothstep(.2, 1.2, uv.y));
        vec2 d = (uv - uRiftScreen) * vec2(uAspect, 1.);
        float glow = exp(-(d.x * d.x * 2.6 + d.y * d.y * .35) * 3.) * uRiftVis;
        c += vec3(.1, .2, .4) * glow * .45;
        vec2 q = uv * vec2(uAspect, 1.);
        float n = texture2D(uNoise, q * .22 + vec2(uTime * .004, uTime * .0015)).r;
        float n2 = texture2D(uNoise, q * .5 - vec2(uTime * .006, -uTime * .002)).r;
        c += vec3(.005, .008, .018) * smoothstep(.4, .85, n * .75 + n2 * .35) * (.6 + glow * 1.2);
        c *= mix(.5, 1., smoothstep(1.25, .25, length((uv - vec2(.55, .5)) * vec2(1.15, 1.35))));
        gl_FragColor = vec4(tonemap(c), 1.);
      }`,
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return { mesh, mat };
}

/** The rift: a jagged vertical slit of flowing light. Never a circle. */
function rift(noise: THREE.Texture) {
  const W = 5;
  const H = 13;
  const geo = new THREE.PlaneGeometry(W, H);
  geo.translate(0, H / 2, 0);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { ...shared, uNoise: { value: noise }, uOpen: { value: 0.11 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uNoise;
      uniform float uTime;
      uniform float uOpen;
      varying vec2 vUv;
      ${TONEMAP}
      void main() {
        float y = vUv.y * ${H.toFixed(1)};
        float x = (vUv.x - .5) * ${W.toFixed(1)};
        float env = pow(clamp(sin(3.14159 * clamp(y / 12.4, 0., 1.)), 0., 1.), .55);
        float cx = .16 * sin(y * .5 + 1.3) + .07 * sin(y * 1.7) + .03 * sin(y * 5.);
        float n1 = texture2D(uNoise, vec2(y * .05, uTime * .015)).r;
        float n2 = texture2D(uNoise, vec2(y * .21 + 3., uTime * .04)).r;
        float hw = env * (uOpen + .12 * n1 + .05 * n2);
        float dx = abs(x - cx);
        float core = 1. - smoothstep(hw * .3, hw, dx);
        float inner = 1. - smoothstep(0., hw * .45, dx);
        float flow = texture2D(uNoise, vec2((x - cx) * .7 + .3, y * .1 - uTime * .07)).r;
        float vein = smoothstep(.55, .78, texture2D(uNoise, vec2((x - cx) * 1.6, y * .24 - uTime * .11)).r);
        vec3 col = (mix(vec3(.3, .18, .7), vec3(.42, .75, 1.25) * 1.5, flow) + vec3(.4, .7, 1.1) * vein * .6) * core;
        col += vec3(1.7, 1.9, 2.2) * inner * inner * core;
        float edge = smoothstep(${(W / 2).toFixed(2)}, ${(W / 2 - 1.4).toFixed(2)}, abs(x)) * smoothstep(0., .6, y);
        col += vec3(.3, .55, 1.) * (exp(-dx * 3.) * .35 + exp(-dx * .9) * .07) * env * edge;
        gl_FragColor = vec4(tonemap(col), 1.);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(RIFT.x, 0, RIFT.z);
  return mesh;
}

/** Wet dark ground that catches the rift's light. */
function ground(noise: THREE.Texture) {
  const geo = new THREE.PlaneGeometry(240, 240);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { ...shared, uNoise: { value: noise } },
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uNoise;
      uniform vec3 uRift;
      varying vec3 vW;
      ${TONEMAP}
      ${FOG}
      void main() {
        float n = texture2D(uNoise, vW.xz * .045).r;
        float n2 = texture2D(uNoise, vW.xz * .21).r;
        vec3 V = normalize(vW - cameraPosition);
        vec3 R = reflect(V, vec3(0., 1., 0.));
        vec3 toR = normalize(uRift - vW);
        float refl = pow(max(dot(R, toR), 0.), 30.) * (.4 + .6 * n2);
        float pool = exp(-abs(vW.x - uRift.x) * .3) * exp(-abs(vW.z - uRift.z) * .07);
        vec3 c = vec3(.003, .004, .009) * (.5 + .9 * n) + vec3(.3, .55, .95) * (pool * .1 + refl * .45);
        float r = length(vW.xz - vec2(.1, -.2));
        c += vec3(.2, .36, .7) * .05 * exp(-r * .55) * (.6 + .4 * n2);
        c *= mix(.3, 1., smoothstep(.2, 1.7, r));
        float far = 1. - smoothstep(22., 60., length(vW.xz - cameraPosition.xz));
        gl_FragColor = vec4(tonemap(applyFog(c, vW)), far);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -5;
  return mesh;
}

/** Layers of low mist that roll slowly through the scene. */
function mist(noise: THREE.Texture) {
  const layers = [
    { p: [0.5, 1.0, 2.4], w: 18, h: 2.0, s: 0.24, a: 0.42, speed: 0.012 },
    { p: [-1.5, 1.6, -2.5], w: 24, h: 3.2, s: 0.17, a: 0.3, speed: -0.009 },
    { p: [3, 2.6, -8], w: 30, h: 5.2, s: 0.12, a: 0.28, speed: 0.007 },
    { p: [4.6, 1.6, -9.5], w: 10, h: 3.2, s: 0.26, a: 0.32, speed: -0.014 },
  ];
  return layers.map((l, i) => {
    const geo = new THREE.PlaneGeometry(l.w, l.h);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { ...shared, uNoise: { value: noise } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vW;
        void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uNoise;
        uniform float uTime;
        uniform vec3 uRift;
        varying vec2 vUv;
        varying vec3 vW;
        ${TONEMAP}
        void main() {
          vec2 q = vUv * vec2(${(l.w * l.s).toFixed(3)}, ${(l.h * l.s).toFixed(3)});
          float n = texture2D(uNoise, q + vec2(uTime * ${l.speed.toFixed(4)}, ${i * 0.37})).r;
          float n2 = texture2D(uNoise, q * 2.1 - vec2(uTime * ${(l.speed * 1.7).toFixed(4)}, ${i * 0.11})).r;
          float m = smoothstep(.38, .82, n * .7 + n2 * .4);
          float fade = smoothstep(0., .45, vUv.y) * smoothstep(1., .35, vUv.y) * smoothstep(0., .3, vUv.x) * smoothstep(1., .7, vUv.x) * smoothstep(0., .5, vW.y);
          float lit = exp(-length(vW.xz - uRift.xz) * .09);
          vec3 c = vec3(.008, .012, .026) + vec3(.2, .36, .7) * lit * .3;
          gl_FragColor = vec4(tonemap(c), m * fade * ${l.a.toFixed(2)});
        }`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(l.p[0], l.p[1], l.p[2]);
    mesh.renderOrder = 2;
    return mesh;
  });
}

/** Embers drifting up through the whole scene; all motion runs on the GPU. */
function embers(count: number) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = Math.random() * 11;
    pos[i * 3 + 2] = 4 - Math.random() * 20;
    seed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { ...shared },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uPx;
      attribute float aSeed;
      varying float vA;
      varying float vV;
      void main() {
        vec3 p = position;
        float speed = .1 + .22 * fract(aSeed * 7.3);
        p.y = mod(p.y + uTime * speed, 11.);
        p.x += sin(uTime * .3 + aSeed * 40.) * .35;
        p.z += cos(uTime * .25 + aSeed * 30.) * .25;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.6 + 2.6 * fract(aSeed * 13.1)) * uPx * (9. / max(-mv.z, 1.));
        vA = (.3 + .7 * fract(aSeed * 3.7)) * smoothstep(0., 1.2, p.y) * (1. - smoothstep(9., 11., p.y)) * (.55 + .45 * sin(uTime * 1.6 + aSeed * 50.));
        vV = step(.7, fract(aSeed * 5.9));
      }`,
    fragmentShader: /* glsl */ `
      varying float vA;
      varying float vV;
      ${TONEMAP}
      void main() {
        vec2 q = gl_PointCoord - .5;
        float a = smoothstep(.5, .0, length(q * vec2(1., .55))) * vA;
        gl_FragColor = vec4(tonemap(mix(vec3(.5, .8, 1.25), vec3(.6, .38, 1.2), vV)), a);
      }`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  return pts;
}

/** Violet smoke rising off the figure's shoulders and hood. Parented to the figure. */
export function aura(anchors: THREE.Vector3[], count: number, noise: THREE.Texture) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = anchors[i % anchors.length];
    pos[i * 3] = a.x + (Math.random() - 0.5) * 0.4;
    pos[i * 3 + 1] = a.y + (Math.random() - 0.5) * 0.3;
    pos[i * 3 + 2] = a.z + (Math.random() - 0.5) * 0.4;
    seed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { ...shared, uNoise: { value: noise } },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uPx;
      uniform float uPulse;
      attribute float aSeed;
      varying float vA;
      varying float vS;
      void main() {
        float life = fract(uTime * (.05 + .05 * fract(aSeed * 3.1)) + aSeed);
        vec3 p = position + vec3(sin(aSeed * 20. + uTime * .4) * .3 * life, life * 1.7, cos(aSeed * 17. + uTime * .35) * .22 * life);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        float flare = exp(-uPulse * 1.1);
        gl_PointSize = (40. + 70. * life) * uPx * (9. / max(-mv.z, 1.)) * (1. + .5 * flare);
        vA = sin(3.14159 * life) * (.06 + .05 * fract(aSeed * 9.)) * (1. + 2. * flare);
        vS = aSeed;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uNoise;
      varying float vA;
      varying float vS;
      ${TONEMAP}
      void main() {
        vec2 q = gl_PointCoord;
        float n = texture2D(uNoise, q * .22 + vec2(vS * 7.1, vS * 3.3)).r;
        float d = length((q - .5) * vec2(1.4, 1.));
        float a = exp(-d * d * 14.) * (.45 + .55 * smoothstep(.3, .7, n)) * vA;
        gl_FragColor = vec4(tonemap(vec3(.5, .3, 1.15)), a);
      }`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.renderOrder = 3;
  return pts;
}

/** The two eyes: a hot core with a soft horizontal streak. Parented to the figure. */
export function eyeGlow(eyes: THREE.Vector3[]) {
  const geo = new THREE.BufferGeometry().setFromPoints(eyes);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: { ...shared },
    vertexShader: /* glsl */ `
      uniform float uPx;
      uniform float uPulse;
      uniform float uTime;
      varying float vF;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mv;
        vF = 1. + 2.2 * exp(-uPulse * 1.1) + .12 * sin(uTime * 2.3);
        gl_PointSize = 46. * uPx * (9. / max(-mv.z, 1.)) * (.85 + .15 * vF);
      }`,
    fragmentShader: /* glsl */ `
      varying float vF;
      ${TONEMAP}
      void main() {
        vec2 q = gl_PointCoord - .5;
        float core = exp(-dot(q * vec2(12., 34.), q * vec2(12., 34.)));
        float streak = exp(-abs(q.y) * 60.) * exp(-abs(q.x) * 6.) * .45;
        float halo = exp(-length(q) * 12.) * .25;
        vec3 c = vec3(1.6, 1.9, 2.3) * core + vec3(.45, .75, 1.3) * streak + vec3(.45, .3, 1.1) * halo;
        gl_FragColor = vec4(tonemap(c * vF), 1.);
      }`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.renderOrder = 4;
  return pts;
}

export function buildEnvironment(noise: THREE.Texture, opts: { embers: number }): Env {
  const s = sky(noise);
  const r = rift(noise);
  const gnd = ground(noise);
  const fog = mist(noise);
  const emb = embers(opts.embers);
  const v = new THREE.Vector3();
  return {
    objects: [s.mesh, gnd, r, ...fog, emb],
    update(camera, aspect) {
      r.rotation.y = Math.atan2(camera.position.x - r.position.x, camera.position.z - r.position.z);
      for (const m of fog) m.quaternion.copy(camera.quaternion);
      v.copy(RIFT_LIGHT).project(camera);
      s.mat.uniforms.uRiftScreen.value.set(v.x * 0.5 + 0.5, v.y * 0.5 + 0.5);
      s.mat.uniforms.uRiftVis.value = v.z < 1 ? 1 : 0;
      s.mat.uniforms.uAspect.value = aspect;
    },
  };
}
