---
name: Lumina Finance Desktop
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#bacac1'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#85948c'
  outline-variant: '#3c4a43'
  surface-tint: '#2fe0aa'
  primary: '#44edb7'
  on-primary: '#003828'
  primary-container: '#00d09c'
  on-primary-container: '#00533c'
  inverse-primary: '#006c4f'
  secondary: '#c5c5d5'
  on-secondary: '#2e303c'
  secondary-container: '#444653'
  on-secondary-container: '#b3b4c3'
  tertiary: '#cfd2e5'
  on-tertiary: '#2c303e'
  tertiary-container: '#b3b6c9'
  on-tertiary-container: '#434757'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#59fdc5'
  primary-fixed-dim: '#2fe0aa'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#e1e1f1'
  secondary-fixed-dim: '#c5c5d5'
  on-secondary-fixed: '#191b26'
  on-secondary-fixed-variant: '#444653'
  tertiary-fixed: '#dfe1f5'
  tertiary-fixed-dim: '#c3c6d8'
  on-tertiary-fixed: '#171b29'
  on-tertiary-fixed-variant: '#424656'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1440px
  gutter: 24px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system for this desktop application is defined by a "Lumina" aesthetic—a premium, high-tech financial environment that feels both sophisticated and cutting-edge. It targets professional users and high-net-worth individuals who require a clear, expansive view of their financial data.

The style is rooted in **Glassmorphism** and **Minimalism**. It uses deep, monochromatic backgrounds contrasted with vibrant, glowing accents to create a sense of depth and focus. The interface should evoke feelings of security, precision, and futuristic intelligence. Visual interest is maintained through subtle background blurs, tiered translucency, and razor-sharp typography.

## Colors
The palette is dominated by a rich, obsidian-toned dark mode.

- **Primary (#00D09C):** A vibrant teal used for high-signal actions, success states, and primary brand flourishes. It should be used sparingly as a "glow" source.
- **Secondary (#12141F):** The foundational canvas color. A deep, desaturated navy that provides better contrast for glass effects than pure black.
- **Tertiary (#1E2230):** Used for elevated surface containers and card backgrounds to establish hierarchy.
- **Neutral (#94A3B8):** A slate grey used for secondary text and non-interactive iconography.

**Functional Accents:**
- **Warning:** #FBBF24 (Amber)
- **Error:** #FF4B4B (Crimson)
- **Info:** #38BDF8 (Sky Blue)

## Typography
The typography utilizes **Outfit** across all levels to leverage its geometric clarity and modern, tech-forward feel. 

For the desktop environment, the type scale is expanded. **Display** sizes are reserved for dashboard overviews and hero financial figures. **Headline** levels organize complex data views. **Body** text remains highly legible against dark backgrounds by maintaining a slightly increased line-height. **Labels** use all-caps and increased letter spacing when used for metadata or table headers to ensure distinction from body content.

## Layout & Spacing
This design system employs a **12-column fixed-width grid** (centered) for main dashboard content, transitioning to a fluid layout for sidebar-heavy administrative views.

- **Desktop (1440px+):** 12 columns, 24px gutters, 48px side margins.
- **Laptop (1024px - 1439px):** 12 columns, 20px gutters, 32px side margins.

The spacing rhythm follows an 8px base unit. In a desktop context, generous "breathable" white space (or "dark space") is prioritized to prevent data density from feeling overwhelming. Horizontal alignment is critical; elements should snap to the grid to maintain the "structured finance" feel.

## Elevation & Depth
Depth is created through **Glassmorphism** and tonal stacking rather than traditional drop shadows.

- **Level 0 (Base):** The #12141F background.
- **Level 1 (Cards):** Surface color #1E2230 at 60% opacity with a `backdrop-filter: blur(12px)`.
- **Level 2 (Modals/Popovers):** Surface color #2D3348 at 80% opacity with a `backdrop-filter: blur(20px)` and a 1px inner border of white at 10% opacity.

**Edge Lighting:** Instead of shadows, use a 1px stroke (Top/Left) with a light gradient (white at 15% to transparent) to simulate a light source hitting the "glass" edges.

## Shapes
The shape language is "Rounded," balancing the technical nature of finance with a modern, approachable feel.

- **Standard Containers:** 0.5rem (8px) radius. Used for cards, input fields, and standard buttons.
- **Large Elements:** 1rem (16px) radius. Used for main dashboard widgets and modal containers.
- **Pill Factor:** Interactive chips and "Status" tags use a fully rounded (pill) radius to differentiate them from structural elements.

## Components

- **Buttons:** Primary buttons use a solid Teal (#00D09C) fill with dark text. Secondary buttons use a glass-style background (transparent with white/10% border). On hover, primary buttons should exhibit a subtle "outer glow" using the primary color.
- **Inputs:** Fields are dark and recessed. The border is a subtle 1px stroke that glows Teal (#00D09C) only upon focus. Use "Outfit" Medium for input text.
- **Cards:** The core container. Must feature the glass blur and the 1px subtle border. No heavy drop shadows; use a very soft, large-radius ambient glow if the card is "active."
- **Data Tables:** Headers are all-caps `label-md`. Rows have a subtle hover state change (#1E2230 at 40% opacity). Borders between rows should be minimal (white at 5% opacity).
- **Charts:** Use the primary teal for the main data line. Background grid lines in charts should be barely visible to maintain the "clean" glass aesthetic.
- **Chips:** Small, pill-shaped indicators for categories. Use low-opacity versions of functional colors (e.g., Error red at 15% fill with solid red text).