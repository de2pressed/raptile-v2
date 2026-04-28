import "server-only";

import { cache } from "react";

import { getCollection } from "@/lib/shopify";
import { SHOPIFY_COLLECTION_HANDLE } from "@/lib/storefront-config";

export const getFeaturedCollection = cache(async () => getCollection(SHOPIFY_COLLECTION_HANDLE));
