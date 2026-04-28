"use client";

import { useCart } from "@shopify/hydrogen-react";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import * as motion from "framer-motion/client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { useRaptileStore } from "@/lib/store";

export function CartDrawer() {
  const cart = useCart();
  const cartLines = useRaptileStore((state) => state.cartLines);
  const cartTotal = useRaptileStore((state) => state.cartTotal);
  const isCartOpen = useRaptileStore((state) => state.isCartOpen);
  const setCartOpen = useRaptileStore((state) => state.setCartOpen);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isCartOpen ? (
          <>
            <motion.button
              aria-label="Close cart"
              className="fixed inset-0 z-[135] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[140] w-full max-w-[420px] p-3 md:p-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <GlassPanel className="glass-panel-heavy flex h-full flex-col rounded-[30px] px-5 py-5 md:px-6">
                <div className="flex items-center justify-between">
                  <div className="font-display text-2xl font-bold tracking-[-0.04em]">Cart</div>
                  <button className="t-ui text-[color:var(--text-muted)]" onClick={() => setCartOpen(false)} type="button">
                    Close
                  </button>
                </div>
                <div className="mono-rule mt-3">--------------------------------</div>
                <div className="scrollbar-thin mt-5 flex-1 overflow-y-auto pr-1">
                  {cartLines.length === 0 ? (
                    <div className="py-10 text-[color:var(--text-muted)]">
                      <span className="t-ui">
                        Your cart is empty<span className="cart-empty-dot">.</span>
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cartLines.map((line) => (
                        <div
                          key={line.id}
                          className="glass-panel rounded-[22px] px-4 py-4 before:rounded-[22px]"
                        >
                          <div className="relative z-[1]">
                            <div className="t-ui flex items-start justify-between gap-4 text-[color:var(--text-muted)]">
                              <div className="min-w-0">{line.variantTitle}</div>
                              <div className="shrink-0 text-[color:var(--text)]">{line.price}</div>
                            </div>
                            <div className="t-product mt-2 truncate">{line.title}</div>
                            <div className="mt-4 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <button
                                  className="glass-panel h-8 w-8 rounded-full text-sm before:rounded-full"
                                  onClick={() => {
                                    if (line.quantity <= 1) {
                                      cart.linesRemove([line.id]);
                                      return;
                                    }

                                    cart.linesUpdate([{ id: line.id, quantity: line.quantity - 1 }]);
                                  }}
                                  type="button"
                                >
                                  -
                                </button>
                                <div className="t-ui min-w-[3rem] text-center text-[color:var(--text)]">{`x${line.quantity}`}</div>
                                <button
                                  className="glass-panel h-8 w-8 rounded-full text-sm before:rounded-full"
                                  onClick={() => cart.linesUpdate([{ id: line.id, quantity: line.quantity + 1 }])}
                                  type="button"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                className="t-ui text-[color:var(--text-muted)] transition duration-200 hover:text-[color:var(--accent-strong)]"
                                onClick={() => cart.linesRemove([line.id])}
                                type="button"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mono-rule mt-4">--------------------------------</div>
                <div className="t-ui mt-4 flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{cartTotal}</span>
                </div>
                <button
                  className="mt-5 rounded-full bg-[color:var(--accent)] px-5 py-4 text-center font-display text-base font-bold text-[color:var(--bg)] transition duration-200 hover:bg-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!cart.checkoutUrl || cartLines.length === 0}
                  onClick={() => {
                    if (cart.checkoutUrl) {
                      window.location.href = cart.checkoutUrl;
                    }
                  }}
                  type="button"
                >
                  Checkout
                </button>
              </GlassPanel>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
