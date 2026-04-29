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
      accent: "#b66c3a",
      accentStrong: "#f1d2b7",
      accentGlow: "#653218",
      accentSubtle: "#b66c3a22",
      bg: "#090603",
      bgSoft: "#120d09",
      bgElevated: "#1a120d",
      glassFill: "#15100bd6",
      glassBorder: "#f4e3cf1a",
      glassHighlight: "#fff8ef0a",
      glassTintWarm: "#4724142e",
      glassTintCool: "#6a3b2418",
      shaderWarm: "#d18a55",
      shaderMid: "#784126",
      shaderDeep: "#070503",
    },
  },
  {
    minute: 360,
    palette: {
      tone: "dawn",
      accent: "#bf7241",
      accentStrong: "#f3d7be",
      accentGlow: "#72391c",
      accentSubtle: "#bf724122",
      bg: "#0a0704",
      bgSoft: "#13100b",
      bgElevated: "#1b140f",
      glassFill: "#16100cd6",
      glassBorder: "#f3e2cc1a",
      glassHighlight: "#fff8ef0a",
      glassTintWarm: "#4c27162e",
      glassTintCool: "#73422418",
      shaderWarm: "#d58d58",
      shaderMid: "#7a4327",
      shaderDeep: "#080503",
    },
  },
  {
    minute: 780,
    palette: {
      tone: "day",
      accent: "#c87b45",
      accentStrong: "#f4dcc3",
      accentGlow: "#7b4220",
      accentSubtle: "#c87b4522",
      bg: "#0b0805",
      bgSoft: "#14100c",
      bgElevated: "#1c150f",
      glassFill: "#17110dd6",
      glassBorder: "#f3e1cb1a",
      glassHighlight: "#fff8ef0a",
      glassTintWarm: "#532b182e",
      glassTintCool: "#7b482718",
      shaderWarm: "#d88f5a",
      shaderMid: "#804724",
      shaderDeep: "#090503",
    },
  },
  {
    minute: 1080,
    palette: {
      tone: "dusk",
      accent: "#b86d3c",
      accentStrong: "#eed0b2",
      accentGlow: "#693319",
      accentSubtle: "#b86d3c22",
      bg: "#090704",
      bgSoft: "#110d09",
      bgElevated: "#19120d",
      glassFill: "#15100cd6",
      glassBorder: "#f2dfc71a",
      glassHighlight: "#fff8ef0a",
      glassTintWarm: "#4826162c",
      glassTintCool: "#6a3f2418",
      shaderWarm: "#cf8a57",
      shaderMid: "#744024",
      shaderDeep: "#080503",
    },
  },
  {
    minute: 1440,
    palette: {
      tone: "night",
      accent: "#b66c3a",
      accentStrong: "#f1d2b7",
      accentGlow: "#653218",
      accentSubtle: "#b66c3a22",
      bg: "#090603",
      bgSoft: "#120d09",
      bgElevated: "#1a120d",
      glassFill: "#15100bd6",
      glassBorder: "#f4e3cf1a",
      glassHighlight: "#fff8ef0a",
      glassTintWarm: "#4724142e",
      glassTintCool: "#6a3b2418",
      shaderWarm: "#d18a55",
      shaderMid: "#784126",
      shaderDeep: "#070503",
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
