---
name: Project X
colors:
  surface: '#0f131b'
  surface-dim: '#0f131b'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a32'
  surface-container-highest: '#31353d'
  on-surface: '#dfe2ed'
  on-surface-variant: '#c3c6d4'
  inverse-surface: '#dfe2ed'
  inverse-on-surface: '#2c3039'
  outline: '#8d909d'
  outline-variant: '#434752'
  surface-tint: '#aec6ff'
  primary: '#aec6ff'
  on-primary: '#002e6b'
  primary-container: '#628fea'
  on-primary-container: '#00275e'
  inverse-primary: '#295bb3'
  secondary: '#85da76'
  on-secondary: '#003a02'
  secondary-container: '#005e06'
  on-secondary-container: '#82d672'
  tertiary: '#ffb86a'
  on-tertiary: '#492900'
  tertiary-container: '#ca801f'
  on-tertiary-container: '#3f2300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#004397'
  secondary-fixed: '#a0f78f'
  secondary-fixed-dim: '#85da76'
  on-secondary-fixed: '#002201'
  on-secondary-fixed-variant: '#005305'
  tertiary-fixed: '#ffdcbc'
  tertiary-fixed-dim: '#ffb86a'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#683d00'
  background: '#0f131b'
  on-background: '#dfe2ed'
  surface-variant: '#31353d'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  mono-code:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1200px
---

## Brand & Style
The design system is built on a foundation of precision, clarity, and technical sophistication. It is tailored for developers who value speed and focus, avoiding visual noise in favor of a high-utility environment. 

The aesthetic is **Modern Minimalist**, drawing inspiration from elite developer tooling. It utilizes a dark charcoal base to reduce eye strain during long sessions, emphasizing a "functional luxury" feel. Depth is achieved through strategic layering of grayscale tones rather than shadows or effects. The emotional response should be one of calm, professional reliability and extreme efficiency.

## Colors
The palette is deeply rooted in a dark-mode-first philosophy. The background uses a rich charcoal (#0F1117) to provide a canvas for the UI.

- **Primary (Accent Blue):** Used for primary actions, focus states, and active indicators.
- **Secondary (Soft Green):** Reserved for success states, deployment indicators, and "Up" status.
- **Surface Tiers:** Use the Card Surface (#181C24) for high-level containers and the Border color (#2A2F3A) for structural definition.
- **Functional Grays:** Use a scale of muted grays for secondary and tertiary text to maintain a sophisticated, low-contrast hierarchy in the background, while keeping critical information high-contrast (White/Off-white).

## Typography
The system uses **Inter** for all primary UI elements to ensure maximum legibility and a modern, neutral feel. **Geist** is introduced as a secondary mono/label font for technical data, code snippets, and metadata tags to reinforce the developer-centric nature of the platform.

To achieve the "sophisticated feel," we prioritize Medium (500) and Regular (400) weights. Bold weights should be used sparingly, reserved only for critical alerts. Headlines utilize a tighter letter-spacing to appear more compact and professional.

## Layout & Spacing
The design system operates on a rigorous 4px/8px baseline grid. The core "rhythm" is set to 24px (3 units), which defines the standard gutter between cards and sections.

- **Desktop:** 12-column fluid grid with 24px gutters.
- **Tablet:** 8-column fluid grid with 24px gutters.
- **Mobile:** 4-column fluid grid with 16px gutters and 16px side margins.

Consistent internal padding for cards should follow the 24px rule to create a sense of breathability and order.

## Elevation & Depth
This design system avoids traditional shadows. Instead, it utilizes **Tonal Layering** and **Structural Outlines** to communicate hierarchy:

1.  **Level 0 (Base):** #0F1117 (Background).
2.  **Level 1 (Surface):** #181C24 (Cards/Sections) with a 1px solid border of #2A2F3A.
3.  **Level 2 (Overlays):** #1C212B (Modals/Popovers) with a slightly lighter border (#3A4150) to create separation.

Interactive elements (hover states) should increase the border brightness rather than adding a shadow.

## Shapes
The shape language is structured and architectural. A standard radius of **14px** is applied to primary cards and containers, providing a modern but disciplined look. Smaller components like buttons and inputs use a **8px** radius to maintain visual harmony without appearing too "bubbly."

## Components

### Buttons
- **Primary:** Solid #4A78D1 with White text. 8px radius. No gradients.
- **Secondary:** Transparent background with #2A2F3A border. On hover, background shifts to #1C212B.
- **Ghost:** No border or background. Only text/icon. Used for low-priority actions.

### Inputs & Form Fields
- Background: #0F1117 (Inset feel).
- Border: #2A2F3A.
- Focus: 1px solid #4A78D1 with no outer glow.
- Typography: body-sm.

### Cards
- Background: #181C24.
- Border: 1px solid #2A2F3A.
- Padding: 24px.
- Radius: 14px.

### Chips/Badges
- Small, uppercase labels using `label-sm`.
- Subtle background tints (e.g., Soft Green at 10% opacity for success badges).

### Icons
- Use **Lucide** or **Feather** icons.
- Stroke width: 1.5px to 2px for a light, technical appearance.
- Color: Inherit from text color or use a muted gray (#888D96) for non-interactive icons.