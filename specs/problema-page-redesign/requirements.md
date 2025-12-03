# Probléma Page Redesign Requirements

## Overview
The goal is to completely redesign the "Probléma" (Problem) page to achieve a sophisticated, modern, elegant, and beautiful aesthetic. The current design is functional but lacks the desired visual impact. The redesign should improve the layout, typography, color usage, and overall user experience, making the content more engaging and easier to digest.

## Core Requirements
1.  **Aesthetic & Visual Style**
    -   **Modern & Elegant:** Use ample whitespace, refined typography, and a sophisticated color palette (aligned with the brand but elevated).
    -   **Sophisticated:** Avoid "boxy" or generic layouts. Use subtle shadows, gradients, or glassmorphism if appropriate, but keep it clean.
    -   **High-Quality Visuals:** Better integration of icons, illustrations, and interactive elements.

2.  **Layout & UX**
    -   **Rethink Navigation:** The current tabbed interface ("A Tömörödés Problémája" vs "Miért Nem Elég a Szántás?") feels disjointed. Consider a single scrolling narrative or a more seamless transition between these two related problems.
    -   **Storytelling:** The page should tell a story:
        1.  The context (Irrigation farming).
        2.  The problem (Compaction).
        3.  The traditional "solution" and why it fails (Ploughing).
        4.  The need for a new solution (The Spading Machine).
    -   **Responsiveness:** Must look perfect on mobile, tablet, and desktop.

3.  **Content Presentation**
    -   **Statistics:** Redesign the "Irrigation" stats to be more impactful.
    -   **Challenges:** Redesign the challenge cards (Droplet, Weight, Layers) to be less card-like and more integrated or visually interesting.
    -   **Interactive Elements:**
        -   `InteractiveSoil`: Better integration into the layout.
        -   `SoilComparison`: Make it a key visual feature.
        -   `ConsequenceCard`: Redesign these to be cleaner.

4.  **Technical Constraints**
    -   Maintain Next.js App Router structure.
    -   Use existing styling methodology (CSS Modules) or introduce Tailwind if appropriate (will check). *Current codebase uses CSS Modules significantly.*
    -   Keep existing text content but feel free to rephrase for better flow if absolutely necessary (mostly styling focused).

## Key Features to Redesign
-   **Hero/Header Section:** "01 A Probléma" - needs to be more striking.
-   **Compaction Section:** Visualizing the weight/water issue.
-   **Ploughing Section:** Visualizing the plough pan and layer mixing.
-   **Transitions:** Smooth animations between sections using Framer Motion.

## User Preferences
-   "Igényes, modern, elegáns, gyönyörű" (Demanding/High-quality, modern, elegant, beautiful).
-   Open to layout changes ("Újra gondolhatod az elrendezést is, mindent is").
