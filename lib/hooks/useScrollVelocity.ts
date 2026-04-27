"use client";

import { useEffect } from "react";

import { useRaptileStore } from "@/lib/store";

let decayLoopRaf: number | null = null;
let activeSubscribers = 0;

function startDecayLoop() {
  if (typeof window === "undefined" || decayLoopRaf !== null) {
    return;
  }

  const tick = () => {
    const store = useRaptileStore.getState();
    const nextVelocity = Math.abs(store.scrollVelocity) < 0.0001 ? 0 : store.scrollVelocity * 0.92;

    if (nextVelocity !== store.scrollVelocity) {
      store.setScrollVelocity(nextVelocity);
    }

    decayLoopRaf = window.requestAnimationFrame(tick);
  };

  decayLoopRaf = window.requestAnimationFrame(tick);
}

function stopDecayLoop() {
  if (decayLoopRaf !== null && activeSubscribers === 0) {
    window.cancelAnimationFrame(decayLoopRaf);
    decayLoopRaf = null;
  }
}

export function useScrollVelocity() {
  const scrollVelocity = useRaptileStore((state) => state.scrollVelocity);

  useEffect(() => {
    activeSubscribers += 1;
    startDecayLoop();

    return () => {
      activeSubscribers -= 1;
      stopDecayLoop();
    };
  }, []);

  return scrollVelocity;
}
