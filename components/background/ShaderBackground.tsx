"use client";

import { useEffect, useRef } from "react";

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
uniform vec2 u_mouse;
uniform float u_scroll;

vec3 colorDark = vec3(0.090, 0.070, 0.050);
vec3 colorMid = vec3(0.280, 0.180, 0.060);
vec3 colorPeak = vec3(0.380, 0.240, 0.060);
vec3 colorHot = vec3(0.500, 0.300, 0.070);

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
  for (int i = 0; i < 6; i++) {
    value += amplitude * smoothNoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.y = 1.0 - uv.y;

  float t = u_time * 0.045;
  float scrollShift = u_scroll * 0.4;
  vec2 mouseWarp = (u_mouse - 0.5) * 0.18;

  vec2 p1 = uv * 2.2 + vec2(t * 0.3, t * 0.15) + mouseWarp + vec2(scrollShift);
  vec2 p2 = uv * 3.8 - vec2(t * 0.2, t * 0.25) - mouseWarp * 0.6 + vec2(scrollShift * 0.7);

  float field1 = fbm(p1);
  float field2 = fbm(p2 + vec2(field1 * 0.8, field1 * 0.6));
  float combined = fbm(vec2(field1, field2) * 2.5 + t * 0.1);

  vec2 vigUV = uv - vec2(0.5, 0.65);
  float vignette = 1.0 - dot(vigUV * vec2(1.0, 0.8), vigUV * vec2(1.0, 0.8)) * 1.8;
  vignette = clamp(vignette, 0.0, 1.0);

  combined = clamp(combined * vignette, 0.0, 1.0);

  vec3 color;
  if (combined < 0.25) {
    color = mix(colorDark, colorMid, combined / 0.25);
  } else if (combined < 0.55) {
    color = mix(colorMid, colorPeak, (combined - 0.25) / 0.30);
  } else {
    color = mix(colorPeak, colorHot, (combined - 0.55) / 0.45);
  }

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
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let frameId = 0;
    let sizeObserver: ResizeObserver | null = null;
    let viewportWidth = 1;
    let viewportHeight = 1;
    let pointerU = 0.5;
    let pointerV = 0.5;
    let scrollProgress = 0;

    const updateMouse = (event: MouseEvent) => {
      pointerU = event.clientX / Math.max(window.innerWidth, 1);
      pointerV = event.clientY / Math.max(window.innerHeight, 1);
    };

    const updateScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      scrollProgress = window.scrollY / maxScroll;
    };

    const updateSize = () => {
      const mobileScale = window.innerWidth < 768 ? 0.5 : 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewportWidth = Math.max(1, Math.floor(canvas.clientWidth * dpr * mobileScale));
      viewportHeight = Math.max(1, Math.floor(canvas.clientHeight * dpr * mobileScale));
      canvas.width = viewportWidth;
      canvas.height = viewportHeight;
      gl.viewport(0, 0, viewportWidth, viewportHeight);
      gl.uniform2f(resolutionLocation, viewportWidth, viewportHeight);
    };

    const render = () => {
      gl.uniform1f(timeLocation, performance.now() / 1000);
      gl.uniform2f(mouseLocation, pointerU, pointerV);
      gl.uniform1f(scrollLocation, scrollProgress);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = window.requestAnimationFrame(render);
    };

    updateScroll();
    updateSize();

    window.addEventListener("mousemove", updateMouse, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateSize, { passive: true });

    sizeObserver = new ResizeObserver(updateSize);
    sizeObserver.observe(document.documentElement);

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", updateMouse);
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

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 h-screen w-screen will-change-transform"
    />
  );
}
