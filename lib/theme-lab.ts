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

export const SLATE_CURRENT: ThemePalette = {
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
};

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
