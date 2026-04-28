# Raptile Studio Prompt 3 Handoff

Date: 2026-04-28

This document summarizes the state of the repo after applying the Raptile Studio iteration prompt and the later maintenance changes that are now present in the working tree.

## Prompt 3 Changes Already Implemented

These are the product and UI changes that came from the prompt itself and are already reflected in the app:

- `components/background/ShaderBackground.tsx` was rewritten into an autonomous WebGL backdrop. Mouse parallax was removed, the shader now animates on its own, and mobile renders at a reduced internal resolution with CSS upscaling.
- `app/globals.css` was rethemed to a restrained warm-dark palette. Amber is now reserved for interactive emphasis, while the rest of the UI stays near-neutral and image-led.
- `components/ui/NoiseOverlay.tsx` now uses a PNG texture approach instead of the earlier SVG/filter path. `scripts/generateNoise.js` and `public/noise.png` support that implementation.
- The shell and commerce surfaces were updated to match the new direction: the nav is restored globally, the footer is full-width, the cart is a dedicated page, the cart drawer is a temporary confirmation surface, and the PDP/homepage were reworked around the editorial bento layout.
- Shopify-facing utilities were added or updated for image sizing, collection handling, product option handling, and notification flow.
- Obsolete UI pieces such as the old route transition and status bar were removed.

## Current Repo State

The repo is currently in a mixed state: the prompt-driven storefront work is present, and the working tree also contains a separate set of maintenance/config changes that are not part of the prompt.

Tracked changes currently in the tree:

- `.gitignore` now ignores `.vercel` and `.env*.local`.
- `package.json` now declares a Node engine floor of `>=18 <24`.
- `eslint.config.mjs` has been added as a flat ESLint config.
- `.nvmrc` has been added with Node `22`.
- `lib/env.ts` has been added to centralize environment reads and quote trimming.
- `app/api/contact/route.ts`, `app/api/notify/route.ts`, `app/api/revalidate/route.ts`, `lib/public-config.ts`, `lib/shopify.ts`, and `lib/storefront-config.ts` now read env values through `lib/env.ts` instead of directly touching `process.env` in those modules.

Local artifacts currently present in the workspace:

- `.build.out.log` and `.build.err.log` are dirty from local build attempts.
- `.impeccable-live.json` is present from the live helper bootstrap.
- `.next/`, `.vercel/`, `node_modules/`, and other generated folders are present locally as expected.

## Live / Runtime Status

- `impeccable live` is booted and the helper is active on `http://localhost:8400`.
- The app is responding at `http://localhost:3111`.
- A spare turbopack dev server was also started on `http://localhost:3112` during debugging.
- `PRODUCT.md` exists at the repo root.
- `DESIGN.md` is still absent.

## Notes For The Next Reader

- The prompt work is already in the app, so the remaining diffs are mostly environment hardening and repo hygiene.
- The shader crash that originally appeared in the browser was reduced to a non-fatal fallback path, so the page no longer hard-fails if WebGL compilation fails on a machine.
- If the goal is to clean the tree, the next likely step is to decide whether the config and env helper changes should be kept or folded back into a single commit with the prompt changes.
