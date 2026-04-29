"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemePalette } from "@/lib/theme-lab";
import { mixColor, withAlpha } from "@/lib/theme-lab";

type RingSpec = {
  radius: number;
  opacity: number;
  strokeWidth: number;
  dashRatio: number;
  duration: number;
  delay: number;
};

const RINGS: RingSpec[] = [
  { radius: 126, opacity: 0.26, strokeWidth: 1.2, dashRatio: 0.2, duration: 21, delay: 0 },
  { radius: 194, opacity: 0.24, strokeWidth: 1.05, dashRatio: 0.16, duration: 27, delay: -4.5 },
  { radius: 264, opacity: 0.22, strokeWidth: 0.95, dashRatio: 0.14, duration: 33, delay: -7 },
  { radius: 336, opacity: 0.18, strokeWidth: 0.9, dashRatio: 0.12, duration: 39, delay: -10.5 },
];

type CornerSpec = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  rotate: number;
  width: string;
  height: string;
};

const CORNERS: CornerSpec[] = [
  { left: "7%", top: "10%", rotate: 0, width: "8.5rem", height: "8.5rem" },
  { left: "auto", right: "7%", top: "10%", rotate: 90, width: "8.5rem", height: "8.5rem" },
  { left: "7%", top: "auto", bottom: "10%", rotate: -90, width: "8.5rem", height: "8.5rem" },
  { left: "auto", right: "7%", top: "auto", bottom: "10%", rotate: 180, width: "8.5rem", height: "8.5rem" },
];

