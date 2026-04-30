"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { withAlpha } from "@/lib/theme-lab";

export default function GrainDriftBackground({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Base fill */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.bgSoft} 50%, ${palette.bgElevated} 100%)`,
        }}
      />

      {/* Subtle accent wash for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${withAlpha(palette.accent, 0.06)} 0%, transparent 70%)`,
        }}
      />

      <style>{`
        @keyframes grain-drift-pan {
          0% { background-position: 0 0; }
          100% { background-position: 220px 220px; }
        }
        @keyframes grain-drift-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>

      {/* Primary grain layer — large, slow drift */}
      <motion.div
        className="absolute inset-[-10%]"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundSize: "220px 220px",
          backgroundRepeat: "repeat",
          mixBlendMode: "soft-light",
          animation: reduceMotion
            ? undefined
            : "grain-drift-pan 10s linear infinite, grain-drift-scale 18s ease-in-out infinite",
          willChange: "background-position, opacity, transform",
        }}
        animate={reduceMotion ? { opacity: 0.18 } : { opacity: [0.12, 0.28, 0.12] }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Secondary grain layer — counter-direction, different speed for richness */}
      <motion.div
        className="absolute inset-[-8%]"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundSize: "180px 180px",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
          animation: reduceMotion
            ? undefined
            : "grain-drift-pan 14s linear infinite reverse",
          willChange: "background-position, opacity",
        }}
        animate={reduceMotion ? { opacity: 0.08 } : { opacity: [0.06, 0.14, 0.06] }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 3,
        }}
      />
    </div>
  );
}
