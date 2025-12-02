# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hungarian agricultural research website presenting scientific findings about spade machine (ásógép) soil cultivation. The site compares traditional plowing methods with Imants spade machine technology across three experimental locations (Szentkirály, Kecskemét-Borbás, Lakitelek).

**Research context:** Neumann János University × Agroskill Ltd. collaboration (2025), BSc thesis by Dobecz Andor.

## Development Commands

```bash
# Start local development server
py -m http.server 8000
```

Access at: http://localhost:8000

## Architecture

Static HTML/CSS/JS website with no build process or dependencies.

### File Structure
- `index.html` - Single-page layout with 4 main sections (Problem, Solution, Experiment, Results)
- `styles.css` - CSS custom properties design system with earth-tone palette
- `script.js` - Vanilla JS for tabs, scroll animations, and chart animations
- `inputs/` - Source materials (thesis documents, presentation, images)

### Key Patterns

**CSS Architecture:**
- Custom properties in `:root` for colors (`--color-earth-*`, `--color-green-*`, `--color-gold*`), spacing (`--space-*`), and typography
- BEM-like class naming (`.section-header`, `.chart-bar-spade`)
- Responsive breakpoints at 1024px and 768px

**JavaScript Modules:**
- `initLocationTabs()` - Tab switching for 3 experiment locations
- `initScrollAnimations()` - IntersectionObserver-based reveal animations
- `animateCharts()` - Bar chart growth animations
- `initNavHighlight()` - Active nav link based on scroll position

**Content Language:** All UI text is in Hungarian.
