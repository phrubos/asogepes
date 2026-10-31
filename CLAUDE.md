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

Run Python scripts with `py file.py`.

## Architecture

### Page Structure (App Router)
- `/` - Home page: `home/Hero` (background video, stats, CTA)
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
├── ui/            # MagneticButton, ImageLightbox, PageBadge, AnimatedNumber, LoadingScreen, SoilLoader
├── providers/     # NavigationContext, RouteLoadingProvider
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
Project skills live in `.agents/skills/` (mirrored in `.claude/skills/`, lock: `skills-lock.json`): ux-heuristics, performance-optimization, information-architecture, design-motion-principles, review-animations, find-animation-opportunities, animation-vocabulary, emil-design-eng, apple-design, systematic-debugging, verification-before-completion, writing-plans, executing-plans.

## Design Notes

- Avoid blue/indigo colors - use earth tones per globals.css
- Respect `prefers-reduced-motion` in every animation
