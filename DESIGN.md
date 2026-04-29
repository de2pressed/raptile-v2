---
name: Raptile Studio
description: High-concept editorial storefront for an Indian streetwear label.
colors:
  charcoal-ink: "oklch(0.11 0.012 40)"
  warm-shadow: "oklch(0.145 0.015 38)"
  ash-lift: "oklch(0.18 0.016 40)"
  parchment: "oklch(0.92 0.012 78)"
  muted-silt: "oklch(0.68 0.018 72)"
  subtle-dust: "oklch(0.46 0.015 62)"
  amber-bronze: "oklch(0.69 0.085 48)"
  amber-bright: "oklch(0.75 0.08 50)"
  ember-glow: "oklch(0.64 0.09 46)"
  amber-haze: "oklch(0.69 0.085 48 / 0.12)"
  sold-out-oxide: "oklch(0.38 0.04 40)"
  glass-fill: "oklch(0.17 0.02 40 / 0.84)"
  glass-border: "oklch(0.92 0.012 80 / 0.1)"
  glass-highlight: "oklch(0.96 0.01 80 / 0.04)"
  glass-tint-warm: "oklch(0.3 0.025 42 / 0.18)"
  glass-tint-cool: "oklch(0.26 0.02 54 / 0.14)"
  shadow-ink: "oklch(0 0 0 / 0.16)"
typography:
  display:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontSize: "clamp(2rem, 8vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontSize: "clamp(1.6rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  product:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontSize: "clamp(0.95rem, 2vw, 1.4rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "0"
  body:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "0"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.65rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.15em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  price:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0"
rounded:
  sm: "18px"
  md: "24px"
  lg: "28px"
  xl: "30px"
  2xl: "32px"
  3xl: "34px"
  4xl: "38px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
  5xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.amber-bronze}"
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.parchment}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  chip:
    backgroundColor: "{colors.warm-shadow}"
    textColor: "{colors.muted-silt}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  glass-panel:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.lg}"
    padding: "24px"
  product-card:
    backgroundColor: "{colors.ash-lift}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.lg}"
    padding: "16px"
  nav-shell:
    backgroundColor: "{colors.warm-shadow}"
    textColor: "{colors.parchment}"
    height: "84px"
    padding: "16px"
  brand-logo:
    width: "216px"
    height: "72px"
    rounded: "{rounded.pill}"
    typography: "{typography.headline}"
---

# Design System: Raptile Studio

## 1. Overview

**Creative North Star: "Polished Disruption"**

Raptile Studio reads like a fashion label with a point of view, not a storefront trying to please everyone. The system is built to keep the cloth in front, with the interface acting as a precise frame around it. The page stack is layered, starting with `BackgroundStage`, then `AppProviders`, then `PageTransition`, then the routed content. The homepage is story-led, the collection page is commerce-led, and the about page is a slower editorial narrative, but they all share the same rule: the garment carries the emotion, the UI sharpens the read.

The visual tone is sharp, polished, and high-concept. Surfaces sit in deep warmth instead of flat black, accents stay deliberate, and motion should feel composed rather than playful. The system explicitly rejects generic AI-slop copy, glowing dashboard cards, loud streetwear neon, playful DTC pastels, and white-label Shopify templates.

**Key Characteristics:**
- Cloth first, interface second.
- Sharp surfaces, not flat black.
- One amber accent, used with intent.
- Scroll-led storytelling with controlled motion.
- Commerce surfaces stay legible, compact, and exact.
- The brand should read as specific and self-possessed, not generic or borrowed.

## 2. Colors

The palette is warm, low-chroma, and materially grounded. It should feel like charred walnut, brushed bronze, and softened parchment under low evening light.

### Primary
- **Amber Bronze** (`oklch(0.69 0.085 48)`): the primary call-to-action color, active states, and rare emphasis. It should read as metal under warm light, not neon.

