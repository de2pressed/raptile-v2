"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const initialPathRef = useRef(pathname);
  const hasMountedRef = useRef(false);

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
      return;
    }
  }, [pathname]);

  return <div className="relative">{children}</div>;
}
