"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";

export default function GrainDriftBackground({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes grain-drift-pan {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 220px 220px;
          }
        }
      `}</style>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundSize: "220px 220px",
          backgroundRepeat: "repeat",
          mixBlendMode: "soft-light",
          animation: reduceMotion ? undefined : "grain-drift-pan 10s linear infinite",
          willChange: "background-position, opacity",
        }}
        animate={reduceMotion ? { opacity: 0.04 } : { opacity: [0.03, 0.06, 0.03] }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.bgSoft} 100%)`,
          opacity: 0.4,
        }}
      />
    </div>
  );
}
