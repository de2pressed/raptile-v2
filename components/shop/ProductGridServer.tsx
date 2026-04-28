import { ProductGrid } from "@/components/shop/ProductGrid";
import { getFeaturedCollection } from "@/lib/collection";

export async function ProductGridServer() {
  const collection = await getFeaturedCollection();
  return <ProductGrid products={collection?.products ?? []} />;
}
