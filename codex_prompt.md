# Raptile Studio — Prompt 5: Production Background + Theme Lab v2

Date: 2026-04-30

## Context

You are working on the Raptile Studio codebase — Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3, Framer Motion, Zustand, Shopify Hydrogen.

### What happened in Prompt 4

- Created 5 experimental backgrounds and 5 color themes in a `/theme-lab` page
- **Decision made:** Aurora Waves background is the winner — it becomes the production background
- The 5 color themes (Midnight Silver, Bone Ink, Storm Slate, Desert Dusk, Carbon Flame) are being **replaced** with 10 new material-referenced palettes
- All other experimental backgrounds (FluidMesh, WovenParticle, GrainDrift, LiquidChromatic, old QuietPlaneBackground) will be deleted

### Key files you will touch

| File | Action |
|---|---|
| `lib/theme-lab.ts` | Remove 5 old palettes, add 10 new palettes, update `THEME_PALETTES` map |
| `components/background/ThemeBackdrop.tsx` | Switch from `LoomRegister` to `AuroraWavesBackground` |
| `components/background/QuietPlaneBackground.tsx` | **Delete** |
| `components/background/FluidMeshBackground.tsx` | **Delete** |
| `components/background/WovenParticleBackground.tsx` | **Delete** |
| `components/background/GrainDriftBackground.tsx` | **Delete** |
| `components/background/LiquidChromaticBackground.tsx` | **Delete** |
| `components/background/backgrounds.ts` | **Delete** (no longer needed — no background switching) |
| `app/theme-lab/page.tsx` | Rewrite — remove background selector, add 10 new themes, use AuroraWaves as fixed background |

### Files you must NOT touch

`app/layout.tsx`, `app/globals.css`, `DESIGN.md`, `DESIGN.json`, `PRODUCT.md`, `components/providers/AppProviders.tsx` (except the import path update if needed), any component outside the listed files.

---

## Objective

1. Make Aurora Waves the production background across the entire site
2. Replace all 5 old experimental palettes with 10 new material-referenced palettes
3. Rebuild the theme-lab page as a theme-only tester (no background selector)

---

## Tasks

### 1. Update `components/background/ThemeBackdrop.tsx`

Replace the current content. Change the import from `QuietPlaneBackground` to `AuroraWavesBackground`. The component stays the same structure:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

import AuroraWavesBackground from "@/components/background/AuroraWavesBackground";
import { EMBER_CURRENT } from "@/lib/theme-lab";

export function ThemeBackdrop() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      <AuroraWavesBackground palette={EMBER_CURRENT} />
    </motion.div>
  );
}
```

This is the entire file. Copy it exactly.

---

### 2. Delete old background files

Delete these 6 files:
- `components/background/QuietPlaneBackground.tsx`
- `components/background/FluidMeshBackground.tsx`
- `components/background/WovenParticleBackground.tsx`
- `components/background/GrainDriftBackground.tsx`
- `components/background/LiquidChromaticBackground.tsx`
- `components/background/backgrounds.ts`

After deletion, `components/background/` should contain only:
- `AuroraWavesBackground.tsx` (the production background)
- `ThemeBackdrop.tsx` (the wrapper that renders it)

---

### 3. Update `lib/theme-lab.ts` — Replace palettes

Keep these unchanged: `ThemePalette` interface, `EMBER_CURRENT`, `parseColor()`, `mixColor()`, `withAlpha()`.

**Delete** these 5 constants: `MIDNIGHT_SILVER`, `BONE_INK`, `STORM_SLATE`, `DESERT_DUSK`, `CARBON_FLAME`.

**Delete** the old `THEME_PALETTES` map.

**Add** these 10 new palette constants and a new `THEME_PALETTES` map. Copy these exactly — every value has been tuned for the Aurora Waves background:

```ts
export const GRAPHITE: ThemePalette = {
  charcoalInk: "#0d0d0f", warmShadow: "#141416", ashLift: "#1a1a1e",
  parchment: "#d8d8da", mutedSilt: "#8a8a8e", subtleDust: "#54545a",
  amberBronze: "#7a8a9a", amberBright: "#a0b0c0", emberGlow: "#4a5a6a",
  amberHaze: "rgba(122,138,154,0.12)", soldOutOxide: "#505058",
  bg: "#0d0d0f", bgSoft: "#141416", bgElevated: "#1a1a1e",
  text: "#d8d8da", textMuted: "#8a8a8e", textSubtle: "#54545a",
  accent: "#7a8a9a", accentStrong: "#a0b0c0", accentGlow: "#4a5a6a",
  accentSubtle: "rgba(122,138,154,0.12)", soldOut: "#505058",
  glassFill: "rgba(20,20,22,0.84)", glassBorder: "rgba(216,216,218,0.1)",
  glassHighlight: "rgba(232,232,234,0.06)", glassTintWarm: "rgba(122,138,154,0.16)",
  glassTintCool: "rgba(74,90,106,0.1)", shaderWarm: "#8a9aaa",
  shaderMid: "#5a6a7a", shaderDeep: "#060608", glassShadow: "rgba(0,0,0,0.18)",
};

