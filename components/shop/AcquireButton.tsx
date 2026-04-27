"use client";

import { useCart } from "@shopify/hydrogen-react";
import { useEffect, useRef, useState } from "react";

import { IS_SHOPIFY_PUBLIC_READY } from "@/lib/public-config";
import { useLongPress } from "@/lib/hooks/useLongPress";
import { useRaptileStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AcquireButtonProps {
  variantId?: string | null;
  available?: boolean;
  compact?: boolean;
  className?: string;
}

export function AcquireButton({
  variantId,
  available = true,
  compact = false,
  className,
}: AcquireButtonProps) {
  const cart = useCart();
  const fallbackVariantId = useRaptileStore((state) => state.selectedVariantId);
  const setCartOpen = useRaptileStore((state) => state.setCartOpen);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const resolvedVariantId = variantId ?? fallbackVariantId;
  const isBusy = cart.status === "creating" || cart.status === "updating" || cart.status === "fetching";
  const isInteractive = Boolean(resolvedVariantId && available && IS_SHOPIFY_PUBLIC_READY && !isBusy);

  const { handlers, progress, isHolding, reset } = useLongPress(() => {
    if (!resolvedVariantId || !isInteractive) {
      return;
    }

    cart.linesAdd([{ merchandiseId: resolvedVariantId, quantity: 1 }]);
    setCartOpen(true);
    window.navigator.vibrate?.(35);
    setIsComplete(true);

    timeoutRef.current = window.setTimeout(() => {
      setIsComplete(false);
      reset();
    }, 1200);
  }, 800);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const label = !IS_SHOPIFY_PUBLIC_READY
    ? "STORE OFFLINE"
    : !available
      ? "VAULTED"
      : !resolvedVariantId
        ? "SELECT SIZE"
        : isBusy
          ? "SYNCING..."
          : isComplete
            ? "ACQUIRED"
            : isHolding
              ? `ACQUIRING... ${Math.round(progress * 100)}%`
              : compact
                ? "ACQUIRE PIECE →"
                : "ACQUIRE PIECE";

  return (
    <button
      className={cn(
        "glass-panel group relative isolate overflow-hidden rounded-full border border-[color:var(--glass-border)] px-5 py-3 text-left transition duration-200 before:rounded-full",
        compact ? "min-w-[12rem]" : "w-full",
        available && resolvedVariantId ? "hover:amber-border" : "opacity-70",
        !isInteractive ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
      disabled={!isInteractive}
      type="button"
      {...(isInteractive ? handlers : {})}
    >
      <span
        className="absolute inset-y-0 left-0 z-[1] origin-left rounded-full bg-[color:var(--accent-glow)] shadow-[0_0_12px_var(--accent-glow)] transition-[transform,opacity] duration-200"
        style={{
          opacity: progress > 0 ? 0.88 : 0,
          transform: `scaleX(${progress})`,
          width: "100%",
        }}
      />
      {isComplete ? (
        <span className="pointer-events-none absolute inset-0 z-[2] rounded-full bg-white/50 animate-ping" />
      ) : null}
      <span
        className={cn(
          "t-label relative z-[3] block transition-colors duration-200",
          isHolding || isComplete ? "text-[#170d09]" : "text-[color:var(--text)]",
        )}
      >
        {label}
      </span>
    </button>
  );
}
