# Agent Guide

This repo is a static site (HTML/CSS) deployed on Vercel. Keep changes minimal, focused, and offline-friendly.

## Commands

- Dev server: `npm run dev` (requires Vercel CLI)
- Build (no-op): `npm run build`
- Deploy (prod): `npm run deploy` (requires `vercel login`)

If Vercel CLI isn’t installed: `npm i -g vercel`.

## Scope & Structure

- Source lives in `public/` (`index.html`, `styles.css`, assets).
- Do not rename or move files unless requested.
- Prefer vanilla HTML/CSS; avoid adding frameworks or heavy JS.
- Put any new assets in `public/`.

## Style & Conventions

- HTML: semantic tags, accessible landmarks, keep existing meta/SEO.
- CSS: keep variables in `:root`, group related sections, prefer existing naming.
- Keep diffs small and focused; avoid unrelated refactors.
- No inline copyright/license headers.

## Accessibility & SEO

- Preserve `skip-link`, focus-visible styles, and color contrast.
- Keep `<meta>` Open Graph/Twitter tags intact; update values only when relevant.

## Constraints

- Tests: none. Keep changes easy to verify by loading `index.html`.
- Network: do not add new external scripts; keep site fast and deterministic.
- Secrets: none required. Do not commit tokens or Vercel config with secrets.

## Tips for Agents

- Use `rg` for search; read files in small chunks.
- Prefer surgical edits to `public/index.html` and `public/styles.css`.
- When adding features (e.g., theme toggle), keep it dependency-free and minimal.
