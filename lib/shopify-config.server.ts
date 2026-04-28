import "server-only";

import { readEnv } from "@/lib/env";
import {
  DEFAULT_SHOPIFY_RUNTIME_CONFIG,
  STOREFRONT_API_VERSION,
  type ShopifyRuntimeConfig,
} from "@/lib/shopify-config";

function readShopifyEnv(primaryName: string, fallbackName: string) {
  return readEnv(primaryName) || readEnv(fallbackName);
}

export function getShopifyRuntimeConfig(): ShopifyRuntimeConfig {
  const storeDomain = readShopifyEnv("SHOPIFY_STORE_DOMAIN", "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN");
  const storefrontToken = readShopifyEnv("SHOPIFY_STOREFRONT_TOKEN", "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN");

  return {
    ...DEFAULT_SHOPIFY_RUNTIME_CONFIG,
    storeDomain,
    storefrontToken,
    storefrontApiVersion: STOREFRONT_API_VERSION,
    isConfigured: Boolean(storeDomain && storefrontToken),
  };
}