### Neutral
- **Charcoal Ink** (`oklch(0.11 0.012 40)`): root background and the darkest canvas for the entire storefront.
- **Warm Shadow** (`oklch(0.145 0.015 38)`): sticky header, footer, and deep UI beds where a softer dark is needed.
- **Ash Lift** (`oklch(0.18 0.016 40)`): elevated panels, product image stages, and secondary surfaces.
- **Parchment** (`oklch(0.92 0.012 78)`): primary text and high-contrast copy.
- **Muted Silt** (`oklch(0.68 0.018 72)`): body copy, helper text, and metadata.
- **Subtle Dust** (`oklch(0.46 0.015 62)`): labels, dividers, and secondary annotations.
- **Sold-Out Oxide** (`oklch(0.38 0.04 40)`): the restrained status tone for unavailable product states.
- **Glass Fill** (`oklch(0.17 0.02 40 / 0.84)`): translucent panel fill on buttons, cards, and the navigation shell.
- **Glass Border** (`oklch(0.92 0.012 80 / 0.1)`): thin borders for all surfaces, never heavy or overdrawn.
- **Glass Highlight** (`oklch(0.96 0.01 80 / 0.04)`): inset highlight that gives the glass panels a controlled lift.
- **Warm Tint** (`oklch(0.3 0.025 42 / 0.18)`): warm upper sheen on layered UI surfaces.
- **Cool Tint** (`oklch(0.26 0.02 54 / 0.14)`): cooler lower sheen that keeps the dark palette from flattening.
- **Shadow Ink** (`oklch(0 0 0 / 0.16)`): ambient shadow tone for depth without hard contrast.

### Named Rules
**The One Accent Rule.** Amber is reserved for primary actions, active states, and the occasional editorial callout. If it starts appearing everywhere, the system has lost its focus.

**The Noise-On-UI Rule.** Texture belongs on panels, shells, and controls only. Product photography stays clean. Never let grain or overlay contaminate the garment image.

## 3. Typography

**Display Font:** Cabinet Grotesk, sans-serif  
**Body Font:** Cabinet Grotesk, sans-serif  
**Label / Mono Font:** JetBrains Mono, monospace

The pairing is compact and editorial. Cabinet Grotesk gives the storefront its confident, fashion-led presence, while JetBrains Mono handles the technical layer, prices, labels, and system metadata.

### Hierarchy
- **Display** (`800`, `clamp(2rem, 8vw, 7rem)`, `0.95`): used for hero headlines, story section titles, and the strongest brand statements.
- **Headline** (`700`, `clamp(1.6rem, 5vw, 4rem)`, `1.02`): used for section leads and dense editorial headings.
- **Product** (`500`, `clamp(0.95rem, 2vw, 1.4rem)`, `1.12`): used on product cards and supporting product copy where the title must stay compact.
- **Body** (`400`, `0.98rem`, `1.85`): used for descriptive paragraphs and support text. Keep it readable and spacious, not dense.
- **Label** (`700`, `0.65rem`, `0.15em`, uppercase): used for UI labels, badges, CTA captions, and system signals.
- **Mono** (`400`, `0.75rem`, `1.6`): used for helper lines, feature notes, and technical detail.
- **Price** (`400`, `0.9rem`, `1.2`): used for product pricing and commerce metadata.

### Named Rules
**The Mono Layer Is Functional Only.** Use JetBrains Mono for prices, labels, and technical states. It should never take over longform content or become decorative noise.

**The Headline Must Stay Slim.** Large type is about presence, not width. Keep display lines short enough to feel composed on desktop and mobile.

## 4. Elevation

This system uses a hybrid of tonal layering and very soft shadow, not dramatic depth. Most separation comes from warm surface shifts, borders, blur, and inset highlights. Shadows should feel ambient and structural, never heavy enough to overpower garment imagery.

### Shadow Vocabulary
- **Ambient Lift** (`0 18px 48px oklch(0 0 0 / 0.16)`): used for large panels such as the nav shell, hero frames, and glass cards.
- **Soft Lift** (`0 10px 24px oklch(0 0 0 / 0.16)`): used for smaller callouts and compact UI surfaces.
- **Inset Sheen** (`inset 0 1px 0 oklch(0.96 0.01 80 / 0.04)`): used to keep panels feeling polished without looking glossy.

