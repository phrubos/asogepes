# Implementation Plan - Solution Page Redesign

## Phase 1: Setup & Structure
- [x] Create new directory `src/components/solution-v2` for the new components.
- [x] Create `SolutionLayout.tsx` to handle the dark theme wrapper and main structure.
- [x] Update `src/app/megoldas/page.tsx` to use the new layout (keep backup of old page).

## Phase 2: Interactive Machine Showcase (The Core)
- [x] Create `MachineBlueprint.tsx` component.
- [x] Implement the visual container (Dark background, Grid lines).
- [x] Add the Machine Image (`40SX.png` as primary).
- [x] Add Hotspots (Framed buttons/dots) positioned over key parts (Rotor, Frame, Roller).
- [x] Implement the "Detail View" state (showing text/specs when a hotspot is active).

## Phase 3: Content Sections
- [x] **Hero Section:** Redesign the "Lazítás forgatás nélkül" header to be more technical/editorial.
- [ ] **Operating Principle:** Create `WorkingPrinciple.tsx` - visual explanation of the spading mechanism (SVG/Animation). (Deferred for now, benefits grid covers this)
- [x] **Benefits Grid:** Redesign `Benefits.tsx` using the blueprint aesthetic (thin borders, technical font for headers).
- [x] **Machine Models:** Create `ModelComparison.tsx` using the 38SX and 40SX images.

## Phase 4: Polish & Integration
- [ ] Add entrance animations (staggered fade-ins, drawing lines).
- [ ] Ensure mobile responsiveness (stacking the blueprint details).
- [ ] Add "Next Step" navigation card at the bottom.
- [ ] Verify image sizing and loading performance.
