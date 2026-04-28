import type { ProductImage } from "@/lib/commerce";

export function normalizeColorName(name: string | null | undefined): string {
  if (!name) return "";

  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "");
}

export function filterImagesByColor(images: ProductImage[], selectedColor: string): ProductImage[] {
  if (!selectedColor) return images;

  const targetColor = normalizeColorName(selectedColor);

  const exactMatch = images.filter((image) => normalizeColorName(image.altText) === targetColor);
  if (exactMatch.length > 0) return exactMatch;

  const containsMatch = images.filter((image) => normalizeColorName(image.altText).includes(targetColor));
  if (containsMatch.length > 0) return containsMatch;

  const reverseMatch = images.filter(
    (image) => image.altText && targetColor.includes(normalizeColorName(image.altText)),
  );
  if (reverseMatch.length > 0) return reverseMatch;

  return images;
}

export function getFirstColorFromImages(images: Array<{ altText: string | null }>): string {
  for (const image of images) {
    const normalized = normalizeColorName(image.altText);
    if (normalized) return normalized;
  }

  return "";
}
