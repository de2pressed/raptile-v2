"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { withAlpha } from "@/lib/theme-lab";

type Particle = {
  x: number;
  y: number;
  layer: 0 | 1 | 2;
};

function createParticles(width: number, height: number, total: number) {
  const columns = Math.max(10, Math.ceil(Math.sqrt(total * (width / Math.max(height, 1)))));
  const rows = Math.max(10, Math.ceil(total / columns));
  const stepX = width / (columns + 1);
  const stepY = height / (rows + 1);
  const particles: Particle[] = [];

  for (let row = 0; row < rows && particles.length < total; row += 1) {
    for (let column = 0; column < columns && particles.length < total; column += 1) {
      const jitterX = (Math.random() - 0.5) * stepX * 0.5;
      const jitterY = (Math.random() - 0.5) * stepY * 0.5;

      particles.push({
        x: (column + 1) * stepX + jitterX,
        y: (row + 1) * stepY + jitterY,
        layer: (particles.length % 3) as 0 | 1 | 2,
      });
    }
  }

  return particles;
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: ThemePalette,
  particles: Particle[],
  time: number,
  staticMode: boolean,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  const phase = staticMode ? 0 : time * 0.000314;
  const colors = [palette.accent, palette.shaderWarm, palette.textSubtle] as const;
  const opacities = [0.4, 0.26, 0.18] as const;

  ctx.fillStyle = palette.text;
  for (const particle of particles) {
    const wave = Math.sin(particle.x * 0.003 + phase) * 18;
    const x = staticMode ? particle.x : particle.x + Math.cos(phase * 0.92 + particle.y * 0.0015) * 1.5;
    const y = staticMode ? particle.y : particle.y + wave;
    ctx.fillStyle = withAlpha(colors[particle.layer], opacities[particle.layer]);
    ctx.fillRect(x, y, 1.5, 1.5);
  }
}

export default function WovenParticleBackground({ palette }: { palette: ThemePalette }) {
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
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      const nextWidth = parent.clientWidth;
      const nextHeight = parent.clientHeight;
      const mobile = window.innerWidth < 768;
      const ratio = mobile ? 0.5 : Math.min(2, window.devicePixelRatio || 1);
      const total = mobile ? 400 : 800;

      width = Math.max(1, Math.round(nextWidth));
      height = Math.max(1, Math.round(nextHeight));
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(width, height, total);
      drawParticles(context, width, height, palette, particles, 0, reduceMotion);
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
      drawParticles(context, width, height, palette, particles, time, false);
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
