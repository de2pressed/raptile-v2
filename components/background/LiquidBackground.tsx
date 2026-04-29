"use client";

import { useEffect, useRef } from "react";

const GRID = 28;
const SPRING = 0.14;
const DAMPING = 0.985;
const AMBIENT_INTERVAL = 90;
const RESIZE_DEBOUNCE_MS = 150;
const INERTIA_THRESHOLD = 0.5;

const BASE_COLOR = [18, 14, 10] as const;
const AMBER_COLOR = [200, 130, 50] as const;

type GridState = {
  cols: number;
  rows: number;
  heights: Float32Array;
  velocities: Float32Array;
  source: Float32Array;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampByte(value: number) {
  return clamp(Math.round(value), 0, 255);
}

function createGrid(width: number, height: number): GridState {
  const cols = Math.ceil(width / GRID) + 2;
  const rows = Math.ceil(height / GRID) + 2;
  const size = cols * rows;

  return {
    cols,
    rows,
    heights: new Float32Array(size),
    velocities: new Float32Array(size),
    source: new Float32Array(size),
  };
}

function getIndex(cols: number, col: number, row: number) {
  return row * cols + col;
}

function sampleCell(grid: GridState, gridX: number, gridY: number) {
  const { cols, rows, heights } = grid;
  const maxCol = cols - 2;
  const maxRow = rows - 2;
  const cellX = clamp(Math.floor(gridX), 0, maxCol);
  const cellY = clamp(Math.floor(gridY), 0, maxRow);
  const nextX = cellX + 1;
  const nextY = cellY + 1;
  const tx = gridX - cellX;
  const ty = gridY - cellY;

  const topLeft = heights[getIndex(cols, cellX, cellY)];
  const topRight = heights[getIndex(cols, nextX, cellY)];
  const bottomLeft = heights[getIndex(cols, cellX, nextY)];
  const bottomRight = heights[getIndex(cols, nextX, nextY)];

  const top = topLeft + (topRight - topLeft) * tx;
  const bottom = bottomLeft + (bottomRight - bottomLeft) * tx;
  const height = top + (bottom - top) * ty;

  const gradientX = (topRight - topLeft) * (1 - ty) + (bottomRight - bottomLeft) * ty;
  const gradientY = (bottomLeft - topLeft) * (1 - tx) + (bottomRight - topRight) * tx;

  return { height, gradientX, gradientY };
}

function ripple(grid: GridState, cx: number, cy: number, strength: number) {
  const { cols, rows, velocities } = grid;
  const centerCol = Math.floor(cx / GRID) + 1;
  const centerRow = Math.floor(cy / GRID) + 1;

  for (let rowOffset = -3; rowOffset <= 3; rowOffset += 1) {
    for (let colOffset = -3; colOffset <= 3; colOffset += 1) {
      const row = centerRow + rowOffset;
      const col = centerCol + colOffset;

      if (row <= 0 || row >= rows - 1 || col <= 0 || col >= cols - 1) {
        continue;
      }

      const distance = Math.hypot(rowOffset, colOffset);
      const falloff = strength / (1 + distance * distance * 0.5);
      velocities[getIndex(cols, col, row)] += falloff;
    }
  }
}

function stepWave(grid: GridState) {
  const { cols, rows, heights, velocities, source } = grid;
  source.set(heights);

  for (let row = 1; row < rows - 1; row += 1) {
    const rowOffset = row * cols;
    for (let col = 1; col < cols - 1; col += 1) {
      const index = rowOffset + col;
      const average =
        (source[index - 1] + source[index + 1] + source[index - cols] + source[index + cols]) * 0.25;

      let velocity = velocities[index];
      velocity += (average - source[index]) * SPRING;
      velocity *= DAMPING;

      velocities[index] = velocity;
      heights[index] = source[index] + velocity;
    }
  }
}

function fillStaticFrame(
  context: CanvasRenderingContext2D,
  imageData: ImageData,
  width: number,
  height: number,
) {
  const { data } = imageData;

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    data[offset] = BASE_COLOR[0];
    data[offset + 1] = BASE_COLOR[1];
    data[offset + 2] = BASE_COLOR[2];
    data[offset + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);
}

export function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!context) {
      return;
    }

    const prefersReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let resizeTimer = 0;
    let animationFrame = 0;
    let viewportWidth = 1;
    let viewportHeight = 1;
    let pixelWidth = 1;
    let pixelHeight = 1;
    let devicePixelRatio = 1;
    let frame = 0;
    let lastScrollY = window.scrollY;
    let inertia = 0;
    let grid = createGrid(viewportWidth, viewportHeight);
    let imageData = context.createImageData(pixelWidth, pixelHeight);
    let prefersReducedMotion = prefersReducedMotionQuery.matches;

    const renderStatic = () => {
      fillStaticFrame(context, imageData, pixelWidth, pixelHeight);
    };

    const resizeCanvas = () => {
      viewportWidth = Math.max(1, Math.floor(window.innerWidth));
      viewportHeight = Math.max(1, Math.floor(window.innerHeight));
      devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
      pixelWidth = Math.max(1, Math.floor(viewportWidth * devicePixelRatio));
      pixelHeight = Math.max(1, Math.floor(viewportHeight * devicePixelRatio));

      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.backgroundColor = "var(--charcoal-ink)";

      grid = createGrid(viewportWidth, viewportHeight);
      imageData = context.createImageData(pixelWidth, pixelHeight);

      if (prefersReducedMotion) {
        renderStatic();
      }
    };

    const renderSurface = () => {
      const { data } = imageData;
      const inverseDpr = 1 / devicePixelRatio;
      const gridScale = 1 / GRID;

      for (let py = 0; py < pixelHeight; py += 1) {
        const cssY = py * inverseDpr;
        const gridY = cssY * gridScale + 1;

        for (let px = 0; px < pixelWidth; px += 1) {
          const cssX = px * inverseDpr;
          const gridX = cssX * gridScale + 1;
          const { height, gradientX, gradientY } = sampleCell(grid, gridX, gridY);
          const spec = Math.max(0, height * 0.6 + gradientX * 0.4 - gradientY * 0.2);
          const shine = Math.pow(spec, 2.2);
          const offset = (py * pixelWidth + px) * 4;

          data[offset] = clampByte(BASE_COLOR[0] + shine * AMBER_COLOR[0] * 0.9);
          data[offset + 1] = clampByte(BASE_COLOR[1] + shine * AMBER_COLOR[1] * 0.5);
          data[offset + 2] = clampByte(BASE_COLOR[2] + shine * AMBER_COLOR[2] * 0.18);
          data[offset + 3] = 255;
        }
      }

      context.putImageData(imageData, 0, 0);
    };

    const injectScrollRipple = () => {
      const x = viewportWidth * (0.3 + Math.random() * 0.4);
      const y = viewportHeight * (0.3 + Math.random() * 0.4);
      ripple(grid, x, y, inertia * 0.25);
    };

    const injectAmbientRipple = () => {
      const x = viewportWidth * (0.12 + Math.random() * 0.76);
      const y = viewportHeight * (0.12 + Math.random() * 0.76);
      ripple(grid, x, y, 0.6 + Math.random() * 0.4);
    };

    const loop = () => {
      const currentScrollY = window.scrollY;
      const scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      inertia += (scrollVelocity - inertia) * 0.08;

      if (Math.abs(inertia) > INERTIA_THRESHOLD) {
        injectScrollRipple();
      }

      if (frame % AMBIENT_INTERVAL === 0) {
        injectAmbientRipple();
      }

      stepWave(grid);
      renderSurface();

      frame += 1;
      animationFrame = window.requestAnimationFrame(loop);
    };

    const stopAnimation = () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const startAnimation = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(loop);
      }
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeCanvas();
      }, RESIZE_DEBOUNCE_MS);
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      stopAnimation();
      resizeCanvas();

      if (!prefersReducedMotion) {
        inertia = 0;
        lastScrollY = window.scrollY;
        frame = 0;
        startAnimation();
      }
    };

    resizeCanvas();

    if (prefersReducedMotion) {
      renderStatic();
    } else {
      startAnimation();
    }

    window.addEventListener("resize", handleResize, { passive: true });
    prefersReducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      stopAnimation();
      window.removeEventListener("resize", handleResize);
      prefersReducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 block" />;
}
