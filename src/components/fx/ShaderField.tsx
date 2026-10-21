"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_intro;

// Ashima 2D simplex noise
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* Three octaves is the legibility/cost sweet spot here: the field is a
   background, and octave four only adds detail the grain overlay eats. */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * 0.042;
  vec2  m = (u_mouse - 0.5) * 2.0;

  // Two rounds of domain warping give the field its slow, folding drift.
  // Low frequency on purpose — large soft masses, not marble.
  vec2 p = uv * 0.85 + m * 0.08;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 1.2 * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p + 1.2 * q + vec2(8.3, 2.8) - t * 1.0));
  float f = fbm(p + 1.6 * r);

  float band = smoothstep(-0.9, 0.9, f);

  // Deliberately dim. Display type sits directly on top of this, so peak
  // luminance stays low enough that bone-on-field keeps its contrast.
  vec3 base  = vec3(0.031, 0.027, 0.024);
  vec3 deep  = vec3(0.115, 0.032, 0.014);
  vec3 ember = vec3(0.620, 0.170, 0.060);

  vec3 col = mix(base, deep, band);
  col = mix(col, ember, pow(smoothstep(0.72, 1.0, band), 2.4) * 0.60);

  // Hairline isolines — a technical trace across the flow, not a texture.
  float contour = abs(fract(f * 1.6 + t * 1.2) - 0.5);
  col += ember * smoothstep(0.018, 0.0, contour) * 0.12 * band;

  // Pointer heat
  float d = length(uv - m * 0.55);
  col += ember * exp(-d * 3.4) * 0.10;

  // Dissolve into the page background at the edges
  col = mix(base, col, smoothstep(1.15, 0.15, length(uv)));

  // Ordered-ish dither kills the banding in the dark falloff
  float dith = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (dith - 0.5) * 0.008;

  gl_FragColor = vec4(col * u_intro, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Full-bleed animated noise field behind the hero.
 *
 * Rendered at ~55% of CSS pixels and upscaled — the field has no hard edges,
 * so the resample is invisible while the fragment cost drops by two thirds.
 */
export default function ShaderField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uIntro = gl.getUniformLocation(program, "u_intro");

    const SCALE = 0.55;
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.floor(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const mouse = { x: 0.5, y: 0.5 };
    const eased = { x: 0.5, y: 0.5 };
    const onMove = (event: PointerEvent) => {
      mouse.x = event.clientX / window.innerWidth;
      mouse.y = 1 - event.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Pause when the hero scrolls away — no point burning GPU on a hidden quad.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => (onScreen = entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(canvas);

    let frame = 0;
    let intro = 0;
    const start = performance.now();

    // Watchdog: if the field can't hold a usable frame rate on this device,
    // tear it down and let the CSS approximation take over. A janky background
    // is worse than a static one, and it drags the whole page's scroll with it.
    let drawn = 0;
    let slowSpan = 0;
    let lastFrame = start;

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!onScreen || document.hidden) {
        lastFrame = now;
        return;
      }

      const delta = now - lastFrame;
      lastFrame = now;
      drawn += 1;
      if (drawn > 12) {
        slowSpan = delta > 45 ? slowSpan + 1 : 0;
        if (slowSpan >= 30) {
          cancelAnimationFrame(frame);
          setFailed(true);
          return;
        }
      }

      eased.x += (mouse.x - eased.x) * 0.045;
      eased.y += (mouse.y - eased.y) * 0.045;
      intro += (1 - intro) * 0.02;

      // Frozen field under reduced motion: still rich, just not moving.
      const elapsed = reduced ? 120 : (now - start) / 1000;

      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, eased.x, eased.y);
      gl.uniform1f(uIntro, reduced ? 1 : intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduced]);

  // No WebGL (blocked, software-disabled, very old device): a layered CSS
  // approximation of the same field, so the hero never falls back to flat black.
  if (failed) {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          background: [
            "radial-gradient(38% 44% at 62% 34%, rgba(255,74,28,0.55), transparent 68%)",
            "radial-gradient(46% 40% at 24% 62%, rgba(179,42,8,0.50), transparent 70%)",
            "radial-gradient(60% 55% at 78% 76%, rgba(255,130,86,0.22), transparent 72%)",
            "radial-gradient(90% 80% at 50% 45%, rgba(22,19,15,0.0), rgba(8,7,6,0.9) 100%)",
            "#080706",
          ].join(", "),
        }}
      />
    );
  }

  return <canvas ref={canvasRef} aria-hidden className={`block ${className}`} />;
}
