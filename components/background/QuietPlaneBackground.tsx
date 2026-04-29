"use client";

import { motion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { withAlpha } from "@/lib/theme-lab";

export function QuietPlaneBackground({ palette }: { palette: ThemePalette }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${palette.bgSoft} 0%, ${palette.bg} 52%, ${palette.bgElevated} 100%)`,
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[12%] h-[48vmax] w-[72vmax] -translate-x-1/2 rounded-[50%] blur-[120px]"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${withAlpha(palette.accent, 0.26)} 0%, ${withAlpha(
            palette.shaderWarm,
            0.12,
          )} 32%, transparent 70%)`,
        }}
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, ${withAlpha(palette.text, 0.04)} 0%, transparent 24%, transparent 76%, ${withAlpha(
            palette.text,
            0.03,
          )} 100%),
            linear-gradient(90deg, ${withAlpha(palette.textSubtle, 0.09)} 0 1px, transparent 1px 100%)`,
          backgroundSize: "100% 100%, 10rem 10rem",
          mixBlendMode: "soft-light",
        }}
        animate={{ opacity: [0.42, 0.58, 0.42] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `url("/noise.png")`,
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
          mixBlendMode: "soft-light",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-[10%] top-[24%] h-px w-[42vw] blur-[0.5px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(palette.accent, 0.12)} 36%, ${withAlpha(
            palette.accentStrong,
            0.18,
          )} 50%, ${withAlpha(palette.accent, 0.08)} 64%, transparent 100%)`,
        }}
        animate={{ opacity: [0.25, 0.55, 0.25], scaleX: [1, 1.06, 1] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-[12%] top-[56%] h-px w-[34vw] blur-[0.5px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(palette.shaderWarm, 0.08)} 36%, ${withAlpha(
            palette.shaderMid,
            0.16,
          )} 50%, ${withAlpha(palette.shaderWarm, 0.08)} 64%, transparent 100%)`,
        }}
        animate={{ opacity: [0.18, 0.38, 0.18], scaleX: [1, 1.04, 1] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
