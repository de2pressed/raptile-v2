# Raptile Studio — Prompt 4: Theme & Background Lab

Date: 2026-04-30

## Context

You are working on the Raptile Studio codebase — a Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 3 + Framer Motion + Zustand headless Shopify storefront.

### Key architecture facts

- Root layout: `app/layout.tsx` wraps everything in `<AppProviders>` → `<PageTransition>`.
- Shell: `components/providers/AppProviders.tsx` renders `<ThemeBackdrop>` (the current background) → `<Nav>` → `<main>` → `<Footer>`.
- Current background: `components/background/ThemeBackdrop.tsx` renders `<LoomRegister palette={EMBER_CURRENT}>` from `components/background/QuietPlaneBackground.tsx`.
- Theme system: `lib/theme-lab.ts` exports `ThemePalette` interface and `EMBER_CURRENT` palette (hex + rgba strings). Utility functions: `parseColor`, `mixColor`, `withAlpha`.
- CSS variables: Defined in `:root` in `app/globals.css` (lines 45–101). Semantic aliases: `--bg`, `--bg-soft`, `--bg-elevated`, `--text`, `--text-muted`, `--text-subtle`, `--accent`, `--accent-strong`, `--accent-glow`, `--accent-subtle`, `--sold-out`, plus glass/shader tokens.
- Tailwind: `tailwind.config.ts` maps CSS variables to Tailwind color names (`bg`, `bg-soft`, `bg-elevated`, `text`, `text-muted`, `accent`, etc.).
- Zustand store: `lib/store.ts` — `useRaptileStore`.
- Fonts: Cabinet Grotesk (display), JetBrains Mono (mono). Already loaded via `@font-face` in `globals.css`.
- Framer Motion: Used everywhere. `useReducedMotion()` is respected in background components.
- Noise texture: `/public/noise.png` (220×220 repeat tile), applied via `.noise-surface::after` and `.glass-panel::after`.

### What this prompt builds

A standalone **Theme & Background Lab** page at `/theme-lab` that lets the owner preview all 5 color themes × 5 dynamic backgrounds simultaneously. This page is a **development tool only** — it will be removed later. It does NOT need Shopify data, commerce logic, or any API calls.

---

## Objective

Build a `/theme-lab` page with a control panel and a live preview area. The owner can select any combination of 5 color themes and 5 background types and see the result rendered in real time with sample UI components (nav mock, hero text, product card mock, button pair, glass panel).

---

## Tasks

### 1. Add 5 theme palettes to `lib/theme-lab.ts`

Keep `ThemePalette` interface and `EMBER_CURRENT` unchanged. Add 5 new exported palette constants below `EMBER_CURRENT`. Each must satisfy the `ThemePalette` interface exactly.

#### Theme A — `MIDNIGHT_SILVER`

```
charcoalInk: "#080c18"      warmShadow: "#0e1328"       ashLift: "#151c34"
parchment: "#d4d4dc"         mutedSilt: "#8e90a2"        subtleDust: "#585a6e"
amberBronze: "#5a9ab8"       amberBright: "#90c4dc"      emberGlow: "#2a5a72"
amberHaze: "rgba(90,154,184,0.12)"
soldOutOxide: "#4a4e62"
bg: "#080c18"                bgSoft: "#0e1328"           bgElevated: "#151c34"
text: "#d4d4dc"              textMuted: "#8e90a2"        textSubtle: "#585a6e"
accent: "#5a9ab8"            accentStrong: "#90c4dc"     accentGlow: "#2a5a72"
accentSubtle: "rgba(90,154,184,0.12)"
soldOut: "#4a4e62"
glassFill: "rgba(14,19,40,0.84)"
glassBorder: "rgba(212,212,220,0.1)"
glassHighlight: "rgba(230,230,240,0.06)"
glassTintWarm: "rgba(90,154,184,0.16)"
glassTintCool: "rgba(42,90,114,0.1)"
shaderWarm: "#6aaecc"        shaderMid: "#3a6a86"        shaderDeep: "#04060c"
glassShadow: "rgba(0,0,0,0.18)"
```

