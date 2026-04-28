import "server-only";

import type {
  MoneyV2,
  ProductImage,
  ProductMetafield,
  ProductVariant,
  ShopifyCollection,
  ShopifyProduct,
  ShopifyCartLineInput,
} from "@/lib/commerce";
import { STOREFRONT_API_VERSION } from "@/lib/public-config";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

interface CartLineUpdateInput extends ShopifyCartLineInput {
  id: string;
}

interface ShopifyResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export function isShopifyConfigured() {
  return Boolean(SHOPIFY_DOMAIN && SHOPIFY_TOKEN);
}

async function storefrontFetch<T>({
  query,
  variables,
  tags,
  revalidate = 3600,
  cache = "force-cache",
}: {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number;
  cache?: RequestCache;
}) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    return null;
  }

  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: tags ? { revalidate, tags } : { revalidate },
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(", "));
  }

  return payload.data ?? null;
}

const COLLECTION_QUERY = /* GraphQL */ `
  query GetCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: 50) {
        nodes {
          id
          title
          handle
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 12) {
            nodes {
              url
              altText
              width
              height
            }
          }
          variants(first: 10) {
            nodes {
              id
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
          metafields(
            identifiers: [
              { namespace: "custom", key: "weight" }
              { namespace: "custom", key: "cut" }
              { namespace: "custom", key: "material" }
              { namespace: "custom", key: "fit" }
            ]
          ) {
            key
            value
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = /* GraphQL */ `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 12) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 10) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
      metafields(
        identifiers: [
          { namespace: "custom", key: "weight" }
          { namespace: "custom", key: "cut" }
          { namespace: "custom", key: "material" }
          { namespace: "custom", key: "fit" }
        ]
      ) {
        key
        value
      }
    }
  }
`;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            product {
              title
              handle
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CreateCart($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
    }
  }
`;

const ADD_LINES_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
`;

const REMOVE_LINES_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
    }
  }
`;

const UPDATE_LINES_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
`;

const GET_CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

function normalizeProduct(product: {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  description?: string | null;
  priceRange: { minVariantPrice: MoneyV2 };
  images: { nodes: ProductImage[] };
  variants: { nodes: ProductVariant[] };
  metafields: Array<ProductMetafield | null>;
}): ShopifyProduct {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    availableForSale: product.availableForSale,
    description: product.description ?? "",
    priceRange: product.priceRange,
    images: product.images.nodes,
    variants: product.variants.nodes,
    metafields: product.metafields.filter(Boolean) as ProductMetafield[],
  };
}

export async function getCollection(handle: string) {
  const data = await storefrontFetch<{
    collection: {
      id: string;
      title: string;
      description: string;
      products: {
        nodes: Array<Parameters<typeof normalizeProduct>[0]>;
      };
    } | null;
  }>({
    query: COLLECTION_QUERY,
    variables: { handle },
    tags: ["collection"],
  });

  if (!data?.collection) {
    return null;
  }

  return {
    id: data.collection.id,
    title: data.collection.title,
    description: data.collection.description,
    products: data.collection.products.nodes.map(normalizeProduct),
  } satisfies ShopifyCollection;
}

export async function getProduct(handle: string) {
  const data = await storefrontFetch<{
    product: Parameters<typeof normalizeProduct>[0] | null;
  }>({
    query: PRODUCT_QUERY,
    variables: { handle },
    tags: [`product-${handle}`, "collection"],
  });

  return data?.product ? normalizeProduct(data.product) : null;
}

export async function createCart(input?: { lines?: ShopifyCartLineInput[] }) {
  const data = await storefrontFetch<{ cartCreate: { cart: unknown } }>({
    query: CREATE_CART_MUTATION,
    variables: { input },
    cache: "no-store",
  });

  return data?.cartCreate.cart ?? null;
}

export async function addCartLines(cartId: string, lines: ShopifyCartLineInput[]) {
  const data = await storefrontFetch<{ cartLinesAdd: { cart: unknown } }>({
    query: ADD_LINES_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });

  return data?.cartLinesAdd.cart ?? null;
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await storefrontFetch<{ cartLinesRemove: { cart: unknown } }>({
    query: REMOVE_LINES_MUTATION,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  return data?.cartLinesRemove.cart ?? null;
}

export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[]) {
  const data = await storefrontFetch<{ cartLinesUpdate: { cart: unknown } }>({
    query: UPDATE_LINES_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });

  return data?.cartLinesUpdate.cart ?? null;
}

export async function getCart(cartId: string) {
  const data = await storefrontFetch<{ cart: unknown }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: "no-store",
  });

  return data?.cart ?? null;
}
