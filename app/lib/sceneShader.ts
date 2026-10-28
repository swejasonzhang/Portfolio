/**
 * The scene behind the whole page: a raymarched Shadow-Monarch-like figure
 * before a vertical rift of light, a legion of kneeling shades in the fog.
 * Original procedural geometry (signed distance fields), no external assets.
 *
 * Uniforms: uRes (px), uTime (s), uSec (0..4, continuous gate), uPtr (-1..1),
 * uPulse (s since last press), uDim (0..1), uSteps (march budget), uWide (0..1).
 */
export const SCENE_VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

export const SCENE_FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uSec;
uniform vec2 uPtr;
uniform float uPulse;
uniform float uDim;
uniform float uSteps;
uniform float uWide;

const float PI = 3.14159265;
const vec3 RIFT = vec3(4.6, 0., 11.);

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; } return s; }
float noise3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float n = i.x + i.y * 57. + i.z * 113.;
  return mix(mix(mix(fract(sin(n) * 43758.5453), fract(sin(n + 1.) * 43758.5453), f.x), mix(fract(sin(n + 57.) * 43758.5453), fract(sin(n + 58.) * 43758.5453), f.x), f.y),
             mix(mix(fract(sin(n + 113.) * 43758.5453), fract(sin(n + 114.) * 43758.5453), f.x), mix(fract(sin(n + 170.) * 43758.5453), fract(sin(n + 171.) * 43758.5453), f.x), f.y), f.z); }

float smin(float a, float b, float k){ float h = clamp(.5 + .5 * (b - a) / k, 0., 1.); return mix(b, a, h) - k * h * (1. - h); }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.); return length(pa - ba * h) - r; }
float sdEllipsoid(vec3 p, vec3 r){ float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.) / k1; }
float sdCone(vec3 p, float h, float r1, float r2){
  vec2 q = vec2(length(p.xz), p.y);
  vec2 k1 = vec2(r2, h), k2 = vec2(r2 - r1, 2. * h);
  vec2 ca = vec2(q.x - min(q.x, (q.y < 0.) ? r1 : r2), abs(q.y) - h);
  vec2 cb = q - k1 + k2 * clamp(dot(k1 - q, k2) / dot(k2, k2), 0., 1.);
  float s = (cb.x < 0. && ca.y < 0.) ? -1. : 1.;
  return s * sqrt(min(dot(ca, ca), dot(cb, cb)));
}

float gEye, gArmy, gRift, gAura, mId, gSil;

float riftHalfWidth(float y){
  float env = pow(clamp(sin(PI * clamp(y / 12., 0., 1.)), 0., 1.), .55);
  float open = mix(.16, .46, smoothstep(3.2, 4., uSec));
  return env * (open + .14 * noise(vec2(y * 1.7, uTime * .25)) + .05 * noise(vec2(y * 7., uTime * .6)));
}
float riftCenter(float y){ return RIFT.x + .16 * sin(y * .5 + 1.3) + .07 * sin(y * 1.7) + .03 * sin(y * 5.); }
float riftDist(vec3 p){
  float slab = abs(p.z - RIFT.z) - .05;
  float side = abs(p.x - RIFT.x) - 1.2;
  if (slab > .8 || side > .8) return max(slab, side);
  float dx = abs(p.x - riftCenter(p.y)) - riftHalfWidth(p.y);
  float dz = abs(p.z - RIFT.z) - .05;
  float dy = max(-p.y, p.y - 12.);
  return max(max(dx, dz), dy);
}