#### Theme B — `BONE_INK`

```
charcoalInk: "#f2ece4"       warmShadow: "#ebe4da"       ashLift: "#e2dace"
parchment: "#141210"         mutedSilt: "#5c554c"        subtleDust: "#9a928a"
amberBronze: "#b86a42"       amberBright: "#d48a5e"      emberGlow: "#8a4428"
amberHaze: "rgba(184,106,66,0.12)"
soldOutOxide: "#8a827a"
bg: "#f2ece4"                bgSoft: "#ebe4da"           bgElevated: "#e2dace"
text: "#141210"              textMuted: "#5c554c"        textSubtle: "#9a928a"
accent: "#b86a42"            accentStrong: "#d48a5e"     accentGlow: "#8a4428"
accentSubtle: "rgba(184,106,66,0.12)"
soldOut: "#8a827a"
glassFill: "rgba(235,228,218,0.84)"
glassBorder: "rgba(20,18,16,0.1)"
glassHighlight: "rgba(20,18,16,0.04)"
glassTintWarm: "rgba(184,106,66,0.12)"
glassTintCool: "rgba(138,68,40,0.08)"
shaderWarm: "#c87a52"        shaderMid: "#9a5634"        shaderDeep: "#f8f4ee"
glassShadow: "rgba(0,0,0,0.08)"
```

> **IMPORTANT for Bone & Ink:** This is a light theme. The `color-scheme` CSS variable must switch to `light` when this theme is active. The glass panels, noise overlay, and scrollbar must still look correct on a light base. Test that `glassFill` is the light equivalent (translucent cream, not dark).

#### Theme C — `STORM_SLATE`

```
charcoalInk: "#0e1118"       warmShadow: "#141922"       ashLift: "#1a2030"
parchment: "#dcd4c8"         mutedSilt: "#8a8278"        subtleDust: "#52524e"
amberBronze: "#38bfa7"       amberBright: "#5edbc4"      emberGlow: "#1a7a68"
amberHaze: "rgba(56,191,167,0.12)"
soldOutOxide: "#4a4c52"
bg: "#0e1118"                bgSoft: "#141922"           bgElevated: "#1a2030"
text: "#dcd4c8"              textMuted: "#8a8278"        textSubtle: "#52524e"
accent: "#38bfa7"            accentStrong: "#5edbc4"     accentGlow: "#1a7a68"
accentSubtle: "rgba(56,191,167,0.12)"
soldOut: "#4a4c52"
glassFill: "rgba(20,25,34,0.84)"
glassBorder: "rgba(220,212,200,0.1)"
glassHighlight: "rgba(240,235,228,0.06)"
glassTintWarm: "rgba(56,191,167,0.14)"
glassTintCool: "rgba(26,122,104,0.1)"
shaderWarm: "#4ad0b8"        shaderMid: "#268a78"        shaderDeep: "#060810"
glassShadow: "rgba(0,0,0,0.18)"
```

#### Theme D — `DESERT_DUSK`

```
charcoalInk: "#120e08"       warmShadow: "#1a1410"       ashLift: "#221a14"
parchment: "#f0e4d2"         mutedSilt: "#a89880"        subtleDust: "#6e6252"
amberBronze: "#c46a30"       amberBright: "#e89050"      emberGlow: "#8a4418"
amberHaze: "rgba(196,106,48,0.12)"
soldOutOxide: "#6a5c4e"
bg: "#120e08"                bgSoft: "#1a1410"           bgElevated: "#221a14"
text: "#f0e4d2"              textMuted: "#a89880"        textSubtle: "#6e6252"
accent: "#c46a30"            accentStrong: "#e89050"     accentGlow: "#8a4418"
accentSubtle: "rgba(196,106,48,0.12)"
soldOut: "#6a5c4e"
glassFill: "rgba(26,20,16,0.84)"
glassBorder: "rgba(240,228,210,0.1)"
glassHighlight: "rgba(255,245,232,0.06)"
glassTintWarm: "rgba(196,106,48,0.16)"
glassTintCool: "rgba(138,68,24,0.1)"
shaderWarm: "#d48040"        shaderMid: "#944e22"        shaderDeep: "#080604"
glassShadow: "rgba(0,0,0,0.18)"
```

