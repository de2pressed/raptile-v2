---
name: Raptile Studio
description: Black editorial storefront for an Indian streetwear label.
colors:
  stage-black: "oklch(0.11 0.004 255)"
  panel-black: "oklch(0.145 0.005 255)"
  graphite-plane: "oklch(0.19 0.006 255)"
  chalk: "oklch(0.93 0.008 90)"
  smoke: "oklch(0.72 0.01 255)"
  steel: "oklch(0.52 0.008 255)"
  frost: "oklch(0.86 0.01 250)"
  focus-ice: "oklch(0.78 0.022 235)"
  dim-oxide: "oklch(0.42 0.015 30)"
  glass-fill: "oklch(0.17 0.006 255 / 0.72)"
  glass-border: "oklch(0.94 0.008 250 / 0.14)"
  glass-highlight: "oklch(0.98 0.004 90 / 0.05)"
  glass-haze-top: "oklch(0.34 0.01 250 / 0.16)"
  glass-haze-bottom: "oklch(0.24 0.008 255 / 0.1)"
  shadow-depth: "oklch(0 0 0 / 0.3)"
typography:
  display:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontSize: "clamp(2.2rem, 7vw, 6.4rem)"
    fontWeight: 700
    lineHeight: 0.93
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontSize: "clamp(1.5rem, 4.2vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  product:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontSize: "clamp(1rem, 1.8vw, 1.22rem)"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.78
    letterSpacing: "0"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.66rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
  price:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.84rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0"
rounded:
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "28px"
  3xl: "32px"
  4xl: "36px"
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
  6xl: "128px"
components:
  button-primary:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.stage-black}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 18px"
  panel-plain:
    backgroundColor: "{colors.panel-black}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.lg}"
    padding: "24px"
  glass-panel:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.xl}"
    padding: "24px"
  product-card:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    rounded: "{rounded.lg}"
    padding: "0"
  nav-shell:
    backgroundColor: "{colors.stage-black}"
    textColor: "{colors.chalk}"
    height: "72px"
    padding: "16px 20px"
  brand-logo:
    width: "188px"
    height: "56px"
    rounded: "{rounded.sm}"
    typography: "{typography.headline}"
---

# Design System: Raptile Studio

## 1. Overview

**Creative North Star: "Noir Precision"**

Raptile Studio should move away from smoked-warm disruption and into a colder, darker editorial frame. The site reads like a fashion spread on a black field: fewer containers, wider negative space, sharper type, and product imagery carrying the emotional charge.

The shell stays almost silent. Most structure comes from spacing, alignment, and thin tone shifts between `stage-black`, `panel-black`, and `graphite-plane`. Plain panels are the baseline. Glass is reserved for the header, drawers, search, or any surface that truly benefits from layered separation.

Commerce stays obvious, but it should feel integrated into the editorial rhythm rather than bolted on as promo UI. The visual system explicitly rejects warm metallic accents, generic glow, overused blur, and merchandising clutter.

**Key Characteristics:**
- Near-black canvas with pale type.
- Plain planes first, glass second.
- Monochrome system with one cold focus note.
- Large image fields and narrow copy measures.
- Sparse motion and deliberate pacing.
- Commerce clarity without promo noise.

## 2. Colors

The palette is restrained and nearly monochrome. It should feel like black studio paper, graphite, frosted acrylic, and a trace of cold light.

### Primary
- **Chalk** (`oklch(0.93 0.008 90)`): the default high-contrast action fill, inverse button state, and strongest text color against the black field.
- **Focus Ice** (`oklch(0.78 0.022 235)`): a rare active-state and focus tone used for rings, selected states, and subtle link emphasis. Keep it under 10% of the interface.

### Neutral
- **Stage Black** (`oklch(0.11 0.004 255)`): root background and the dominant canvas for the storefront.
- **Panel Black** (`oklch(0.145 0.005 255)`): the default matte surface for content blocks, forms, and quiet framed zones.
- **Graphite Plane** (`oklch(0.19 0.006 255)`): lifted image stages, media beds, and the occasional secondary surface.
- **Chalk** (`oklch(0.93 0.008 90)`): primary text, key separators, and high-contrast UI.
- **Smoke** (`oklch(0.72 0.01 255)`): body copy, support copy, and secondary metadata.
- **Steel** (`oklch(0.52 0.008 255)`): labels, secondary dividers, and low-priority annotations.
- **Frost** (`oklch(0.86 0.01 250)`): hairlines, subtle edges, and lifted outlines on black surfaces.
- **Dim Oxide** (`oklch(0.42 0.015 30)`): restrained unavailable or low-energy state treatment.
- **Glass Fill** (`oklch(0.17 0.006 255 / 0.72)`): translucent shell fill used sparingly on header, search, or utility layers.
- **Glass Border** (`oklch(0.94 0.008 250 / 0.14)`): one-pixel glass outline for layered surfaces.
- **Glass Highlight** (`oklch(0.98 0.004 90 / 0.05)`): a soft inset lift that prevents glass from turning muddy.
- **Glass Haze Top** (`oklch(0.34 0.01 250 / 0.16)`): upper tint for restrained glass depth.
- **Glass Haze Bottom** (`oklch(0.24 0.008 255 / 0.1)`): lower tint that keeps transparent surfaces grounded.
- **Shadow Depth** (`oklch(0 0 0 / 0.3)`): deep structural shadow, used minimally.

### Named Rules
**The Black Is the Field Rule.** The background should read as one continuous stage, not a patchwork of competing dark tones.

**The Plain Before Glass Rule.** If a matte plane solves the hierarchy, do not blur it.

