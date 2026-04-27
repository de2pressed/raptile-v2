"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { clamp } from "@/lib/utils";

type Handlers = {
  onPointerDown: React.PointerEventHandler<HTMLElement>;
  onPointerUp: React.PointerEventHandler<HTMLElement>;
  onPointerLeave: React.PointerEventHandler<HTMLElement>;
  onPointerCancel: React.PointerEventHandler<HTMLElement>;
};

export function useLongPress(onComplete: () => void, duration = 800) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stopFrame = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopFrame();
    completedRef.current = false;
    setIsHolding(false);
    setProgress(0);
  }, [stopFrame]);

  const step = useCallback(
    (timestamp: number) => {
      const elapsed = timestamp - startRef.current;
      const ratio = clamp(elapsed / duration, 0, 1);
      setProgress(ratio);

      if (ratio >= 1) {
        completedRef.current = true;
        setIsHolding(false);
        stopFrame();
        onCompleteRef.current();
        return;
      }

      frameRef.current = window.requestAnimationFrame(step);
    },
    [duration, stopFrame],
  );

  const onPointerDown = useCallback<React.PointerEventHandler<HTMLElement>>(
    (event) => {
      if (event.button !== -1 && event.button !== 0) {
        return;
      }

      completedRef.current = false;
      setIsHolding(true);
      setProgress(0);
      startRef.current = performance.now();
      stopFrame();
      frameRef.current = window.requestAnimationFrame(step);
    },
    [step, stopFrame],
  );

  const cancel = useCallback(() => {
    stopFrame();
    setIsHolding(false);

    if (!completedRef.current) {
      setProgress(0);
    }
  }, [stopFrame]);

  useEffect(() => reset, [reset]);

  const handlers: Handlers = {
    onPointerDown,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
  };

  return {
    handlers,
    progress,
    isHolding,
    reset,
  };
}
