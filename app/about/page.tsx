import Image from "next/image";
import Link from "next/link";

import { ScrollNarrative } from "@/components/story/ScrollNarrative";
import { getFeaturedCollection } from "@/lib/collection";
import { fabricSignals, storyBeats } from "@/lib/story-content";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

const FALLBACK_ABOUT_COPY =
  "Raptile Studio is built around heavyweight essentials, quiet graphics, and a release rhythm that keeps the product ahead of the storefront.";

export default async function AboutPage() {
  const collection = await getFeaturedCollection();
  const products = collection?.products ?? [];
  const heroImage = products[0]?.images[0] ?? products[1]?.images[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-[1440px] py-8 md:py-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
        <div className="space-y-6">
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

          <div className="space-y-4 border-t border-[color:var(--glass-border)] pt-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[color:var(--text-muted)]">
              {fabricSignals.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="t-ui">{item}</span>
                  {index < fabricSignals.length - 1 ? (
                    <span aria-hidden className="text-[color:var(--text-subtle)]">
                      /
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
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

              <div className="hidden space-y-3 self-end text-right md:block">
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
          items={storyBeats}
        />
      </section>

      <section className="pt-16 md:pt-20">
        <div className="border-t border-[color:var(--glass-border)] pt-8">
          <div className="t-ui max-w-[38rem] text-[color:var(--text-muted)]">
            Built for people who read the product before they read the pitch. The navigation already holds the transactional
            work, so the page can stay with the story.
          </div>
        </div>
      </section>
    </div>
  );
}
