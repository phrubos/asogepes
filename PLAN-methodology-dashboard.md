# Methodology Dashboard Refinement Plan

## Overview
Refine the "Measurement Dashboard" on the Methodology page to create a more cohesive, premium visual experience. The goal is to integrate the Scale Bar and Manometer into a unified "Instrument Panel" rather than two separate elements placed side-by-side.

## Success Criteria
- [ ] Scale Bar and Manometer appear as a single, unified component.
- [ ] Vertical alignment is perfect.
- [ ] Visual hierarchy supports the narrative (Input: Manometer -> Output: Scale Reading).
- [ ] Mobile responsiveness is maintained (stacking order).
- [ ] Design matches the "Premium Technical" aesthetic of the site.

## Tech Stack
- React (Next.js)
- CSS Modules
- Framer Motion (for entry animations)

## File Structure
- `src/components/experiment/pages/MethodologyPage.tsx` (Markup updates)
- `src/components/experiment/pages/MethodologyPage.module.css` (Style updates)

## Task Breakdown

### 1. Structure Update
- **Task**: Wrap Scale Bar and Manometer in a new `dashboardContainer` div.
- **Input**: `MethodologyPage.tsx`
- **Output**: Updated markup with new container.
- **Verify**: Elements are grouped in DOM.

### 2. Styling - Unify Components
- **Task**: Style `dashboardContainer` to look like a control panel.
    - Subtle dark background (glassmorphism?).
    - Border/Glow effect to frame both elements.
    - Improved spacing/gap.
- **Input**: `MethodologyPage.module.css`
- **Output**: Cohesive visual style.
- **Verify**: Visual check.

### 3. Visual Polish
- **Task**: Add "connector" visuals or alignment tweaks.
    - Ensure center lines match.
    - Maybe overlapping slightly or using a connecting line.
- **Input**: CSS
- **Output**: Polished CSS.
- **Verify**: Visual check.

## ✅ PHASE X COMPLETE
- [ ] Lint: ✅ Pass
- [ ] Build: ✅ Success
