export const COLOR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#f0ede8",
  cream: "#f5f0e8",
  off_white: "#ede8e0",
  ivory: "#f4f0e6",
  grey: "#8a8a8a",
  gray: "#8a8a8a",
  charcoal: "#3a3a3a",
  slate: "#6b7280",
  navy: "#1e2a3a",
  blue: "#2a4a7a",
  sage: "#7a9a7a",
  olive: "#6b7a3a",
  green: "#2d5a3d",
  brown: "#6b4a2a",
  tan: "#c4a882",
  sand: "#d4c4a0",
  camel: "#c4945a",
  rust: "#9a4a2a",
  burgundy: "#6a1a2a",
  red: "#9a2a2a",
  orange: "#d46a1a",
  yellow: "#d4b44a",
  pink: "#d4829a",
  purple: "#6a4a8a",
};

export function getColorHex(name: string): string {
  const key = name.toLowerCase().replace(/[\s-]/g, "_");
  return COLOR_MAP[key] ?? "#888888";
}
