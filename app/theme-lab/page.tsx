"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  BACKGROUND_REGISTRY,
  type BackgroundComponent,
} from "@/components/background/backgrounds";
import {
  BONE_INK,
  CARBON_FLAME,
  DESERT_DUSK,
  EMBER_CURRENT,
  MIDNIGHT_SILVER,
  STORM_SLATE,
  THEME_PALETTES,
  parseColor,
  type ThemePalette,
} from "@/lib/theme-lab";

const THEME_OPTIONS: Array<{ key: string; label: string; palette: ThemePalette }> = [
  { key: "ember", label: "Ember", palette: EMBER_CURRENT },
  { key: "midnight", label: "Midnight Silver", palette: MIDNIGHT_SILVER },
  { key: "bone", label: "Bone Ink", palette: BONE_INK },
  { key: "storm", label: "Storm Slate", palette: STORM_SLATE },
  { key: "desert", label: "Desert Dusk", palette: DESERT_DUSK },
  { key: "carbon", label: "Carbon Flame", palette: CARBON_FLAME },
];

const BACKGROUND_OPTIONS = Object.entries(BACKGROUND_REGISTRY).map(([key, entry]) => ({
  key,
  label: entry.label,
}));

function isLightPalette(palette: ThemePalette) {
  return parseColor(palette.bg).r > 128;
}

function applyPaletteToElement(el: HTMLElement, palette: ThemePalette) {
  el.style.setProperty("--bg", palette.bg);
  el.style.setProperty("--bg-soft", palette.bgSoft);
  el.style.setProperty("--bg-elevated", palette.bgElevated);
  el.style.setProperty("--text", palette.text);
  el.style.setProperty("--text-muted", palette.textMuted);
  el.style.setProperty("--text-subtle", palette.textSubtle);
  el.style.setProperty("--accent", palette.accent);
  el.style.setProperty("--accent-strong", palette.accentStrong);
  el.style.setProperty("--accent-glow", palette.accentGlow);
  el.style.setProperty("--accent-subtle", palette.accentSubtle);
  el.style.setProperty("--sold-out", palette.soldOut);
  el.style.setProperty("--glass-fill", palette.glassFill);
  el.style.setProperty("--glass-border", palette.glassBorder);
  el.style.setProperty("--glass-highlight", palette.glassHighlight);
  el.style.setProperty("--glass-tint-a", palette.glassTintWarm);
  el.style.setProperty("--glass-tint-b", palette.glassTintCool);
  el.style.setProperty("--shader-warm", palette.shaderWarm);
  el.style.setProperty("--shader-mid", palette.shaderMid);
  el.style.setProperty("--shader-deep", palette.shaderDeep);
  el.style.setProperty("--glass-shadow", palette.glassShadow);
  el.style.setProperty("--noise-header-opacity", isLightPalette(palette) ? "0.035" : "0.05");
  el.style.setProperty("--noise-surface-opacity", isLightPalette(palette) ? "0.035" : "0.05");
  el.style.colorScheme = isLightPalette(palette) ? "light" : "dark";
}

function ThemeSwatch({ palette, active, label, onClick }: {
  palette: ThemePalette;
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const activeRing = active ? `0 0 0 1px ${palette.accent}, 0 0 0 3px color-mix(in oklch, ${palette.accent} 22%, transparent)` : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="glass-panel flex min-w-[12.5rem] items-center gap-3 rounded-[22px] border border-[var(--glass-border)] px-3 py-3 text-left transition-transform duration-200 ease-out hover:-translate-y-0.5"
      style={{
        boxShadow: activeRing,
        borderColor: active ? palette.accent : undefined,
      }}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-[18px] border border-[var(--glass-border)] bg-[var(--bg-soft)] p-1">
        <span className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: palette.accent }} />
        <span className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: palette.bg }} />
      </span>
      <span className="t-label text-[var(--text)]">{label}</span>
    </button>
  );
}

function BackgroundSwatch({ label, active, accent, onClick }: {
  label: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  const activeRing = active ? `0 0 0 1px ${accent}, 0 0 0 3px color-mix(in oklch, ${accent} 22%, transparent)` : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="glass-panel min-w-[9.5rem] rounded-[20px] border border-[var(--glass-border)] px-3 py-3 text-left transition-transform duration-200 ease-out hover:-translate-y-0.5"
      style={{
        boxShadow: activeRing,
        borderColor: active ? accent : undefined,
      }}
    >
      <span className="t-label text-[var(--text)]">{label}</span>
    </button>
  );
}

