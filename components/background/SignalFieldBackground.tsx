"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { mixColor, withAlpha } from "@/lib/theme-lab";

type FoldPanel = {
  clipPath: string;
  background: string;
  opacity: number;
  rotateY: number;
  x: number;
  delay: number;
  duration: number;
};

const PANELS: FoldPanel[] = [
  {
    clipPath: "polygon(0 0, 52% 0, 44% 50%, 52% 100%, 0 100%)",
    background: "linear-gradient(110deg, rgba(255,255,255,0.02) 0%, transparent 34%, rgba(255,255,255,0.03) 100%)",
    opacity: 0.9,
    rotateY: -16,
    x: -28,
    delay: 0,
    duration: 28,
  },
  {
    clipPath: "polygon(42% 0, 58% 0, 54% 50%, 58% 100%, 42% 100%, 46% 50%)",
    background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 48%, rgba(255,255,255,0.04) 100%)",
    opacity: 1,
    rotateY: 0,
    x: 0,
    delay: 1.8,
    duration: 22,
  },
  {
    clipPath: "polygon(48% 0, 100% 0, 100% 100%, 48% 100%, 56% 50%)",
    background: "linear-gradient(250deg, rgba(255,255,255,0.03) 0%, transparent 36%, rgba(255,255,255,0.015) 100%)",
    opacity: 0.92,
    rotateY: 17,
    x: 30,
    delay: 0.9,
    duration: 30,
  },
] as const;

const SEAMS = [
  "M -80 220 L 1080 840",
  "M -60 300 L 1040 960",
  "M -120 700 L 1120 160",
] as const;

export default function FoldEngine({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;
  const frameTint = mixColor(palette.shaderDeep, palette.accentStrong, 0.22);
  const seamTone = mixColor(palette.accent, palette.shaderWarm, 0.55);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${palette.bgSoft} 0%, ${palette.bg} 52%, ${palette.bgElevated} 100%)`,
        perspective: "1600px",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-12%]"
        style={{
          backgroundImage: `
            linear-gradient(180deg, ${withAlpha(palette.shaderWarm, 0.08)} 0%, transparent 30%, ${withAlpha(
              palette.shaderDeep,
              0.08,
            )} 100%),
            repeating-linear-gradient(90deg, ${withAlpha(palette.textSubtle, 0.05)} 0 1px, transparent 1px 88px)
          `,
          mixBlendMode: "soft-light",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.62 }
            : {
                opacity: [0.38, 0.72, 0.38],
                x: [0, 14, 0],
                y: [0, -10, 0],
                scale: [1, 1.012, 1],
              }
        }
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-[44%]"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${withAlpha(palette.accentStrong, 0.16)} 0%, ${withAlpha(
            palette.accent,
            0.08,
          )} 26%, transparent 58%)`,
          filter: "blur(46px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.7, scale: 1 }
            : {
                opacity: [0.48, 0.94, 0.48],
                scale: [1, 1.04, 1.015],
                x: [0, 10, 0],
                y: [0, 6, 0],
              }
        }
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(130deg, transparent 0%, ${withAlpha(palette.shaderDeep, 0.24)} 50%, transparent 100%)`,
          mixBlendMode: "multiply",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, ${withAlpha(palette.textSubtle, 0.035)} 0 1px, transparent 1px 28px),
            repeating-linear-gradient(90deg, ${withAlpha(palette.textSubtle, 0.03)} 0 1px, transparent 1px 48px)
          `,
          opacity: 0.28,
          mixBlendMode: "soft-light",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {PANELS.map((panel, index) => (
          <motion.div
            key={`${index}-${panel.rotateY}`}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              clipPath: panel.clipPath,
              background: panel.background,
              opacity: panel.opacity,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              boxShadow: `inset 0 1px 0 ${withAlpha(palette.glassHighlight, 0.5)}, inset 0 0 0 1px ${withAlpha(
                palette.glassBorder,
                0.6,
              )}`,
            }}
            animate={
              reduceMotion
                ? { opacity: panel.opacity, x: panel.x, rotateY: panel.rotateY }
                : {
                    opacity: [panel.opacity * 0.85, panel.opacity, panel.opacity * 0.88],
                    x: [panel.x, panel.x + 14 * (index % 2 === 0 ? -1 : 1), panel.x],
                    rotateY: [panel.rotateY, panel.rotateY + (index % 2 === 0 ? -4 : 4), panel.rotateY],
                    skewY: [0, index === 1 ? -0.9 : 0.8, 0],
                  }
            }
            transition={{
              duration: panel.duration,
              delay: panel.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        {SEAMS.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            opacity={0.28 - index * 0.05}
            stroke={index === 1 ? seamTone : frameTint}
            strokeDasharray="12 26"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={index === 1 ? 1.8 : 1.3}
            vectorEffect="non-scaling-stroke"
            animate={
              reduceMotion
                ? { strokeDashoffset: 0, opacity: 0.28 - index * 0.05 }
                : {
                    strokeDashoffset: [0, -180 - index * 40, -360 - index * 60],
                    opacity: [0.18, 0.34 - index * 0.05, 0.18],
                  }
            }
            transition={{
              duration: 24 + index * 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <motion.line
          x1="500"
          x2="500"
          y1="88"
          y2="912"
          stroke={withAlpha(palette.accentStrong, 0.2)}
          strokeLinecap="round"
          strokeWidth="1.4"
          animate={
            reduceMotion
              ? { opacity: 0.34 }
              : {
                  opacity: [0.16, 0.42, 0.16],
                  y: [0, -10, 0],
                }
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[12%] h-[10vh]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(palette.accent, 0.06)} 18%, ${withAlpha(
            palette.accentStrong,
            0.16,
          )} 50%, ${withAlpha(palette.accent, 0.06)} 82%, transparent 100%)`,
          filter: "blur(18px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.5, y: 0 }
            : {
                opacity: [0.18, 0.4, 0.18],
                y: [0, -8, 0],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-65"
        style={{
          backgroundImage: `url("/noise.png")`,
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
