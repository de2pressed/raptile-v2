"use client";

import { useEffect, useRef } from "react";

import type { ThemePalette } from "@/lib/theme-lab";
import { withAlpha } from "@/lib/theme-lab";

type CloudLayer = {
  centerX: number;
  centerY: number;
  radius: number;
  spreadX: number;
  spreadY: number;
  speed: number;
  phase: number;
  blur: number;
  opacity: number;
  colorKey: "accent" | "accentStrong" | "accentGlow" | "shaderWarm" | "shaderMid";
};

const CLOUD_LAYERS: CloudLayer[] = [
  { centerX: 0.16, centerY: 0.24, radius: 0.28, spreadX: 0.16, spreadY: 0.08, speed: 0.8, phase: 0.2, blur: 92, opacity: 0.52, colorKey: "accent" },
  { centerX: 0.42, centerY: 0.18, radius: 0.34, spreadX: 0.22, spreadY: 0.1, speed: 0.58, phase: 1.4, blur: 118, opacity: 0.36, colorKey: "shaderWarm" },
  { centerX: 0.68, centerY: 0.34, radius: 0.38, spreadX: 0.2, spreadY: 0.12, speed: 0.76, phase: 2.1, blur: 124, opacity: 0.48, colorKey: "accentStrong" },
  { centerX: 0.3, centerY: 0.76, radius: 0.46, spreadX: 0.24, spreadY: 0.14, speed: 0.68, phase: 3.3, blur: 136, opacity: 0.45, colorKey: "shaderMid" },
  { centerX: 0.78, centerY: 0.82, radius: 0.4, spreadX: 0.26, spreadY: 0.16, speed: 0.62, phase: 4.5, blur: 128, opacity: 0.42, colorKey: "accentGlow" },
];

export function ShaderBackground({ palette }: { palette: ThemePalette }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!context) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let lastFrameAt = 0;
    let resizeObserver: ResizeObserver | null = null;
    let viewportWidth = 1;
    let viewportHeight = 1;
    let devicePixelRatio = 1;

    const resize = () => {
      const mobile = window.innerWidth < 768;
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      viewportWidth = Math.max(1, Math.floor(window.innerWidth));
      viewportHeight = Math.max(1, Math.floor(window.innerHeight));

      canvas.width = Math.max(1, Math.floor(viewportWidth * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(viewportHeight * devicePixelRatio));
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.opacity = mobile ? "0.9" : "1";
      canvas.style.backgroundColor = palette.bg;
      canvas.style.transform = "translateZ(0)";
      canvas.style.transformOrigin = "top left";

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const draw = (now: number) => {
      const shouldReduceMotion = prefersReducedMotion;
      if (shouldReduceMotion && lastFrameAt > 0) {
        return;
      }

      if (!shouldReduceMotion && now - lastFrameAt < 34) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      lastFrameAt = now;

      const cycle = 82_000;
      const progress = (now % cycle) / cycle;
      const pulse = 0.5 + Math.sin(progress * Math.PI * 2) * 0.5;

      context.clearRect(0, 0, viewportWidth, viewportHeight);

      const background = context.createLinearGradient(0, 0, 0, viewportHeight);
      background.addColorStop(0, palette.bgSoft);
      background.addColorStop(0.48, palette.bg);
      background.addColorStop(1, palette.bgElevated);
      context.fillStyle = background;
      context.fillRect(0, 0, viewportWidth, viewportHeight);

      const ambient = context.createRadialGradient(
        viewportWidth * 0.52,
        viewportHeight * 0.26,
        0,
        viewportWidth * 0.52,
        viewportHeight * 0.52,
        Math.max(viewportWidth, viewportHeight) * 0.95,
      );
      ambient.addColorStop(0, withAlpha(palette.accent, 0.28));
      ambient.addColorStop(0.36, withAlpha(palette.shaderWarm, 0.18));
      ambient.addColorStop(0.74, withAlpha(palette.shaderMid, 0.1));
      ambient.addColorStop(1, withAlpha(palette.bg, 0));
      context.fillStyle = ambient;
      context.fillRect(0, 0, viewportWidth, viewportHeight);

      context.globalCompositeOperation = "screen";

      for (const layer of CLOUD_LAYERS) {
        const driftX = Math.sin(progress * Math.PI * 2 * layer.speed + layer.phase);
        const driftY = Math.cos(progress * Math.PI * 2 * (layer.speed * 0.82) + layer.phase * 1.3);
        const x = viewportWidth * layer.centerX + driftX * viewportWidth * layer.spreadX;
        const y = viewportHeight * layer.centerY + driftY * viewportHeight * layer.spreadY;
        const radius = Math.max(viewportWidth, viewportHeight) * layer.radius;

        context.save();
        context.filter = `blur(${layer.blur}px)`;
        context.globalAlpha = layer.opacity * (0.84 + pulse * 0.16);

        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        const color = palette[layer.colorKey];
        gradient.addColorStop(0, withAlpha(color, 0.95));
        gradient.addColorStop(0.34, withAlpha(color, 0.46));
        gradient.addColorStop(0.72, withAlpha(color, 0.12));
        gradient.addColorStop(1, withAlpha(color, 0));

        context.fillStyle = gradient;
        context.beginPath();
        context.ellipse(
          x,
          y,
          radius * (1.05 + Math.sin(progress * Math.PI * 2 + layer.phase) * 0.08),
          radius * (0.54 + Math.cos(progress * Math.PI * 2 + layer.phase) * 0.06),
          layer.phase * 0.12,
          0,
          Math.PI * 2,
        );
        context.fill();
        context.restore();
      }

      context.globalCompositeOperation = "source-over";

      const beam = context.createLinearGradient(0, viewportHeight * 0.58, viewportWidth, viewportHeight * 0.58);
      beam.addColorStop(0, withAlpha(palette.accent, 0));
      beam.addColorStop(0.48, withAlpha(palette.accentStrong, 0.08));
      beam.addColorStop(0.52, withAlpha(palette.accentStrong, 0.22));
      beam.addColorStop(0.56, withAlpha(palette.accentStrong, 0.08));
      beam.addColorStop(1, withAlpha(palette.accent, 0));

      context.globalAlpha = 0.72;
      context.fillStyle = beam;
      context.fillRect(0, 0, viewportWidth, viewportHeight);
      context.globalAlpha = 1;

      if (!shouldReduceMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);

    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
    };
  }, [palette]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 will-change-transform" />;
}