export const TOBACCO: ThemePalette = {
  charcoalInk: "#0e0a06", warmShadow: "#16100a", ashLift: "#1e1610",
  parchment: "#e8dcd0", mutedSilt: "#a09484", subtleDust: "#6a5e52",
  amberBronze: "#a86840", amberBright: "#c88860", emberGlow: "#7a4828",
  amberHaze: "rgba(168,104,64,0.12)", soldOutOxide: "#6a5e54",
  bg: "#0e0a06", bgSoft: "#16100a", bgElevated: "#1e1610",
  text: "#e8dcd0", textMuted: "#a09484", textSubtle: "#6a5e52",
  accent: "#a86840", accentStrong: "#c88860", accentGlow: "#7a4828",
  accentSubtle: "rgba(168,104,64,0.12)", soldOut: "#6a5e54",
  glassFill: "rgba(22,16,10,0.84)", glassBorder: "rgba(232,220,208,0.1)",
  glassHighlight: "rgba(248,240,232,0.06)", glassTintWarm: "rgba(168,104,64,0.16)",
  glassTintCool: "rgba(122,72,40,0.1)", shaderWarm: "#b87850",
  shaderMid: "#8a5030", shaderDeep: "#060402", glassShadow: "rgba(0,0,0,0.18)",
};

export const INDIGO: ThemePalette = {
  charcoalInk: "#080c14", warmShadow: "#0e1420", ashLift: "#141c2a",
  parchment: "#d4dae2", mutedSilt: "#8890a0", subtleDust: "#505868",
  amberBronze: "#6882a4", amberBright: "#8aa4c4", emberGlow: "#3a5274",
  amberHaze: "rgba(104,130,164,0.12)", soldOutOxide: "#4a5060",
  bg: "#080c14", bgSoft: "#0e1420", bgElevated: "#141c2a",
  text: "#d4dae2", textMuted: "#8890a0", textSubtle: "#505868",
  accent: "#6882a4", accentStrong: "#8aa4c4", accentGlow: "#3a5274",
  accentSubtle: "rgba(104,130,164,0.12)", soldOut: "#4a5060",
  glassFill: "rgba(14,20,32,0.84)", glassBorder: "rgba(212,218,226,0.1)",
  glassHighlight: "rgba(228,234,242,0.06)", glassTintWarm: "rgba(104,130,164,0.14)",
  glassTintCool: "rgba(58,82,116,0.1)", shaderWarm: "#7892b4",
  shaderMid: "#4a6284", shaderDeep: "#04060a", glassShadow: "rgba(0,0,0,0.18)",
};

export const OLIVE: ThemePalette = {
  charcoalInk: "#0a0c08", warmShadow: "#12140e", ashLift: "#1a1c16",
  parchment: "#d4d8cc", mutedSilt: "#888c7a", subtleDust: "#52564a",
  amberBronze: "#7a8a5a", amberBright: "#9aaa78", emberGlow: "#4a5a34",
  amberHaze: "rgba(122,138,90,0.12)", soldOutOxide: "#50544a",
  bg: "#0a0c08", bgSoft: "#12140e", bgElevated: "#1a1c16",
  text: "#d4d8cc", textMuted: "#888c7a", textSubtle: "#52564a",
  accent: "#7a8a5a", accentStrong: "#9aaa78", accentGlow: "#4a5a34",
  accentSubtle: "rgba(122,138,90,0.12)", soldOut: "#50544a",
  glassFill: "rgba(18,20,14,0.84)", glassBorder: "rgba(212,216,204,0.1)",
  glassHighlight: "rgba(228,232,220,0.06)", glassTintWarm: "rgba(122,138,90,0.14)",
  glassTintCool: "rgba(74,90,52,0.1)", shaderWarm: "#8a9a6a",
  shaderMid: "#5a6a44", shaderDeep: "#040604", glassShadow: "rgba(0,0,0,0.18)",
};

