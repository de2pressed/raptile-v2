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
      accent: "#3d4fd6",
      accentStrong: "#dfe5ff",
      accentGlow: "#22339c",
      accentSubtle: "#3d4fd622",
      bg: "#070b15",
      bgSoft: "#0c1324",
      bgElevated: "#111a2e",
      glassFill: "#10182b75",
      glassBorder: "#d7e2ff18",
      glassHighlight: "#f2f6ff0a",
      glassTintWarm: "#203b8f3a",
      glassTintCool: "#405ed642",
      shaderWarm: "#7084ff",
      shaderMid: "#2d45a8",
      shaderDeep: "#05070d",
    },
  },
  {
    minute: 360,
    palette: {
      tone: "dawn",
      accent: "#4256d8",
      accentStrong: "#e0e6ff",
      accentGlow: "#22339b",
      accentSubtle: "#4256d822",
      bg: "#09101b",
      bgSoft: "#11182a",
      bgElevated: "#172033",
      glassFill: "#111a2d75",
      glassBorder: "#dbe4ff18",
      glassHighlight: "#f2f6ff0a",
      glassTintWarm: "#1f2f7538",
      glassTintCool: "#3954c636",
      shaderWarm: "#6f7dff",
      shaderMid: "#344ca7",
      shaderDeep: "#060b13",
    },
  },
  {
    minute: 780,
    palette: {
      tone: "day",
      accent: "#3d4fd6",
      accentStrong: "#dfe5ff",
      accentGlow: "#22339c",
      accentSubtle: "#3d4fd622",
      bg: "#0a111d",
      bgSoft: "#12192a",
      bgElevated: "#182133",
      glassFill: "#121b2d75",
      glassBorder: "#d7e2ff18",
      glassHighlight: "#f2f6ff0a",
      glassTintWarm: "#22357c34",
      glassTintCool: "#3e59cf34",
      shaderWarm: "#7887ff",
      shaderMid: "#354ea9",
      shaderDeep: "#060a12",
    },
  },
  {
    minute: 1080,
    palette: {
      tone: "dusk",
      accent: "#4356d7",
      accentStrong: "#dbe2ff",
      accentGlow: "#233296",
      accentSubtle: "#4356d622",
      bg: "#08101c",
      bgSoft: "#101728",
      bgElevated: "#162033",
      glassFill: "#111a2d75",
      glassBorder: "#d7e2ff18",
      glassHighlight: "#f2f6ff0a",
      glassTintWarm: "#1d2d7130",
      glassTintCool: "#4f6ca64a",
      shaderWarm: "#8190ff",
      shaderMid: "#4661a5",
      shaderDeep: "#08101d",
    },
  },
  {
    minute: 1440,
    palette: {
      tone: "night",
      accent: "#3d4fd6",
      accentStrong: "#dfe5ff",
      accentGlow: "#22339c",
      accentSubtle: "#3d4fd622",
      bg: "#070b15",
      bgSoft: "#0c1324",
      bgElevated: "#111a2e",
      glassFill: "#10182b75",
      glassBorder: "#d7e2ff18",
      glassHighlight: "#f2f6ff0a",
      glassTintWarm: "#203b8f3a",
      glassTintCool: "#405ed642",
      shaderWarm: "#7084ff",
      shaderMid: "#2d45a8",
      shaderDeep: "#05070d",
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
