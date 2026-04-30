export interface ThemePalette {
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

export const EMBER_CURRENT: ThemePalette = {
  charcoalInk: "#100b08",
  warmShadow: "#17100c",
  ashLift: "#1d1410",
  parchment: "#f3e8dc",
  mutedSilt: "#cdbfaa",
  subtleDust: "#8e7869",
  amberBronze: "#bc7545",
  amberBright: "#f0d3ba",
  emberGlow: "#6a341d",
  amberHaze: "rgba(188, 117, 69, 0.12)",
  soldOutOxide: "#6f5c52",
  bg: "#100b08",
  bgSoft: "#17100c",
  bgElevated: "#1d1410",
  text: "#f3e8dc",
  textMuted: "#cdbfaa",
  textSubtle: "#8e7869",
  accent: "#bc7545",
  accentStrong: "#f0d3ba",
  accentGlow: "#6a341d",
  accentSubtle: "rgba(188, 117, 69, 0.12)",
  soldOut: "#6f5c52",
  glassFill: "rgba(23, 16, 12, 0.84)",
  glassBorder: "rgba(243, 232, 220, 0.1)",
  glassHighlight: "rgba(255, 248, 239, 0.06)",
  glassTintWarm: "rgba(188, 117, 69, 0.16)",
  glassTintCool: "rgba(139, 92, 61, 0.1)",
  shaderWarm: "#d08b59",
  shaderMid: "#784126",
  shaderDeep: "#080503",
  glassShadow: "rgba(0, 0, 0, 0.18)",
};

// --- Accent preset system ---

export interface AccentPreset {
  key: string;
  label: string;
  accent: string;
  accentStrong: string;
  accentGlow: string;
  accentSubtle: string;
  shaderWarm: string;
  shaderMid: string;
  glassTintWarm: string;
  glassTintCool: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    key: "ember",
    label: "Ember",
    accent: "#bc7545",
    accentStrong: "#f0d3ba",
    accentGlow: "#6a341d",
    accentSubtle: "rgba(188,117,69,0.12)",
    shaderWarm: "#d08b59",
    shaderMid: "#784126",
    glassTintWarm: "rgba(188,117,69,0.16)",
    glassTintCool: "rgba(106,52,29,0.1)",
  },
  {
    key: "steel",
    label: "Steel",
    accent: "#7a8a9a",
    accentStrong: "#a8b8c8",
    accentGlow: "#4a5a6a",
    accentSubtle: "rgba(122,138,154,0.12)",
    shaderWarm: "#8a9aaa",
    shaderMid: "#5a6a7a",
    glassTintWarm: "rgba(122,138,154,0.16)",
    glassTintCool: "rgba(74,90,106,0.1)",
  },
  {
    key: "sage",
    label: "Sage",
    accent: "#7a8a5a",
    accentStrong: "#a0b080",
    accentGlow: "#4a5a34",
    accentSubtle: "rgba(122,138,90,0.12)",
    shaderWarm: "#8a9a6a",
    shaderMid: "#5a6a44",
    glassTintWarm: "rgba(122,138,90,0.16)",
    glassTintCool: "rgba(74,90,52,0.1)",
  },
  {
    key: "rust",
    label: "Rust",
    accent: "#c46030",
    accentStrong: "#e07a48",
    accentGlow: "#8a4018",
    accentSubtle: "rgba(196,96,48,0.12)",
    shaderWarm: "#d47040",
    shaderMid: "#944828",
    glassTintWarm: "rgba(196,96,48,0.16)",
    glassTintCool: "rgba(138,64,24,0.1)",
  },
  {
    key: "ivory",
    label: "Ivory",
    accent: "#c4b496",
    accentStrong: "#e0d4c0",
    accentGlow: "#8a7a5e",
    accentSubtle: "rgba(196,180,150,0.12)",
    shaderWarm: "#d0c0a0",
    shaderMid: "#9a8a6c",
    glassTintWarm: "rgba(196,180,150,0.16)",
    glassTintCool: "rgba(138,122,94,0.1)",
  },
];

export function getAccentPreset(key: string): AccentPreset {
  return ACCENT_PRESETS.find((p) => p.key === key) ?? ACCENT_PRESETS[0];
}

export function applyAccentToCSS(el: HTMLElement, preset: AccentPreset) {
  el.style.setProperty("--accent", preset.accent);
  el.style.setProperty("--accent-strong", preset.accentStrong);
  el.style.setProperty("--accent-glow", preset.accentGlow);
  el.style.setProperty("--accent-subtle", preset.accentSubtle);
  el.style.setProperty("--shader-warm", preset.shaderWarm);
  el.style.setProperty("--shader-mid", preset.shaderMid);
  el.style.setProperty("--glass-tint-a", preset.glassTintWarm);
  el.style.setProperty("--glass-tint-b", preset.glassTintCool);
}

export function buildPaletteFromAccent(preset: AccentPreset): ThemePalette {
  return {
    ...EMBER_CURRENT,
    accent: preset.accent,
    accentStrong: preset.accentStrong,
    accentGlow: preset.accentGlow,
    accentSubtle: preset.accentSubtle,
    amberBronze: preset.accent,
    amberBright: preset.accentStrong,
    emberGlow: preset.accentGlow,
    amberHaze: preset.accentSubtle,
    shaderWarm: preset.shaderWarm,
    shaderMid: preset.shaderMid,
    glassTintWarm: preset.glassTintWarm,
    glassTintCool: preset.glassTintCool,
  };
}

// --- Color utilities ---

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
