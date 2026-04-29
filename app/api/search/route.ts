import { NextResponse } from "next/server";

import { getFeaturedCollection } from "@/lib/collection";
import { searchCatalogProducts } from "@/lib/catalog";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const collection = await getFeaturedCollection();
  const products = collection?.products ?? [];
  const results = searchCatalogProducts(products, query, 6);

  return NextResponse.json({
    query,
    results,
  });
}
