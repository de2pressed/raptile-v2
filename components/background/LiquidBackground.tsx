"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { mixColor, withAlpha } from "@/lib/theme-lab";

type CellSpec = {
  left: string;
  top: string;
  width: string;
  height: string;
  blur: number;
  opacity: number;
  duration: number;
  delay: number;
  x: number;
  y: number;
  scale: number;
  colorKey: "accent" | "accentStrong" | "shaderWarm" | "shaderMid" | "accentGlow";
};

const CELLS: CellSpec[] = [
  { left: "6%", top: "12%", width: "30vw", height: "24vh", blur: 96, opacity: 0.5, duration: 28, delay: 0, x: 18, y: 10, scale: 1.06, colorKey: "accent" },
  { left: "26%", top: "18%", width: "38vw", height: "30vh", blur: 118, opacity: 0.36, duration: 34, delay: -4, x: -14, y: 8, scale: 1.04, colorKey: "shaderWarm" },
  { left: "56%", top: "8%", width: "34vw", height: "28vh", blur: 104, opacity: 0.42, duration: 30, delay: -8, x: 12, y: 12, scale: 1.08, colorKey: "accentStrong" },
  { left: "14%", top: "60%", width: "42vw", height: "28vh", blur: 124, opacity: 0.4, duration: 38, delay: -12, x: 16, y: -8, scale: 1.05, colorKey: "shaderMid" },
  { left: "58%", top: "56%", width: "34vw", height: "24vh", blur: 110, opacity: 0.38, duration: 32, delay: -15, x: -18, y: 10, scale: 1.07, colorKey: "accentGlow" },
] as const;

const CONTOURS = [
  "M -120 240 C 90 180, 220 280, 410 232 S 740 170, 1120 230",
  "M -140 420 C 60 370, 260 480, 520 420 S 820 360, 1140 425",
  "M -120 612 C 120 560, 300 680, 520 620 S 820 560, 1120 610",
  "M -100 800 C 120 748, 330 842, 560 806 S 840 754, 1140 800",
] as const;

export default function WeatherCell({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;
  const frontTone = mixColor(palette.shaderWarm, palette.accentStrong, 0.38);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${palette.bgSoft} 0%, ${palette.bg} 42%, ${palette.bgElevated} 100%)`,
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-14%]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, ${withAlpha(palette.textSubtle, 0.045)} 0 1px, transparent 1px 14vw),
            repeating-linear-gradient(0deg, ${withAlpha(palette.textSubtle, 0.04)} 0 1px, transparent 1px 18vh)
          `,
          mixBlendMode: "soft-light",
          opacity: 0.4,
        }}
        animate={
          reduceMotion
            ? { opacity: 0.28 }
            : {
                x: [0, 16, 0],
                y: [0, -10, 0],
                opacity: [0.22, 0.44, 0.22],
              }
        }
        transition={{
          duration: 36,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[18%] h-[74vmax] w-[74vmax] -translate-x-1/2 rounded-[50%]"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${withAlpha(palette.accentStrong, 0.2)} 0%, ${withAlpha(
            palette.accent,
            0.1,
          )} 28%, transparent 60%)`,
          filter: "blur(62px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.68, y: 0, scale: 1 }
            : {
                opacity: [0.48, 0.88, 0.5],
                y: [0, 18, 0],
                scale: [1, 1.045, 1.015],
              }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {CELLS.map((cell, index) => {
        const cellColor = palette[cell.colorKey];

        return (
          <motion.div
            key={`${cell.left}-${cell.top}-${index}`}
            aria-hidden="true"
            className="absolute rounded-[50%]"
            style={{
              left: cell.left,
              top: cell.top,
              width: cell.width,
              height: cell.height,
              background: `radial-gradient(circle at 35% 32%, ${withAlpha(cellColor, 0.8)} 0%, ${withAlpha(
                cellColor,
                0.42,
              )} 26%, ${withAlpha(cellColor, 0.16)} 54%, transparent 74%)`,
              filter: `blur(${cell.blur}px)`,
              mixBlendMode: "screen",
            }}
            animate={
              reduceMotion
                ? { opacity: cell.opacity, x: 0, y: 0, scale: cell.scale }
                : {
                    opacity: [cell.opacity * 0.82, cell.opacity, cell.opacity * 0.9],
                    x: [0, cell.x, 0],
                    y: [0, cell.y, 0],
                    scale: [cell.scale, cell.scale + 0.03, cell.scale],
                  }
            }
            transition={{
              duration: cell.duration,
              delay: cell.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-[40%] h-[22vh]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(frontTone, 0.05)} 18%, ${withAlpha(
            palette.accentStrong,
            0.14,
          )} 50%, ${withAlpha(frontTone, 0.05)} 82%, transparent 100%)`,
          filter: "blur(16px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.45, y: 0 }
            : {
                opacity: [0.2, 0.46, 0.2],
                y: [0, 14, 0],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        {CONTOURS.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            opacity={0.26 - index * 0.035}
            stroke={index % 2 === 0 ? palette.accentStrong : palette.shaderWarm}
            strokeDasharray="8 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={index === 1 ? 1.7 : 1.35}
            vectorEffect="non-scaling-stroke"
            animate={
              reduceMotion
                ? { strokeDashoffset: 0, opacity: 0.28 - index * 0.035 }
                : {
                    strokeDashoffset: [0, -200 - index * 36, -400 - index * 60],
                    opacity: [0.16, 0.34 - index * 0.035, 0.16],
                  }
            }
            transition={{
              duration: 26 + index * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <motion.path
          d="M -40 560 C 140 500, 360 610, 540 560 S 860 500, 1080 548"
          fill="none"
          stroke={withAlpha(palette.accent, 0.22)}
          strokeLinecap="round"
          strokeWidth="1.55"
          animate={
            reduceMotion
              ? { opacity: 0.36, x: 0 }
              : {
                  opacity: [0.18, 0.42, 0.18],
                  x: [0, 14, 0],
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
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 56%, transparent 18%, ${withAlpha(palette.bg, 0.1)} 66%, ${withAlpha(
            palette.shaderDeep,
            0.3,
          )} 100%)`,
          mixBlendMode: "multiply",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.84 }
            : {
                opacity: [0.72, 0.9, 0.72],
              }
        }
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-68"
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
