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
uniform float u_scroll;

vec3 colorBase = vec3(0.070, 0.055, 0.042);
vec3 colorMid = vec3(0.160, 0.100, 0.038);
vec3 colorPeak = vec3(0.260, 0.155, 0.042);
vec3 colorCyan = vec3(0.040, 0.120, 0.140);

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
    frequency *= 2.1;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.y = 1.0 - uv.y;

  float t = u_time * 0.042;
  float breathe = sin(u_time * 0.52) * 0.06 + 1.0;
  float scrollShift = u_scroll * 0.5;

  vec2 p1 = uv * 2.0 * breathe + vec2(t * 0.28, t * 0.14) + vec2(scrollShift);
  vec2 p2 = uv * 3.5 * breathe - vec2(t * 0.18, t * 0.22) + vec2(scrollShift * 0.6);

  float field1 = fbm(p1);
  float field2 = fbm(p2 + vec2(field1 * 0.85, field1 * 0.55));
  float combined = fbm(vec2(field1, field2) * 2.4 + vec2(t * 0.09));

  vec2 vigUV = uv - vec2(0.5, 0.70);
  float vignette = 1.0 - dot(vigUV * vec2(1.0, 0.75), vigUV * vec2(1.0, 0.75)) * 2.0;
  vignette = clamp(vignette, 0.0, 1.0);
  combined = clamp(combined * vignette, 0.0, 1.0);

  vec3 color;
  if (combined < 0.30) {
    color = mix(colorBase, colorMid, combined / 0.30);
  } else if (combined < 0.65) {
    color = mix(colorMid, colorPeak, (combined - 0.30) / 0.35);
  } else {
    float cyanBlend = smoothstep(0.65, 1.0, combined) * 0.25;
    color = mix(colorPeak, colorCyan, cyanBlend);
  }

  float scanlineY = mod(u_time * 0.2, 1.0);
  float scanlineDist = abs(uv.y - scanlineY);
  float scanlineGlow = exp(-scanlineDist * 800.0) * 0.06;
  color += vec3(scanlineGlow * 0.8, scanlineGlow * 0.5, scanlineGlow * 0.2);

  float band1 = step(0.997, fract(sin(floor(uv.y * 40.0) + u_time * 0.7) * 43758.5));
  color += vec3(0.04, 0.025, 0.008) * band1 * 0.3;

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
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let frameId = 0;
    let sizeObserver: ResizeObserver | null = null;
    let scrollProgress = 0;

    const updateScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      scrollProgress = window.scrollY / maxScroll;
    };

    const updateSize = () => {
      const mobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = mobile ? window.innerWidth * 0.4 : window.innerWidth;
      const cssHeight = mobile ? window.innerHeight * 0.4 : window.innerHeight;

      canvas.style.width = mobile ? "40vw" : "100vw";
      canvas.style.height = mobile ? "40vh" : "100vh";
      canvas.style.transform = mobile ? "scale(2.5) translateZ(0)" : "translateZ(0)";
      canvas.style.transformOrigin = "top left";

      const viewportWidth = Math.max(1, Math.floor(cssWidth * dpr));
      const viewportHeight = Math.max(1, Math.floor(cssHeight * dpr));

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

    updateScroll();
    updateSize();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateSize, { passive: true });

    sizeObserver = new ResizeObserver(updateSize);
    sizeObserver.observe(document.documentElement);

    frameId = window.requestAnimationFrame(render);

    return () => {
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

  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-0 will-change-transform" />;
}
