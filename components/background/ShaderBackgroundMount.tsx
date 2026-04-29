"use client";

import dynamic from "next/dynamic";

export const LiquidBackgroundMount = dynamic(
  () => import("@/components/background/LiquidBackground").then((module) => module.default),
  { ssr: false },
);
