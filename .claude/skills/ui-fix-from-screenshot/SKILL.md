---
name: ui-fix-from-screenshot
description: Use when the user sends a screenshot (usually a phone view, in Hungarian) saying something on the site looks wrong — misaligned, too much space, clipped, jumping, too big, not filling the width — or asks to make spacing/alignment consistent. Finds the component, measures the cause in the running dev server, fixes it at the right breakpoint, and proves it with numbers.
---

# Fixing a UI issue from a screenshot

The user reviews the site on a phone and on a laptop and sends short Hungarian messages with screenshots ("itt túl nagy a távolság", "nem tölti ki a teret", "ugrik egyet", "legyen egységes"). Each one is usually a symptom of a rule that is broken in several places, so fix the rule, not just the screenshot.

## 1. Find the element

- Grep the visible Hungarian text in `src/` (accents included). Titles often live in the page component (`*/pages/*Page.tsx`), data in `src/lib/data.ts` or `technology-data.ts`.
- Work out which viewport the screenshot is: a narrow screenshot with the `MobileSectionBar` is <=1024px; otherwise desktop or a <=900px-high laptop (`@media (max-height: 900px) and (min-width: 1025px)` blocks exist on most pages).

## 2. Measure before you change anything

Use the dev server the user already runs (`http://localhost:3000`). Don't start a production build unless asked: the user stopped one before, and parallel servers get killed by memory pressure.

```bash
node scripts/qa/trace.js http://localhost:3000/kutatas "[class*=Szentkir_lyTempPage_header]" 390
```

It prints the element and every ancestor up to `<main>` with box, margins, paddings, flex/grid gap and alignment, `max-width`, transform and the distance to the next visible sibling. The extra space is almost always one of these:

| Symptom | Usual cause seen in this repo |
|---|---|
| Upper block wider than the lower one / content not at the gutter | An inner frame adds its own `padding: 0 2rem` or a `max-width` + `margin: auto` box on top of the 20px section gutter |
| Big gap under a title | A container `gap` **plus** the title's `margin-bottom`, or the child's own `margin` (e.g. the chart's `margin: var(--space-xl) 0`), or `justify-content: center` vertically centring content in leftover height |
| Gap under a pill badge | The pill's own `margin-bottom` adding to the wrapper's margin |
| Element 0px high | `height: 100%` against a parent sized only by `min-height` — use `position: absolute; inset: 0` or a grid row |
| Jumps when the entrance ends | CSS `transition: all` on an element Framer animates inline, or Framer animating `scale` (re-raster snap) |
| Overlay marks slip on mobile | `%` coordinates authored for the desktop crop; hide them in `[data-preview]` and show them in the fullscreen view |
| Fix "doesn't apply" | Mobile override placed before the base rule in the file, or lower specificity than the base (`.a.b` beats `.b`) |

Remember `flex-direction: column` swaps the axes: vertical centring then comes from `justify-content`, not `align-items`.

Entrances (`whileInView`) leave `opacity: 0` and `translateY(20px)` until scrolled into view, so scroll the element in before measuring (`trace.js` does) or the numbers are off by the transform.

## 3. Fix with the house rules

Phones and tablets (`@media (max-width: 1024px)`), desktop untouched unless the user says otherwise:

- One gutter: the `ScrollLayout_section` padding (20px). Inner frames add 0 horizontal padding and no narrower centred `max-width` box.
- Titles, badges and labels align left (user's choice, 2026-11-01). Centred only for data badges inside cards.
- Title -> its content: 16px. Badge/eyebrow -> content: 12px. Put the space in one place (the container `gap`), zero the title's own margin.
- Text never below 12px (`0.75rem`); body at least 15px.
- Stacked pairs (e.g. good/bad ranges) get equal boxes: same radius, a gap, no shared border.

Append mobile overrides in a block at the end of the module file, with a one-line comment saying why. The `css-guard` hook warns about `transition: all`, small fonts, unguarded `max-height` queries and `height: 100%` in new lines.

Then search for the same pattern elsewhere (the user expects "mindenhol egységes"): grep the class/property across `src/components/**`, and run the audits.

## 4. Prove it

```bash
node scripts/qa/layout-check.js http://localhost:3000            # gutter, left alignment, title/badge gaps at 390 and 900
node scripts/qa/trace.js <url> "<selector>" 390                  # the specific spot, before/after numbers
node scripts/qa/trace.js <url> "<selector>" 1440 900             # the laptop, if desktop CSS was touched
npx tsc --noEmit
```

For a visual change take one Playwright screenshot of the element and look at it. When something can't be verified (no screenshot taken), say so in the reply.

## 5. Commit, report, push

- Commit on the working branch (`chore/cleanup-2026`), message in English, ending with the Co-Authored-By line.
- Report in Hungarian: what was wrong (cause, with the measured numbers), what changed, how it was verified.
- Push to `main` only when the user says so in that message ("mehet a main-re és push"): fast-forward `main` to the branch, push, switch back.