#### Theme E — `CARBON_FLAME`

```
charcoalInk: "#0a0a0a"       warmShadow: "#141414"       ashLift: "#1c1c1c"
parchment: "#f0ece6"         mutedSilt: "#8a8882"        subtleDust: "#4e4e4a"
amberBronze: "#d44030"       amberBright: "#f06050"      emberGlow: "#8a2218"
amberHaze: "rgba(212,64,48,0.12)"
soldOutOxide: "#5a5a56"
bg: "#0a0a0a"                bgSoft: "#141414"           bgElevated: "#1c1c1c"
text: "#f0ece6"              textMuted: "#8a8882"        textSubtle: "#4e4e4a"
accent: "#d44030"            accentStrong: "#f06050"     accentGlow: "#8a2218"
accentSubtle: "rgba(212,64,48,0.12)"
soldOut: "#5a5a56"
glassFill: "rgba(20,20,20,0.84)"
glassBorder: "rgba(240,236,230,0.1)"
glassHighlight: "rgba(255,252,248,0.06)"
glassTintWarm: "rgba(212,64,48,0.14)"
glassTintCool: "rgba(138,34,24,0.1)"
shaderWarm: "#e05040"        shaderMid: "#9a3020"        shaderDeep: "#040404"
glassShadow: "rgba(0,0,0,0.2)"
```

Also export a lookup map:

```ts
export const THEME_PALETTES: Record<string, ThemePalette> = {
  ember: EMBER_CURRENT,
  midnight: MIDNIGHT_SILVER,
  bone: BONE_INK,
  storm: STORM_SLATE,
  desert: DESERT_DUSK,
  carbon: CARBON_FLAME,
};
```

---

### 2. Create 5 background components in `components/background/`

Each background component must:
- Accept `{ palette: ThemePalette }` as its only prop
- Use `useReducedMotion()` from Framer Motion and freeze to a static fallback when reduced motion is preferred
- Be a `"use client"` component
- Use `aria-hidden="true"` on the outer wrapper
- Render as `className="absolute inset-0 overflow-hidden"` (same pattern as `QuietPlaneBackground.tsx`)
- Import `mixColor` and `withAlpha` from `@/lib/theme-lab`

#### 2a. `components/background/FluidMeshBackground.tsx`

**Canvas 2D approach.** Render a `<canvas>` element that fills the container. On mount, start an animation loop that draws 4 large circles (radius ~30% of viewport diagonal) at low opacity. Each circle uses a different palette color (`accent`, `accentStrong`, `shaderWarm`, `shaderMid`). Circles drift slowly on Lissajous curves (sine/cosine with different frequencies, 15–30 second periods). Apply a large Gaussian blur via `ctx.filter = 'blur(80px)'`. On each frame, clear and redraw. Mobile: reduce to 3 circles, halve canvas resolution with CSS `width/height: 100%` but `canvas.width/height` at 50% of clientWidth/clientHeight. Reduced motion: draw once and stop the loop.

#### 2b. `components/background/WovenParticleBackground.tsx`

**Canvas 2D particle system.** Create 800 particles (400 on mobile, detected via `window.innerWidth < 768`). Each particle is a 1.5px dot. Particles are arranged in a loose grid with random jitter, then animated with a sine wave displacement: `y += Math.sin(x * 0.003 + time * 0.0005) * 18`. Use 3 color layers from the palette (`accent`, `shaderWarm`, `textSubtle`) with varying opacity (0.15–0.4). The wave creates a fabric/weave illusion. Speed: complete wave cycle in ~20 seconds. Reduced motion: render the static dot grid without the sine displacement.

