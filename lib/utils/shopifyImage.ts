export function shopifyImageUrl(
  url: string,
  options: { width?: number; height?: number; crop?: "center" | "top" | "bottom" },
): string {
  if (!url) return url;

  const parsed = new URL(url);

  if (options.width) parsed.searchParams.set("width", String(options.width));
  if (options.height) parsed.searchParams.set("height", String(options.height));
  if (options.crop) parsed.searchParams.set("crop", options.crop);

  return parsed.toString();
}
