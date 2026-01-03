# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hungarian agricultural research website ("Ásógépes Talajművelés") presenting scientific findings about spade machine soil cultivation for irrigated horticultural crops. Built with Next.js 15, React 18, TypeScript, and features heavy animation use with GSAP and Framer Motion.

The site is in Hungarian language and uses an earth-tone color palette (browns, greens, golds) with Fraunces (display) and Inter (body) fonts.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint
npm run start    # Start production server
```

## Architecture

### Page Structure (App Router)
- `/` - Home page with Hero and ResearchQuestions
- `/problema` - Problem page: soil compaction issues with irrigated farming
- `/technologia` - Solution page: spade machine technology (3 models: 38SX, 38WX, 40SX)
- `/kutatas` - Research/experiment page: field trial locations and methodology
- `/eredmenyek` - Results page: findings from the research

### Component Organization
```
src/components/
├── home/          # Hero, ResearchQuestions
├── problem/       # SoilHero variants (6 hero options), CompactionView, PloughingView, CultivatorView
├── solution-v2/   # SolutionLayout, ModelSection, HubFolder, ApplicationGuide, FieldDataModal
├── experiment/    # ResearchLayout, Timeline, LocationContent, BarChart
├── results/       # ResultsLayout
├── layout/        # Navigation, Footer
├── ui/            # Reusable: MagneticButton, TextReveal, TiltCard, ImageLightbox, AnimatedChart, etc.
├── providers/     # RouteLoadingProvider
└── shared/        # Shared components
```

### Key Patterns

**Layout Components**: Each major page has a layout component (e.g., `ProblemLayout`, `SolutionLayout`, `ResearchLayout`) that orchestrates section composition and navigation.

**Hero Variants**: The problem page has multiple hero implementations in separate folders (`SoilHero/`, `SoilHeroAlt/`, `SoilHeroInteractive/`, etc.) - currently using `SoilHeroInteractive`.

**Data Layer**: Research data (locations, machine specs, findings) centralized in `src/lib/data.ts`.

**Animation Libraries**:
- GSAP with `@gsap/react` for complex scroll-triggered animations
- Framer Motion for component transitions and micro-interactions
- Custom hook: `useGSAP.ts` for GSAP cleanup

**CSS Modules**: Each component typically has a corresponding `.module.css` file (e.g., `ProblemNew.module.css`).

### Import Alias
Use `@/` for imports from `src/` directory (configured in tsconfig.json).

## Slash Commands

- `/checkpoint` - Create a comprehensive git commit with all changes
- `/create-feature` - Create feature spec with requirements and implementation plan in `/specs` folder
- `/check-build` - Run lint, typecheck, and build to verify no errors

## Design Notes

- Design iterations stored in `.superdesign/design_iterations/` as HTML files
- Uses Flowbite as styling base for design prototypes
- Avoid blue/indigo colors - use earth tones per globals.css
- Google Fonts: prefer JetBrains Mono, Space Mono, Inter, Poppins, etc.
