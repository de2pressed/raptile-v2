"use client";

import { useEffect, useState } from "react";

import { useRaptileStore } from "@/lib/store";
import { pad } from "@/lib/utils";

export function GhostUI() {
  const mouseX = useRaptileStore((state) => state.mouseX);
  const mouseY = useRaptileStore((state) => state.mouseY);
  const scrollY = useRaptileStore((state) => state.scrollY);
  const [clock, setClock] = useState(() =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date()),
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const updateClock = () => setClock(formatter.format(new Date()));
    const interval = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsVisible(!media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden md:block">
      <div className="t-label absolute left-4 top-4 opacity-40">SYS: RAPTILE-OS v2.6</div>
      <div className="t-label absolute right-4 top-4 opacity-40">{clock}</div>
      <div className="t-label absolute bottom-4 left-4 opacity-40">SCROLL: {pad(scrollY)}</div>
      <div className="t-label absolute bottom-4 right-4 opacity-40">
        {pad(mouseX)} / {pad(mouseY)}
      </div>
    </div>
  );
}