#### 2c. `components/background/GrainDriftBackground.tsx`

**CSS-only approach.** No canvas needed. Render a `<div>` with `backgroundImage: url('/noise.png')`, `backgroundSize: '220px 220px'`, and `backgroundRepeat: 'repeat'`. Animate with a CSS keyframe that slowly translates the background position (`0,0` → `220px,220px` over 10 seconds, linear, infinite) and pulses opacity between 0.03 and 0.06. Use Framer Motion's `motion.div` with `animate={{ opacity: [0.03, 0.06, 0.03] }}` on an 8-second easeInOut infinite loop. Apply `mix-blend-mode: soft-light`. This is the lightest background — essentially an enhanced version of the existing noise overlay but made dynamic. Reduced motion: static noise at 0.04 opacity.

#### 2d. `components/background/AuroraWavesBackground.tsx`

**SVG + Framer Motion approach.** Render 4 broad SVG `<path>` elements representing flowing ribbon curves. Each ribbon uses a different palette color at low opacity (0.06–0.12). Apply `filter: blur(40px)` to each path. Use Framer Motion to animate the SVG path `d` attribute between 2 keyframes (gentle wave shape A → wave shape B), with `duration: 30–45s`, `repeat: Infinity`, `ease: "easeInOut"`. Paths should span the full viewport width and be spaced vertically. Ribbons should overlap slightly. Reduced motion: show static paths at their midpoint shape.

Define the path keyframes as string constants. Example starting path: `M -100 300 C 200 250, 400 350, 600 280 S 1000 320, 1200 290`. Example ending path: `M -100 320 C 200 370, 400 260, 600 330 S 1000 270, 1200 310`. Create 4 such pairs at different vertical positions.

#### 2e. `components/background/LiquidChromaticBackground.tsx`

**CSS + Framer Motion approach.** Render 4 absolutely positioned `<motion.div>` circles, each ~40vmax in diameter, heavily blurred (`filter: blur(100px)`), positioned at different starting points. Colors: `palette.accent` at 0.08, `palette.accentStrong` at 0.06, `palette.shaderWarm` at 0.1, `palette.shaderMid` at 0.08. Animate x/y position with Framer Motion on 30–45 second cycles with different durations per circle so they don't sync. Movement range: ±15% of viewport. Apply `mix-blend-mode: screen` for dark themes, `mix-blend-mode: multiply` for the Bone & Ink light theme (detect via `palette.bg` luminance — if the bg hex starts with a value > `#80`, use multiply). Reduced motion: static blurred circles at their starting positions.

---

### 3. Create the background registry

Create `components/background/backgrounds.ts`:

```ts
export { default as FluidMeshBackground } from "./FluidMeshBackground";
export { default as WovenParticleBackground } from "./WovenParticleBackground";
export { default as GrainDriftBackground } from "./GrainDriftBackground";
export { default as AuroraWavesBackground } from "./AuroraWavesBackground";
export { default as LiquidChromaticBackground } from "./LiquidChromaticBackground";
// Keep existing:
export { default as LoomRegister } from "./QuietPlaneBackground";

import type { ComponentType } from "react";
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
```

---

### 4. Create the Theme Lab page

Create `app/theme-lab/page.tsx` as a Client Component (`"use client"`).

#### State

Use React `useState` for:
- `activeTheme: string` — key from `THEME_PALETTES` (default: `"ember"`)
- `activeBg: string` — key from `BACKGROUND_REGISTRY` (default: `"loom"`)

#### Layout

Split the page into two regions:

**Left: Control Panel (fixed sidebar on desktop, sticky top bar on mobile)**

A glass-panel-styled sidebar (280px wide on desktop, full-width collapsed on mobile) containing:

