# Viewport Scaling & Height Optimization Guide (125% Zoom)

This guide documents the workflow (`village_scale_check`) for ensuring pages fit perfectly within height-constrained viewports, specifically targeting the **125% OS scaling** scenario.

## The Problem
At 125% scaling on a standard 1920x1080 monitor, the logical resolution becomes **1536x864**. After accounting for the browser's chrome (address bar, bookmarks, tabs), the available viewport height is typically around **674px**. 

Standard "desktop-first" designs often overflow this height, causing:
1.  **Vertical Scrollbars**: Breaking the single-page "app" feel.
2.  **Element Overlap**: Content hitting or covering bottom-fixed navigation elements (e.g., the `Lapozás` pill).
3.  **Visual Crowding**: Elements feeling too large for the constrained workspace.

---

## The Workflow (`village_scale_check`)

### 1. Simulation & Audit
- **Resolution**: Resize viewport to `1536x800`.
- **Target Height**: Ensure content fits within **674px**.
- **Checkpoints**:
    - [ ] No vertical scrollbar on the main container.
    - [ ] Padding between bottom content and pagination is at least 10-20px.
    - [ ] Titles and stats don't dominate the screen visually.

### 2. Implementation Strategy

#### A. Media Query Trigger
Always use height-based media queries to target these constrained viewports without affecting standard large monitors.
```css
@media (max-height: 900px) { 
  /* Adjustments go here */
}
```

#### B. Content Scaling
- **Font Sizes**: Use `clamp()` with reduced `vh` values.
  - *Example Title:* `font-size: clamp(1.5rem, 5vh, 2.75rem);`
- **Margins & Gaps**: Switch from large `rem` units to small `vh` units or smaller fixed values.
  - *Example:* `margin-bottom: 1vh;` or `gap: var(--space-sm);`
- **Component Padding**: Tighten internal padding (e.g., `.challengeItem`, `.ctaButton`).

#### C. Grid Constraints
- Use `max-height` calculations for grid containers to force them to shrink.
  ```css
  .statsPageGrid {
    max-height: calc(100vh - 120px); /* Leave room for header/footer */
  }
  ```

---

## Reference Pages Fixed
- **Hero Section**: `Hero.module.css` (Reduced title size, tightened stats).
- **Compaction Stats**: `ProblemNew.module.css` (Scaled challenge cards and main statistic).

## Verification Ritual
1.  Resize to `1536x800`.
2.  Navigate to the page.
3.  Check layout at 100% vs 125% (simulated).
4.  Capture screenshot to verify "Visual Balance" (proportions should look similar to the 100% version).
