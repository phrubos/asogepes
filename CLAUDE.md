# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hungarian agricultural research website ("Ásógépes Talajművelés") presenting scientific findings about spade machine soil cultivation for irrigated horticultural crops. Built with Next.js 15, React 18, TypeScript, Framer Motion and CSS Modules (no Tailwind). The `/kutatas` 3D field chart uses plain `three` (no react-three-fiber).

The site is in Hungarian language and uses an earth-tone color palette (browns, greens, golds) with Fraunces (display) and Inter (body) fonts.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (also runs lint + typecheck)
npm run lint     # ESLint (next/core-web-vitals, .eslintrc.json) — 0 errors; only react-hooks/exhaustive-deps warnings remain
npx tsc --noEmit # Typecheck
npm run start    # Start production server
npx playwright test --project=chromium  # E2E tests against http://localhost:3000 (server must already run)
```

QA scripts (`scripts/qa/`, see its README) run against a production build in `.next-qa` on port 3100, so they never clash with `npm run dev`:

```bash
bash scripts/qa/stop-server.sh 3100   # always first: an old server keeps serving the old build
NEXT_DIST_DIR=.next-qa npm run build && NEXT_DIST_DIR=.next-qa npx next start -p 3100
node scripts/qa/clip-check.js    # clipped text at 360/390/1440/1536/1366 px (Git Bash + --pages=/…: prefix MSYS_NO_PATHCONV=1)
node scripts/qa/type-check.js    # body text median >= 15px, no text < 12px
node scripts/qa/hero-check.js    # home hero never blocked by the video
node scripts/qa/nav-check.js     # SSR <h1>, fast menu navigation, ?section= deep links
node scripts/qa/motion-check.js  # prefers-reduced-motion honoured
node scripts/qa/touch-check.js   # hover cards work by tap and keyboard
node scripts/qa/perf.js          # FCP/LCP/CLS/TBT report
node scripts/qa/mobile-check.js  # phones (390/360 px): no empty band > 300px, no overlapping text, tap targets >= 44px
node scripts/qa/layout-check.js  # <=1024px: one 20px gutter, left-aligned titles, title gap <= 24px, badge gap <= 16px
node scripts/qa/trace.js <url> "<selector>" [w] [h]  # why an element sits where it does (box/margin/gap of it and its ancestors)
```

For a quick check of a CSS change, point the scripts at the dev server instead (`node scripts/qa/layout-check.js http://localhost:3000`); the user usually has `npm run dev` running and prefers that to a QA build. CSS-module classes are hashed: select with `[class*=Component_class]`, accents become `_` (`Szentkir_lyInfoPage`).

Run Python scripts with `py file.py`.

## Architecture

### Page Structure (App Router)
- `/` - Home page: `home/Hero` (poster image; background video only on >=768px without reduced motion / Save-Data; stats, CTA)
- `/problema` - `problem/ProblemScrollLayout`: hero, compaction, ploughing, cultivator sections
- `/technologia` - `solution-v2/TechnologyScrollLayout`: hero, operation principle, models (38SX, 38WX, 40SX), application guide
- `/kutatas` - `experiment/ResearchScrollLayout`: hero, methodology, Szentkirály, Kecskemét, Lakitelek

All three content pages use the shared `shared/ScrollLayout` (window scroll, section/subsection nav, `?section=` deep links).

### Component Organization
```
src/components/
├── home/          # Hero
├── problem/       # ProblemScrollLayout, sections/, pages/, visualizations/ (SVG soil profiles)
├── solution-v2/   # TechnologyScrollLayout, sections/, pages/, HubFolder, ModelSection, ApplicationGuide
├── experiment/    # ResearchScrollLayout, sections/, pages/ (per location), FieldChart3DCanvas, BookLayout
├── layout/        # Navigation, Footer
├── shared/        # ScrollLayout, PhotoViewer, BeforeAfterSlider, ThermalOverlays
├── ui/            # MagneticButton, ImageLightbox, PageBadge, AnimatedNumber, SoilLoader
├── providers/     # MotionProvider (MotionConfig reducedMotion="user")
└── error/         # HydrationErrorBoundary
```

