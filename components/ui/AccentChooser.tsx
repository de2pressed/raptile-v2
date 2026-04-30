"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { useRaptileStore } from "@/lib/store";
import { ACCENT_PRESETS, applyAccentToCSS, getAccentPreset } from "@/lib/theme-lab";

const STORAGE_KEY = "raptile-accent";

export function AccentChooser() {
  const reduceMotion = useReducedMotion() ?? false;
  const { accentKey, setAccentKey } = useRaptileStore();
  const [isOpen, setIsOpen] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ACCENT_PRESETS.some((p) => p.key === saved)) {
        setAccentKey(saved);
      }
    } catch {
      // localStorage unavailable — keep default
    }
  }, [setAccentKey]);

  // Apply accent CSS variables whenever accentKey changes
  useEffect(() => {
    const preset = getAccentPreset(accentKey);
    applyAccentToCSS(document.documentElement, preset);

    try {
      localStorage.setItem(STORAGE_KEY, accentKey);
    } catch {
      // localStorage unavailable
    }
  }, [accentKey]);

  const handleSelect = (key: string) => {
    setAccentKey(key);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100] md:bottom-6 md:left-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="glass-panel mb-2 flex flex-col gap-2 rounded-full p-2 before:rounded-full"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => handleSelect(preset.key)}
                className="group relative flex items-center justify-center"
                aria-label={`Set accent to ${preset.label}`}
                title={preset.label}
              >
                <span
                  className="block rounded-full transition-transform duration-200 group-hover:scale-110"
                  style={{
                    width: accentKey === preset.key ? 18 : 14,
                    height: accentKey === preset.key ? 18 : 14,
                    backgroundColor: preset.accent,
                    boxShadow:
                      accentKey === preset.key
                        ? `0 0 0 2px var(--bg), 0 0 0 3.5px ${preset.accent}`
                        : "none",
                  }}
                />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="glass-panel flex h-9 w-9 items-center justify-center rounded-full before:rounded-full md:h-10 md:w-10"
        aria-label="Change accent color"
        title="Change accent color"
      >
        <motion.span
          className="block rounded-full"
          style={{
            width: 14,
            height: 14,
            backgroundColor: getAccentPreset(accentKey).accent,
          }}
          animate={reduceMotion ? {} : { scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </button>
    </div>
  );
}
