---
name: FinAI Narrative Light
colors:
  surface: '#f8fafb'
  surface-dim: '#d8dadb'
  surface-bright: '#f8fafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f5'
  surface-container: '#eceeef'
  surface-container-high: '#e6e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3c4a44'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#eff1f2'
  outline: '#6c7a74'
  outline-variant: '#bbcac2'
  surface-tint: '#006c53'
  primary: '#006c53'
  on-primary: '#ffffff'
  primary-container: '#27c9a0'
  on-primary-container: '#004f3c'
  inverse-primary: '#47deb3'
  secondary: '#4b626b'
  on-secondary: '#ffffff'
  secondary-container: '#cde7f1'
  on-secondary-container: '#516871'
  tertiary: '#984722'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff986c'
  on-tertiary-container: '#772e0a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6afbcf'
  primary-fixed-dim: '#47deb3'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#00513e'
  secondary-fixed: '#cde7f1'
  secondary-fixed-dim: '#b2cad5'
  on-secondary-fixed: '#051e26'
  on-secondary-fixed-variant: '#334a53'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb597'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#79300c'
  background: '#f8fafb'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  sidebar-width: 280px
  max-content-width: 800px
---

## Brand & Style

This design system is built for a fintech-focused AI assistant, prioritizing clarity, trust, and rapid information retrieval. The personality is authoritative yet helpful, stripping away visual noise to focus on financial data.

The design style is **Corporate / Modern** with subtle **Minimalist** influences. It utilizes a sophisticated light mode palette that maintains professional gravity while feeling fresh and accessible. High-legibility typography and precise spacing ensure that complex mutual fund data remains readable across all devices. The visual mood is calm and systematic, using the signature brand teal as a functional beacon for action and focus.

## Colors

The light theme palette is anchored by a **clean white background** (`#FFFFFF`) to maximize contrast and reduce cognitive load. 

- **Primary Teal:** Reserved for key actions (buttons, icons, active states). This maintains brand recognition from the original dark UI.
- **Secondary Navy:** Used for high-level branding elements and primary headings to provide a sense of stability.
- **Neutrals:** Soft greys (`#E2E8F0`) are used for borders and subtle container separation, while a deep slate is used for text to ensure WCAG AA accessibility standards are met.
- **Surface Tints:** Extremely light grey-blues (`#F8FAFB`) are used for sidebar backgrounds and secondary card surfaces to create depth without relying on heavy shadows.

## Typography

This design system uses **Hanken Grotesk** for headlines to provide a sharp, contemporary fintech feel. **Inter** is utilized for all body copy and UI labels due to its exceptional legibility in data-dense environments.

For mobile displays, `headline-lg` scales down to 20px. All line heights are optimized for a 4px baseline grid. Links within chat messages should be underlined and use the Primary Teal color to ensure they are clearly interactive.

## Layout & Spacing

The layout follows a **Fixed Sidebar + Fluid Content** model. 
- **Sidebar:** Fixed at 280px, utilizing a subtle surface tint to separate it from the main chat area.
- **Main Chat:** Content is centered with a maximum width of 800px to maintain comfortable reading lengths for long AI responses.
- **Gutter & Margins:** A standard 24px (`space-lg`) margin is applied to the main container. Internal chat bubbles use 16px (`space-md`) of padding.
- **Breakpoints:** On mobile (below 768px), the sidebar collapses into a drawer menu and the main content area expands to fill 100% of the viewport width with 16px side margins.

## Elevation & Depth

In this light theme, depth is primarily conveyed through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Background):** Pure white `#FFFFFF`.
- **Level 1 (Secondary Surfaces):** Sidebar and secondary buttons use `#F8FAFB`.
- **Level 2 (Chat Bubbles/Cards):** AI responses are housed in containers with a 1px border of `#E2E8F0`. User messages can use a very light tint of the primary color or a soft grey to distinguish them.
- **Interactive States:** Only the primary "New Chat" button and the active input field use a subtle, highly-diffused ambient shadow (4px blur, 5% opacity) to indicate focus.

## Shapes

The design system employs a **Rounded** shape language to soften the industrial feel of financial data. 
- **Standard UI Elements:** Buttons, input fields, and chat bubbles use a 0.5rem (8px) corner radius.
- **Large Containers:** Cards and major modal components use 1rem (16px) for a more pronounced, friendly appearance.
- **Icons:** Always enclosed in circular or highly rounded containers to maintain the "assistant" persona.

## Components

### Buttons
- **Primary:** Solid Teal background with white text. High contrast, 8px radius.
- **Secondary:** Transparent background with Teal border and text.
- **Ghost:** No border, Navy text, appears only on hover with a light grey background.

### Chat Bubbles
- **User:** Right-aligned, light grey background (`#F1F5F9`) with dark slate text.
- **Assistant:** Left-aligned, white background, 1px border (`#E2E8F0`). Features a small teal bot icon to the left.

### Input Fields
- **Search/Chat Box:** 1px border `#E2E8F0`. On focus, the border transitions to Teal with a subtle outer glow. Text placeholder is `#94A3B8`.

### Chips & Tags
- Used for "Chat History" or "Quick Replies." Small, 4px radius, using `label-sm` typography and a light grey background.

### Disclaimers
- Housed in a "Pill-shaped" container with a soft red or amber tint and monospaced font for a "system-level" warning feel.