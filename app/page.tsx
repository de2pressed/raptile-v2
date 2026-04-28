import { HomePageClient } from "@/components/home/HomePageClient";
import { getFeaturedCollection } from "@/lib/collection";

const FALLBACK_COLLECTION_DESCRIPTION =
  "Heavyweight essentials, short-run releases, and a slower approach to garments that stay composed over time.";

export default async function HomePage() {
  const collection = await getFeaturedCollection();

  return (
    <HomePageClient
      collectionDescription={collection?.description || FALLBACK_COLLECTION_DESCRIPTION}
      collectionTitle="Onyx Collection"
      products={collection?.products ?? []}
    />
  );
}
