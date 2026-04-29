export type ThemeBackgroundId =
  | "oxidised-relief"
  | "liquid-drift"
  | "quiet-plane"
  | "monsoon-veil"
  | "signal-field";

export type ThemePaletteId = "bronze-night" | "monsoon-slate" | "ash-dune" | "silt-ember" | "graphite-moss";

export type ThemeScheme = "dark" | "light";

export interface ThemeBackground {
  id: ThemeBackgroundId;
  label: string;
  note: string;
}

export interface ThemePalette {
  id: ThemePaletteId;
  label: string;
  note: string;
  scheme: ThemeScheme;
  charcoalInk: string;
  warmShadow: string;
  ashLift: string;
  parchment: string;
  mutedSilt: string;
  subtleDust: string;
  amberBronze: string;
  amberBright: string;
  emberGlow: string;
  amberHaze: string;
  soldOutOxide: string;
  bg: string;
  bgSoft: string;
  bgElevated: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentStrong: string;
  accentGlow: string;
  accentSubtle: string;
  soldOut: string;
  glassFill: string;
  glassBorder: string;
  glassHighlight: string;
  glassTintWarm: string;
  glassTintCool: string;
  shaderWarm: string;
  shaderMid: string;
  shaderDeep: string;
  glassShadow: string;
}

export const DEFAULT_THEME_SELECTION = {
  background: "oxidised-relief" as const,
  palette: "bronze-night" as const,
};

export const THEME_BACKGROUNDS: readonly ThemeBackground[] = [
  {
    id: "oxidised-relief",
    label: "Oxidised Relief",
    note: "Contour heat, tactile and mineral.",
  },
  {
    id: "liquid-drift",
    label: "Liquid Drift",
    note: "Slow fluid fields, humid and soft.",
  },
  {
    id: "quiet-plane",
    label: "Quiet Plane",
    note: "Flat plane, cleanest reading.",
  },
  {
    id: "monsoon-veil",
    label: "Monsoon Veil",
    note: "Layered haze, wetter and cinematic.",
  },
  {
    id: "signal-field",
    label: "Signal Field",
    note: "Beams, grid, and sharper direction.",
  },
] as const;