**The No Decorative Texture Rule.** Grain, haze, or noise should stay microscopic and atmospheric. Never place visible texture on garment imagery.

## 3. Typography

**Display Font:** Cabinet Grotesk, sans-serif  
**Body Font:** Cabinet Grotesk, sans-serif  
**Label / Mono Font:** JetBrains Mono, monospace

The pairing stays compact and controlled. Cabinet Grotesk gives the store its editorial authority through proportion and spacing rather than exaggerated flair. JetBrains Mono handles the technical layer quietly: prices, labels, inventory states, and utility copy.

### Hierarchy
- **Display** (`700`, `clamp(2.2rem, 7vw, 6.4rem)`, `0.93`): hero headlines, section leads, and the strongest brand lines.
- **Headline** (`600`, `clamp(1.5rem, 4.2vw, 3.5rem)`, `1`): editorial headings, collection intros, and focused content breaks.
- **Product** (`500`, `clamp(1rem, 1.8vw, 1.22rem)`, `1.16`): product names and compact commerce copy.
- **Body** (`400`, `0.98rem`, `1.78`): supporting paragraphs and service information. Keep it airy and narrow.
- **Label** (`700`, `0.66rem`, `0.14em`, uppercase): navigation links, CTAs, badges, and UI states.
- **Mono** (`400`, `0.78rem`, `1.55`): technical helper text, metadata, and compact supporting notes.
- **Price** (`400`, `0.84rem`, `1.2`): price and tight commerce metadata.

### Named Rules
**The Column Stays Narrow Rule.** Editorial paragraphs should usually sit between 36ch and 44ch.

**The Mono Layer Whispers Rule.** Use mono for utility and evidence, never for decorative personality.

## 4. Elevation

This system is flatter than the previous direction. Separation comes from tone, line, and spacing first. Blur and shadow only appear when a live shell has to sit over imagery or motion.

### Shadow Vocabulary
- **Matte Edge** (`inset 0 1px 0 oklch(0.94 0.008 250 / 0.06)`): a quiet internal edge for plain black surfaces.
- **Glass Float** (`0 18px 44px oklch(0 0 0 / 0.3)`): reserved lift for glass shells and elevated utilities.
- **Focus Halo** (`0 0 0 2px oklch(0.78 0.022 235 / 0.18)`): keyboard focus and selected state treatment.

### Named Rules
**The Matte By Default Rule.** Most surfaces should feel printed or machined, not floating.

**The Blur Must Justify Itself Rule.** Blur is only allowed when content visibly moves behind the surface and the separation materially helps.

## 5. Components

### Buttons
Primary buttons should be chalk-filled rectangles with modest radii, dark text, and no ornamental shadow. Secondary buttons are outline or transparent on plain sections, and glass only when placed over imagery or moving backgrounds. Hover effects are minimal: one step brighter or darker, one-pixel lift at most.

### Panels
Use two panel types. `panel-plain` is the default for content sections, product info, support pages, and editorial captions. `glass-panel` is reserved for the navigation shell, compact utilities, and occasional overlay surfaces. Never stack multiple glass cards inside each other. If a page can work with type and spacing alone, remove the panel.

### Product Cards
Product cards should almost disappear. Prefer a framed image stage, generous negative space, and two or three lines of metadata over fully boxed merchandise tiles. The image can sit on `graphite-plane` or the black field, and the metadata sits beneath with clear price and availability.

### Navigation and Logo
The header is slimmer and quieter than the current warm-shell direction. It can live as a plain black band or a restrained glass shell when it overlays photography. Links stay small, uppercase, and quiet. The logo should read crisp and compact, never oversized.

### Application Shell
The shell should feel architectural, not atmospheric. Background treatments stay nearly solid black, transitions are mostly fades or short cross-dissolves, and any persistent stage effect should be subtle enough to disappear behind product images and copy.

### Product Detail
The PDP should read like a gallery wall paired with an information column. The media stage gets scale and breathing room, and the purchase column stays calm, aligned, and direct. Use a plain panel around copy or controls only when the raw black field stops being legible.

### Story Sections
Storytelling stays editorial but more distilled. Use fewer pinned modules, fewer frames, and longer uninterrupted black runs between sections. Copy blocks should feel like captions in a spread, not marketing cards explaining every thought.

### Support Surfaces
Shipping, returns, size guide, privacy, and contact pages should be stripped back to plain panels, hairlines, and readable form fields. If glass appears here, it should be soft and functional, never decorative.

## 6. Do's and Don'ts

### Do:
- **Do** keep the site predominantly black, with just enough tone separation to guide the eye.
- **Do** let product imagery, silhouette, and spacing carry most of the emotion.
- **Do** use `panel-plain` as the default structure and reserve `glass-panel` for shell or utility layers.
- **Do** keep copy blocks narrow, headlines short, and CTAs obvious through contrast.
- **Do** make support and commerce surfaces feel edited, not promotional.
- **Do** keep motion quiet and quick enough to disappear.
- **Do** use the cold focus tone only for focus, active state, or rare emphasis.

### Don't:
- **Don't** warm the palette with amber, bronze, or brown luxury cues.
- **Don't** turn every section into a rounded card.
- **Don't** stack glass on glass or use blur as a default styling shortcut.
- **Don't** use glowing highlights, visible grain, or cinematic haze on product imagery.
- **Don't** fill the homepage with badges, metrics, icon grids, or promo strips.
- **Don't** let editorial minimalism become sterile emptiness, the product and copy still need tension.
- **Don't** hide critical commerce actions behind hover-only or gesture-dependent affordances.
- **Don't** let the shell become louder than the garment.
