import { HomePageClient } from "@/components/home/HomePageClient";
import { getFeaturedCollection } from "@/lib/collection";

const FALLBACK_COLLECTION_DESCRIPTION =
  "A short edit of heavyweight tees and essentials, tuned for Indian weather and repeated wear.";

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
