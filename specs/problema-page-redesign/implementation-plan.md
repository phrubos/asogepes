# Implementation Plan - Probléma Page Redesign

## Phase 1: Restructuring & Component Setup
- [x] Create a new directory `src/components/problem-v2` to avoid breaking the current page immediately (or refactor in place if preferred, but safety first).
- [x] Create `ProblemLayout.tsx` to handle the main structure and the "View Switcher" state.
- [x] Extract "Compaction" content into `CompactionView.tsx`.
- [x] Extract "Ploughing" content into `PloughingView.tsx`.
- [x] Update `src/app/problema/page.tsx` to use the new layout.

## Phase 2: Hero & Navigation Design
- [x] Design a modern, elegant Section Header ("01 A Probléma").
- [x] Create a sophisticated "Segmented Control" or "Toggle" for switching between "Tömörödés" (Compaction) and "Szántás" (Ploughing).
    -   Style: Minimalist, pill-shaped, smooth sliding background.
- [x] Add entrance animations for the hero section.

## Phase 3: Compaction View Redesign ("A Tömörödés Problémája")
- [x] **Stats Section:** Redesign the "Irrigation" stat (min-max water). use large typography, maybe a water-themed background or subtle gradient.
- [x] **Context Intro:** Style the introduction text with better typography (measure, line-height, font-weight).
- [x] **Challenge Grid:** Redesign the `challengeGrid` (Droplet, Weight, Layers).
    -   Move away from basic cards. Use a list with icons, or a horizontal scroll, or a beautiful grid with hover effects.
    -   Add subtle animations for the icons.
- [x] **Interactive Soil Integration:** Re-style the container for `InteractiveSoil` to make it blend seamlessly.

## Phase 4: Ploughing View Redesign ("Miért Nem Elég a Szántás?")
- [x] **Intro & Context:** Style the text explaining the ploughing issues.
- [x] **Consequences Grid:** Redesign `ConsequenceCard`.
    -   Make them cleaner, perhaps minimal borders or soft shadows.
    -   Improve icon presentation.
- [x] **Soil Comparison:** Better container for the comparison visualization.
- [x] **Conclusion & CTA:** Redesign the "Solution" CTA to be a prominent, elegant button/link at the bottom.

## Phase 5: Polish & Responsive Adjustments
- [x] Verify mobile responsiveness for all new components.
- [x] Check tablet layouts.
- [x] Fine-tune Framer Motion animations (timings, easings).
- [x] Ensure all colors and fonts match the "Modern, Elegant" requirement.
