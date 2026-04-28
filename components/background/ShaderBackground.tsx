"use client";

import { useEffect, useRef } from "react";

import { getIstTimeAccentPalette } from "@/lib/time-accent";

const vertexShaderSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scroll;
uniform vec3 u_warm;
uniform vec3 u_mid;
uniform vec3 u_deep;
uniform vec3 u_accent;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 5; i++) {
    value += amplitude * smoothNoise(p * frequency);
    amplitude *= 0.52;
    frequency *= 2.15;
  }

  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.y = 1.0 - uv.y;

  float t = u_time * 0.035;
  float scroll = u_scroll * 0.55;
  float breathe = 1.0 + sin(u_time * 0.22) * 0.045;

  vec2 flowA = uv * 2.3 * breathe + vec2(t * 0.24, -t * 0.16) + vec2(scroll * 0.35, scroll * 0.15);
  vec2 flowB = uv * 3.9 * breathe - vec2(t * 0.16, t * 0.2) - vec2(scroll * 0.2, scroll * 0.08);

  float fieldA = fbm(flowA);
  float fieldB = fbm(flowB + vec2(fieldA * 0.75, fieldA * 0.5));
  float fieldC = fbm(vec2(fieldA, fieldB) * 2.2 + vec2(t * 0.12, -t * 0.08));

  vec2 vignetteUV = uv - vec2(0.5, 0.62);
  float vignette = 1.0 - dot(vignetteUV * vec2(1.0, 0.82), vignetteUV * vec2(1.0, 0.82)) * 1.9;
  vignette = clamp(vignette, 0.0, 1.0);

  float combined = clamp(mix(fieldA, fieldC, 0.45) * vignette, 0.0, 1.0);
  vec3 color = mix(u_deep, u_mid, smoothstep(0.08, 0.82, combined));
  color = mix(color, u_warm, smoothstep(0.35, 0.92, fieldA) * 0.42);
  color += u_accent * exp(-abs(uv.y - mod(t * 0.18, 1.0)) * 140.0) * 0.18;
  color += u_warm * exp(-abs(uv.x - 0.52) * 7.0) * combined * 0.08;
  color += u_mid * exp(-abs(uv.x - 0.5) * 4.5) * fieldB * 0.03;

  float grain = smoothNoise(gl_FragCoord.xy * 0.9 + vec2(t * 48.0, -t * 33.0));
  color += vec3(grain * 0.025);

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Unable to create shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unknown shader compilation error.";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Unable to create shader program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Unknown program link error.";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return { program, vertexShader, fragmentShader };
}

function colorToVec3(value: string) {
  const rgba = value.match(/rgba?\(([^)]+)\)/i);

  if (rgba?.[1]) {
    const [r = 0, g = 0, b = 0] = rgba[1]
      .split(",")
      .slice(0, 3)
      .map((component) => Number.parseFloat(component.trim()));

    return [r / 255, g / 255, b / 255] as const;
  }

  const hex = value.replace("#", "").trim();
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex.slice(0, 6);

  return [
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
  ] as const;
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      return;
    }

    const { program, vertexShader, fragmentShader } = createProgram(gl);
    const buffer = gl.createBuffer();

    if (!buffer) {
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");
    const warmLocation = gl.getUniformLocation(program, "u_warm");
    const midLocation = gl.getUniformLocation(program, "u_mid");
    const deepLocation = gl.getUniformLocation(program, "u_deep");
    const accentLocation = gl.getUniformLocation(program, "u_accent");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let frameId = 0;
    let sizeObserver: ResizeObserver | null = null;
    let scrollProgress = 0;

    const applyTone = () => {
      const palette = getIstTimeAccentPalette(new Date());

      if (warmLocation) {
        gl.uniform3fv(warmLocation, colorToVec3(palette.shaderWarm));
      }

      if (midLocation) {
        gl.uniform3fv(midLocation, colorToVec3(palette.shaderMid));
      }

      if (deepLocation) {
        gl.uniform3fv(deepLocation, colorToVec3(palette.shaderDeep));
      }

      if (accentLocation) {
        gl.uniform3fv(accentLocation, colorToVec3(palette.accent));
      }
    };

    const updateScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      scrollProgress = window.scrollY / maxScroll;
    };

    const updateSize = () => {
      const mobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);
      const viewportWidth = Math.max(1, Math.floor(window.innerWidth * dpr));
      const viewportHeight = Math.max(1, Math.floor(window.innerHeight * dpr));

      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.transform = "translateZ(0)";
      canvas.style.transformOrigin = "top left";
      canvas.style.opacity = mobile ? "0.9" : "1";

      canvas.width = viewportWidth;
      canvas.height = viewportHeight;
      gl.viewport(0, 0, viewportWidth, viewportHeight);
      gl.uniform2f(resolutionLocation, viewportWidth, viewportHeight);
    };

    const render = () => {
      gl.uniform1f(timeLocation, performance.now() / 1000);
      gl.uniform1f(scrollLocation, scrollProgress);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = window.requestAnimationFrame(render);
    };

    applyTone();
    updateScroll();
    updateSize();

    const toneTimer = window.setInterval(applyTone, 60_000);

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateSize, { passive: true });

    sizeObserver = new ResizeObserver(updateSize);
    sizeObserver.observe(document.documentElement);

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.clearInterval(toneTimer);
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateSize);
      sizeObserver?.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 will-change-transform" />;
}