1. **Theme Selector** — 6 buttons (ember + 5 new), each showing:
   - A 24×24 circle filled with the palette's `accent` color
   - A 24×24 circle filled with the palette's `bg` color
   - The theme name in `t-label` style
   - Active state: border ring in the palette's accent color

2. **Background Selector** — 6 buttons (loom + 5 new), each showing:
   - The background name in `t-label` style
   - Active state: same accent ring treatment

3. **Current Selection** — Small text showing `"Theme: {name} × Background: {name}"`

**Right: Live Preview Area (fills remaining space)**

A full-height container that renders:

1. **The selected background component** — Rendered behind everything, positioned absolutely, using the selected palette
2. **Sample UI elements** layered on top (relative, z-10):
   - A mock nav bar using the current `site-header` glass styling with "RAPTILE STUDIO" wordmark and dummy links ("Collection", "About", "Cart")
   - A hero section with `.t-hero` text: "Polished to the brim." and `.editorial-copy` text: "240gsm. Double bio washed. Built for heat, motion, and repeat wear."
   - A row of 3 mock product cards using `.glass-panel` styling, each with a solid-color rectangle (using `bgElevated`) as image placeholder, a product name in `.t-product`, and a price in `.t-price`
   - A button pair: one `.btn-primary` ("Shop Collection") and one `.ghost-button` ("Read the Story")
   - A small `.glass-panel` with sample body text in `.editorial-copy` to test readability

All sample UI must use the **currently active palette** for its colors. This means you need to apply CSS custom properties dynamically.

#### Dynamic theming

When the user switches themes, update CSS custom properties on the preview container element using inline `style` or a `useEffect` that sets properties on a wrapper div. Map each `ThemePalette` field to its corresponding CSS variable:

```ts
function applyPaletteToElement(el: HTMLElement, palette: ThemePalette) {
  el.style.setProperty("--bg", palette.bg);
  el.style.setProperty("--bg-soft", palette.bgSoft);
  el.style.setProperty("--bg-elevated", palette.bgElevated);
  el.style.setProperty("--text", palette.text);
  el.style.setProperty("--text-muted", palette.textMuted);
  el.style.setProperty("--text-subtle", palette.textSubtle);
  el.style.setProperty("--accent", palette.accent);
  el.style.setProperty("--accent-strong", palette.accentStrong);
  el.style.setProperty("--accent-glow", palette.accentGlow);
  el.style.setProperty("--accent-subtle", palette.accentSubtle);
  el.style.setProperty("--sold-out", palette.soldOut);
  el.style.setProperty("--glass-fill", palette.glassFill);
  el.style.setProperty("--glass-border", palette.glassBorder);
  el.style.setProperty("--glass-highlight", palette.glassHighlight);
  el.style.setProperty("--glass-tint-a", palette.glassTintWarm);
  el.style.setProperty("--glass-tint-b", palette.glassTintCool);
  el.style.setProperty("--shader-warm", palette.shaderWarm);
  el.style.setProperty("--shader-mid", palette.shaderMid);
  el.style.setProperty("--shader-deep", palette.shaderDeep);
  el.style.setProperty("--glass-shadow", palette.glassShadow);
  // For Bone & Ink light theme:
  el.style.setProperty("color-scheme", isLightPalette(palette) ? "light" : "dark");
}

function isLightPalette(palette: ThemePalette): boolean {
  // Simple heuristic: if bg hex has high RGB values, it's light
  const hex = palette.bg.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  return r > 128;
}
```

Apply this via a `ref` on the preview wrapper `<div>` + a `useEffect` that runs when `activeTheme` changes.

#### Transition

When switching theme or background, use Framer Motion `<AnimatePresence>` with a quick 300ms crossfade (`opacity: 0 → 1`) so the change doesn't flash.

---

### 5. Wire into the app router

Create `app/theme-lab/page.tsx` as described above. This page should bypass the normal `<AppProviders>` shell — it does NOT render `<Nav>`, `<Footer>`, `<ThemeBackdrop>`, or any Shopify providers. Instead, render it standalone with just the lab UI.

