# PLAN-scale-fix-125

> **Goal:** Counteract the operating system's 125% display scaling (common on laptops) by scaling the web application content down by 20% (to 0.8x), effectively restoring a "100%" visual appearance for these users.

## 🛑 User Review Required

> [!CAUTION]
> **Accessibility Impact**: Overriding the user's preferred scaling (125%) forces smaller content than they requested via their OS settings. This is a deliberate design choice per user instructions, but may affect readability for visually impaired users relying on OS scaling.

> [!NOTE]
> **Technical Approach**: We will primarily try CSS `zoom` property for Chrome/Edge (Windows standard) as it handles layout reflow best. If standard compatibility is needed (e.g., Firefox), `transform: scale(0.8)` with width adjustment will be the fallback/alternative.

## Proposed Changes

### Global Styling
#### [MODIFY] [index.css](file:///c:/Projects/asogepes_webapp_2/src/index.css)
- Add a specific media query to detect ~125% DPI (1.25 dppx or 120dpi).
- Apply scaling rule to the `html` or `body` element.
- **Formula**: 125% * 0.8 = 100%.

## Verification Plan

### Automated Tests
- None (Visual change dependent on device headers/settings).

### Manual Verification
1. **Simulate 125% Scaling**:
   - In Chrome DevTools > Device Toolbar, set "DPR" (Device Pixel Ratio) to 1.25.
   - OR change Windows Display Settings to 125% and open the browser.
2. **Check Scaling**:
   - Verify that the effective view looks "smaller" (like 100% on a 100% screen) rather than "zoomed in".
   - **Critical Check**: Ensure no content is cut off at the right edge or bottom.
   - **Critical Check**: Ensure fixed position elements (modals, headers) behave correctly.

## Task Breakdown

### 1. Analysis & Prototyping
- [ ] Research best CSS property (`zoom` vs `transform`) for full-page downscaling to prevent layout breakage.
- [ ] Determine exact media query syntax to target 125% users specifically (avoiding 150% or 200% users if possible, or scaling strictly for >100%).

### 2. Implementation
- [ ] Add CSS media query to `src/index.css`.
    -   Target `min-resolution: 1.25dppx` (or specific range).
    -   Apply `zoom: 0.8` (or `transform` equivalent).

### 3. Verification
- [ ] Verify on Windows with 125% scaling (or DevTools simulation).
- [ ] Check for layout regressions (scrollbars, fixed elements).

## ✅ Phase X Compliance
- [ ] 125% Detection acts correctly.
- [ ] Visual layout is preserved (no white bars or overflow).
