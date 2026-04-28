"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";

import type { ShopifyProduct } from "@/lib/commerce";
import { useRaptileStore } from "@/lib/store";
import { toTechnicalLabel } from "@/lib/utils";

interface SpecDrawerProps {
  product: ShopifyProduct;
}

export function SpecDrawer({ product }: SpecDrawerProps) {
  const isOpen = useRaptileStore((state) => state.isSpecDrawerOpen);
  const setSpecDrawerOpen = useRaptileStore((state) => state.setSpecDrawerOpen);
  const metafields = new Map(product.metafields.map((field) => [field.key, field.value]));
  const specs = [
    ["weight", metafields.get("weight")],
    ["cut", metafields.get("cut")],
    ["material", metafields.get("material")],
    ["fit", metafields.get("fit")],
    ["print", null],
    ["care", null],
  ] as const;
  const status = product.availableForSale ? "Available to order" : "Currently unavailable";

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              aria-label="Close product details"
              className="fixed inset-0 z-[145] bg-[color:var(--bg)]/72"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSpecDrawerOpen(false)}
              type="button"
            />
            <motion.section
              className="fixed inset-0 z-[150] md:inset-x-6 md:bottom-6 md:top-auto md:h-[60vh]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass-panel glass-panel-heavy h-full rounded-none px-5 py-5 md:rounded-[34px] md:px-8 md:py-8">
                <div className="relative z-[1] flex h-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="t-label text-[color:var(--text-muted)]">Product Details</div>
                      <div className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                        {product.title}
                      </div>
                    </div>
                    <button className="t-label text-[color:var(--text-muted)] hover:text-[color:var(--text)]" onClick={() => setSpecDrawerOpen(false)} type="button">
                      Close
                    </button>
                  </div>

                  <div className="mono-rule mt-4">--------------------------------</div>

                  <div className="mt-6 flex-1 overflow-y-auto pr-1">
                    <div className="grid gap-4">
                      {specs.map(([key, value]) => (
                        <div key={key} className="flex items-start justify-between gap-4 border-b border-[color:var(--glass-border)] pb-4">
                          <div className="t-label text-[color:var(--text-muted)]">{toTechnicalLabel(key)}</div>
                          <div className="t-ui max-w-[30ch] text-right text-[color:var(--text)]">
                            {(value ?? "Available on request").toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {product.description ? (
                      <div className="mt-8 max-w-[65ch] text-sm leading-7 text-[color:var(--text-muted)] md:text-base">
                        {product.description}
                      </div>
                    ) : null}
                  </div>

                  <div className="mono-rule mt-4">--------------------------------</div>
                  <div className="t-ui mt-4 text-[color:var(--text-muted)]">{`Status: ${status}`}</div>
                </div>
              </div>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
