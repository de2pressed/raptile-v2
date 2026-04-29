import { CollectionPageClient } from "@/components/shop/CollectionPageClient";
import { getFeaturedCollection } from "@/lib/collection";
import { Suspense } from "react";

const FALLBACK_COLLECTION_DESCRIPTION =
  "Heavyweight essentials, short-run releases, and a slower approach to garments that stay composed over time.";

export default async function CollectionPage() {
  const collection = await getFeaturedCollection();

  return (
    <Suspense fallback={<div className="min-h-[calc(100svh-var(--header-height))]" />}>
      <CollectionPageClient
        collectionDescription={collection?.description || FALLBACK_COLLECTION_DESCRIPTION}
        collectionTitle={collection?.title?.trim() || "Onyx Collection"}
        products={collection?.products ?? []}
      />
    </Suspense>
  );
}
