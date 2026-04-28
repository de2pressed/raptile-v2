"use client";

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { useRaptileStore } from "@/lib/store";
import { shopifyImageUrl } from "@/lib/utils/shopifyImage";

export function CartDrawer() {
  const cartLines = useRaptileStore((state) => state.cartLines);
  const isCartOpen = useRaptileStore((state) => state.isCartOpen);
  const lastAddedMerchandiseId = useRaptileStore((state) => state.lastAddedMerchandiseId);
  const setCartOpen = useRaptileStore((state) => state.setCartOpen);

  const addedLine = useMemo(
    () =>
      cartLines.find((line) => line.merchandiseId === lastAddedMerchandiseId) ??
      cartLines[cartLines.length - 1] ??
      null,
    [cartLines, lastAddedMerchandiseId],
  );

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isCartOpen ? (
          <>
            <motion.button
              aria-label="Close cart confirmation"
              className="fixed inset-0 z-[135] bg-[color:var(--bg)]/74"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              type="button"
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[140] w-full max-w-[420px] p-3 md:p-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass-panel glass-panel-heavy flex h-full flex-col rounded-[30px] px-5 py-5 md:px-6">
                <div className="relative z-[1] flex h-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="t-label text-[color:var(--text-muted)]">Cart Confirmation</div>
                      <div className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                        Added to cart
                      </div>
                    </div>
                    <button className="t-ui text-[color:var(--text-muted)]" onClick={() => setCartOpen(false)} type="button">
                      Close
                    </button>
                  </div>

                  <div className="mono-rule mt-4">--------------------------------</div>

                  <div className="mt-6 flex-1">
                    {addedLine ? (
                      <div className="grid gap-4 rounded-[26px] border border-[color:var(--glass-border)] bg-[color:var(--glass-fill)] p-4">
                        <div className="grid grid-cols-[80px_1fr] gap-4">
                          <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[color:var(--bg-elevated)]">
                            {addedLine.imageUrl ? (
                              <Image
                                alt={addedLine.imageAlt ?? addedLine.title}
                                className="h-full w-full object-cover"
                                fill
                                sizes="80px"
                                src={shopifyImageUrl(addedLine.imageUrl, { width: 160 })}
                              />
                            ) : null}
                          </div>
                          <div className="flex flex-col justify-center gap-2">
                            <div className="t-product">{addedLine.title}</div>
                            <div className="t-label text-[color:var(--text-muted)]">{addedLine.variantTitle}</div>
                            <div className="t-price text-[color:var(--text)]">{addedLine.price}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="t-ui text-[color:var(--text-muted)]">Your selection is being added to the cart.</div>
                    )}
                  </div>

                  <div className="mono-rule mt-4">--------------------------------</div>

                  <Link
                    className="t-label mt-5 inline-flex items-center justify-between text-[color:var(--text-muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                  >
                    <span>View Cart</span>
                    <span aria-hidden>Open</span>
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
