export const STOREFRONT_API_VERSION = "2026-04";

export interface ShopifyRuntimeConfig {
  storeDomain: string;
  storefrontToken: string;
  storefrontApiVersion: string;
  isConfigured: boolean;
}

export const DEFAULT_SHOPIFY_RUNTIME_CONFIG: ShopifyRuntimeConfig = {
  storeDomain: "",
  storefrontToken: "",
  storefrontApiVersion: STOREFRONT_API_VERSION,
  isConfigured: false,
};
