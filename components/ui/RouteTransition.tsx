"use client";

import type { PropsWithChildren } from "react";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import { usePathname } from "next/navigation";

export function PageContentTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{
            opacity: { duration: 0.18, delay: reducedMotion ? 0 : 0.08 },
            y: { duration: reducedMotion ? 0 : 0.18, delay: reducedMotion ? 0 : 0.08 },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LazyMotion>
  );
}

export function RouteTransitionOverlay() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={pathname}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[9999] bg-[oklch(0.14_0.03_42)]"
          initial={{ clipPath: "circle(0% at 50% 50%)", opacity: reducedMotion ? 0 : 1 }}
          animate={{
            clipPath: reducedMotion
              ? "circle(0% at 50% 50%)"
              : ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)", "circle(150% at 50% 50%)", "circle(0% at 50% 50%)"],
            opacity: reducedMotion ? [0, 1, 0] : 1,
          }}
          exit={{ opacity: reducedMotion ? 0 : 1 }}
          transition={
            reducedMotion
              ? { duration: 0.18, times: [0, 0.5, 1] }
              : {
                  duration: 0.44,
                  ease: [0.76, 0, 0.24, 1],
                  times: [0, 0.41, 0.55, 1],
                }
          }
        />
      </AnimatePresence>
    </LazyMotion>
  );
}
