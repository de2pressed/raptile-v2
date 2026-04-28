const IST_TIME_ZONE = "Asia/Kolkata";

export type TimeAccentTone = "night" | "dawn" | "day" | "dusk";

export interface TimeAccentPalette {
  tone: TimeAccentTone;
  accent: string;
  accentStrong: string;
  accentGlow: string;
  accentSubtle: string;
  bg: string;
  bgSoft: string;
  bgElevated: string;
  glassFill: string;
  glassBorder: string;
  glassHighlight: string;
  glassTintWarm: string;
  glassTintCool: string;
  shaderWarm: string;
  shaderMid: string;
  shaderDeep: string;
}

interface KeyframePalette extends Omit<TimeAccentPalette, "tone"> {
  tone: TimeAccentTone;
}

const KEYFRAMES: Array<{ minute: number; palette: KeyframePalette }> = [
  {
    minute: 0,
    palette: {
      tone: "night",
      accent: "#4a6fc7",
      accentStrong: "#9eb5ff",
      accentGlow: "#2f4f95",
      accentSubtle: "#567ccf40",
      bg: "#070c18",
      bgSoft: "#0b1324",
      bgElevated: "#111b33",
      glassFill: "#111a2bd6",
      glassBorder: "#9db4ff1c",
      glassHighlight: "#edf3ff0c",
      glassTintWarm: "#18336642",
      glassTintCool: "#2b4f9a42",
      shaderWarm: "#6d89ff",
      shaderMid: "#26478b",
      shaderDeep: "#04070f",
    },
  },
  {
    minute: 360,
    palette: {
      tone: "dawn",
      accent: "#9f6639",
      accentStrong: "#e3a56f",
      accentGlow: "#7a4926",
      accentSubtle: "#c28a5f3c",
      bg: "#0d1119",
      bgSoft: "#141822",
      bgElevated: "#1b202c",
      glassFill: "#1c1920d8",
      glassBorder: "#e7d0b61c",
      glassHighlight: "#fff0df0c",
      glassTintWarm: "#7f4f1e3d",
      glassTintCool: "#365a9d2a",
      shaderWarm: "#b97842",
      shaderMid: "#4762aa",
      shaderDeep: "#07101b",
    },
  },
  {
    minute: 780,
    palette: {
      tone: "day",
      accent: "#cf7533",
      accentStrong: "#eab06c",
      accentGlow: "#a94f18",
      accentSubtle: "#d8925b3a",
      bg: "#120d0a",
      bgSoft: "#19120f",
      bgElevated: "#221713",
      glassFill: "#241711d4",
      glassBorder: "#f0ccaa1a",
      glassHighlight: "#fff0df0c",
      glassTintWarm: "#8b5a2840",
      glassTintCool: "#2c529b20",
      shaderWarm: "#c36d31",
      shaderMid: "#4362ac",
      shaderDeep: "#06101e",
    },
  },
  {
    minute: 1080,
    palette: {
      tone: "dusk",
      accent: "#5b79c8",
      accentStrong: "#9aaff8",
      accentGlow: "#364f97",
      accentSubtle: "#5d7cc540",
      bg: "#0b101b",
      bgSoft: "#10182a",
      bgElevated: "#162135",
      glassFill: "#121c2ed9",
      glassBorder: "#9ab0ff1c",
      glassHighlight: "#edf3ff0c",
      glassTintWarm: "#8d5a2e2b",
      glassTintCool: "#4f6ca650",
      shaderWarm: "#9d6b42",
      shaderMid: "#4661a5",
      shaderDeep: "#08101d",
    },
  },
  {
    minute: 1440,
    palette: {
      tone: "night",
      accent: "#4a6fc7",
      accentStrong: "#9eb5ff",
      accentGlow: "#2f4f95",
      accentSubtle: "#567ccf40",
      bg: "#070c18",
      bgSoft: "#0b1324",
      bgElevated: "#111b33",
      glassFill: "#111a2bd6",
      glassBorder: "#9db4ff1c",
      glassHighlight: "#edf3ff0c",
      glassTintWarm: "#18336642",
      glassTintCool: "#2b4f9a42",
      shaderWarm: "#6d89ff",
      shaderMid: "#26478b",
      shaderDeep: "#04070f",
    },
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothStep(t: number) {
  return t * t * (3 - 2 * t);
}

function parseHexColor(value: string) {
  const hex = value.replace("#", "").trim();

  if (![3, 4, 6, 8].includes(hex.length)) {
    throw new Error(`Unsupported hex color: ${value}`);
  }

  const expanded =
    hex.length === 3 || hex.length === 4
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;

  const hasAlpha = expanded.length === 8;
  const rgb = expanded.slice(0, 6);
  const alpha = hasAlpha ? expanded.slice(6, 8) : "ff";

  return {
    r: Number.parseInt(rgb.slice(0, 2), 16),
    g: Number.parseInt(rgb.slice(2, 4), 16),
    b: Number.parseInt(rgb.slice(4, 6), 16),
    a: Number.parseInt(alpha, 16) / 255,
  };
}

function mixHexColor(left: string, right: string, t: number) {
  const start = parseHexColor(left);
  const end = parseHexColor(right);

  const r = Math.round(lerp(start.r, end.r, t));
  const g = Math.round(lerp(start.g, end.g, t));
  const b = Math.round(lerp(start.b, end.b, t));
  const a = lerp(start.a, end.a, t);

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

function getIstMinuteOfDay(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: IST_TIME_ZONE,
  });

  const parts = formatter.formatToParts(date);
  const getValue = (type: Intl.DateTimeFormatPart["type"]) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const hours = getValue("hour");
  const minutes = getValue("minute");
  const seconds = getValue("second");

  return hours * 60 + minutes + seconds / 60;
}

function findSegment(minute: number) {
  for (let index = 0; index < KEYFRAMES.length - 1; index += 1) {
    const current = KEYFRAMES[index];
    const next = KEYFRAMES[index + 1];

    if (minute >= current.minute && minute <= next.minute) {
      return { current, next };
    }
  }

  return { current: KEYFRAMES[0], next: KEYFRAMES[1] };
}

export function getIstTimeAccentPalette(date = new Date()): TimeAccentPalette {
  const minute = getIstMinuteOfDay(date);
  const { current, next } = findSegment(minute);
  const segmentDuration = Math.max(next.minute - current.minute, 1);
  const segmentT = smoothStep((minute - current.minute) / segmentDuration);

  return {
    tone: segmentT < 0.5 ? current.palette.tone : next.palette.tone,
    accent: mixHexColor(current.palette.accent, next.palette.accent, segmentT),
    accentStrong: mixHexColor(current.palette.accentStrong, next.palette.accentStrong, segmentT),
    accentGlow: mixHexColor(current.palette.accentGlow, next.palette.accentGlow, segmentT),
    accentSubtle: mixHexColor(current.palette.accentSubtle, next.palette.accentSubtle, segmentT),
    bg: mixHexColor(current.palette.bg, next.palette.bg, segmentT),
    bgSoft: mixHexColor(current.palette.bgSoft, next.palette.bgSoft, segmentT),
    bgElevated: mixHexColor(current.palette.bgElevated, next.palette.bgElevated, segmentT),
    glassFill: mixHexColor(current.palette.glassFill, next.palette.glassFill, segmentT),
    glassBorder: mixHexColor(current.palette.glassBorder, next.palette.glassBorder, segmentT),
    glassHighlight: mixHexColor(current.palette.glassHighlight, next.palette.glassHighlight, segmentT),
    glassTintWarm: mixHexColor(current.palette.glassTintWarm, next.palette.glassTintWarm, segmentT),
    glassTintCool: mixHexColor(current.palette.glassTintCool, next.palette.glassTintCool, segmentT),
    shaderWarm: mixHexColor(current.palette.shaderWarm, next.palette.shaderWarm, segmentT),
    shaderMid: mixHexColor(current.palette.shaderMid, next.palette.shaderMid, segmentT),
    shaderDeep: mixHexColor(current.palette.shaderDeep, next.palette.shaderDeep, segmentT),
  };
}

export function applyTimeAccentPalette(target: HTMLElement, palette: TimeAccentPalette) {
  const rootStyle = target.style;

  rootStyle.setProperty("--accent", palette.accent);
  rootStyle.setProperty("--accent-strong", palette.accentStrong);
  rootStyle.setProperty("--accent-glow", palette.accentGlow);
  rootStyle.setProperty("--accent-subtle", palette.accentSubtle);
  rootStyle.setProperty("--bg", palette.bg);
  rootStyle.setProperty("--bg-soft", palette.bgSoft);
  rootStyle.setProperty("--bg-elevated", palette.bgElevated);
  rootStyle.setProperty("--glass-fill", palette.glassFill);
  rootStyle.setProperty("--glass-border", palette.glassBorder);
  rootStyle.setProperty("--glass-highlight", palette.glassHighlight);
  rootStyle.setProperty("--glass-tint-a", palette.glassTintWarm);
  rootStyle.setProperty("--glass-tint-b", palette.glassTintCool);
  rootStyle.setProperty("--shader-warm", palette.shaderWarm);
  rootStyle.setProperty("--shader-mid", palette.shaderMid);
  rootStyle.setProperty("--shader-deep", palette.shaderDeep);
  target.dataset.timeTone = palette.tone;
}
