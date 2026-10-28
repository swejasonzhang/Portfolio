// Renders the scene stills in public/scene from the shader in app/lib/sceneShader.ts.
// Needs Google Chrome (GPU). Usage: node --experimental-websocket scripts/render-scene.mjs
// (Node 20; Node 22+ has WebSocket built in and needs no flag.)
//
// Each still is drawn at 2x its output size in horizontal strips (so no single
// GPU job runs long), then downsampled with high-quality filtering: that 2x2
// supersampling is the anti-aliasing.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = process.env.OUT || path.join(ROOT, "public/scene");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ts = fs.readFileSync(path.join(ROOT, "app/lib/sceneShader.ts"), "utf8");
const FRAG = ts.slice(ts.indexOf("export const SCENE_FRAG = `") + "export const SCENE_FRAG = `".length, ts.lastIndexOf("`;"));

// Desktop 3840x2160 (sharp on 2x laptop screens) and phone 1290x2796, one per gate, plus the opening's "arise" frame.
const D = { w: 3840, h: 2160, wide: 1 };
const M = { w: 1290, h: 2796, wide: 0 };
const SHOTS = [
  ...[0, 1, 2, 3, 4].map((s) => ({ name: `d-${s}`, ...D, s, pulse: 99 })),
  { name: "d-0-arise", ...D, s: 0, pulse: 0.9 },
  ...[0, 1, 2, 3, 4].map((s) => ({ name: `m-${s}`, ...M, s, pulse: 99 })),
  { name: "m-0-arise", ...M, s: 0, pulse: 0.9 },
];

const PAGE = `<!doctype html><canvas id=c></canvas><script>
(async () => {
const q = new URLSearchParams(location.search), P = (k) => parseFloat(q.get(k));
const W = P("w"), H = P("h"), SS = 2, c = document.getElementById("c");
c.width = W * SS; c.height = H * SS;
const gl = c.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: true });
if (gl.drawingBufferWidth !== c.width || gl.drawingBufferHeight !== c.height) { window.__err = "drawing buffer clamped to " + gl.drawingBufferWidth + "x" + gl.drawingBufferHeight; return; }
const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
const pr = gl.createProgram();
gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"));
gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, ${JSON.stringify(FRAG)}));
gl.linkProgram(pr); gl.useProgram(pr);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
const U = (n) => gl.getUniformLocation(pr, n);
gl.viewport(0, 0, c.width, c.height);
gl.uniform2f(U("uRes"), c.width, c.height); gl.uniform1f(U("uTime"), 6); gl.uniform1f(U("uSec"), P("s"));
gl.uniform2f(U("uPtr"), 0, 0); gl.uniform1f(U("uPulse"), P("pulse")); gl.uniform1f(U("uDim"), 1); gl.uniform1f(U("uSteps"), 340); gl.uniform1f(U("uWide"), P("wide"));
gl.enable(gl.SCISSOR_TEST);
const px = new Uint8Array(4);
const STRIP = 160;
for (let y = 0; y < c.height; y += STRIP) {
  gl.scissor(0, y, c.width, Math.min(STRIP, c.height - y));
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.readPixels(0, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); // wait for the strip before queuing the next
  await new Promise((r) => setTimeout(r, 0));
}
if (gl.isContextLost()) { window.__err = "GPU context lost"; return; }
const o = document.createElement("canvas"); o.width = W; o.height = H;
const x = o.getContext("2d"); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high"; x.drawImage(c, 0, 0, W, H);
window.__data = o.toDataURL("image/webp", 0.86);
})().catch((e) => { window.__err = String(e); });
</script>`;

const server = http.createServer((_, res) => { res.writeHead(200, { "content-type": "text/html" }); res.end(PAGE); });
await new Promise((r) => server.listen(4399, "127.0.0.1", r));
const chrome = spawn(CHROME, ["--headless=new", "--use-angle=metal", "--ignore-gpu-blocklist", "--disable-gpu-watchdog", "--remote-debugging-port=9399", `--user-data-dir=${path.join(ROOT, ".next/render-scene-profile")}`, "about:blank"], { stdio: "ignore", detached: true });
// Chrome forks GPU and renderer helpers: end the whole process group, or they outlive the script.
const killChrome = () => { try { process.kill(-chrome.pid, "SIGTERM"); } catch {} };
process.on("exit", killChrome);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 60; i++) { try { targets = await (await fetch("http://127.0.0.1:9399/json/list")).json(); if (targets.some((t) => t.type === "page")) break; } catch {} await sleep(200); }
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const read = async (e) => (await send("Runtime.evaluate", { expression: e, returnByValue: true })).result?.value;
await send("Page.enable");
fs.mkdirSync(OUT, { recursive: true });
// ONLY=d-0,m-0 renders a subset (for previews).
const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
try {
  for (const s of SHOTS.filter((x) => !only || only.has(x.name))) {
    const t0 = Date.now();
    await send("Page.navigate", { url: `http://127.0.0.1:4399/?w=${s.w}&h=${s.h}&s=${s.s}&wide=${s.wide}&pulse=${s.pulse}` });
    let data = null;
    for (let i = 0; i < 1200 && !data; i++) {
      await sleep(100);
      const err = await read("window.__err || null");
      if (err) throw new Error(`${s.name}: ${err}`);
      data = await read("window.__data || null");
    }
    if (!data) throw new Error(`render timed out: ${s.name}`);
    const file = path.join(OUT, `${s.name}.webp`);
    fs.writeFileSync(file, Buffer.from(data.split(",")[1], "base64"));
    console.log(`${s.name}.webp  ${s.w}x${s.h}  ${Math.round(fs.statSync(file).size / 1024)} KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
} finally {
  ws.close(); killChrome(); server.close();
}
