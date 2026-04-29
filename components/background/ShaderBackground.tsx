"use client";

import { useEffect, useRef } from "react";

import type { ThemePalette } from "@/lib/theme-lab";
import { withAlpha } from "@/lib/theme-lab";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
};

const PARTICLE_COUNT = 180;
const MAX_DPR = 1.5;

function createParticles(width: number, height: number) {
  return Array.from({ length: PARTICLE_COUNT }, (_, index): Particle => {
    const seed = index / PARTICLE_COUNT;
    const angle = seed * Math.PI * 2.7;
    const radius = 0.18 + (index % 7) * 0.02;

    return {
      x: width * (0.08 + Math.random() * 0.84),
      y: height * (0.1 + Math.random() * 0.8),
      vx: Math.cos(angle) * (0.02 + radius * 0.06),
      vy: Math.sin(angle) * (0.015 + radius * 0.04),
      radius: 0.55 + (index % 5) * 0.18,
      phase: seed * Math.PI * 2,
    };
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function DarkroomSweep({ palette }: { palette: ThemePalette }) {
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

    const prefersReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = prefersReducedMotionQuery.matches;
    let animationFrame = 0;
    let viewportWidth = 1;
    let viewportHeight = 1;
    let devicePixelRatio = 1;
    let particles = createParticles(viewportWidth, viewportHeight);

    const resize = () => {
      viewportWidth = Math.max(1, Math.floor(window.innerWidth));
      viewportHeight = Math.max(1, Math.floor(window.innerHeight));
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      canvas.width = Math.max(1, Math.floor(viewportWidth * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(viewportHeight * devicePixelRatio));
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.backgroundColor = palette.bg;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      particles = createParticles(viewportWidth, viewportHeight);
    };

    const drawOnce = () => {
      const background = context.createLinearGradient(0, 0, 0, viewportHeight);
      background.addColorStop(0, palette.bgSoft);
      background.addColorStop(0.5, palette.bg);
      background.addColorStop(1, palette.bgElevated);
      context.fillStyle = background;
      context.fillRect(0, 0, viewportWidth, viewportHeight);

      const beamGradient = context.createLinearGradient(viewportWidth * 0.08, 0, viewportWidth * 0.82, 0);
      beamGradient.addColorStop(0, withAlpha(palette.accent, 0));
      beamGradient.addColorStop(0.2, withAlpha(palette.accent, 0.06));
      beamGradient.addColorStop(0.5, withAlpha(palette.accentStrong, 0.2));
      beamGradient.addColorStop(0.72, withAlpha(palette.shaderWarm, 0.08));
      beamGradient.addColorStop(1, withAlpha(palette.accent, 0));
      context.globalAlpha = 0.9;
      context.fillStyle = beamGradient;
      context.fillRect(0, viewportHeight * 0.34, viewportWidth, viewportHeight * 0.28);
      context.globalAlpha = 1;
    };

    const drawFrame = (now: number) => {
      const t = now * 0.001;
      const sweep = 0.5 + Math.sin(t * 0.18) * 0.5;
      const drift = Math.sin(t * 0.31 + 0.8) * 0.5 + 0.5;
      const beamX = viewportWidth * (0.12 + sweep * 0.74);
      const beamY = viewportHeight * (0.26 + drift * 0.12);
      const scanY = viewportHeight * (0.22 + (Math.sin(t * 0.26 + 1.4) * 0.5 + 0.5) * 0.48);

      const background = context.createLinearGradient(0, 0, 0, viewportHeight);
      background.addColorStop(0, palette.bgSoft);
      background.addColorStop(0.48, palette.bg);
      background.addColorStop(1, palette.bgElevated);
      context.fillStyle = background;
      context.fillRect(0, 0, viewportWidth, viewportHeight);

      const vignette = context.createRadialGradient(
        viewportWidth * 0.5,
        viewportHeight * 0.46,
        0,
        viewportWidth * 0.5,
        viewportHeight * 0.5,
        Math.max(viewportWidth, viewportHeight) * 0.95,
      );
      vignette.addColorStop(0, withAlpha(palette.accent, 0.14));
      vignette.addColorStop(0.42, withAlpha(palette.shaderWarm, 0.08));
      vignette.addColorStop(0.78, withAlpha(palette.shaderMid, 0.08));
      vignette.addColorStop(1, withAlpha(palette.bg, 0));
      context.fillStyle = vignette;
      context.fillRect(0, 0, viewportWidth, viewportHeight);

      context.save();
      context.globalCompositeOperation = "screen";
      const beam = context.createLinearGradient(beamX - viewportWidth * 0.42, beamY, beamX + viewportWidth * 0.42, beamY);
      beam.addColorStop(0, withAlpha(palette.accent, 0));
      beam.addColorStop(0.26, withAlpha(palette.accent, 0.05));
      beam.addColorStop(0.47, withAlpha(palette.accentStrong, 0.18));
      beam.addColorStop(0.5, withAlpha(palette.accentStrong, 0.32));
      beam.addColorStop(0.53, withAlpha(palette.accentGlow, 0.1));
      beam.addColorStop(0.76, withAlpha(palette.shaderWarm, 0.06));
      beam.addColorStop(1, withAlpha(palette.accent, 0));
      context.fillStyle = beam;
      context.fillRect(0, beamY - viewportHeight * 0.16, viewportWidth, viewportHeight * 0.32);

      const halo = context.createRadialGradient(beamX, beamY, 0, beamX, beamY, viewportWidth * 0.35);
      halo.addColorStop(0, withAlpha(palette.accentStrong, 0.24));
      halo.addColorStop(0.4, withAlpha(palette.shaderWarm, 0.08));
      halo.addColorStop(0.8, withAlpha(palette.bg, 0));
      context.fillStyle = halo;
      context.beginPath();
      context.ellipse(beamX, beamY, viewportWidth * 0.24, viewportHeight * 0.18, -0.12, 0, Math.PI * 2);
      context.fill();
      context.restore();

      context.save();
      context.globalCompositeOperation = "screen";
      context.fillStyle = withAlpha(palette.accentStrong, 0.25);

      for (const particle of particles) {
        particle.x += particle.vx + Math.sin(t * 0.24 + particle.phase) * 0.08;
        particle.y += particle.vy + Math.cos(t * 0.2 + particle.phase) * 0.06;

        if (particle.x < -12) {
          particle.x = viewportWidth + 12;
        } else if (particle.x > viewportWidth + 12) {
          particle.x = -12;
        }

        if (particle.y < -12) {
          particle.y = viewportHeight + 12;
        } else if (particle.y > viewportHeight + 12) {
          particle.y = -12;
        }

        const beamDistance = Math.abs(particle.x - beamX) / viewportWidth;
        const scanDistance = Math.abs(particle.y - scanY) / viewportHeight;
        const brightness = clamp(0.16 + (1 - beamDistance * 3.2) * 0.24 + (1 - scanDistance * 4.5) * 0.08, 0.05, 0.45);
        const radius = particle.radius * (1 + brightness * 0.9);

        context.globalAlpha = brightness;
        context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();

      context.save();
      context.globalAlpha = 0.12;
      context.fillStyle = palette.shaderDeep;
      for (let y = 0; y < viewportHeight; y += 3) {
        context.fillRect(0, y, viewportWidth, 1);
      }
      context.restore();

      context.save();
      context.globalAlpha = 0.28;
      context.fillStyle = withAlpha(palette.shaderMid, 0.16);
      context.fillRect(0, scanY, viewportWidth, 1);
      context.globalAlpha = 0.18;
      context.fillRect(0, scanY + 2, viewportWidth, 1);
      context.restore();

      context.save();
      context.globalAlpha = 0.22;
      const grain = context.createRadialGradient(viewportWidth * 0.5, viewportHeight * 0.5, 0, viewportWidth * 0.5, viewportHeight * 0.5, Math.max(viewportWidth, viewportHeight) * 0.9);
      grain.addColorStop(0, withAlpha(palette.bg, 0));
      grain.addColorStop(0.72, withAlpha(palette.bg, 0));
      grain.addColorStop(1, withAlpha(palette.shaderDeep, 0.16));
      context.fillStyle = grain;
      context.fillRect(0, 0, viewportWidth, viewportHeight);
      context.restore();

      if (!prefersReducedMotion) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (prefersReducedMotion) {
      drawOnce();
    } else {
      animationFrame = window.requestAnimationFrame(drawFrame);
    }

    const onMotionChange = () => {
      prefersReducedMotion = prefersReducedMotionQuery.matches;
      window.cancelAnimationFrame(animationFrame);
      resize();

      if (prefersReducedMotion) {
        drawOnce();
      } else {
        animationFrame = window.requestAnimationFrame(drawFrame);
      }
    };

    prefersReducedMotionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      prefersReducedMotionQuery.removeEventListener("change", onMotionChange);
    };
  }, [palette]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 will-change-transform" />;
}
