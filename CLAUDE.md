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
