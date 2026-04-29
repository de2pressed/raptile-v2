"use client";

import { LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const initialPathRef = useRef(pathname);
  const hasMountedRef = useRef(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (initialPathRef.current === pathname) {
      initialPathRef.current = "";
      setDisplayChildren(children);
      setPhase("idle");
      return;
    }

    setPhase("exit");

    const swapTimer = window.setTimeout(() => {
      setDisplayChildren(children);
      setPhase("enter");
    }, reducedMotion ? 0 : 160);

    const settleTimer = window.setTimeout(() => {
      setPhase("idle");
    }, reducedMotion ? 120 : 400);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(settleTimer);
    };
  }, [children, pathname, reducedMotion]);

  const transition = reducedMotion
    ? { duration: 0.01, ease: [0.4, 0, 0.2, 1] as const }
    : { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative">
        <motion.div
          initial={false}
          animate={{
            filter: phase === "exit" ? "blur(12px)" : "blur(0px)",
            opacity: phase === "exit" ? 0.94 : 1,
          }}
          transition={transition}
        >
          {displayChildren}
        </motion.div>

        <motion.div
          aria-hidden
          className="page-transition-overlay"
          initial={false}
          animate={{ opacity: phase === "idle" ? 0 : phase === "exit" ? 0.6 : 0 }}
          transition={transition}
        />
      </div>
    </LazyMotion>
  );
}