export const OXBLOOD: ThemePalette = {
  charcoalInk: "#100808", warmShadow: "#180e0e", ashLift: "#201414",
  parchment: "#e0d4d4", mutedSilt: "#9a8888", subtleDust: "#645454",
  amberBronze: "#8a3a3a", amberBright: "#aa5454", emberGlow: "#5a2222",
  amberHaze: "rgba(138,58,58,0.12)", soldOutOxide: "#5a4e4e",
  bg: "#100808", bgSoft: "#180e0e", bgElevated: "#201414",
  text: "#e0d4d4", textMuted: "#9a8888", textSubtle: "#645454",
  accent: "#8a3a3a", accentStrong: "#aa5454", accentGlow: "#5a2222",
  accentSubtle: "rgba(138,58,58,0.12)", soldOut: "#5a4e4e",
  glassFill: "rgba(24,14,14,0.84)", glassBorder: "rgba(224,212,212,0.1)",
  glassHighlight: "rgba(240,228,228,0.06)", glassTintWarm: "rgba(138,58,58,0.14)",
  glassTintCool: "rgba(90,34,34,0.1)", shaderWarm: "#9a4a4a",
  shaderMid: "#6a2a2a", shaderDeep: "#060404", glassShadow: "rgba(0,0,0,0.18)",
};

export const CHALK: ThemePalette = {
  charcoalInk: "#eae4dc", warmShadow: "#e2dcd4", ashLift: "#d8d2ca",
  parchment: "#1a1816", mutedSilt: "#5a5650", subtleDust: "#8a8680",
  amberBronze: "#6a5838", amberBright: "#8a7450", emberGlow: "#4a3c24",
  amberHaze: "rgba(106,88,56,0.12)", soldOutOxide: "#8a867e",
  bg: "#eae4dc", bgSoft: "#e2dcd4", bgElevated: "#d8d2ca",
  text: "#1a1816", textMuted: "#5a5650", textSubtle: "#8a8680",
  accent: "#6a5838", accentStrong: "#8a7450", accentGlow: "#4a3c24",
  accentSubtle: "rgba(106,88,56,0.12)", soldOut: "#8a867e",
  glassFill: "rgba(226,220,212,0.84)", glassBorder: "rgba(26,24,22,0.1)",
  glassHighlight: "rgba(26,24,22,0.04)", glassTintWarm: "rgba(106,88,56,0.12)",
  glassTintCool: "rgba(74,60,36,0.08)", shaderWarm: "#7a6848",
  shaderMid: "#5a4830", shaderDeep: "#f0ece6", glassShadow: "rgba(0,0,0,0.06)",
};

export const SOOT: ThemePalette = {
  charcoalInk: "#0c0a08", warmShadow: "#141210", ashLift: "#1c1a18",
  parchment: "#e4e0dc", mutedSilt: "#8e8a84", subtleDust: "#545250",
  amberBronze: "#b07848", amberBright: "#cc9464", emberGlow: "#7a5230",
  amberHaze: "rgba(176,120,72,0.12)", soldOutOxide: "#5a5854",
  bg: "#0c0a08", bgSoft: "#141210", bgElevated: "#1c1a18",
  text: "#e4e0dc", textMuted: "#8e8a84", textSubtle: "#545250",
  accent: "#b07848", accentStrong: "#cc9464", accentGlow: "#7a5230",
  accentSubtle: "rgba(176,120,72,0.12)", soldOut: "#5a5854",
  glassFill: "rgba(20,18,16,0.84)", glassBorder: "rgba(228,224,220,0.1)",
  glassHighlight: "rgba(244,240,236,0.06)", glassTintWarm: "rgba(176,120,72,0.16)",
  glassTintCool: "rgba(122,82,48,0.1)", shaderWarm: "#c08858",
  shaderMid: "#8a5838", shaderDeep: "#060504", glassShadow: "rgba(0,0,0,0.18)",
};

export const MONSOON: ThemePalette = {
  charcoalInk: "#0c0e12", warmShadow: "#12151a", ashLift: "#1a1d24",
  parchment: "#d4d6da", mutedSilt: "#828690", subtleDust: "#4e5258",
  amberBronze: "#6a7a90", amberBright: "#8a9aae", emberGlow: "#3e4e62",
  amberHaze: "rgba(106,122,144,0.12)", soldOutOxide: "#4e5258",
  bg: "#0c0e12", bgSoft: "#12151a", bgElevated: "#1a1d24",
  text: "#d4d6da", textMuted: "#828690", textSubtle: "#4e5258",
  accent: "#6a7a90", accentStrong: "#8a9aae", accentGlow: "#3e4e62",
  accentSubtle: "rgba(106,122,144,0.12)", soldOut: "#4e5258",
  glassFill: "rgba(18,21,26,0.84)", glassBorder: "rgba(212,214,218,0.1)",
  glassHighlight: "rgba(228,230,234,0.06)", glassTintWarm: "rgba(106,122,144,0.14)",
  glassTintCool: "rgba(62,78,98,0.1)", shaderWarm: "#7a8aa0",
  shaderMid: "#4a5a70", shaderDeep: "#040608", glassShadow: "rgba(0,0,0,0.18)",
};

