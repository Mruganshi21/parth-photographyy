# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite, localhost:5173)
npm run build     # tsc -b && vite build → dist/
npm run lint      # eslint
npm run preview   # serve the dist/ build locally
```

No test runner is configured.

## Architecture

This is a single-page React + TypeScript portfolio site (Vite). The entire app lives in three files:

- `src/main.tsx` — mounts `<App />`
- `src/App.tsx` — all components, all data, all state
- `src/index.css` — all styles (no CSS modules or utility framework)

**All content is hardcoded** in `App.tsx`: `photos`, `categories`, `packages`, and `navLinks` arrays at the top of the file. To add, remove, or edit photos/packages/nav items, edit those arrays directly.

**Loader sequence** — controlled by `loaderPhase` state (0→3) and four `setTimeout` calls in a `useEffect`. Phase 3 starts the slide carousel; `loading` flips to `false` at 7 s, revealing the rest of the page.

**Custom cursor** — two DOM refs (`cursorRef` for the trailing ring, `dotRef` for the instant dot) updated by a `requestAnimationFrame` loop with 0.13 lerp factor. `cursorType` state (`'default' | 'hover' | 'view'`) drives CSS class names; elements call `setCursorType` on `onMouseEnter`/`onMouseLeave`.

**Gallery layout** — photos are grouped in threes: `[left, right, center-large]`. The grouping loop in `App` produces `groups: Photo[][]`, rendered as `.gallery-group` > `.gallery-sides` (first two) + `.g-center` (third).

**`PhotoCard` component** — handles per-card 3-D tilt (rotateX/rotateY via mouse position math) and a radial spotlight overlay, both driven by local state. Scroll-reveal direction (`'left' | 'right' | 'up'`) maps to different Framer Motion `initial` values.

**Framer Motion patterns** — two reusable motion configs defined at module scope: `ease` (cubic-bezier array) and `spring` (spring config object). All section headings use `whileInView` with `viewport={{ once: true }}`. The menu overlay uses `clipPath` for its wipe animation.

**Navigation** is anchor-hash based (`#gallery`, `#categories`, etc.) — no router library.

**Deployment** — Vercel, configured in `vercel.json`. The rewrite rule catches all non-asset paths and serves `index.html` (SPA fallback).
