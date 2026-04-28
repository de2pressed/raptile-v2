"use client";

import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { ProductImage } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

export interface ScrollNarrativeItem {
  eyebrow: string;
  title: string;
  body: string;
  image?: ProductImage | null;
  note?: string;
  stat?: string;
}

interface ScrollNarrativeProps {
  label: string;
  title: string;
  intro: string;
  items: ScrollNarrativeItem[];
  cta?: {
    href: string;
    label: string;
  };
  className?: string;
}

export function ScrollNarrative({ label, title, intro, items, cta, className }: ScrollNarrativeProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const index = Number((visible.target as HTMLElement).dataset.index ?? 0);
        setActiveIndex(index);
      },
      {
        rootMargin: "-20% 0px -48% 0px",
        threshold: [0.25, 0.45, 0.65],
      },
    );

    itemRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [items.length]);

  const activeItem = useMemo(() => items[activeIndex] ?? items[0], [activeIndex, items]);

  if (items.length === 0 || !activeItem) {
    return null;
  }

  return (
    <section className={cn("grid gap-8 lg:grid-cols-[minmax(280px,0.92fr)_minmax(0,1.08fr)]", className)}>
      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-3">
          <div className="t-label text-[color:var(--text-muted)]">{label}</div>
          <h2 className="t-display max-w-[12ch] text-[color:var(--text)]">{title}</h2>
          <p className="editorial-copy max-w-[34ch]">{intro}</p>
        </div>

        <div className="noise-surface relative overflow-hidden rounded-[34px] border border-[color:var(--glass-border)] bg-[color:var(--bg-elevated)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeIndex}-${activeItem.title}`}
              className="relative min-h-[28rem]"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeItem.image ? (
                <Image
                  alt={activeItem.image.altText ?? activeItem.title}
                  className="z-[1] h-full w-full object-cover"
                  fill
                  priority={activeIndex === 0}
                  sizes="(min-width: 1280px) 34vw, 100vw"
                  src={shopifyImageUrl(activeItem.image.url, { width: 1200 })}
                />
              ) : (
                <div className="absolute inset-0 image-skeleton" />
              )}

              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,color-mix(in_oklch,var(--bg)_14%,transparent)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="t-label text-[color:var(--text-muted)]">{activeItem.eyebrow}</div>
                  <div className="t-ui text-[color:var(--text-muted)]">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </div>
                </div>
                <div className="mt-4 max-w-[18rem] space-y-2">
                  <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                    {activeItem.title}
                  </div>
                  <div className="t-ui text-[color:var(--text-muted)]">{activeItem.stat ?? activeItem.note}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {cta ? (
          <Link
            className="t-label inline-flex items-center gap-2 text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
            href={cta.href}
          >
            <span>{cta.label}</span>
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>

      <div className="space-y-8">
        {items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            data-index={index}
            className={cn(
              "group min-h-[68vh] border-t border-[color:var(--glass-border)] py-8 md:py-12 transition-opacity duration-300",
              index === activeIndex ? "opacity-100" : "opacity-65",
            )}
          >
            <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
              <div className="t-label text-[color:var(--text-subtle)]">{String(index + 1).padStart(2, "0")}</div>
              <div className="space-y-4">
                <div className="t-label text-[color:var(--text-muted)]">{item.eyebrow}</div>
                <h3 className="t-display max-w-[12ch] text-[color:var(--text)]">{item.title}</h3>
                <p className="editorial-copy max-w-[34ch]">{item.body}</p>
                {item.note ? <div className="t-ui max-w-[32ch] text-[color:var(--text-subtle)]">{item.note}</div> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
