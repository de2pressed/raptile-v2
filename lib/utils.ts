import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function pad(value: number, width = 4) {
  return Math.max(0, Math.floor(value)).toString().padStart(width, "0");
}

export function toTechnicalLabel(input: string) {
  return input.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
}
