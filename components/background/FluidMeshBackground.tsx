"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { mixColor, withAlpha } from "@/lib/theme-lab";

type CircleSpec = {
  color: keyof Pick<
    ThemePalette,
    "accent" | "accentStrong" | "shaderWarm" | "shaderMid"
  >;
  xPhase: number;
  yPhase: number;
  xFrequency: number;
  yFrequency: number;
  xRange: number;
  yRange: number;
};

const CIRCLES: CircleSpec[] = [
  { color: "accent", xPhase: 0, yPhase: 0.7, xFrequency: 0.00031, yFrequency: 0.00027, xRange: 0.22, yRange: 0.18 },
  { color: "accentStrong", xPhase: 1.2, yPhase: 1.7, xFrequency: 0.00026, yFrequency: 0.00034, xRange: 0.19, yRange: 0.24 },
  { color: "shaderWarm", xPhase: 2.1, yPhase: 2.6, xFrequency: 0.00022, yFrequency: 0.00029, xRange: 0.24, yRange: 0.2 },
  { color: "shaderMid", xPhase: 3.4, yPhase: 3.2, xFrequency: 0.00028, yFrequency: 0.00023, xRange: 0.16, yRange: 0.26 },
];

function drawMesh(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: ThemePalette,
  time: number,
  mobile: boolean,
) {
  const diag = Math.hypot(width, height);
  const radiusBase = diag * 0.3;

  ctx.clearRect(0, 0, width, height);
  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  ctx.filter = "blur(80px)";
  ctx.globalCompositeOperation = "screen";

  CIRCLES.slice(0, mobile ? 3 : 4).forEach((spec, index) => {
    const color = palette[spec.color];
    const x = width * (0.5 + Math.sin(time * spec.xFrequency + spec.xPhase) * spec.xRange);
    const y = height * (0.5 + Math.cos(time * spec.yFrequency + spec.yPhase) * spec.yRange);
    const radius = radiusBase * (0.92 + index * 0.06);
    const soft = mixColor(color, palette.bg, 0.18);
    const gradient = ctx.createRadialGradient(x, y, radius * 0.08, x, y, radius);

    gradient.addColorStop(0, withAlpha(color, mobile ? 0.22 : 0.28));
    gradient.addColorStop(0.5, withAlpha(soft, mobile ? 0.08 : 0.12));
    gradient.addColorStop(1, withAlpha(mixColor(palette.bg, palette.shaderDeep, 0.22), 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";
}

export default function FluidMeshBackground({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let frame = 0;
    let width = 0;
    let height = 0;
    let mobile = false;

    const resize = () => {
      const nextWidth = parent.clientWidth;
      const nextHeight = parent.clientHeight;
      const nextMobile = window.innerWidth < 768;
      const ratio = nextMobile ? 0.5 : Math.min(2, window.devicePixelRatio || 1);

      width = Math.max(1, Math.round(nextWidth));
      height = Math.max(1, Math.round(nextHeight));
      mobile = nextMobile;

      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawMesh(context, width, height, palette, 0, mobile);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();

    if (reduceMotion) {
      return () => {
        observer.disconnect();
      };
    }

    const tick = (time: number) => {
      drawMesh(context, width, height, palette, time, mobile);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [palette, reduceMotion]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