export default function PressPlateBloom({ palette }: { palette: ThemePalette }) {
  const reduceMotion = useReducedMotion() ?? false;
  const registerStroke = mixColor(palette.accent, palette.text, 0.42);
  const plateGlow = `radial-gradient(circle at 50% 42%, ${withAlpha(palette.accentStrong, 0.22)} 0%, ${withAlpha(
    palette.accent,
    0.12,
  )} 24%, transparent 52%)`;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${palette.bgSoft} 0%, ${palette.bg} 48%, ${palette.bgElevated} 100%)`,
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-10%]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, ${withAlpha(palette.textSubtle, 0.05)} 0 1px, transparent 1px 92px),
            repeating-linear-gradient(0deg, ${withAlpha(palette.textSubtle, 0.035)} 0 1px, transparent 1px 92px),
            radial-gradient(circle at 50% 42%, ${withAlpha(palette.accentStrong, 0.09)} 0%, transparent 54%)
          `,
          mixBlendMode: "soft-light",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.68 }
            : {
                x: [0, 16, 0],
                y: [0, -10, 0],
                opacity: [0.42, 0.72, 0.42],
                scale: [1, 1.02, 1],
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
        className="absolute left-1/2 top-1/2 h-[72vmax] w-[72vmax] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background: `${plateGlow}, radial-gradient(circle at 50% 48%, ${withAlpha(palette.shaderWarm, 0.16)} 0%, transparent 58%)`,
          filter: "blur(52px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.84, scale: 1 }
            : {
                opacity: [0.66, 1, 0.74],
                scale: [1, 1.045, 1.01],
                x: [0, 8, 0],
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[18%] h-[72vw] w-[120vw] -translate-x-1/2 rounded-[50%]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${withAlpha(palette.shaderMid, 0.1)} 48%, transparent 100%)`,
          filter: "blur(28px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.55, y: 0 }
            : {
                opacity: [0.24, 0.5, 0.24],
                y: [0, 16, 0],
                scale: [1, 1.02, 1],
              }
        }
        transition={{
          duration: 20,
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
        <g>
          {RINGS.map((ring, index) => {
            const circumference = 2 * Math.PI * ring.radius;
            const stroke = mixColor(palette.shaderDeep, registerStroke, 0.32 + index * 0.12);

            return (
              <motion.circle
                key={`${ring.radius}-${index}`}
                cx="500"
                cy="500"
                fill="none"
                opacity={ring.opacity}
                r={ring.radius}
                stroke={stroke}
                strokeDasharray={`${circumference * ring.dashRatio} ${circumference}`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={ring.strokeWidth}
                vectorEffect="non-scaling-stroke"
                animate={
                  reduceMotion
                    ? { strokeDashoffset: 0, rotate: 0 }
                    : {
                        strokeDashoffset: [0, -circumference * 0.16, -circumference * 0.32],
                        rotate: [0, 1.2 + index * 0.2, 0],
                      }
                }
                style={{
                  transformOrigin: "center",
                  filter: `drop-shadow(0 0 10px ${withAlpha(palette.accent, 0.14)})`,
                }}
                transition={{
                  duration: ring.duration,
                  delay: ring.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          <motion.line
            x1="156"
            x2="844"
            y1="500"
            y2="500"
            stroke={withAlpha(palette.accentStrong, 0.34)}
            strokeLinecap="round"
            strokeWidth="1.6"
            animate={
              reduceMotion
                ? { opacity: 0.42, x: 0 }
                : {
                    opacity: [0.22, 0.5, 0.22],
                    x: [0, 8, 0],
                  }
            }
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.line
            x1="500"
            x2="500"
            y1="154"
            y2="846"
            stroke={withAlpha(palette.accent, 0.28)}
            strokeLinecap="round"
            strokeWidth="1.4"
            animate={
              reduceMotion
                ? { opacity: 0.38, y: 0 }
                : {
                    opacity: [0.18, 0.42, 0.18],
                    y: [0, -10, 0],
                  }
            }
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.path
            d="M 206 330 C 330 250, 670 250, 794 330"
            fill="none"
            stroke={withAlpha(palette.shaderWarm, 0.28)}
            strokeLinecap="round"
            strokeWidth="1.4"
            animate={
              reduceMotion
                ? { pathLength: 1, opacity: 0.42 }
                : {
                    pathLength: [0.58, 1, 0.62],
                    opacity: [0.2, 0.46, 0.2],
                  }
            }
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.path
            d="M 206 670 C 330 750, 670 750, 794 670"
            fill="none"
            stroke={withAlpha(palette.shaderMid, 0.26)}
            strokeLinecap="round"
            strokeWidth="1.3"
            animate={
              reduceMotion
                ? { pathLength: 1, opacity: 0.38 }
                : {
                    pathLength: [0.52, 1, 0.56],
                    opacity: [0.16, 0.4, 0.16],
                  }
            }
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </g>
      </svg>

      {CORNERS.map((corner, index) => (
        <motion.div
          key={`${corner.left ?? corner.right ?? "corner"}-${index}`}
          aria-hidden="true"
          className="absolute"
          style={{
            left: corner.left,
            right: corner.right,
            top: corner.top,
            bottom: corner.bottom,
            width: corner.width,
            height: corner.height,
            transform: `rotate(${corner.rotate}deg)`,
            transformOrigin: "center",
          }}
          animate={
            reduceMotion
              ? { opacity: 0.5, scale: 1 }
              : {
                  opacity: [0.28, 0.58, 0.28],
                  scale: [1, 1.03, 1],
                }
          }
          transition={{
            duration: 14 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderTop: `1px solid ${withAlpha(palette.accentStrong, 0.46)}`,
              borderLeft: `1px solid ${withAlpha(palette.accent, 0.46)}`,
              borderRadius: "0 0 0 0",
              maskImage:
                "linear-gradient(135deg, black 0 52%, transparent 52% 100%), linear-gradient(225deg, black 0 52%, transparent 52% 100%)",
              WebkitMaskImage:
                "linear-gradient(135deg, black 0 52%, transparent 52% 100%), linear-gradient(225deg, black 0 52%, transparent 52% 100%)",
            }}
          />
        </motion.div>
      ))}

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-[46%] h-[12vh]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(palette.accent, 0.04)} 18%, ${withAlpha(
            palette.accentStrong,
            0.18,
          )} 50%, ${withAlpha(palette.accent, 0.04)} 82%, transparent 100%)`,
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.5, y: 0 }
            : {
                opacity: [0.2, 0.42, 0.2],
                y: [0, 8, 0],
              }
        }
        transition={{
          duration: 19,
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
          backgroundSize: "220px 220px",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
