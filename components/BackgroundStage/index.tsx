"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";

import GradientBreath from "./GradientBreath";
import NoiseVignette from "./NoiseVignette";
import OxidisedRelief from "./OxidisedRelief";

type BackgroundId = "gradient" | "noise" | "relief";

const STORAGE_KEY = "raptile_bg";

const OPTIONS: Array<{
  id: BackgroundId;
  label: string;
  Component: ComponentType;
}> = [
  { id: "gradient", label: "A Breath", Component: GradientBreath },
  { id: "noise", label: "B Grain", Component: NoiseVignette },
  { id: "relief", label: "C Relief", Component: OxidisedRelief },
];

function isBackgroundId(value: string | null): value is BackgroundId {
  return value === "gradient" || value === "noise" || value === "relief";
}

export default function BackgroundStage() {
  const [active, setActive] = useState<BackgroundId>("gradient");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (isBackgroundId(stored)) {
        setActive(stored);
      }
    } catch {
      // Local storage can be unavailable in restricted contexts. Default stays in place.
    }
  }, []);

  const handleSelect = (id: BackgroundId) => {
    setActive(id);

    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Ignore storage failures, the preview still switches live.
    }
  };

  const ActiveBackground = OPTIONS.find((option) => option.id === active)?.Component ?? GradientBreath;

  return (
    <>
      <div className="bg-stage" aria-hidden="true">
        <ActiveBackground />
      </div>

      <div className="bg-switcher" role="group" aria-label="Background preview switcher">
        <span className="bg-switcher__label">Preview</span>
        {OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            aria-pressed={active === id}
            className={`bg-switcher__btn ${active === id ? "is-active" : ""}`}
            onClick={() => handleSelect(id)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
