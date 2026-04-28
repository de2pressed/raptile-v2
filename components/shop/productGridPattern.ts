export const GRID_PATTERNS = [
  { desktopSpan: "lg:col-span-7", tabletSpan: "md:col-span-4", aspectRatioClass: "aspect-[4/5]" },
  { desktopSpan: "lg:col-span-5", tabletSpan: "md:col-span-2", aspectRatioClass: "aspect-[4/5]" },
  { desktopSpan: "lg:col-span-4", tabletSpan: "md:col-span-4", aspectRatioClass: "aspect-[4/5] lg:aspect-[3/4]" },
  { desktopSpan: "lg:col-span-4", tabletSpan: "md:col-span-2", aspectRatioClass: "aspect-[4/5] lg:aspect-[3/4]" },
  { desktopSpan: "lg:col-span-4", tabletSpan: "md:col-span-4", aspectRatioClass: "aspect-[4/5] lg:aspect-[3/4]" },
  { desktopSpan: "lg:col-span-5", tabletSpan: "md:col-span-2", aspectRatioClass: "aspect-[4/5]" },
  { desktopSpan: "lg:col-span-7", tabletSpan: "md:col-span-4", aspectRatioClass: "aspect-[4/5]" },
] as const;

export function getGridPattern(index: number) {
  return GRID_PATTERNS[index % GRID_PATTERNS.length];
}
