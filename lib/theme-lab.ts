export type ThemeBackgroundId =
  | "press-plate-bloom"
  | "loom-register"
  | "darkroom-sweep"
  | "fold-engine"
  | "weather-cell";

export type ThemePaletteId = "bronze-furnace" | "slate-current" | "clay-kiln" | "moss-oxide" | "parchment-signal";

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
  background: "press-plate-bloom" as const,
  palette: "bronze-furnace" as const,
};

export const THEME_BACKGROUNDS: readonly ThemeBackground[] = [
  {
    id: "press-plate-bloom",
    label: "Press Plate Bloom",
    note: "Rotating plate, registration marks.",
  },
  {
    id: "loom-register",
    label: "Loom Register",
    note: "Warp threads and tension drift.",
  },
  {
    id: "darkroom-sweep",
    label: "Darkroom Sweep",
    note: "Scan beam, dust, and exposure.",
  },
  {
    id: "fold-engine",
    label: "Fold Engine",
    note: "Hinged planes and seam pressure.",
  },
  {
    id: "weather-cell",
    label: "Weather Cell",
    note: "Pressure bands and moving cells.",
  },
] as const;

export const THEME_PALETTES: readonly ThemePalette[] = [
  {
    id: "bronze-furnace",
    label: "Bronze Furnace",
    note: "Warm charcoal with heated metal.",
    scheme: "dark",
    charcoalInk: "#120e0c",
    warmShadow: "#191411",
    ashLift: "#231b17",
    parchment: "#f3e7d7",
    mutedSilt: "#c6ae94",
    subtleDust: "#8a745f",
    amberBronze: "#c87f42",
    amberBright: "#efb86a",
    emberGlow: "#a34f26",
    amberHaze: "rgba(200, 127, 66, 0.12)",
    soldOutOxide: "#776053",
    bg: "#120e0c",
    bgSoft: "#191411",
    bgElevated: "#231b17",
    text: "#f3e7d7",
    textMuted: "#c6ae94",
    textSubtle: "#8a745f",
    accent: "#c87f42",
    accentStrong: "#efb86a",
    accentGlow: "#a34f26",
    accentSubtle: "rgba(200, 127, 66, 0.12)",
    soldOut: "#776053",
    glassFill: "rgba(25, 19, 15, 0.84)",
    glassBorder: "rgba(243, 231, 215, 0.1)",
    glassHighlight: "rgba(255, 247, 238, 0.06)",
    glassTintWarm: "rgba(200, 127, 66, 0.16)",
    glassTintCool: "rgba(96, 114, 158, 0.08)",
    shaderWarm: "#d29157",
    shaderMid: "#8f6046",
    shaderDeep: "#0f0b09",
    glassShadow: "rgba(0, 0, 0, 0.16)",
  },
  {
    id: "slate-current",
    label: "Slate Current",
    note: "Cool slate with electric depth.",
    scheme: "dark",
    charcoalInk: "#0b1118",
    warmShadow: "#111a27",
    ashLift: "#172232",
    parchment: "#eef3f6",
    mutedSilt: "#bac8d7",
    subtleDust: "#7e8ea4",
    amberBronze: "#5f7bd8",
    amberBright: "#d8e5ff",
    emberGlow: "#334ea8",
    amberHaze: "rgba(95, 123, 216, 0.12)",
    soldOutOxide: "#5d6878",
    bg: "#0b1118",
    bgSoft: "#111a27",
    bgElevated: "#172232",
    text: "#eef3f6",
    textMuted: "#bac8d7",
    textSubtle: "#7e8ea4",
    accent: "#5f7bd8",
    accentStrong: "#d8e5ff",
    accentGlow: "#334ea8",
    accentSubtle: "rgba(95, 123, 216, 0.12)",
    soldOut: "#5d6878",
    glassFill: "rgba(17, 25, 37, 0.84)",
    glassBorder: "rgba(238, 243, 246, 0.1)",
    glassHighlight: "rgba(255, 255, 255, 0.06)",
    glassTintWarm: "rgba(95, 123, 216, 0.16)",
    glassTintCool: "rgba(118, 155, 228, 0.1)",
    shaderWarm: "#6f7dff",
    shaderMid: "#3b53b5",
    shaderDeep: "#090e16",
    glassShadow: "rgba(0, 0, 0, 0.18)",
  },
  {
    id: "clay-kiln",
    label: "Clay Kiln",
    note: "Earth heat with kiln ember.",
    scheme: "dark",
    charcoalInk: "#140f0d",
    warmShadow: "#1c1512",
    ashLift: "#291b17",
    parchment: "#f5e7da",
    mutedSilt: "#cfb39c",
    subtleDust: "#927766",
    amberBronze: "#c86a42",
    amberBright: "#f1a06f",
    emberGlow: "#9b4326",
    amberHaze: "rgba(200, 106, 66, 0.12)",
    soldOutOxide: "#8f6f58",
    bg: "#140f0d",
    bgSoft: "#1c1512",
    bgElevated: "#291b17",
    text: "#f5e7da",
    textMuted: "#cfb39c",
    textSubtle: "#927766",
    accent: "#c86a42",
    accentStrong: "#f1a06f",
    accentGlow: "#9b4326",
    accentSubtle: "rgba(200, 106, 66, 0.12)",
    soldOut: "#8f6f58",
    glassFill: "rgba(28, 21, 18, 0.84)",
    glassBorder: "rgba(245, 231, 218, 0.1)",
    glassHighlight: "rgba(255, 248, 242, 0.06)",
    glassTintWarm: "rgba(200, 106, 66, 0.16)",
    glassTintCool: "rgba(100, 92, 158, 0.08)",
    shaderWarm: "#ce8c58",
    shaderMid: "#95563d",
    shaderDeep: "#130d0b",
    glassShadow: "rgba(0, 0, 0, 0.16)",
  },
  {
    id: "moss-oxide",
    label: "Moss Oxide",
    note: "Olive, graphite, and lichen.",
    scheme: "dark",
    charcoalInk: "#0f1310",
    warmShadow: "#171c18",
    ashLift: "#202724",
    parchment: "#edf0e8",
    mutedSilt: "#b7c2b0",
    subtleDust: "#7c8877",
    amberBronze: "#89a34f",
    amberBright: "#dee6b4",
    emberGlow: "#5f7141",
    amberHaze: "rgba(137, 163, 79, 0.12)",
    soldOutOxide: "#738065",
    bg: "#0f1310",
    bgSoft: "#171c18",
    bgElevated: "#202724",
    text: "#edf0e8",
    textMuted: "#b7c2b0",
    textSubtle: "#7c8877",
    accent: "#89a34f",
    accentStrong: "#dee6b4",
    accentGlow: "#5f7141",
    accentSubtle: "rgba(137, 163, 79, 0.12)",
    soldOut: "#738065",
    glassFill: "rgba(23, 28, 24, 0.84)",
    glassBorder: "rgba(237, 240, 232, 0.1)",
    glassHighlight: "rgba(255, 255, 255, 0.06)",
    glassTintWarm: "rgba(137, 163, 79, 0.14)",
    glassTintCool: "rgba(89, 122, 99, 0.1)",
    shaderWarm: "#9cad61",
    shaderMid: "#61734c",
    shaderDeep: "#0d120f",
    glassShadow: "rgba(0, 0, 0, 0.18)",
  },
  {
    id: "parchment-signal",
    label: "Parchment Signal",
    note: "Light parchment with muted teal.",
    scheme: "light",
    charcoalInk: "#201915",
    warmShadow: "#ece1d3",
    ashLift: "#ddd0bc",
    parchment: "#fbf7f1",
    mutedSilt: "#61564a",
    subtleDust: "#86786a",
    amberBronze: "#4e7f7a",
    amberBright: "#93b8b3",
    emberGlow: "#366763",
    amberHaze: "rgba(78, 127, 122, 0.12)",
    soldOutOxide: "#8f7e72",
    bg: "#f4eadc",
    bgSoft: "#e9dcc9",
    bgElevated: "#d9c9b3",
    text: "#231c18",
    textMuted: "#61564a",
    textSubtle: "#86786a",
    accent: "#4e7f7a",
    accentStrong: "#93b8b3",
    accentGlow: "#366763",
    accentSubtle: "rgba(78, 127, 122, 0.12)",
    soldOut: "#8f7e72",
    glassFill: "rgba(251, 247, 241, 0.8)",
    glassBorder: "rgba(35, 28, 24, 0.12)",
    glassHighlight: "rgba(255, 255, 255, 0.5)",
    glassTintWarm: "rgba(140, 118, 98, 0.14)",
    glassTintCool: "rgba(78, 127, 122, 0.1)",
    shaderWarm: "#b99c84",
    shaderMid: "#8e7460",
    shaderDeep: "#5d4c3f",
    glassShadow: "rgba(61, 41, 26, 0.12)",
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
