import type { ShopifyProduct } from "@/lib/commerce";
import { formatPrice } from "@/lib/commerce";
import { getProductSizes } from "@/lib/product-options";

export type CollectionSort = "newest" | "price-asc" | "price-desc" | "bestselling";

export interface CatalogSearchResult {
  title: string;
  handle: string;
  description: string;
  price: string;
  availableForSale: boolean;
  imageUrl?: string | null;
  imageAlt?: string | null;
  score: number;
  matchLabel: string;
}

export interface CatalogFilterState {
  query: string;
  sort: CollectionSort;
  size: string | null;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "");
}

function priceAmount(product: ShopifyProduct) {
  return Number(product.priceRange.minVariantPrice.amount || 0);
}

function buildMatchLabel(product: ShopifyProduct, query: string) {
  if (!query) {
    return "Featured";
  }

  const normalizedQuery = normalize(query);
  const title = normalize(product.title);
  const handle = normalize(product.handle);
  const description = normalize(product.description);
  const metafields = product.metafields.map((field) => normalize(field.value)).join(" ");

  if (title.includes(normalizedQuery)) {
    return "Title match";
  }

  if (handle.includes(normalizedQuery)) {
    return "Handle match";
  }

  if (description.includes(normalizedQuery)) {
    return "Description match";
  }

  if (metafields.includes(normalizedQuery)) {
    return "Spec match";
  }

  return "Related";
}

function scoreProduct(product: ShopifyProduct, query: string) {
  if (!query) {
    return 0;
  }

  const normalizedQuery = normalize(query);
  const title = normalize(product.title);
  const handle = normalize(product.handle);
  const description = normalize(product.description);
  const metafields = product.metafields.map((field) => normalize(field.value)).join(" ");

  let score = 0;

  if (!normalizedQuery) {
    return score;
  }

  if (title === normalizedQuery) {
    score += 120;
  } else if (title.includes(normalizedQuery)) {
    score += 80;
  }

  if (handle.includes(normalizedQuery)) {
    score += 28;
  }

  if (description.includes(normalizedQuery)) {
    score += 16;
  }

  if (metafields.includes(normalizedQuery)) {
    score += 12;
  }

  if (getProductSizes(product).some((size) => normalize(size).includes(normalizedQuery))) {
    score += 8;
  }

  if (product.availableForSale) {
    score += 2;
  }

  return score;
}

function getExcerpt(product: ShopifyProduct, query: string) {
  const description = product.description.trim();

  if (!description) {
    return "Available in the Onyx collection.";
  }

  if (!query) {
    return description.slice(0, 84);
  }

  const normalizedQuery = normalize(query);
  const normalizedDescription = normalize(description);
  const index = normalizedDescription.indexOf(normalizedQuery);

  if (index < 0) {
    return description.slice(0, 84);
  }

  const start = Math.max(0, index - 32);
  const end = Math.min(description.length, index + normalizedQuery.length + 36);
  return `${start > 0 ? "…" : ""}${description.slice(start, end).trim()}${end < description.length ? "…" : ""}`;
}

export function searchCatalogProducts(products: ShopifyProduct[], query: string, limit = 8): CatalogSearchResult[] {
  const trimmedQuery = query.trim();
  const ranked = products
    .map((product, index) => ({
      product,
      index,
      score: scoreProduct(product, trimmedQuery),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const leftPrice = priceAmount(left.product);
      const rightPrice = priceAmount(right.product);

      if (leftPrice !== rightPrice) {
        return leftPrice - rightPrice;
      }

      return left.index - right.index;
    })
    .slice(0, limit);

  return ranked.map(({ product, score }) => ({
    title: product.title,
    handle: product.handle,
    description: getExcerpt(product, trimmedQuery),
    price: formatPrice(product.priceRange.minVariantPrice.amount),
    availableForSale: product.availableForSale,
    imageUrl: product.images[0]?.url ?? null,
    imageAlt: product.images[0]?.altText ?? null,
    score,
    matchLabel: buildMatchLabel(product, trimmedQuery),
  }));
}

export function filterCatalogProducts(products: ShopifyProduct[], state: CatalogFilterState) {
  const query = state.query.trim().toLowerCase();
  const size = state.size?.trim().toUpperCase() ?? "";

  let nextProducts = [...products];

  if (query) {
    nextProducts = nextProducts.filter((product) => {
      const searchable = [
        product.title,
        product.handle,
        product.description,
        ...product.metafields.map((field) => field.value),
        ...getProductSizes(product),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }

  if (size) {
    nextProducts = nextProducts.filter((product) => getProductSizes(product).some((value) => value.toUpperCase() === size));
  }

  return sortCatalogProducts(nextProducts, state.sort, products);
}

export function sortCatalogProducts(
  products: ShopifyProduct[],
  sort: CollectionSort,
  originalOrder: ShopifyProduct[] = products,
) {
  const indexed = products.map((product) => ({
    product,
    originalIndex: originalOrder.findIndex((candidate) => candidate.id === product.id),
  }));

  indexed.sort((left, right) => {
    switch (sort) {
      case "price-asc":
        return priceAmount(left.product) - priceAmount(right.product) || left.originalIndex - right.originalIndex;
      case "price-desc":
        return priceAmount(right.product) - priceAmount(left.product) || left.originalIndex - right.originalIndex;
      case "bestselling":
        if (left.product.availableForSale !== right.product.availableForSale) {
          return left.product.availableForSale ? -1 : 1;
        }
        return left.originalIndex - right.originalIndex;
      case "newest":
      default:
        return left.originalIndex - right.originalIndex;
    }
  });

  return indexed.map(({ product }) => product);
}

export function createCatalogFilterState(searchParams: URLSearchParams): CatalogFilterState {
  return {
    query: searchParams.get("q")?.trim() ?? "",
    sort: (searchParams.get("sort") as CollectionSort | null) ?? "newest",
    size: searchParams.get("size")?.trim().toUpperCase() ?? null,
  };
}
