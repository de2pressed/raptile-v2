export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ProductVariant {
  id: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  price: MoneyV2;
}

export interface ProductMetafield {
  key: string;
  value: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  metafields: ProductMetafield[];
  description: string;
  totalInventory: number | null;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  description: string;
  products: ShopifyProduct[];
}

export interface ShopifyCartLineInput {
  merchandiseId: string;
  quantity: number;
}

export function formatPrice(amount: string | number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(typeof amount === "string" ? Number(amount) : amount);
}
