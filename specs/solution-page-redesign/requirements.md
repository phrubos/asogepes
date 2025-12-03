# Solution Page Redesign Requirements

## Overview
The goal is to redesign the "Megoldás" (Solution) page to match the high visual quality of the new "Probléma" page. The focus is on presenting the Imants spading machines in a sophisticated, technical, and interactive way ("Blueprint" aesthetic). The page should feel premium, modern, and educational.

## Core Requirements

### 1. Visual Style & Aesthetic
-   **Theme:** Dark, technical, premium.
-   **Palette:** Dark earth tones (`var(--color-earth-800)` background), gold accents (`var(--color-gold)`), and white/cream text for high contrast.
-   **Style:** "Blueprint" / "Technical Drawing" aesthetic. Use thin lines, geometric shapes, and technical typography (monospace or structured sans-serif details).
-   **Consistency:** Must align with the global design system (editorial feel) but representing the "Technology" aspect of the story.

### 2. Key Features & Components

#### A. Interactive Machine Showcase ("The Blueprint")
-   **Concept:** Instead of static cards, show the machine (using the new PNGs: `40SX.png`, `38SX.png`) as a central interactive element.
-   **Interactivity:** Hotspots or "pulsing" points on the machine.
    -   **Hover/Click:** Reveals details about the Rotor, Spades, or Depth control.
-   **Visuals:** Use the transparent PNGs against a dark background, perhaps with subtle grid lines or technical markings behind them.

#### B. "How It Works" Visualization
-   **Animation:** Explain the "Spading" motion vs. "Ploughing" motion.
-   **Graphics:** Clean SVG animations or diagrams showing the mixing action without inversion (preserving soil layers).

#### C. Technical Specifications (Machine Types)
-   **Layout:** A clean comparison grid or horizontal scroll for the different models (`38SX`, `40SX`, `38WX`).
-   **Content:** Working depth, horsepower requirements, unique features.

#### D. Benefits Grid
-   **Redesign:** Update the current benefits list to be more visual, using icons and the "Blueprint" style (e.g., framed like technical notes).

### 3. Assets
-   **Images:** Use `public/images/40SX.png` and `public/images/38SX.png`.
-   **Icons:** Lucide React icons (settings, layers, maximize, etc.).

### 4. User Experience (UX)
-   **Flow:** Intro -> Interactive Machine -> How it Works -> Models -> CTA.
-   **Navigation:** Clear "Next Step" CTA at the bottom leading to "Kísérlet" (Experiment) page.
-   **Responsiveness:** The interactive blueprint must work well on mobile (stacking info instead of hover).

## Technical Constraints
-   Use `framer-motion` for animations.
-   Ensure images are optimized (Next.js Image component).
-   Maintain existing route structure (`src/app/megoldas/page.tsx`).