function PreviewBody({
  palette,
  backgroundKey,
}: {
  palette: ThemePalette;
  backgroundKey: string;
}) {
  const Background = (BACKGROUND_REGISTRY[backgroundKey]?.component ?? BACKGROUND_REGISTRY.loom.component) as BackgroundComponent;

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Background palette={palette} />
      </div>

      <div className="relative z-10 flex min-h-full flex-col gap-8 p-4 md:p-8 lg:p-10">
        <header className="site-header noise-surface glass-panel rounded-[32px] border border-[var(--glass-border)] px-4 py-4 shadow-none">
          <div className="site-header-inner flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--bg-elevated)]">
                <span className="t-label text-[var(--text)]">R</span>
              </div>
              <div>
                <div className="t-label text-[var(--text)]">RAPTILE STUDIO</div>
                <div className="t-ui text-[var(--text-muted)]">Theme lab preview</div>
              </div>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              {["Collection", "About", "Cart"].map((item) => (
                <span key={item} className="t-label text-[var(--text-muted)]">
                  {item}
                </span>
              ))}
            </nav>
          </div>
        </header>

        <section className="max-w-4xl space-y-4 pt-8 md:pt-14">
          <p className="t-label text-[var(--accent-strong)]">Preview surface</p>
          <h1 className="t-hero text-[var(--text)]">Polished to the brim.</h1>
          <p className="editorial-copy text-[var(--text-muted)]">
            240gsm. Double bio washed. Built for heat, motion, and repeat wear.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Heavyweight Tee", price: "₹2,999", tone: "var(--bg-elevated)" },
            { name: "Relaxed Crew", price: "₹3,499", tone: "color-mix(in oklch, var(--bg-elevated) 84%, var(--accent) 16%)" },
            { name: "Utility Layer", price: "₹3,899", tone: "color-mix(in oklch, var(--bg-elevated) 88%, var(--shader-warm) 12%)" },
          ].map((product) => (
            <article key={product.name} className="glass-panel rounded-[28px] p-4">
              <div
                className="mb-4 aspect-[4/5] rounded-[24px]"
                style={{
                  backgroundColor: product.tone,
                }}
              />
              <div className="space-y-1">
                <h2 className="t-product text-[var(--text)]">{product.name}</h2>
                <p className="t-price text-[var(--text-muted)]">{product.price}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary">
            <span className="t-label">Shop Collection</span>
          </button>
          <button type="button" className="ghost-button">
            <span className="t-label">Read the Story</span>
          </button>
        </section>

        <section className="max-w-2xl">
          <div className="glass-panel rounded-[28px] p-6">
            <p className="t-label mb-3 text-[var(--text-muted)]">Readability check</p>
            <p className="editorial-copy text-[var(--text-muted)]">
              The surface should stay calm, the type should stay exact, and the glass should hold together whether the
              palette is smoked dark or paper light.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ThemeLabPage() {
  const [activeTheme, setActiveTheme] = useState("ember");
  const [activeBg, setActiveBg] = useState("loom");
  const previewRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const activePalette = THEME_PALETTES[activeTheme] ?? EMBER_CURRENT;
  const currentThemeLabel = THEME_OPTIONS.find((theme) => theme.key === activeTheme)?.label ?? "Ember";
  const currentBackgroundLabel =
    BACKGROUND_OPTIONS.find((background) => background.key === activeBg)?.label ?? "Loom (Current)";

  const previewStyle = useMemo<CSSProperties & Record<string, string>>(
    () => ({
      backgroundColor: activePalette.bg,
      color: activePalette.text,
      "--bg": activePalette.bg,
      "--bg-soft": activePalette.bgSoft,
      "--bg-elevated": activePalette.bgElevated,
      "--text": activePalette.text,
      "--text-muted": activePalette.textMuted,
      "--text-subtle": activePalette.textSubtle,
      "--accent": activePalette.accent,
      "--accent-strong": activePalette.accentStrong,
      "--accent-glow": activePalette.accentGlow,
      "--accent-subtle": activePalette.accentSubtle,
      "--sold-out": activePalette.soldOut,
      "--glass-fill": activePalette.glassFill,
      "--glass-border": activePalette.glassBorder,
      "--glass-highlight": activePalette.glassHighlight,
      "--glass-tint-a": activePalette.glassTintWarm,
      "--glass-tint-b": activePalette.glassTintCool,
      "--shader-warm": activePalette.shaderWarm,
      "--shader-mid": activePalette.shaderMid,
      "--shader-deep": activePalette.shaderDeep,
      "--glass-shadow": activePalette.glassShadow,
      "--noise-header-opacity": isLightPalette(activePalette) ? "0.035" : "0.05",
      "--noise-surface-opacity": isLightPalette(activePalette) ? "0.035" : "0.05",
      colorScheme: isLightPalette(activePalette) ? "light" : "dark",
    }),
    [activePalette],
  );

  useEffect(() => {
    if (previewRef.current) {
      applyPaletteToElement(previewRef.current, activePalette);
    }
  }, [activePalette]);

  return (
    <div
      className="fixed inset-0 z-[200] flex h-[100dvh] flex-col overflow-hidden text-[var(--text)]"
      style={{ backgroundColor: EMBER_CURRENT.bg, color: EMBER_CURRENT.text }}
    >
      <aside className="sticky top-0 z-30 border-b border-[var(--glass-border)] bg-[var(--bg)]/95 md:fixed md:inset-y-0 md:left-0 md:w-[280px] md:border-b-0 md:border-r">
        <div className="noise-surface flex h-full flex-col gap-5 p-4 md:p-5">
          <div className="glass-panel rounded-[28px] p-4">
            <p className="t-label mb-2 text-[var(--text-muted)]">Theme selector</p>
            <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
              {THEME_OPTIONS.map(({ key, label, palette }) => (
                <ThemeSwatch
                  key={key}
                  palette={palette}
                  active={activeTheme === key}
                  label={label}
                  onClick={() => setActiveTheme(key)}
                />
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-4">
            <p className="t-label mb-2 text-[var(--text-muted)]">Background selector</p>
            <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
              {BACKGROUND_OPTIONS.map(({ key, label }) => (
                <BackgroundSwatch
                  key={key}
                  label={label}
                  active={activeBg === key}
                  accent={activePalette.accent}
                  onClick={() => setActiveBg(key)}
                />
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[24px] px-4 py-3">
            <p className="t-ui text-[var(--text-muted)]">Theme: {currentThemeLabel} × Background: {currentBackgroundLabel}</p>
          </div>
        </div>
      </aside>

      <main className="relative min-h-0 flex-1 md:pl-[280px]">
        <div className="h-full overflow-auto">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={`${activeTheme}-${activeBg}`}
              ref={previewRef}
              className="relative min-h-full"
              style={previewStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <PreviewBody palette={activePalette} backgroundKey={activeBg} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
