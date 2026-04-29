import { HomePageChooser } from "@/components/home/HomePageChooser";
import { getFeaturedCollection } from "@/lib/collection";

const FALLBACK_COLLECTION_DESCRIPTION =
  "A sharp edit of heavyweight tees and essentials, built for heat, motion, and repeat wear.";

export default async function HomePage() {
  const collection = await getFeaturedCollection();

  return (
    <HomePageChooser
      collectionDescription={collection?.description || FALLBACK_COLLECTION_DESCRIPTION}
      collectionTitle="Onyx Collection"
      products={collection?.products ?? []}
    />
  );
}
