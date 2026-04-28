"use client";

import dynamic from "next/dynamic";

export const ShaderBackgroundMount = dynamic(
  () => import("@/components/background/ShaderBackground").then((module) => module.ShaderBackground),
  { ssr: false },
);