export const THEME_PALETTES: readonly ThemePalette[] = [
  {
    id: "bronze-night",
    label: "Bronze Night",
    note: "Closest to the current warm dark system.",
    scheme: "dark",
    charcoalInk: "#15110e",
    warmShadow: "#1b1512",
    ashLift: "#241c17",
    parchment: "#f4eadc",
    mutedSilt: "#c4b39a",
    subtleDust: "#8d7a66",
    amberBronze: "#cb9246",
    amberBright: "#f0c56a",
    emberGlow: "#b66a33",
    amberHaze: "rgba(203, 146, 70, 0.12)",
    soldOutOxide: "#70574c",
    bg: "#15110e",
    bgSoft: "#1b1512",
    bgElevated: "#251c17",
    text: "#f4eadc",
    textMuted: "#c6b69e",
    textSubtle: "#8d7a66",
    accent: "#cb9246",
    accentStrong: "#f0c56a",
    accentGlow: "#b66a33",
    accentSubtle: "rgba(203, 146, 70, 0.12)",
    soldOut: "#70574c",
    glassFill: "rgba(28, 22, 18, 0.84)",
    glassBorder: "rgba(244, 234, 220, 0.1)",
    glassHighlight: "rgba(255, 248, 242, 0.05)",
    glassTintWarm: "rgba(203, 146, 70, 0.16)",
    glassTintCool: "rgba(92, 111, 168, 0.1)",
    shaderWarm: "#cb9246",
    shaderMid: "#7f5c46",
    shaderDeep: "#120f0d",
    glassShadow: "rgba(0, 0, 0, 0.16)",
  },
  {
    id: "monsoon-slate",
    label: "Monsoon Slate",
    note: "Cooler dark with a blue cast.",
    scheme: "dark",
    charcoalInk: "#0e131c",
    warmShadow: "#121a28",
    ashLift: "#182232",
    parchment: "#eef3ff",
    mutedSilt: "#bac6dc",
    subtleDust: "#7e8ba7",
    amberBronze: "#5c76d8",
    amberBright: "#dce5ff",
    emberGlow: "#3248a8",
    amberHaze: "rgba(92, 118, 216, 0.12)",
    soldOutOxide: "#5d6477",
    bg: "#0e131c",
    bgSoft: "#141c2a",
    bgElevated: "#1a2334",
    text: "#eef3ff",
    textMuted: "#bac6dc",
    textSubtle: "#7e8ba7",
    accent: "#5c76d8",
    accentStrong: "#dce5ff",
    accentGlow: "#3248a8",
    accentSubtle: "rgba(92, 118, 216, 0.12)",
    soldOut: "#5d6477",
    glassFill: "rgba(19, 27, 41, 0.84)",
    glassBorder: "rgba(238, 243, 255, 0.1)",
    glassHighlight: "rgba(255, 255, 255, 0.05)",
    glassTintWarm: "rgba(92, 118, 216, 0.16)",
    glassTintCool: "rgba(118, 155, 228, 0.1)",
    shaderWarm: "#6f7dff",
    shaderMid: "#3a53b4",
    shaderDeep: "#0b1018",
    glassShadow: "rgba(0, 0, 0, 0.18)",
  },
  {
    id: "ash-dune",
    label: "Ash Dune",
    note: "Daylight-leaning control case.",
    scheme: "light",
    charcoalInk: "#1f1812",
    warmShadow: "#ece0cf",
    ashLift: "#ded0bb",
    parchment: "#fbf6ee",
    mutedSilt: "#635545",
    subtleDust: "#8a7964",
    amberBronze: "#a65c34",
    amberBright: "#dd8250",
    emberGlow: "#7d4025",
    amberHaze: "rgba(166, 92, 52, 0.12)",
    soldOutOxide: "#8f6f58",
    bg: "#f2e9db",
    bgSoft: "#e7d9c5",
    bgElevated: "#d8c5af",
    text: "#231c16",
    textMuted: "#635545",
    textSubtle: "#8a7964",
    accent: "#a65c34",
    accentStrong: "#dd8250",
    accentGlow: "#7d4025",
    accentSubtle: "rgba(166, 92, 52, 0.12)",
    soldOut: "#8f6f58",
    glassFill: "rgba(251, 247, 240, 0.78)",
    glassBorder: "rgba(36, 29, 22, 0.12)",
    glassHighlight: "rgba(255, 255, 255, 0.5)",
    glassTintWarm: "rgba(166, 92, 52, 0.16)",
    glassTintCool: "rgba(89, 104, 156, 0.08)",
    shaderWarm: "#d7a06c",
    shaderMid: "#a67c57",
    shaderDeep: "#5b4838",
    glassShadow: "rgba(61, 41, 26, 0.12)",
  },
  {
    id: "silt-ember",
    label: "Silt Ember",
    note: "Earthier and more tobacco warm.",
    scheme: "dark",
    charcoalInk: "#17110d",
    warmShadow: "#221711",
    ashLift: "#312017",
    parchment: "#f5e9db",
    mutedSilt: "#c9b299",
    subtleDust: "#957c64",
    amberBronze: "#c87141",
    amberBright: "#ee9a63",
    emberGlow: "#9d4822",
    amberHaze: "rgba(200, 113, 65, 0.12)",
    soldOutOxide: "#8f6f58",
    bg: "#17110d",
    bgSoft: "#201712",
    bgElevated: "#2b1f18",
    text: "#f5e9db",
    textMuted: "#c9b299",
    textSubtle: "#957c64",
    accent: "#c87141",
    accentStrong: "#ee9a63",
    accentGlow: "#9d4822",
    accentSubtle: "rgba(200, 113, 65, 0.12)",
    soldOut: "#8f6f58",
    glassFill: "rgba(31, 23, 18, 0.84)",
    glassBorder: "rgba(245, 233, 219, 0.1)",
    glassHighlight: "rgba(255, 248, 242, 0.05)",
    glassTintWarm: "rgba(200, 113, 65, 0.16)",
    glassTintCool: "rgba(100, 92, 158, 0.08)",
    shaderWarm: "#ce8c58",
    shaderMid: "#95563d",
    shaderDeep: "#140f0c",
    glassShadow: "rgba(0, 0, 0, 0.16)",
  },
  {
    id: "graphite-moss",
    label: "Graphite Moss",
    note: "Industrial, softer, and green-cast.",
    scheme: "dark",
    charcoalInk: "#111512",
    warmShadow: "#171c18",
    ashLift: "#202723",
    parchment: "#eef1e8",
    mutedSilt: "#b5c0b0",
    subtleDust: "#7b8876",
    amberBronze: "#8ca34c",
    amberBright: "#dde7af",
    emberGlow: "#5d7140",
    amberHaze: "rgba(140, 163, 76, 0.12)",
    soldOutOxide: "#738065",
    bg: "#111512",
    bgSoft: "#171c18",
    bgElevated: "#1f2621",
    text: "#eef1e8",
    textMuted: "#b5c0b0",
    textSubtle: "#7b8876",
    accent: "#8ca34c",
    accentStrong: "#dde7af",
    accentGlow: "#5d7140",
    accentSubtle: "rgba(140, 163, 76, 0.12)",
    soldOut: "#738065",
    glassFill: "rgba(19, 24, 20, 0.84)",
    glassBorder: "rgba(238, 241, 232, 0.1)",
    glassHighlight: "rgba(255, 255, 255, 0.05)",
    glassTintWarm: "rgba(140, 163, 76, 0.14)",
    glassTintCool: "rgba(89, 122, 99, 0.1)",
    shaderWarm: "#9cad61",
    shaderMid: "#61734c",
    shaderDeep: "#0e120f",
    glassShadow: "rgba(0, 0, 0, 0.18)",
  },
] as const;

