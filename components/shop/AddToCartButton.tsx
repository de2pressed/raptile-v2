"use client";

import { useCart } from "@shopify/hydrogen-react";
import { useEffect, useRef, useState } from "react";

import { IS_SHOPIFY_PUBLIC_READY } from "@/lib/public-config";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  variantId?: string | null;
  soldOut?: boolean;
  compact?: boolean;
  className?: string;
  emptySelectionLabel?: string;
}

export function AddToCartButton({
  variantId,
  soldOut = false,
  compact = false,
  className,
  emptySelectionLabel = "Select a size",
}: AddToCartButtonProps) {
  const cart = useCart();
  const fallbackVariantId = useRaptileStore((state) => state.selectedVariantId);
  const setCartOpen = useRaptileStore((state) => state.setCartOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const resolvedVariantId = variantId ?? fallbackVariantId;
  const isSoldOut = soldOut || !IS_SHOPIFY_PUBLIC_READY;
  const isDisabled = isLoading || isSoldOut || !resolvedVariantId;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = async () => {
    if (isDisabled || !resolvedVariantId) {
      return;
    }

    setIsLoading(true);

    try {
      await cart.linesAdd([{ merchandiseId: resolvedVariantId, quantity: 1 }]);
      setIsSuccess(true);
      setCartOpen(true);
      timeoutRef.current = window.setTimeout(() => setIsSuccess(false), 1000);
    } catch (error) {
      console.error("Cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const label = isSoldOut
    ? "Sold Out"
    : !resolvedVariantId
      ? emptySelectionLabel
      : isSuccess
        ? "\u2713 Added"
        : "Add to Cart";

  return (
    <button
      className={cn(
        "glass-panel group relative isolate overflow-hidden rounded-full border border-[color:var(--glass-border)] px-5 py-3 text-left transition duration-200 before:rounded-full",
        compact ? "min-w-[12rem]" : "w-full",
        isDisabled ? "cursor-not-allowed opacity-45" : "hover:amber-border",
        isLoading ? "cursor-wait" : "",
        className,
      )}
      disabled={isDisabled}
      onClick={handleClick}
      type="button"
    >
      <span className="relative z-[1] flex min-h-[1.1rem] items-center justify-center gap-1.5">
        {isLoading ? (
          <span className="flex items-center gap-1.5" aria-label="Adding">
            <span className="loading-dot animation-delay-0" />
            <span className="loading-dot animation-delay-150" />
            <span className="loading-dot animation-delay-300" />
          </span>
        ) : (
          <span className="t-label">{label}</span>
        )}
      </span>
    </button>
  );
}
