"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const initialPathRef = useRef(pathname);
  const hasMountedRef = useRef(false);

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

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    if (initialPathRef.current === pathname) {
      initialPathRef.current = "";
      return;
    }
  }, [pathname]);

  return <div className="relative">{children}</div>;
}