float monarch(vec3 p){
  float bound = sdCapsule(p, vec3(.2, .6, -.1), vec3(0., 4.5, 0.), 1.95);
  if (bound > .6) return bound;
  float turn = PI * smoothstep(3.25, 3.95, uSec);
  float cs = cos(turn), sn = sin(turn);
  p.xz = vec2(cs * p.x - sn * p.z, sn * p.x + cs * p.z);
  p.x += sin(uTime * .35) * .012 * p.y;
  // hood and head
  float d = sdEllipsoid(p - vec3(0., 4.22, .06), vec3(.36, .44, .38));
  d = smin(d, sdCapsule(p, vec3(0., 4.36, .22), vec3(.02, 4.62, .46), .05), .16);
  // high collar standing behind the head
  d = smin(d, sdCapsule(p, vec3(0., 3.7, 0.), vec3(0., 4.0, .02), .17), .1);
  // shoulders
  d = smin(d, sdEllipsoid(p - vec3(-.55, 3.6, .05), vec3(.52, .32, .4)), .28);
  d = smin(d, sdEllipsoid(p - vec3(.55, 3.6, .05), vec3(.52, .32, .4)), .28);
  d = smin(d, sdEllipsoid(p - vec3(0., 3.85, .12), vec3(.42, .32, .34)), .2);
  vec3 q = p; q.z *= 1.45;
  d = smin(d, sdCone(q - vec3(0., 2.9, 0.), .62, .52, .85), .22);
  // long coat with folds and a hem that dissolves into smoke
  vec3 c = p; c.z *= 1.2;
  float coat = sdCone(c - vec3(0., 1.42, .08), 1.42, 1.55, .6);
  float a = atan(p.x, p.z);
  float hem = smoothstep(1.6, 0., p.y);
  coat += sin(a * 9. + p.y * .7 + sin(uTime * .4) * .6) * .045 * (1. - p.y / 3.);
  coat += (noise3(p * vec3(2.6, 1.4, 2.6) + vec3(0., -uTime * .45, 0.)) - .5) * .5 * hem;
  d = smin(d, coat, .25);
  // arms; the right hand holds a long blade
  d = smin(d, sdCapsule(p, vec3(-.88, 3.4, 0.), vec3(-1.08, 2.42, -.08), .17), .14);
  d = smin(d, sdCapsule(p, vec3(-1.08, 2.42, -.08), vec3(-1.12, 1.62, -.2), .13), .08);
  d = smin(d, sdCapsule(p, vec3(.88, 3.4, 0.), vec3(1.1, 2.48, -.1), .17), .14);
  d = smin(d, sdCapsule(p, vec3(1.1, 2.48, -.1), vec3(1.18, 1.7, -.3), .13), .08);
  float blade = sdCapsule(p, vec3(1.19, 1.74, -.32), vec3(1.52, .02, -.7), .028);
  d = min(d, blade);
  // the shadow aura: violet flame licking up off the body
  float fl = noise3(p * vec3(3., .9, 3.) - vec3(0., uTime * 1.2, 0.));
  float halo = exp(-max(d, 0.) * 5.) * (1. - exp(-max(d, 0.) * 30.));
  gAura += halo * smoothstep(.55, .9, fl) * .05 * smoothstep(1.2, 4.2, p.y);
  // eyes
  vec3 e1 = p - vec3(-.095, 4.16, -.34), e2 = p - vec3(.095, 4.16, -.34);
  e1.y *= 2.6; e2.y *= 2.6;
  float flare = 1. + 3. * exp(-uPulse * 1.4);
  gEye += flare * (.000035 / (dot(e1, e1) + .00006) + .000035 / (dot(e2, e2) + .00006));
  return d;
}

float army(vec3 p){
  vec2 cell = vec2(2.1, 2.3);
  vec2 id = floor(p.xz / cell);
  vec2 lc = (id + .5) * cell;
  vec2 fr = abs(p.xz - lc);
  vec3 bq = p - vec3(1., 1.6, 15.5);
  vec3 bb = abs(bq) - vec3(15.5, 1.75, 10.5);
  float box = length(max(bb, 0.)) + min(max(bb.x, max(bb.y, bb.z)), 0.);
  if (box > .3) return box;
  float edge = max(min(cell.x * .5 - fr.x, cell.y * .5 - fr.y), 0.) + .08;
  float h = hash(id);
  float region = step(5.5, lc.y) * step(lc.y, 26.) * step(abs(lc.x - 1.), 15.);
  float lane = abs(lc.x - lc.y / RIFT.z * RIFT.x);
  float corridor = step(lane, 2.2) * step(lc.y, 12.8);
  if (region < .5 || corridor > .5 || h < .2) return max(edge, p.y - 2.2);
  vec3 q = p - vec3(lc.x + (hash(id + 3.1) - .5) * .4, 0., lc.y + (hash(id + 7.7) - .5) * .5);
  float s = .85 + .35 * hash(id + 1.9);
  q /= s;
  float kneel = step(.5, h);
  float top = mix(1.75, 1.2, kneel);
  float lean = mix(.04, .3, kneel);
  vec3 r = q; r.z += lean * (r.y / top);
  float d = sdCone(r - vec3(0., top * .5, 0.), top * .5, .5, .2);
  d = smin(d, sdEllipsoid(r - vec3(0., top + .12, -.04), vec3(.2, .25, .22)), .14);
  d = smin(d, sdEllipsoid(r - vec3(0., top - .12, 0.), vec3(.34, .2, .24)), .18);
  float spear = step(.72, hash(id + 9.4));
  d = mix(d, min(d, sdCapsule(r, vec3(.32, .1, -.1), vec3(.36, top + 1.3, -.18), .025)), spear);
  d *= s;
  float dist = length(lc);
  float wave = exp(-pow((uPulse * 10. - dist) * .5, 2.)) * step(uPulse, 7.);
  float lit = step(.4, hash(id + 5.3)) * (.4 + .6 * (.5 + .5 * sin(uTime * .6 + h * 40.)));
  vec3 eq = r * s - vec3(0., top + .1, -.25) * s; eq.y *= 2.4;
  vec3 ee = vec3(abs(eq.x) - .055 * s, eq.y, eq.z);
  gArmy += (lit * .5 + wave * 3.5) * .00003 / (dot(ee, ee) + .00008);
  return min(d, edge);
}