export const KHAKI: ThemePalette = {
  charcoalInk: "#0e0c08", warmShadow: "#161410", ashLift: "#1e1c18",
  parchment: "#e4ddd2", mutedSilt: "#9e968a", subtleDust: "#66604e",
  amberBronze: "#a8965a", amberBright: "#c4b274", emberGlow: "#7a6a38",
  amberHaze: "rgba(168,150,90,0.12)", soldOutOxide: "#605c50",
  bg: "#0e0c08", bgSoft: "#161410", bgElevated: "#1e1c18",
  text: "#e4ddd2", textMuted: "#9e968a", textSubtle: "#66604e",
  accent: "#a8965a", accentStrong: "#c4b274", accentGlow: "#7a6a38",
  accentSubtle: "rgba(168,150,90,0.12)", soldOut: "#605c50",
  glassFill: "rgba(22,20,16,0.84)", glassBorder: "rgba(228,221,210,0.1)",
  glassHighlight: "rgba(244,238,228,0.06)", glassTintWarm: "rgba(168,150,90,0.16)",
  glassTintCool: "rgba(122,106,56,0.1)", shaderWarm: "#b8a66a",
  shaderMid: "#8a7a48", shaderDeep: "#060504", glassShadow: "rgba(0,0,0,0.18)",
};

export const IRON: ThemePalette = {
  charcoalInk: "#0a0c10", warmShadow: "#10141a", ashLift: "#181c24",
  parchment: "#d8d4d0", mutedSilt: "#8a8884", subtleDust: "#52524e",
  amberBronze: "#c46030", amberBright: "#e07a48", emberGlow: "#8a4018",
  amberHaze: "rgba(196,96,48,0.12)", soldOutOxide: "#52524e",
  bg: "#0a0c10", bgSoft: "#10141a", bgElevated: "#181c24",
  text: "#d8d4d0", textMuted: "#8a8884", textSubtle: "#52524e",
  accent: "#c46030", accentStrong: "#e07a48", accentGlow: "#8a4018",
  accentSubtle: "rgba(196,96,48,0.12)", soldOut: "#52524e",
  glassFill: "rgba(16,20,26,0.84)", glassBorder: "rgba(216,212,208,0.1)",
  glassHighlight: "rgba(232,228,224,0.06)", glassTintWarm: "rgba(196,96,48,0.14)",
  glassTintCool: "rgba(138,64,24,0.1)", shaderWarm: "#d47040",
  shaderMid: "#944828", shaderDeep: "#040608", glassShadow: "rgba(0,0,0,0.2)",
};

export const THEME_PALETTES: Record<string, ThemePalette> = {
  ember: EMBER_CURRENT,
  graphite: GRAPHITE,
  tobacco: TOBACCO,
  indigo: INDIGO,
  olive: OLIVE,
  oxblood: OXBLOOD,
  chalk: CHALK,
  soot: SOOT,
  monsoon: MONSOON,
  khaki: KHAKI,
  iron: IRON,
};
```

> **IMPORTANT about Chalk:** This is a light-mode palette. `bg` is `#eae4dc` (light cream). When this palette is active, `color-scheme` must switch to `light`. The `glassFill` is translucent cream, not translucent charcoal. The `shaderDeep` is light (`#f0ece6`) because it represents the deepest layer of a light background, not a dark one.

---

### 4. Rewrite `app/theme-lab/page.tsx`

This is the full replacement. The page should:

**Remove entirely:**
- All `BACKGROUND_REGISTRY` imports and usage
- The `BackgroundSwatch` component
- The `activeBg` state
- The `BACKGROUND_OPTIONS` constant
- Any reference to background switching

**Keep and update:**
- Theme switching with 11 themes (ember + 10 new)
- `AuroraWavesBackground` as the fixed background for all previews
- The `PreviewBody` component with sample UI elements
- The `applyPaletteToElement` function
- `AnimatePresence` crossfade on theme switch

