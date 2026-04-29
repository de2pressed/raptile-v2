"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { mixColor, withAlpha } from "@/lib/theme-lab";

type ThreadSpec = {
  d: string;
  opacity: number;
  strokeWidth: number;
  dash: string;
  duration: number;
  delay: number;
};

const THREADS: ThreadSpec[] = [
  { d: "M -120 230 C 120 188, 280 270, 460 232 S 800 190, 1120 232", opacity: 0.42, strokeWidth: 1.4, dash: "2 30", duration: 28, delay: 0 },
  { d: "M -120 352 C 130 306, 310 392, 500 352 S 790 308, 1120 354", opacity: 0.38, strokeWidth: 1.2, dash: "3 26", duration: 32, delay: -4 },
  { d: "M -120 498 C 120 458, 300 542, 500 498 S 800 456, 1120 500", opacity: 0.34, strokeWidth: 1.15, dash: "2 24", duration: 36, delay: -8 },
  { d: "M -120 646 C 120 608, 300 692, 500 648 S 800 608, 1120 648", opacity: 0.3, strokeWidth: 1.12, dash: "3 28", duration: 40, delay: -12 },
  { d: "M -120 792 C 120 758, 310 836, 500 794 S 790 760, 1120 794", opacity: 0.28, strokeWidth: 1.08, dash: "2 32", duration: 44, delay: -16 },
] as const;

const BEAMS = [
  { left: "10%", top: "14%", width: "18rem", height: "52vh", rotate: -4, delay: 0 },
  { left: "42%", top: "8%", width: "11rem", height: "84vh", rotate: 0, delay: 2.5 },
  { left: "72%", top: "18%", width: "16rem", height: "58vh", rotate: 5, delay: 4.2 },
] as const;

export default function LoomRegister({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;
  const warp = mixColor(palette.shaderDeep, palette.shaderWarm, 0.42);
  const weft = mixColor(palette.accent, palette.text, 0.22);
  const seam = mixColor(palette.shaderMid, palette.accentStrong, 0.38);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${palette.bgSoft} 0%, ${palette.bg} 50%, ${palette.bgElevated} 100%)`,
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-12%]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, ${withAlpha(warp, 0.07)} 0 1px, transparent 1px 20px),
            repeating-linear-gradient(0deg, ${withAlpha(weft, 0.055)} 0 1px, transparent 1px 22px),
            linear-gradient(135deg, ${withAlpha(palette.accent, 0.08)} 0%, transparent 35%, ${withAlpha(
              palette.shaderDeep,
              0.1,
            )} 100%)
          `,
          backgroundBlendMode: "screen, screen, normal",
          mixBlendMode: "soft-light",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.7 }
            : {
                x: [0, 18, 0],
                y: [0, -12, 0],
                opacity: [0.5, 0.82, 0.5],
                scale: [1, 1.018, 1],
              }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-[-8%]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(128deg, ${withAlpha(palette.accentStrong, 0.12)} 0 1px, transparent 1px 36px),
            repeating-linear-gradient(52deg, ${withAlpha(palette.shaderWarm, 0.1)} 0 1px, transparent 1px 42px)
          `,
          mixBlendMode: "screen",
          opacity: 0.58,
        }}
        animate={
          reduceMotion
            ? { opacity: 0.45 }
            : {
                x: [0, -22, 0],
                y: [0, 16, 0],
                rotate: [0, 0.8, 0],
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
        className="absolute left-1/2 top-1/2 h-[74vmax] w-[74vmax] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${withAlpha(palette.accentStrong, 0.16)} 0%, ${withAlpha(
            palette.accent,
            0.08,
          )} 22%, transparent 60%)`,
          filter: "blur(48px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.78, scale: 1 }
            : {
                opacity: [0.54, 0.92, 0.54],
                scale: [1, 1.035, 1.01],
                x: [0, 12, 0],
              }
        }
        transition={{
          duration: 26,
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
        {THREADS.map((thread, index) => {
          const stroke = [palette.shaderWarm, seam, palette.accentStrong, palette.shaderMid, palette.accent]
            [index % 5];

          return (
            <motion.path
              key={`${index}-${thread.d}`}
              d={thread.d}
              fill="none"
              opacity={thread.opacity}
              stroke={stroke}
              strokeDasharray={thread.dash}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={thread.strokeWidth}
              vectorEffect="non-scaling-stroke"
              animate={
                reduceMotion
                  ? { strokeDashoffset: 0, x: 0 }
                  : {
                      strokeDashoffset: [0, -80 - index * 22, -160 - index * 30],
                      x: [0, 10 + index * 2, 0],
                    }
              }
              style={{
                filter: `drop-shadow(0 0 8px ${withAlpha(palette.accent, 0.12)})`,
              }}
              transition={{
                duration: thread.duration,
                delay: thread.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}

        <motion.line
          x1="150"
          x2="850"
          y1="502"
          y2="502"
          stroke={withAlpha(palette.accentStrong, 0.24)}
          strokeLinecap="round"
          strokeWidth="1.6"
          animate={
            reduceMotion
              ? { opacity: 0.42, x: 0 }
              : {
                  opacity: [0.18, 0.48, 0.18],
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

      <div aria-hidden="true" className="absolute inset-0">
        {BEAMS.map((beam, index) => (
          <motion.div
            key={`${beam.left}-${beam.top}`}
            className="absolute rounded-[42px]"
            style={{
              left: beam.left,
              top: beam.top,
              width: beam.width,
              height: beam.height,
              background: `linear-gradient(180deg, ${withAlpha(palette.accent, 0.04)} 0%, ${withAlpha(
                palette.accentStrong,
                0.14,
              )} 42%, ${withAlpha(palette.shaderWarm, 0.12)} 68%, ${withAlpha(palette.shaderDeep, 0)} 100%)`,
              transform: `rotate(${beam.rotate}deg)`,
              transformOrigin: "center",
              filter: `blur(${index === 1 ? 42 : 54}px)`,
              mixBlendMode: "screen",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.3, x: 0 }
                : {
                    opacity: [0.16, 0.44, 0.16],
                    x: [0, 12, 0],
                  }
            }
            transition={{
              duration: 16 + beam.delay * 1.5,
              delay: beam.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[16%] h-[12vh]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(palette.shaderWarm, 0.08)} 16%, ${withAlpha(
            palette.accentStrong,
            0.16,
          )} 50%, ${withAlpha(palette.shaderWarm, 0.08)} 84%, transparent 100%)`,
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.46, y: 0 }
            : {
                opacity: [0.18, 0.42, 0.18],
                y: [0, -10, 0],
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
          backgroundSize: "210px 210px",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