### Named Rules
**The Flat By Default Rule.** Resting surfaces should read as layered planes, not floating widgets. Depth appears only when the component needs it.

**The Shadow Never Competes Rule.** If the shadow becomes noticeable before the garment does, it is too strong.

## 5. Components

### Buttons
Buttons are rounded pills with clear hierarchy. Primary buttons use amber fill, dark text, and a slight lift on hover. Ghost buttons use glass fill, muted text, and a thin border. Focus states rely on an amber halo rather than a loud outline. Keep the padding generous enough to feel tactile, but not so large that the button becomes a decorative block.

### Cards and Panels
Glass panels are the main container language for navigation, footers, info blocks, and support surfaces. They use a 28px to 34px corner radius, a thin border, blur, and the noise treatment on the panel itself. Product cards are simpler and tighter, with square imagery, a 28px frame, and compact metadata below. The collection grid should stay disciplined, with up to four cards across on large screens, never a sprawling wall of oversized tiles.

### Navigation and Logo
The header is intentionally taller than a generic ecommerce bar. `Nav` uses a sticky, full-width glass shell with predictive search on desktop, a mode-switching mobile header, and compact cart badges that stay informational rather than loud. The logo component resolves `/logo/logo.png` and falls back to a wordmark if the asset fails, so the brand remains legible even when the image is unavailable.

### Application Shell
The global shell is always present: `BackgroundStage` supplies atmosphere, `PageTransition` keeps route changes controlled, and `AppProviders` handles Shopify and time-accent context. This layer should feel like stagecraft, not decoration.

### Product Detail
The PDP is a split editorial layout: a large image stage, a thumbnail rail on desktop when needed, and a fixed-width information column that stays readable. The description must remain fully visible on desktop, without an internal scroll trap. The image stage should feel generous and centered, with object containment that respects the garment shape.

### Story Sections
The homepage and about page both rely on the scroll narrative pattern. One side stays pinned, the other side advances through steps that explain weight, wash, shape, and release rhythm. This is the main place to stage cloth facts like 240gsm and double bio washed, because the information should feel woven into the story, not dumped into a spec sheet. The story asset set and `ScrollNarrative` should always support the garment, never compete with it.

### Support Surfaces
Contact, shipping, returns, and size guide content should stay calm and utilitarian. Use the same glass language, but lower the visual temperature. `SupportPageFrame`, `ContactForm`, and `SizeChartTable` should all stay readable, sparse, and low-drama. The job is clarity, not performance.

## 6. Do's and Don'ts

### Do:
- **Do** keep product imagery dominant and let the UI stay dark, warm, and polished.
- **Do** keep the background stage, page transitions, and navigation shell composed so the shell supports the cloth.
- **Do** use `noise-surface` and `glass-panel` on controls, headers, footers, and story cards so texture lives on interface elements, not garments.
- **Do** keep the homepage sequence explicit: Onyx collection first, featured products second, fabric story third.
- **Do** keep the collection grid compact, with responsive columns that cap out at four across on large screens.
- **Do** preserve full product descriptions on desktop PDPs and keep the information column readable at a glance.
- **Do** use the logo PNG in the header and about page when available, with a clean fallback wordmark.
- **Do** keep body text tinted, never pure black or pure white.
- **Do** use motion for scroll pacing, state change, and transition polish, not for spectacle.

### Don't:
- **Don't** use generic SaaS gradients.
- **Don't** use glowing dashboard cards.
- **Don't** use loud streetwear neon.
- **Don't** use playful DTC pastels.
- **Don't** use white-label Shopify templates.
- **Don't** let the copy sound like AI slop or "just another clothing brand".
- **Don't** add decorative amber fill on secondary UI.
- **Don't** rely on hover gimmicks or icon-card grids.
- **Don't** let any interface treatment compete with product images.
- **Don't** place noise overlay on product images, on the homepage, on collection cards, or anywhere else the garments should read cleanly.
- **Don't** clamp the PDP description into a hidden scroll region on desktop.
- **Don't** let the header collapse into a thin strip that feels underweighted.
- **Don't** let product cards grow so large that four of them fill the entire laptop viewport.