float map(vec3 p){
  float m = monarch(p);
  float a = army(p);
  float g = p.y + .03 * fbm(p.xz * .7);
  float d = min(m, min(a, g));
  mId = d == m ? 1. : (d == a ? 2. : 3.);
  gSil = min(m, a);
  return d;
}

vec3 calcNormal(vec3 p){
  vec2 e = vec2(.002, -.002);
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

void keyframe(float i, out vec3 ro, out vec3 ta){
  if (i < .5)      { ro = mix(vec3(.5, 1.2, -14.5), vec3(-2.6, 1.15, -11.5), uWide); ta = mix(vec3(.5, 3.8, 0.), vec3(-2.4, 3.1, 0.), uWide); }
  else if (i < 1.5){ ro = vec3(-6., 5.6, -11.5); ta = vec3(.6, 2.2, 5.); }
  else if (i < 2.5){ ro = vec3(7., 2.2, -6.);  ta = vec3(-.2, 2.8, 4.); }
  else if (i < 3.5){ ro = vec3(.4, 12., -6.); ta = vec3(.4, 0., 8.); }
  else             { ro = vec3(-4.2, 1.9, -10.6);  ta = vec3(-2.6, 3.9, 11.); }
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - .5 * uRes) / uRes.y;
  vec2 suv = frag / uRes;

  float s = clamp(uSec, 0., 4.);
  float i0 = floor(s), f = smoothstep(0., 1., fract(s));
  vec3 ro0, ta0, ro1, ta1;
  keyframe(i0, ro0, ta0); keyframe(min(i0 + 1., 4.), ro1, ta1);
  vec3 ro = mix(ro0, ro1, f), ta = mix(ta0, ta1, f);
  ro += vec3(uPtr.x * .5, uPtr.y * .3, 0.);
  ro.y += sin(uTime * .2) * .04;

  vec3 ww = normalize(ta - ro), uu = normalize(cross(vec3(0., 1., 0.), ww)), vv = cross(ww, uu);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.7 * ww);

  gEye = 0.; gArmy = 0.; gRift = 0.; gAura = 0.;
  float t = .05 + hash(frag + fract(uTime)) * .3, hit = 0.;
  float spent = 0.;
  // edge coverage: how close each ray came to a silhouette, for anti-aliasing
  float pixA = 1. / (uRes.y * 1.7);
  float cov = 0., tCov = 0., covId = 0.;
  for (int i = 0; i < 120; i++){
    if (float(i) > uSteps) break;
    spent += 1.;
    vec3 p = ro + rd * t;
    float d = map(p);
    float rdist = riftDist(p);
    float stp = min(d, rdist + .04);
    gRift += exp(-max(rdist, 0.) * 2.6) * .035 * min(stp, 1.5);
    if (rdist < .0) { hit = 2.; break; }
    if (d < .0009 * t) { hit = 1.; break; }
    float c = 1. - clamp((gSil - .0009 * t) / (t * pixA * 2.2), 0., 1.);
    if (c > cov) { cov = c; tCov = t; covId = mId; }
    t += stp;
    if (t > 80.) break;
  }
  if (hit < .5 && spent > uSteps) t = max(t, 60.);

  vec3 riftCol = vec3(.42, .75, 1.2);
  vec3 violet = vec3(.5, .3, 1.15);
  vec3 lightPos = vec3(RIFT.x, 4.6, RIFT.z);
  vec3 toRift = normalize(lightPos - ro);
  float facing = max(dot(rd, toRift), 0.);

  vec3 col = vec3(.002, .003, .008);
  if (hit > 1.5){
    vec3 p = ro + rd * t;
    float w = max(riftHalfWidth(p.y), .001);
    float u = (p.x - riftCenter(p.y)) / w;
    float core = 1. - smoothstep(0., .5, abs(u));
    float swirl = fbm(vec2(u * 1.3 + uTime * .04, p.y * .55 - uTime * .32));
    float vein = smoothstep(.55, .75, fbm(vec2(u * 3. - uTime * .05, p.y * 1.4 - uTime * .5)));
    col = mix(violet * .7 + riftCol * .35, riftCol * 1.5, swirl) + riftCol * vein * .5;
    col += vec3(1.6, 1.8, 2.1) * core * core * (.6 + .4 * swirl);
    col = mix(riftCol * .9, col, smoothstep(1., .82, abs(u)));
  } else if (hit > .5){
    vec3 p = ro + rd * t;
    float id = mId;
    vec3 ld = normalize(lightPos - p);
    vec3 n = vec3(0., 1., 0.);
    float ao = 1.;
    if (id < 2.5) n = calcNormal(p);
    if (id < 1.5){
      ao = 0.; float sca = 1.;
      for (int k = 1; k < 5; k++){ float hh = .03 + .09 * float(k); ao += (hh - map(p + n * hh)) * sca; sca *= .65; }
      ao = clamp(1. - 3. * ao, 0., 1.);
    }
    float rim = pow(1. - max(dot(n, -rd), 0.), 4.);
    float back = smoothstep(-.2, .8, dot(n, ld));
    if (id < 1.5){
      col = vec3(.003, .004, .009) + riftCol * rim * back * 2.2 * ao * ao + violet * .012 * max(n.y, 0.) * ao;
    } else if (id < 2.5){
      float fade = exp(-max(t - 8., 0.) * .07);
      col = vec3(.002, .003, .007) + riftCol * rim * back * .45 * fade;
    } else {
      float pool = exp(-abs(p.x - RIFT.x) * .3) * exp(-abs(p.z - RIFT.z) * .08);
      float spec = pow(max(dot(reflect(rd, vec3(0., 1., 0.)), ld), 0.), 24.);
      col = vec3(.002, .003, .007) + riftCol * (pool * .12 + spec * .5) * (.5 + .5 * fbm(p.xz * 2.2));
    }
  }

  // fog: near black, lit only along the line to the rift
  float tFog = t;
  if (hit < .5 || hit > 1.5) {
    float k = smoothstep(0., 1., cov);
    tFog = mix(t, tCov, k);
    col = mix(col, vec3(.003, .004, .009) + riftCol * (covId < 1.5 ? .55 : .2) * k, k);
  }
  float fogAmt = 1. - exp(-max(tFog - 4., 0.) * .035);
  vec3 fogCol = vec3(.0012, .002, .005) + riftCol * (pow(facing, 120.) * .8 + pow(facing, 18.) * .022) + violet * .002;
  col = mix(col, fogCol, fogAmt);

  // drifting low smoke, lit from behind by the rift
  float sm = fbm(vec2(suv.x * 3. + uTime * .02, suv.y * 2.2 - uTime * .05) + uPtr * .12);
  float sm2 = fbm(vec2(suv.x * 7. - uTime * .03, suv.y * 4.5 - uTime * .08) + 4.);
  float smoke = smoothstep(.5, .95, sm * .7 + sm2 * .45) * (1. - smoothstep(.05, .6, suv.y));
  col += smoke * (vec3(.006, .008, .018) + riftCol * pow(facing, 30.) * .12) * 1.6;

  col += gRift * riftCol * (.9 + .25 * sin(uTime * .9));
  col += gAura * violet * 1.3;
  col += gEye * mix(riftCol, violet, .3) * 1.7;
  col += gArmy * mix(violet, riftCol, .45) * 1.4;

  // sparse sparks drifting up
  for (int k = 0; k < 3; k++){
    float fk = float(k);
    vec2 g = vec2(suv.x * (10. + fk * 7.) * (uRes.x / uRes.y), suv.y * (6. + fk * 4.) - uTime * (.07 + fk * .04));
    vec2 gi = floor(g), gf = fract(g) - .5;
    float r = hash(gi + fk * 13.);
    vec2 o = vec2(hash(gi + 2.) - .5, hash(gi + 5.) - .5) * .7 + vec2(sin(uTime * .5 + r * 9.) * .08, 0.);
    vec2 dd = (gf - o) * vec2(1., .7);
    float e = step(.965, r) * .0005 / (dot(dd, dd) + .0005) * (.5 + .5 * sin(uTime * 1.5 + r * 30.));
    col += e * mix(riftCol, violet, step(.975, r)) * (.5 - fk * .12);
  }

  float vig = smoothstep(1.3, .2, length((suv - vec2(.55, .5)) * vec2(1., 1.25)));
  col *= mix(.25, 1., vig);
  col *= uDim;
  col = col / (1. + col);
  col = pow(col, vec3(.4545));
  col = smoothstep(.015, 1., col);
  col += (hash(frag + fract(uTime * 7.) * 100.) - .5) * .02;
  gl_FragColor = vec4(col, 1.);
}
`;
