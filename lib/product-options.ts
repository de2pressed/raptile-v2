import type { ProductImage, ProductVariant, ShopifyProduct } from "@/lib/commerce";
import { filterImagesByColor, getFirstColorFromImages, normalizeColorName } from "@/lib/utils/imageFilter";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function getOptionValue(variant: ProductVariant, optionName: string) {
  return (
    variant.selectedOptions.find((option) => normalize(option.name) === normalize(optionName))?.value ?? null
  );
}

export function matchesColor(image: ProductImage, colorName: string | null) {
  if (!colorName) return false;
  return filterImagesByColor([image], colorName).length > 0;
}

export function getProductColors(product: ShopifyProduct) {
  const imageColors = product.images.flatMap((image) => (image.altText ? [image.altText.trim()] : []));
  const variantColors = product.variants.flatMap((variant) => {
    const color = getOptionValue(variant, "Color");
    return color ? [color.trim()] : [];
  });
  const seen = new Set<string>();

  return [...variantColors, ...imageColors].filter((color) => {
    const normalized = normalizeColorName(color);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function getProductSizes(product: ShopifyProduct) {
  return [
    ...new Set(
      product.variants.flatMap((variant) => {
        const size = getOptionValue(variant, "Size");
        return size ? [size] : [];
      }),
    ),
  ];
}

export function getFirstAvailableColor(product: ShopifyProduct) {
  const variantColor = product.variants.find((variant) => variant.availableForSale);

  return (
    (variantColor ? getOptionValue(variantColor, "Color") : null) ||
    product.images.find((image) => normalizeColorName(image.altText))?.altText ||
    getFirstColorFromImages(product.images) ||
    getProductColors(product)[0] ||
    null
  );
}
