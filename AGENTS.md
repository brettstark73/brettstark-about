# Repository Guidelines

## Pre-Action Checklist

Before suggesting ANY infrastructure, CI/CD, or tooling changes:

1. Run `ls .github/workflows/` to see existing workflows
2. Run `cat package.json | grep scripts -A 50` to see available commands
3. Check for `.qualityrc.json`, `CLAUDE.md`, or similar config files

## Project Structure & Module Organization

- `public/` contains entrypoint `index.html`, site styles in `styles.css`, fallback `404.html`, and static assets for favicons and social cards.
- `api/` holds Vercel serverless functions (`beehiiv.js`, `github.js`, `strava.js`) used for dynamic data; keep responses lean and cache-friendly.
- `server.js` supports local experimentation but is not required for Vercel deploys; prefer the CLI workflows.
- Configuration lives in `vercel.json`, `package.json`, `robots.txt`, and `sitemap.xml`; update cautiously to avoid SEO regressions.

## Build, Test, and Development Commands

- `npm run dev` – starts the Vercel dev server; requires the `vercel` CLI and mirrors production routing.
- `npm run build` – placeholder build step for workflow parity; keep it fast and side-effect free.
- `npm run deploy` – wraps `vercel deploy`; log in with `vercel login`, review the preview URL, then promote to production manually.

## Coding Style & Naming Conventions

- HTML and CSS use two-space indentation; prefer semantic landmarks, keep existing meta tags, and preserve the skip link.
- Reuse CSS custom properties declared in `:root`; group selectors by section context and avoid introducing utility class sprawl.

- Name new assets descriptively (e.g., `public/feature-card.png`) and reference them with root-relative paths.

## Testing Guidelines

- No automated suite today; validate changes by loading `public/index.html` locally and checking responsive breakpoints.

- When editing API routes, hit `http://localhost:3000/api/<name>` during `npm run dev` to confirm JSON shape and headers.
- Document manual checks in pull requests so reviewers can reproduce them quickly.

## Commit & Pull Request Guidelines

- Follow the existing `Type: Summary` format (`Docs: clarify hero copy`); keep subjects under ~65 characters and write in imperative voice.
- Each PR should outline scope, testing evidence, and any follow-up tasks; include before/after screenshots for visual tweaks.
- Link issues when available and flag production-impacting changes so deploys can be scheduled.

## Security & Deployment Tips

- Do not commit secrets; manage environment values through Vercel project settings only.
- Keep external dependencies minimal to preserve offline rendering and fast cold starts for API routes.
- After production deploys, verify `sitemap.xml` and metadata via `curl` or browser devtools to ensure SEO assets remain intact.

## Quality Automation (create-qa-architect)

**IMPORTANT**: This project uses `create-qa-architect` for CI/CD quality gates. Before suggesting or creating ANY new GitHub Actions workflows for lint/test/security/formatting, you MUST first check:

1. `.github/workflows/quality.yml` — already exists and handles all quality checks
2. `.qualityrc.json` — CQA configuration file

**DO NOT** create duplicate workflows. The existing workflow already handles:

- ESLint with security rules
- Prettier formatting checks
- Stylelint for CSS
- Test execution
- Security audit (`npm audit`)
- Secret detection

**Available Commands** (use these instead of suggesting new workflows):

- `npm run quality:ci` — Full CI quality pipeline
- `npm run validate:all` — Comprehensive validation
- `npm run lint` / `npm run lint:fix` — Linting
- `npm run format:check` / `npm run format` — Formatting
- `npm run security:audit` — Dependency security check

**Before proposing CI/CD changes**: Run `ls .github/workflows/` and `cat .github/workflows/quality.yml` to understand what already exists.
