# Plan: Improve 3D Chart Label Readability (`PLAN-chart-readability`)

## Problem Statement
The treatment labels ("szürke művelőeszközök") on the 3D Field Chart are difficult to read on standard monitors (e.g., 27" 1920x1080) when the chart is in embedded (non-fullscreen) mode. The text is likely too small or blurry due to 3D scaling and texture resolution.

## Analysis of Current Implementation
- **Technique**: Three.js `Sprite` with `CanvasTexture`.
- **Resolution**: ~460x80px canvas.
- **Font Size**: 24px default font.
- **3D Scale**: 4.5 units width.
- **Issue**: When the camera moves back (to fit the scene), the 4.5 unit sprite becomes few pixels on screen. Canvas texture resolution might also be too low for sharp text.

## Proposed Solutions

### Option 1: High-Res Textures & Larger Sprites (Recommended First Step)
Increase the internal resolution of the canvas text and slightly increase the physical size in the 3D world.
- **Canvas Size**: Double to 920x160px.
- **Font Size**: Double to 48px (for sharpness).
- **Physical Scale**: Increase from 4.5 to ~5.5 or 6.0 units width.
- **Positioning**: Adjust Z-position slightly to prevent overlapping if they get wider.

### Option 2: Adaptive Scaling (Dynamic Size)
Calculate the distance from the camera and scale the sprites so they maintain a minimum screen size.
- **Pros**: Always readable.
- **Cons**: Can look cluttered if they overlap adjacent elements; requires calculations in the render loop.

### Option 3: HTML Overlay (The "Hybrid" Approach)
Remove the names from the 3D scene (Sprites) and render them as absolute-positioned `div`s on top of the canvas.
- **Pros**: Perfect text rendering (CSS), selectable text, responsive font sizing.
- **Cons**: Harder to manage depth (occlusion); text might float over things it shouldn't.

### Option 4: "Layout Shift"
Move the labels out of the 3D scene entirely and place them in a static legend below the 3D view (similar to the "Results Summary" side panel, but for the X-axis labels).
- **Pros**: Best readability.
- **Cons**: Disconnects the label from the specific row in the visual.

## Selected Strategy: Option 1 (Optimization)
We will stick with the 3D Sprites (to maintain the "immersive" feel and correct perspective) but significantly boost their visibility.

1.  **Double Resolution**: Increase canvas pixel density.
2.  **Increase Scale**: Make the labels physically larger in the 3D scene.
3.  **Contrast Boost**: Ensure the gray background is distinctive enough against the dark ground.

## Implementation Steps

### Phase 1: Texture & Scale Upgrade
- [ ] Update `FieldChart3DCanvas.tsx`:
    - [ ] Increase `nameCanvas` width/height (approx double).
    - [ ] Increase font size context.
    - [ ] Increase `nameSprite.scale` values.

### Phase 2: Positioning Refinement
- [ ] Check if new larger labels overlap (since we moved the camera back).
- [ ] Adjust Z position of labels if necessary (move them slightly forward/South).

## Verification
- **Visual Check**: Open in embedded view on 1080p screen simulation.
- **Readability**: Text should be crisp and legible without squinting.
- **Layout**: Labels should not overlap each other or the Roman numerals.

## User Review Required
- Is the new size "too big" in fullscreen? (We might need conditional scaling for fullscreen vs embedded).
