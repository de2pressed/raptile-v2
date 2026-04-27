"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

import { TunnelScene } from "@/components/tunnel/TunnelScene";

export function TunnelCanvas() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 250 }}
        dpr={mobile ? [1, 1] : [1, 1.5]}
        frameloop="demand"
        gl={{ antialias: true, alpha: true }}
      >
        <TunnelScene mobile={mobile} />
      </Canvas>
    </div>
  );
}
