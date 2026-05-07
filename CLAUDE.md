# Brett Stark About Site - Claude Guide

> Static about-me page with live GitHub, Strava, and newsletter feeds.

**Domain**: about.brettstark.com

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend  | Vercel Serverless Functions     |
| Hosting  | Vercel                          |
| Quality  | ESLint 9, Prettier, Stylelint   |

## Key Commands

```bash
npm run dev              # Vercel dev server
node server.js           # Express dev (local only)
vercel --prod            # Deploy to production
npm run lint             # ESLint + Stylelint
npm run quality:ci       # Full quality check
```

## Project Structure

```
/
├── api/                 # Vercel serverless functions
│   ├── github.js       # GitHub activity (10 min cache)
│   ├── strava.js       # Running stats (10 min cache)
│   └── beehiiv.js      # Newsletter stats (30 min cache)
├── public/
│   ├── index.html      # Single-page app
│   └── styles.css      # All styling
└── tests/              # Vitest tests
```

## API Endpoints

| Endpoint       | Description                      | Cache  |
| -------------- | -------------------------------- | ------ |
| `/api/github`  | Repos, commits, languages        | 10 min |
| `/api/strava`  | Running activities, weekly stats | 10 min |
| `/api/beehiiv` | Subscribers, post count          | 30 min |

## Environment Variables

```bash
GITHUB_TOKEN=ghp_...           # Optional (rate limits)
STRAVA_CLIENT_ID=...           # Required for live data
STRAVA_CLIENT_SECRET=...
STRAVA_REFRESH_TOKEN=...
BEEHIIV_API_KEY=...            # Required for live data
```

## What NOT to Do

- Don't remove SEO meta tags or JSON-LD schema
- Don't hardcode API credentials
- Don't expose env vars to client
- Don't remove API fallback data
- Don't add build step (static site)

---

_No framework, no build step. Global rules in `~/.claude/CLAUDE.md`._

---

## GitHub Actions Policy

See `.claude-setup/docs/GITHUB-ACTIONS-POLICY.md` — minimal workflow mode, no new workflows.

## Pre-Action Checklist

Before suggesting ANY infrastructure, CI/CD, or tooling changes:

1. Run `ls .github/workflows/` to see existing workflows
2. Run `cat package.json | grep scripts -A 50` to see available commands
3. Check for `.qualityrc.json`, `CLAUDE.md`, or similar config files

## Quality Automation (create-qa-architect)

This project uses `create-qa-architect` for CI/CD quality gates. Before suggesting or creating ANY new GitHub Actions workflows for lint/test/security/formatting, you MUST first check:

1. `.github/workflows/quality.yml` — already exists and handles all quality checks
2. `.qualityrc.json` — CQA configuration file

**DO NOT** create duplicate workflows. The existing workflow already handles ESLint, Prettier, Stylelint, test execution, npm audit, and secret detection.

Available commands (use these instead of suggesting new workflows):

```bash
npm run quality:ci       # Full CI quality pipeline
npm run validate:all     # Comprehensive validation
npm run lint             # ESLint + Stylelint
npm run lint:fix         # Auto-fix lint
npm run format:check     # Check formatting
npm run security:audit   # Dependency security check
```

**Before proposing CI/CD changes**: Run `ls .github/workflows/` and read `quality.yml` to understand what already exists.

---

**Last Updated:** 2026-03-01
