"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

import {
  DEFAULT_THEME_SELECTION,
  applyThemePalette,
  getThemeBackground,
  getThemePalette,
  isThemeBackgroundId,
  isThemePaletteId,
  THEME_BACKGROUNDS,
  THEME_PALETTES,
  type ThemeBackground,
  type ThemeBackgroundId,
  type ThemePalette,
  type ThemePaletteId,
} from "@/lib/theme-lab";

const BACKGROUND_STORAGE_KEY = "raptile.theme.background";
const PALETTE_STORAGE_KEY = "raptile.theme.palette";

interface ThemeLabContextValue {
  backgroundId: ThemeBackgroundId;
  paletteId: ThemePaletteId;
  background: ThemeBackground;
  palette: ThemePalette;
  backgrounds: readonly ThemeBackground[];
  palettes: readonly ThemePalette[];
  setBackground: (backgroundId: ThemeBackgroundId) => void;
  setPalette: (paletteId: ThemePaletteId) => void;
  resetTheme: () => void;
}

const ThemeLabContext = createContext<ThemeLabContextValue | null>(null);

function readStoredThemeSelection() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_SELECTION;
  }

  const storedBackground = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
  const storedPalette = window.localStorage.getItem(PALETTE_STORAGE_KEY);

  return {
    background: isThemeBackgroundId(storedBackground ?? "")
      ? (storedBackground as ThemeBackgroundId)
      : DEFAULT_THEME_SELECTION.background,
    palette: isThemePaletteId(storedPalette ?? "") ? (storedPalette as ThemePaletteId) : DEFAULT_THEME_SELECTION.palette,
  } as const;
}

export function ThemeLabProvider({ children }: PropsWithChildren) {
  const [backgroundId, setBackgroundId] = useState<ThemeBackgroundId>(DEFAULT_THEME_SELECTION.background);
  const [paletteId, setPaletteId] = useState<ThemePaletteId>(DEFAULT_THEME_SELECTION.palette);
  const [hasLoadedStoredTheme, setHasLoadedStoredTheme] = useState(false);

  const background = useMemo(() => getThemeBackground(backgroundId), [backgroundId]);
  const palette = useMemo(() => getThemePalette(paletteId), [paletteId]);

  useEffect(() => {
    const stored = readStoredThemeSelection();
    setBackgroundId(stored.background);
    setPaletteId(stored.palette);
    setHasLoadedStoredTheme(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredTheme) {
      return;
    }

    const root = document.documentElement;

    applyThemePalette(root, palette);
    root.dataset.themeBackground = background.id;

    try {
      window.localStorage.setItem(BACKGROUND_STORAGE_KEY, background.id);
      window.localStorage.setItem(PALETTE_STORAGE_KEY, palette.id);
    } catch {
      // Ignore storage failures in private mode or restrictive browsers.
    }
  }, [background.id, hasLoadedStoredTheme, palette]);

  const value = useMemo<ThemeLabContextValue>(
    () => ({
      backgroundId,
      paletteId,
      background,
      palette,
      backgrounds: THEME_BACKGROUNDS,
      palettes: THEME_PALETTES,
      setBackground: setBackgroundId,
      setPalette: setPaletteId,
      resetTheme: () => {
        setBackgroundId(DEFAULT_THEME_SELECTION.background);
        setPaletteId(DEFAULT_THEME_SELECTION.palette);
      },
    }),
    [background, backgroundId, palette, paletteId],
  );

  return <ThemeLabContext.Provider value={value}>{children}</ThemeLabContext.Provider>;
}

export function useThemeLab() {
  const context = useContext(ThemeLabContext);

  if (!context) {
    throw new Error("useThemeLab must be used within ThemeLabProvider");
  }

  return context;
}
