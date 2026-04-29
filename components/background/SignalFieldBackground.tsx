"use client";

import { motion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { withAlpha } from "@/lib/theme-lab";

const SIGNAL_BEAMS = [
  { left: "-8%", top: "18%", rotate: -18, width: "44vw", height: "26vh", delay: 0 },
  { left: "36%", top: "10%", rotate: 11, width: "38vw", height: "28vh", delay: 1.4 },
  { left: "64%", top: "38%", rotate: -9, width: "32vw", height: "24vh", delay: 2.2 },
] as const;

export function SignalFieldBackground({ palette }: { palette: ThemePalette }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${palette.bgSoft} 0%, ${palette.bg} 40%, ${palette.bgElevated} 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, ${withAlpha(palette.textSubtle, 0.06)} 0 1px, transparent 1px 12.5vw),
            repeating-linear-gradient(0deg, ${withAlpha(palette.textSubtle, 0.05)} 0 1px, transparent 1px 12.5vw)
          `,
          opacity: 0.45,
          mixBlendMode: "soft-light",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[10%] h-[52vmax] w-[82vmax] -translate-x-1/2 rounded-[50%] blur-[110px]"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${withAlpha(palette.accent, 0.22)} 0%, ${withAlpha(
            palette.shaderWarm,
            0.14,
          )} 30%, transparent 68%)`,
        }}
        animate={{
          y: [0, -14, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {SIGNAL_BEAMS.map((beam) => (
        <motion.div
          key={`${beam.left}-${beam.top}`}
          aria-hidden="true"
          className="absolute rounded-[42px] blur-[72px]"
          style={{
            left: beam.left,
            top: beam.top,
            width: beam.width,
            height: beam.height,
            background: `linear-gradient(135deg, ${withAlpha(palette.accent, 0.05)} 0%, ${withAlpha(
              palette.accentStrong,
              0.24,
            )} 44%, ${withAlpha(palette.accentGlow, 0.12)} 68%, transparent 100%)`,
            transform: `rotate(${beam.rotate}deg)`,
            transformOrigin: "center",
          }}
          animate={{
            opacity: [0.18, 0.42, 0.18],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 13 + beam.delay,
            delay: beam.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-[52%] h-[28vh] blur-[56px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(palette.accent, 0.08)} 22%, ${withAlpha(
            palette.accentStrong,
            0.18,
          )} 50%, ${withAlpha(palette.accent, 0.08)} 78%, transparent 100%)`,
        }}
        animate={{
          y: [0, 8, 0],
          opacity: [0.24, 0.46, 0.24],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `url("/noise.png")`,
          backgroundRepeat: "repeat",
          backgroundSize: "210px 210px",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
