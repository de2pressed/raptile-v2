"use client";

import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  GridHelper,
  Mesh,
  Points,
  PointsMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";

import { useScrollVelocity } from "@/lib/hooks/useScrollVelocity";

const BG_HEX = "#160f0d";
const ACCENT_HEX = "#f49242";
const ACCENT_GLOW_HEX = "#ff7f2a";

interface TunnelSceneProps {
  mobile: boolean;
}

export function TunnelScene({ mobile }: TunnelSceneProps) {
  const tunnelRef = useRef<Mesh>(null);
  const gridRef = useRef<GridHelper>(null);
  const pointsRef = useRef<Points>(null);
  const dustPositionsRef = useRef<Float32Array | null>(null);
  const scrollVelocity = useScrollVelocity();
  const { invalidate } = useThree();

  const particleCount = mobile ? 300 : 800;

  const tunnelGeometry = useMemo(() => {
    const points = Array.from({ length: 16 }, (_, index) => {
      const depth = -index * 14;
      const offset = Math.sin(index * 0.65) * 1.8;
      const lift = Math.cos(index * 0.45) * 1.1;
      return new Vector3(offset, lift, depth);
    });

    const curve = new CatmullRomCurve3(points);
    return new TubeGeometry(curve, 260, 11, 12, false);
  }, []);

  const dustGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 60;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[index * 3 + 2] = -Math.random() * 120;
    }

    dustPositionsRef.current = positions;
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, [particleCount]);

  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) {
      return;
    }

    if (Array.isArray(grid.material)) {
      grid.material.forEach((material) => {
        material.transparent = true;
        material.opacity = 0.15;
      });
    } else {
      grid.material.transparent = true;
      grid.material.opacity = 0.15;
    }
  }, []);

  useEffect(() => {
    const pulse = () => invalidate();

    window.addEventListener("scroll", pulse, { passive: true });
    window.addEventListener("mousemove", pulse, { passive: true });
    window.addEventListener("touchmove", pulse, { passive: true });

    return () => {
      window.removeEventListener("scroll", pulse);
      window.removeEventListener("mousemove", pulse);
      window.removeEventListener("touchmove", pulse);
    };
  }, [invalidate]);

  useFrame((state) => {
    const drift = 0.008 + scrollVelocity * 0.15;

    if (tunnelRef.current) {
      tunnelRef.current.position.z += drift;

      if (tunnelRef.current.position.z > 12) {
        tunnelRef.current.position.z = 0;
      }
    }

    if (gridRef.current) {
      gridRef.current.position.z += drift * 5;

      if (gridRef.current.position.z > 12) {
        gridRef.current.position.z = -20;
      }
    }

    if (pointsRef.current && dustPositionsRef.current) {
      const positions = dustPositionsRef.current;
      const time = state.clock.elapsedTime;

      for (let index = 0; index < particleCount; index += 1) {
        const xIndex = index * 3;
        const yIndex = xIndex + 1;
        const zIndex = xIndex + 2;
        const wobble = Math.sin(time * 0.6 + index * 0.17) * 0.015;

        positions[xIndex] += wobble;
        positions[yIndex] += 0.015 + Math.cos(time * 0.7 + index * 0.11) * 0.01;
        positions[zIndex] += drift * 1.8;

        if (positions[yIndex] > 20) {
          positions[yIndex] = -20;
        }

        if (positions[zIndex] > 10) {
          positions[zIndex] = -120;
        }

        if (positions[xIndex] > 30) {
          positions[xIndex] = -30;
        } else if (positions[xIndex] < -30) {
          positions[xIndex] = 30;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    invalidate();
  });

  return (
    <>
      <color attach="background" args={[BG_HEX]} />
      <fogExp2 attach="fog" args={[BG_HEX, 0.012]} />
      <mesh ref={tunnelRef} geometry={tunnelGeometry} position={[0, 0, 0]}>
        <meshBasicMaterial color={new Color(ACCENT_GLOW_HEX)} wireframe transparent opacity={0.22} />
      </mesh>
      <gridHelper ref={gridRef} args={[200, 40, ACCENT_GLOW_HEX, ACCENT_GLOW_HEX]} position={[0, -8, -20]} />
      <points ref={pointsRef} geometry={dustGeometry}>
        <pointsMaterial
          color={new Color(ACCENT_HEX)}
          opacity={0.4}
          size={0.08}
          sizeAttenuation
          transparent
          depthWrite={false}
        />
      </points>
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={mobile ? 0.8 : 1.4} />
        <ChromaticAberration offset={new Vector2(0.0008, 0.0008)} />
        <Vignette darkness={0.6} offset={0.4} />
      </EffectComposer>
    </>
  );
}
