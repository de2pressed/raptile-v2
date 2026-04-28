"use client";

import { useEffect } from "react";

import { applyTimeAccentPalette, getIstTimeAccentPalette } from "@/lib/time-accent";

export function TimeAccentBridge() {
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      applyTimeAccentPalette(root, getIstTimeAccentPalette(new Date()));
    };

    apply();

    const interval = window.setInterval(apply, 60_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        apply();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
