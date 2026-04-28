import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { ScrollNarrative } from "@/components/story/ScrollNarrative";
import { getFeaturedCollection } from "@/lib/collection";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

const FALLBACK_ABOUT_COPY =
  "Raptile Studio is built around heavyweight essentials, quiet graphics, and a release rhythm that keeps the product ahead of the storefront.";

export default async function AboutPage() {
  const collection = await getFeaturedCollection();
  const products = collection?.products ?? [];
  const heroImage = products[0]?.images[0] ?? products[1]?.images[0] ?? null;

  const narrativeItems = [
    {
      eyebrow: "01 / Material",
      title: "Dense cloth, softer hand.",
      body:
        "The collection is built around 240gsm fabric that keeps its shape, then softened with a double bio wash so the garment wears in instead of wearing out.",
      image: products[0]?.images[0] ?? heroImage,
      note: "The surface should feel steady, not flimsy.",
    },
    {
      eyebrow: "02 / Release",
      title: "Short runs keep the point of view intact.",
      body:
        "Small batches let us stay close to fit, print, and finish. It keeps the line narrow and the attention on the piece instead of the inventory.",
      image: products[1]?.images[0] ?? products[0]?.images[1] ?? heroImage,
      note: "Less volume, more control.",
    },
    {
      eyebrow: "03 / Support",
      title: "The service layer stays direct.",
      body:
        "Sizing help, shipping questions, and product support should remain easy to find and calm to use. The brand voice stays measured even when a customer needs fast answers.",
      image: products[2]?.images[0] ?? products[1]?.images[0] ?? heroImage,
      note: "No unnecessary detours.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] py-8 md:py-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
        <div className="space-y-6">
          <BrandLogo size="lg" />
          <div className="space-y-4">
            <div className="t-label text-[color:var(--text-muted)]">About Raptile Studio</div>
            <h1 className="t-hero max-w-[10ch] text-[color:var(--text)]">Made for repeat wear, not repeat noise.</h1>
            <p className="editorial-copy max-w-[34ch]">{collection?.description || FALLBACK_ABOUT_COPY}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary rounded-full px-5 py-3.5" href="/collection">
              <span className="t-label text-[color:var(--bg)]">View Collection</span>
            </Link>
            <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href="/contact">
              <span className="t-label">Contact the Studio</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {["240gsm", "Double bio washed", "Short run", "India based"].map((item) => (
              <div
                key={item}
                className="noise-surface rounded-full border border-[color:var(--glass-border)] bg-[color:var(--bg-soft)] px-4 py-2"
              >
                <span className="t-label relative z-[1] text-[color:var(--text-muted)]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="noise-surface relative isolate overflow-hidden rounded-[38px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)]">
          <div className="relative min-h-[34rem] md:min-h-[40rem]">
            {heroImage ? (
              <>
                <Image
                  alt={heroImage.altText ?? "Raptile Studio garment photograph"}
                  className="absolute inset-0 z-[1] h-full w-full object-cover"
                  fill
                  priority
                  sizes="(min-width: 1280px) 42vw, 100vw"
                  src={shopifyImageUrl(heroImage.url, { width: 1400 })}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_12%,color-mix(in_oklch,var(--bg)_20%,transparent)_100%)]" />
              </>
            ) : (
              <div className="absolute inset-0 image-skeleton" />
            )}

            <div className="relative z-[1] flex h-full min-h-[34rem] flex-col justify-between p-6 md:min-h-[40rem] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="t-label text-[color:var(--text-muted)]">The studio listens to the cloth first.</div>
                <div className="t-label text-[color:var(--text-muted)]">Editorial / measured / tactile</div>
              </div>

              <div className="space-y-3 self-end text-right">
                <div className="t-label text-[color:var(--text-muted)]">Core principle</div>
                <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
                  Garment first, interface second.
                </div>
                <div className="t-ui max-w-[22rem] text-[color:var(--text-muted)]">
                  The image should carry the mood. The interface should never fight for the frame.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <ScrollNarrative
          cta={{ href: "/contact", label: "Contact the studio" }}
          intro="The story is short on purpose. Every detail points back to weight, wash, fit, and the way the clothes hold presence in a room."
          label="Studio story"
          title="A slower release rhythm keeps the point of view intact."
          items={narrativeItems}
        />
      </section>

      <section className="pt-16 md:pt-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--glass-border)] pt-8">
          <div className="t-ui max-w-[30rem] text-[color:var(--text-muted)]">
            Built for people who read the product before they read the pitch.
          </div>
          <div className="flex flex-wrap gap-5">
            <Link className="t-label text-[color:var(--text)] transition-colors duration-200 hover:text-[color:var(--accent)]" href="/collection">
              View collection
            </Link>
            <Link className="t-label text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
