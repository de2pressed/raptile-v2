import type { ProductImage, ProductVariant, ShopifyProduct } from "@/lib/commerce";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function getOptionValue(variant: ProductVariant, optionName: string) {
  return (
    variant.selectedOptions.find((option) => normalize(option.name) === normalize(optionName))?.value ?? null
  );
}

export function matchesColor(image: ProductImage, colorName: string | null) {
  if (!colorName || !image.altText) {
    return false;
  }

  return normalize(image.altText) === normalize(colorName);
}

export function getProductColors(product: ShopifyProduct) {
  const imageColors = product.images.flatMap((image) => (image.altText ? [image.altText] : []));
  const variantColors = product.variants.flatMap((variant) => {
    const color = getOptionValue(variant, "Color");
    return color ? [color] : [];
  });

  return [...new Set([...imageColors, ...variantColors])];
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
  return variantColor ? getOptionValue(variantColor, "Color") : getProductColors(product)[0] ?? null;
}
