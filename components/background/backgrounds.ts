export { default as FluidMeshBackground } from "./FluidMeshBackground";
export { default as WovenParticleBackground } from "./WovenParticleBackground";
export { default as GrainDriftBackground } from "./GrainDriftBackground";
export { default as AuroraWavesBackground } from "./AuroraWavesBackground";
export { default as LiquidChromaticBackground } from "./LiquidChromaticBackground";
export { default as LoomRegister } from "./QuietPlaneBackground";

import type { ComponentType } from "react";

import FluidMeshBackground from "./FluidMeshBackground";
import AuroraWavesBackground from "./AuroraWavesBackground";
import GrainDriftBackground from "./GrainDriftBackground";
import LiquidChromaticBackground from "./LiquidChromaticBackground";
import LoomRegister from "./QuietPlaneBackground";
import WovenParticleBackground from "./WovenParticleBackground";
import type { ThemePalette } from "@/lib/theme-lab";

export type BackgroundComponent = ComponentType<{ palette: ThemePalette }>;

export const BACKGROUND_REGISTRY: Record<string, { label: string; component: BackgroundComponent }> = {
  loom: { label: "Loom (Current)", component: LoomRegister },
  fluid: { label: "Fluid Mesh", component: FluidMeshBackground },
  woven: { label: "Woven Particles", component: WovenParticleBackground },
  grain: { label: "Grain Drift", component: GrainDriftBackground },
  aurora: { label: "Aurora Waves", component: AuroraWavesBackground },
  liquid: { label: "Liquid Chromatic", component: LiquidChromaticBackground },
};