**New `THEME_OPTIONS` array:**
```ts
const THEME_OPTIONS: Array<{ key: string; label: string; ref: string; palette: ThemePalette }> = [
  { key: "ember", label: "Ember", ref: "Current production", palette: EMBER_CURRENT },
  { key: "graphite", label: "Graphite", ref: "Steel & concrete", palette: GRAPHITE },
  { key: "tobacco", label: "Tobacco", ref: "Aged leather", palette: TOBACCO },
  { key: "indigo", label: "Indigo", ref: "Raw denim", palette: INDIGO },
  { key: "olive", label: "Olive", ref: "Military surplus", palette: OLIVE },
  { key: "oxblood", label: "Oxblood", ref: "Polished leather", palette: OXBLOOD },
  { key: "chalk", label: "Chalk", ref: "Gallery walls", palette: CHALK },
  { key: "soot", label: "Soot", ref: "Copper & ash", palette: SOOT },
  { key: "monsoon", label: "Monsoon", ref: "Wet concrete", palette: MONSOON },
  { key: "khaki", label: "Khaki", ref: "Desert utility", palette: KHAKI },
  { key: "iron", label: "Iron", ref: "Rust patina", palette: IRON },
];
```

**ThemeSwatch update:** Show the `ref` text as a subtitle below the label in `t-ui` style. This gives each palette a material reference so the owner knows the intention.

**Preview background:** Instead of looking up `BACKGROUND_REGISTRY`, directly import and render `AuroraWavesBackground`:
```tsx
import AuroraWavesBackground from "@/components/background/AuroraWavesBackground";
```
In `PreviewBody`, render:
```tsx
<div className="pointer-events-none absolute inset-0">
  <AuroraWavesBackground palette={palette} />
</div>
```

**Sidebar layout:** Since there are now 11 themes, make the sidebar scrollable on desktop:
- Add `overflow-y-auto` to the sidebar inner container
- On mobile, use horizontal scroll (already working)

**Current Selection text:** Change to just show `"Theme: {name}"` (no background info).

**The control panel must use ember palette styling** regardless of what's selected in the preview. Apply ember's colors directly to the sidebar's `style` prop so it stays readable.

---

## Design Constraints

- All existing CSS classes (`.glass-panel`, `.btn-primary`, `.ghost-button`, `.t-hero`, `.t-label`, `.t-price`, `.editorial-copy`, `.noise-surface`) must be used in preview — do not invent new styles
- The Aurora Waves background must use the **active preview palette**, not hardcoded ember
- The Chalk light palette must correctly flip `color-scheme` to `light` and adjust `--noise-header-opacity` / `--noise-surface-opacity` to `0.035`
- The sidebar control panel always stays on ember palette — it must not change when switching preview themes
- Sample product cards should display ₹ prices (Indian Rupees)
- Buttons in preview need explicit sizing: `.btn-primary` gets `rounded-full px-5 py-3`, `.ghost-button` gets `rounded-full px-5 py-3`

## Acceptance Criteria

- [ ] Site loads normally with Aurora Waves background visible (replacing the old Loom background)
- [ ] `/theme-lab` loads without errors
- [ ] All 11 themes (ember + 10 new) appear in the sidebar and can be selected
- [ ] Switching theme updates: background ribbon colors, glass panels, text colors, accent colors, button colors
- [ ] Chalk (light theme) correctly inverts — light background, dark text, cream glass, `color-scheme: light`
- [ ] No background selector exists in theme-lab
- [ ] Old background files are deleted — only `AuroraWavesBackground.tsx` and `ThemeBackdrop.tsx` remain in `components/background/`
- [ ] No console errors, no broken imports, no hydration mismatches
- [ ] Control panel sidebar stays readable (ember palette) regardless of preview theme
- [ ] `prefers-reduced-motion` respected — Aurora ribbons freeze to static midpoint
- [ ] No changes to `AppProviders.tsx` beyond what's needed (if any import path changed)
- [ ] The `THEME_PALETTES` map in `theme-lab.ts` has exactly 11 entries

## Notes

- `AuroraWavesBackground.tsx` already exists and is production-ready. Do NOT modify it.
- `ThemeBackdrop.tsx` content is provided above — copy it exactly.
- The palette hex values are final — copy them exactly, do not round or modify.
- Each palette's `ref` field in `THEME_OPTIONS` is a 2-word material reference (e.g., "Aged leather"). Display it in the UI so the owner knows what each palette is inspired by.
- The old `codex_prompt.md` (Prompt 4) can be ignored — this prompt supersedes it.
