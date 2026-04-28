import { Suspense } from "react";

import { CollectionHeader } from "@/components/shop/CollectionHeader";
import { ProductGridServer } from "@/components/shop/ProductGridServer";
import { ProductGridSkeleton } from "@/components/shop/ProductGridSkeleton";

export default function CollectionPage() {
  return (
    <>
      <CollectionHeader />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGridServer />
      </Suspense>
    </>
  );
}
