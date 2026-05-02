"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect } from "react";

function forceScrollTop() {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    forceScrollTop();

    const rafOne = window.requestAnimationFrame(() => {
      forceScrollTop();
      window.requestAnimationFrame(forceScrollTop);
    });

    const timeout = window.setTimeout(forceScrollTop, 0);

    return () => {
      window.cancelAnimationFrame(rafOne);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={pathname}
          className="relative min-h-[100dvh] transform-gpu"
          initial={{ opacity: 0, filter: "blur(14px)", y: 8, scale: 0.995 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
          exit={{ opacity: 0, filter: "blur(14px)", y: -6, scale: 0.995 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "opacity, filter, transform" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LazyMotion>
  );
}