### Data Layer
- Research data (locations, photos, treatments, model details) lives in `src/lib/data.ts`; technology models in `src/lib/technology-data.ts`.
- Some research numbers are still hard-coded inside location page components (`experiment/pages/*`), not in `data.ts` — check both when updating data.

### CSS Modules
Each component has a `.module.css` file. Unused classes were pruned in the 2026 cleanup; when deleting a component, delete its unused CSS too.

### Import Alias
Use `@/` for imports from `src/` directory (configured in tsconfig.json).

## Analysis / audit
- UI/UX, mobile and performance analysis: `docs/2026-10-31-ui-ux-performance-analysis.md`

## Skills
Project skills live in `.agents/skills/` (mirrored in `.claude/skills/`, lock: `skills-lock.json`): ux-heuristics, performance-optimization, information-architecture, design-motion-principles, review-animations, find-animation-opportunities, animation-vocabulary, emil-design-eng, apple-design, systematic-debugging, verification-before-completion, writing-plans, executing-plans, and the local **ui-fix-from-screenshot** (the workflow for "this looks wrong" screenshots: trace, fix at the right breakpoint, prove with numbers).

Hook: `.claude/hooks/css-guard.js` runs after every Edit/Write of a `*.module.css` and reports, for the newly added lines only, `transition: all`, fonts below 12px, `max-height` queries without `min-width: 1025px`, and `height: 100%`.

## Design Notes

- Avoid blue/indigo colors - use earth tones per globals.css
- Respect `prefers-reduced-motion` in every animation (`useReducedMotion` from `@/hooks/useReducedMotion`; Framer's `MotionConfig` skips transforms but not opacity)
- Hover-revealed content must also open by tap and keyboard: use `useDisclosureTrigger` (`@/hooks/useDisclosureTrigger`)
- Text: no font-size below 0.75rem (12px); body text at least 0.9375rem. Sections grow with content (`min-height`, not fixed `height` + `overflow: hidden`)
- Phones/tablets (<=1024px) have their own patterns, desktop is unchanged: `shared/ScrollLayout/MobileSectionBar` (sticky bar + contents sheet), `shared/HeroTopicList` (hero topics), `problem/StaticChallenge` (hover cards shown as a list). Gate JS with `useMediaQuery` (`@/hooks/useMediaQuery`, null until mounted); pause loops off-screen with `useLoopActive`. Put `mobile-static` on Framer entrances that would hide content until scrolled. Laptop `@media (max-height: …)` rules must also say `and (min-width: 1025px)` or they hit tall phones. Shortening a block near the top can pull a heavy section into the `content-visibility` render range at load — check mobile TBT (`perf.js`) after such changes. `MagneticButton` takes `href` to render a link (never wrap it in `<Link>`)
- Phone/tablet layout rules (user decisions, 2026-11-01): one 20px gutter (the `ScrollLayout_section` padding; inner frames add no horizontal padding and no narrower centred `max-width` box); titles, badges and labels align left; 16px from a title to its content and 12px from a badge to its content, set in one place (container `gap`, title margin 0). Check with `layout-check.js`
- Framer + CSS: never put `transition: all` on an element Framer animates (the CSS transition lags behind Framer's inline transform and the element jumps when the entrance ends); don't animate `scale` on crisp icons (pixel snap at the end)
- `height: 100%` against a parent that only has `min-height` resolves to 0 (the 3D canvas and the fullscreen photo broke this way): fill with `position: absolute; inset: 0` or a grid row
- Photo overlays (`ThermalOverlays`, `BeforeAfterSlider`) use `%` coordinates for the desktop crop: in mobile previews (`[data-preview]`) they are hidden, the fullscreen `PhotoViewer` shows them
- In a `flex-direction: column` container vertical centring comes from `justify-content`; a laptop rule that centres content in the leftover height leaves a big band under the title
- Fonts come from `next/font` in `app/layout.tsx` (`--font-inter`, `--font-fraunces`); don't add CSS `@import` font URLs
