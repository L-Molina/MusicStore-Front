---
name: MusicStore Design System
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#f8f5f5'
  on-tertiary: '#303030'
  tertiary-container: '#dbd9d8'
  on-tertiary-container: '#5f5e5e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is built on the intersection of professional utility and high-energy digital culture. It targets a young, gear-focused audience that values precision and aesthetic clarity. The brand personality is efficient, technical, and vibrant.

The style leverages **Minimalism** with a **High-Contrast** edge. By stripping away decorative clutter and relying on a strict pure-black canvas, the system directs all focus toward the product and action. The aesthetic is "technical-chic"—evoking the feel of high-end studio equipment and modern digital audio workstations (DAWs). Large amounts of whitespace are used not just for breathing room, but as a structural tool to emphasize the utilitarian nature of the interface.

## Colors

The palette is engineered for maximum legibility and visual impact in a dark environment. 

- **Base:** A pure black (#000000) background provides the foundation for infinite depth and high contrast.
- **Secondary/Surface:** Deep grays are used to define containers and secondary regions without breaking the dark-mode immersion.
- **Accent:** A vibrant Electric Cyan (#00F0FF) is reserved strictly for primary call-to-actions, progress indicators, and active states. This "neon" hit provides the energy necessary to appeal to a younger demographic.
- **Text:** Pure white is used for primary headings, while a scaled gray-white is used for secondary body text to reduce eye strain.

## Typography

The typography system uses **Plus Jakarta Sans** to bridge the gap between technical precision and friendly approachability. Its rounded terminals soften the aggressive high-contrast color palette, making the store feel professional yet accessible.

- **Headlines:** Set with tight letter spacing and heavy weights to create a strong visual anchor.
- **Body:** Generous line heights are maintained to ensure long-form product descriptions remain readable against the black background.
- **Labels:** Small caps or bold weights are used for technical specifications and metadata, mimicking the labeling found on physical music hardware.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy to maintain a structured, editorial feel. A 12-column grid is centered on the viewport with a maximum width of 1280px.

- **Rhythm:** An 8px linear scale governs all spatial relationships. 
- **Margins:** Large outer margins (80px+) are encouraged on desktop to isolate content and reinforce the minimalist aesthetic.
- **Utilitarian Alignment:** Elements should align strictly to the grid edges. Padding within components is generous (typically 24px) to ensure touch targets are clear and the UI feels "un-cramped."

## Elevation & Depth

This design system avoids traditional shadows in favor of **Tonal Layering** and **Low-Contrast Outlines**.

- **Surface Tiers:** Depth is communicated by subtly lightening the background color. Level 0 is #000000; Level 1 (cards/inputs) is #1A1A1A; Level 2 (modals/popovers) is #2A2A2A.
- **Borders:** Subtle 1px solid borders using a dark gray (#333333) are used to define the boundaries of elements without adding visual weight.
- **Active State Elevation:** No shadows are used for hover states; instead, the accent color or a change in border-brightness communicates interactivity.

## Shapes

The shape language is consistently **Rounded**, echoing the geometry of the typeface.

- **Components:** Standard buttons, input fields, and product cards use a 0.5rem (8px) radius.
- **Large Containers:** Section containers or large banners may use the `rounded-lg` (16px) or `rounded-xl` (24px) tokens to create a softer, more modern silhouette.
- **Icons:** Icons should feature rounded caps and corners to remain cohesive with the overall design language.

## Components

### Buttons
Primary CTAs are high-impact: Solid Electric Cyan background with black text. Secondary buttons use a transparent background with a 1px gray border. Hover states for primary buttons involve a slight brightness increase; secondary buttons shift their border to white.

### Search Bar
A central utilitarian element. It should be full-width within its container, featuring a #1A1A1A background, a subtle border, and a minimalist magnifying glass icon. Placeholder text should be low-contrast gray.

### Navigation
The navigation is structured and persistent. It uses clear, high-contrast labels in the `label-md` style. Active links are indicated by a small Electric Cyan dot or underline, avoiding heavy background fills.

### Cards
Product cards use a #1A1A1A background with a 1px border. Imagery should be high-quality and fill the top half of the card. Text information (Title, Price, Category) is stacked vertically with clear typographic hierarchy.

### Chips/Tags
Used for genres or technical specs. These are small, dark gray pill-shaped containers with white text, providing a metadata-heavy "utilitarian" look without cluttering the UI.

### Inputs & Checkboxes
Inputs use the same styling as the search bar. Checkboxes and radio buttons, when selected, are filled with Electric Cyan to provide a sharp, unmistakable feedback loop.