To bypass the shell, create `app/theme-lab/layout.tsx`:

```tsx
export default function ThemeLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

And update `app/layout.tsx` to conditionally render. Actually, since Next.js App Router nests layouts, the simplest approach is:

In `app/theme-lab/layout.tsx`, provide a minimal wrapper that imports `globals.css` styles but does NOT use `AppProviders`:

```tsx
import "../globals.css";

export const metadata = { title: "Theme Lab | Raptile Studio" };

export default function ThemeLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

> **Wait** — the root `app/layout.tsx` already wraps with `<html>` and `<body>` and `<AppProviders>`. To avoid the shell for theme-lab, the cleanest approach given Next.js App Router rules is to **keep the root layout as-is** and instead make the Theme Lab page render its own isolated preview inside a full-viewport `<div>` that overlays the shell with `fixed inset-0 z-[200]`. The control panel and preview both live inside this overlay. This way, you don't need to modify the root layout at all.

So: `app/theme-lab/page.tsx` is a Client Component that renders a `<div className="fixed inset-0 z-[200] bg-black">` containing the entire lab UI. This effectively covers the normal shell.

---

## Design Constraints

- Use existing CSS classes (`.glass-panel`, `.btn-primary`, `.ghost-button`, `.t-hero`, `.t-display`, `.t-product`, `.t-label`, `.t-price`, `.t-ui`, `.editorial-copy`, `.noise-surface`) in the sample UI. Do NOT invent new utility classes for the preview.
- The control panel itself should use the **ember** (current) palette styling regardless of what's selected in the preview, so controls remain readable.
- Keep all new background components under 300 lines each. If a component gets complex, keep the animation logic in a separate hook file.
- All canvas-based backgrounds must handle resize (`ResizeObserver` or `window resize` listener) and clean up on unmount.
- Performance: requestAnimationFrame for canvas loops. Cancel the rAF handle on unmount.
- All 5 new backgrounds + the existing Loom should be selectable in the lab. The lab shows 6 themes total (ember + 5 new) and 6 backgrounds total (loom + 5 new).

## Acceptance Criteria

- [ ] `/theme-lab` loads without crashing and without requiring Shopify env vars
- [ ] All 6 themes render correctly when selected — CSS variables update, text colors change, accent colors change, glass panels adapt
- [ ] Bone & Ink (light theme) correctly inverts — light background, dark text, glass panels are translucent cream not translucent charcoal
- [ ] All 6 backgrounds render and animate when selected
- [ ] Backgrounds use the active palette's colors (not hardcoded)
- [ ] Switching theme updates both the sample UI AND the active background's colors
- [ ] Switching background swaps the background component with a crossfade
- [ ] `prefers-reduced-motion` is respected — all backgrounds freeze to static
- [ ] No console errors or React hydration mismatches
- [ ] Canvas backgrounds handle window resize without breaking
- [ ] Canvas backgrounds clean up (cancelAnimationFrame, observer disconnect) on unmount
- [ ] Mobile: control panel is usable (horizontal scroll or collapsible) and preview fills the screen below
- [ ] The control panel remains readable regardless of which theme is previewed (it stays on ember palette)
- [ ] No changes to any existing component files except `lib/theme-lab.ts` (which gets new palette constants added)

## Notes

- This is a dev tool. It doesn't need SEO, analytics, or production polish. Focus on making it work reliably so the owner can evaluate theme/background combinations.
- The existing `LoomRegister` background already accepts `ThemePalette` and uses `mixColor`/`withAlpha` — follow that pattern exactly for new backgrounds.
- Use `default export` for all background components (matching `QuietPlaneBackground.tsx` convention).
- The `BACKGROUND_REGISTRY` object makes it easy to add/remove backgrounds later.
- Do NOT modify `DESIGN.md`, `DESIGN.json`, `PRODUCT.md`, or `globals.css` `:root` variables. The theme lab overrides variables locally on the preview container, not globally.
