"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { THEME_PALETTES, type ThemeBackgroundId, type ThemePaletteId } from "@/lib/theme-lab";
import { useThemeLab } from "@/components/providers/ThemeLabProvider";

const PANEL_STORAGE_KEY = "raptile.theme.panel.open";

function BackgroundSwatch({ backgroundId, accent, shaderWarm, shaderMid }: { backgroundId: ThemeBackgroundId; accent: string; shaderWarm: string; shaderMid: string }) {
  const swatch = useMemo(() => {
    switch (backgroundId) {
      case "liquid-drift":
        return `linear-gradient(135deg, ${shaderWarm} 0%, ${accent} 48%, ${shaderMid} 100%)`;
      case "quiet-plane":
        return `linear-gradient(135deg, ${shaderMid} 0%, ${accent} 50%, ${shaderWarm} 100%)`;
      case "monsoon-veil":
        return `linear-gradient(135deg, ${accent} 0%, ${shaderMid} 52%, ${shaderWarm} 100%)`;
      case "signal-field":
        return `linear-gradient(135deg, ${shaderMid} 0%, ${accent} 42%, ${shaderWarm} 100%)`;
      case "oxidised-relief":
      default:
        return `linear-gradient(135deg, ${shaderMid} 0%, ${shaderWarm} 48%, ${accent} 100%)`;
    }
  }, [accent, backgroundId, shaderMid, shaderWarm]);

  return <span className="theme-lab-swatch theme-lab-swatch--bar" style={{ background: swatch }} />;
}

function PaletteSwatch({ paletteId }: { paletteId: ThemePaletteId }) {
  const palette = THEME_PALETTES.find((entry) => entry.id === paletteId) ?? THEME_PALETTES[0];

  return (
    <span className="theme-lab-swatch theme-lab-swatch--dots" aria-hidden>
      <span style={{ background: palette.bg }} />
      <span style={{ background: palette.accent }} />
      <span style={{ background: palette.text }} />
    </span>
  );
}

export function ThemeLabPanel() {
  const { background, backgroundId, backgrounds, palette, paletteId, palettes, resetTheme, setBackground, setPalette } =
    useThemeLab();
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoadedPanelState, setHasLoadedPanelState] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PANEL_STORAGE_KEY);

      if (stored === "true") {
        setIsOpen(true);
      } else if (stored === "false") {
        setIsOpen(false);
      } else {
        setIsOpen(window.matchMedia("(min-width: 1024px)").matches);
      }
    } catch {
      setIsOpen(window.matchMedia("(min-width: 1024px)").matches);
    }

    setHasLoadedPanelState(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPanelState) {
      return;
    }

    try {
      window.localStorage.setItem(PANEL_STORAGE_KEY, String(isOpen));
    } catch {
      // Ignore storage failures.
    }
  }, [hasLoadedPanelState, isOpen]);

  const summary = `${background.label} / ${palette.label}`;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[115] md:inset-x-auto md:left-4 md:bottom-4 md:w-[min(44rem,calc(100vw-2rem))]">
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.div
            key="theme-lab-open"
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassPanel
              className="pointer-events-auto max-h-[calc(100vh-2rem)] overflow-auto rounded-[30px] px-4 py-4 md:px-5 md:py-5 scrollbar-thin"
              style={{ overflow: "auto" }}
            >
              <div className="grid gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <div className="t-label text-[color:var(--text-muted)]">Theme lab</div>
                    <div className="font-display text-[1.4rem] font-semibold tracking-[-0.04em] text-[color:var(--text)]">
                      {summary}
                    </div>
                    <div className="t-ui max-w-[34rem] text-[color:var(--text-muted)]">
                      Internal review mode. The whole store updates in place, so you can compare the 25 background and
                      palette combinations without leaving the page.
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="ghost-button rounded-full px-3 py-2"
                      onClick={resetTheme}
                      type="button"
                    >
                      <span className="t-label">Reset</span>
                    </button>
                    <button
                      aria-label="Collapse theme lab"
                      className="ghost-button rounded-full px-3 py-2"
                      onClick={() => setIsOpen(false)}
                      type="button"
                    >
                      <span className="t-label">Close</span>
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <section className="grid gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="t-label text-[color:var(--text-subtle)]">Backgrounds</div>
                      <div className="t-ui text-[color:var(--text-subtle)]">5 lanes</div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
                      {backgrounds.map((option) => (
                        <button
                          key={option.id}
                          aria-pressed={backgroundId === option.id}
                          className={cn("theme-lab-chip", backgroundId === option.id && "is-active")}
                          data-active={backgroundId === option.id}
                          onClick={() => setBackground(option.id)}
                          type="button"
                        >
                          <BackgroundSwatch
                            accent={palette.accent}
                            backgroundId={option.id}
                            shaderMid={palette.shaderMid}
                            shaderWarm={palette.shaderWarm}
                          />
                          <span className="grid min-w-0 gap-0.5 text-left">
                            <span className="font-display text-[1rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                              {option.label}
                            </span>
                            <span className="t-ui text-[color:var(--text-muted)]">{option.note}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="grid gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="t-label text-[color:var(--text-subtle)]">Palettes</div>
                      <div className="t-ui text-[color:var(--text-subtle)]">5 families</div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
                      {palettes.map((option) => (
                        <button
                          key={option.id}
                          aria-pressed={paletteId === option.id}
                          className={cn("theme-lab-chip", paletteId === option.id && "is-active")}
                          data-active={paletteId === option.id}
                          onClick={() => setPalette(option.id)}
                          type="button"
                        >
                          <PaletteSwatch paletteId={option.id} />
                          <span className="grid min-w-0 gap-0.5 text-left">
                            <span className="font-display text-[1rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                              {option.label}
                            </span>
                            <span className="t-ui text-[color:var(--text-muted)]">{option.note}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ) : (
          <motion.button
            key="theme-lab-closed"
            className="pointer-events-auto glass-panel flex items-center gap-3 rounded-full px-4 py-3 text-left"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => setIsOpen(true)}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            type="button"
          >
            <span className="theme-lab-swatch theme-lab-swatch--dots" aria-hidden>
              <span style={{ background: palette.bg }} />
              <span style={{ background: palette.accent }} />
              <span style={{ background: palette.text }} />
            </span>
            <span className="grid min-w-0 gap-0.5">
              <span className="t-label text-[color:var(--text-muted)]">Theme lab</span>
              <span className="font-display text-[1rem] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                {summary}
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
