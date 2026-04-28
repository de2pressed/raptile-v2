import { readEnv } from "@/lib/env";

export const SHOPIFY_COLLECTION_HANDLE = readEnv("SHOPIFY_COLLECTION_HANDLE") || "frontpage";
