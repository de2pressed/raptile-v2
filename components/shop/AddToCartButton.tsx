"use client";

import { useCart } from "@shopify/hydrogen-react";
import { useEffect, useRef, useState } from "react";

import { useShopifyRuntime } from "@/components/providers/ShopifyRuntimeContext";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  variantId?: string | null;
  soldOut?: boolean;
  compact?: boolean;
  className?: string;
  emptySelectionLabel?: string;
}

interface AddToCartButtonFrameProps {
  label: string;
  compact: boolean;
  className?: string;
  disabled: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function AddToCartButtonFrame({
  label,
  compact,
  className,
  disabled,
  loading = false,
  onClick,
}: AddToCartButtonFrameProps) {
  return (
    <button
      className={cn(
        "btn-primary group relative isolate flex items-center justify-center overflow-hidden rounded-full px-5 py-3.5 text-center transition duration-200",
        compact ? "min-w-[12rem]" : "w-full",
        disabled ? "cursor-not-allowed opacity-45" : "shadow-[0_14px_34px_rgba(0,0,0,0.18)]",
        loading ? "cursor-wait" : "",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="relative z-[1] flex min-h-[1.1rem] items-center justify-center gap-1.5">
        {loading ? (
          <span className="flex items-center gap-1.5" aria-label="Adding">
            <span className="loading-dot animation-delay-0" />
            <span className="loading-dot animation-delay-150" />
            <span className="loading-dot animation-delay-300" />
          </span>
        ) : (
          <span className="t-label text-[color:var(--bg)]">{label}</span>
        )}
      </span>
    </button>
  );
}

function AddToCartButtonAction({
  className,
  compact,
  resolvedVariantId,
}: {
  className?: string;
  compact: boolean;
  resolvedVariantId: string;
}) {
  const cart = useCart();
  const setLastAddedMerchandiseId = useRaptileStore((state) => state.setLastAddedMerchandiseId);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const successTimeoutRef = useRef<number | null>(null);
  const closeDrawerTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current !== null) window.clearTimeout(successTimeoutRef.current);
      if (closeDrawerTimeoutRef.current !== null) window.clearTimeout(closeDrawerTimeoutRef.current);
    };
  }, []);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      await cart.linesAdd([{ merchandiseId: resolvedVariantId, quantity: 1 }]);
      setIsSuccess(true);
      setLastAddedMerchandiseId(resolvedVariantId);
      useRaptileStore.getState().setCartOpen(true);

      if (successTimeoutRef.current !== null) window.clearTimeout(successTimeoutRef.current);
      if (closeDrawerTimeoutRef.current !== null) window.clearTimeout(closeDrawerTimeoutRef.current);

      successTimeoutRef.current = window.setTimeout(() => setIsSuccess(false), 1200);
      closeDrawerTimeoutRef.current = window.setTimeout(() => {
        useRaptileStore.getState().setCartOpen(false);
      }, 2200);
    } catch (error) {
      console.error("Cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const label = isSuccess ? "\u2713 Added" : "Add to Cart";

  return (
    <AddToCartButtonFrame
      className={className}
      compact={compact}
      disabled={isLoading}
      label={label}
      loading={isLoading}
      onClick={handleClick}
    />
  );
}

export function AddToCartButton({
  variantId,
  soldOut = false,
  compact = false,
  className,
  emptySelectionLabel = "Select a size",
}: AddToCartButtonProps) {
  const { isConfigured } = useShopifyRuntime();
  const fallbackVariantId = useRaptileStore((state) => state.selectedVariantId);
  const resolvedVariantId = variantId ?? fallbackVariantId;
  const isSoldOut = soldOut || !isConfigured;
  const isDisabled = isSoldOut || !resolvedVariantId;
  const label = isSoldOut ? "Sold Out" : !resolvedVariantId ? emptySelectionLabel : "Add to Cart";

  if (isDisabled) {
    return <AddToCartButtonFrame className={className} compact={compact} disabled label={label} />;
  }

  return <AddToCartButtonAction className={className} compact={compact} resolvedVariantId={resolvedVariantId} />;
}