export function isThemeBackgroundId(value: string): value is ThemeBackgroundId {
  return THEME_BACKGROUNDS.some((background) => background.id === value);
}

export function isThemePaletteId(value: string): value is ThemePaletteId {
  return THEME_PALETTES.some((palette) => palette.id === value);
}

export function getThemeBackground(id: ThemeBackgroundId) {
  return THEME_BACKGROUNDS.find((background) => background.id === id) ?? THEME_BACKGROUNDS[0];
}

export function getThemePalette(id: ThemePaletteId) {
  return THEME_PALETTES.find((palette) => palette.id === id) ?? THEME_PALETTES[0];
}

export function parseColor(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("rgba")) {
    const parts = trimmed
      .slice(trimmed.indexOf("(") + 1, trimmed.lastIndexOf(")"))
      .split(",")
      .map((part) => part.trim());

    return {
      r: Number.parseFloat(parts[0] ?? "0"),
      g: Number.parseFloat(parts[1] ?? "0"),
      b: Number.parseFloat(parts[2] ?? "0"),
      a: Number.parseFloat(parts[3] ?? "1"),
    };
  }

  if (trimmed.startsWith("rgb(")) {
    const parts = trimmed
      .slice(trimmed.indexOf("(") + 1, trimmed.lastIndexOf(")"))
      .split(",")
      .map((part) => part.trim());

    return {
      r: Number.parseFloat(parts[0] ?? "0"),
      g: Number.parseFloat(parts[1] ?? "0"),
      b: Number.parseFloat(parts[2] ?? "0"),
      a: 1,
    };
  }

  const hex = trimmed.replace("#", "");
  const expanded =
    hex.length === 3 || hex.length === 4
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;
  const hasAlpha = expanded.length >= 8;

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
    a: hasAlpha ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1,
  };
}

export function mixColor(left: string, right: string, amount: number) {
  const from = parseColor(left);
  const to = parseColor(right);
  const t = Math.min(1, Math.max(0, amount));

  const r = Math.round(from.r + (to.r - from.r) * t);
  const g = Math.round(from.g + (to.g - from.g) * t);
  const b = Math.round(from.b + (to.b - from.b) * t);
  const a = from.a + (to.a - from.a) * t;

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

export function withAlpha(color: string, alpha: number) {
  const parsed = parseColor(color);
  return `rgba(${Math.round(parsed.r)}, ${Math.round(parsed.g)}, ${Math.round(parsed.b)}, ${alpha.toFixed(3)})`;
}

export function applyThemePalette(target: HTMLElement, palette: ThemePalette) {
  const rootStyle = target.style;

  rootStyle.setProperty("--charcoal-ink", palette.charcoalInk);
  rootStyle.setProperty("--warm-shadow", palette.warmShadow);
  rootStyle.setProperty("--ash-lift", palette.ashLift);
  rootStyle.setProperty("--parchment", palette.parchment);
  rootStyle.setProperty("--muted-silt", palette.mutedSilt);
  rootStyle.setProperty("--subtle-dust", palette.subtleDust);
  rootStyle.setProperty("--amber-bronze", palette.amberBronze);
  rootStyle.setProperty("--amber-bright", palette.amberBright);
  rootStyle.setProperty("--ember-glow", palette.emberGlow);
  rootStyle.setProperty("--amber-haze", palette.amberHaze);
  rootStyle.setProperty("--sold-out-oxide", palette.soldOutOxide);

  rootStyle.setProperty("--bg", palette.bg);
  rootStyle.setProperty("--bg-soft", palette.bgSoft);
  rootStyle.setProperty("--bg-elevated", palette.bgElevated);
  rootStyle.setProperty("--text", palette.text);
  rootStyle.setProperty("--text-muted", palette.textMuted);
  rootStyle.setProperty("--text-subtle", palette.textSubtle);
  rootStyle.setProperty("--accent", palette.accent);
  rootStyle.setProperty("--accent-strong", palette.accentStrong);
  rootStyle.setProperty("--accent-glow", palette.accentGlow);
  rootStyle.setProperty("--accent-subtle", palette.accentSubtle);
  rootStyle.setProperty("--sold-out", palette.soldOut);
  rootStyle.setProperty("--glass-fill", palette.glassFill);
  rootStyle.setProperty("--glass-border", palette.glassBorder);
  rootStyle.setProperty("--glass-highlight", palette.glassHighlight);
  rootStyle.setProperty("--glass-tint-a", palette.glassTintWarm);
  rootStyle.setProperty("--glass-tint-b", palette.glassTintCool);
  rootStyle.setProperty("--shader-warm", palette.shaderWarm);
  rootStyle.setProperty("--shader-mid", palette.shaderMid);
  rootStyle.setProperty("--shader-deep", palette.shaderDeep);
  rootStyle.setProperty("--glass-shadow", palette.glassShadow);

  target.dataset.themePalette = palette.id;
  target.dataset.themeScheme = palette.scheme;
  target.style.colorScheme = palette.scheme;
}
