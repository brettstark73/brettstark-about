# WFHroulette

WFHroulette is a tiny deterministic picker that helps teams assign a single work-from-home day each ISO week, complete
with a light-hearted excuse. It ships with a Node.js CLI and a browser-based viewer so you can keep the fun going in the
terminal or on a shared screen.

## Features

- Deterministically selects one weekday (Monday–Friday only) per ISO week based on a seed.
- Pairs every selection with a randomly chosen (but reproducible) excuse from `reasons.json`.
- Re-usable core logic shared by the CLI and the browser UI.
- Ships with a lightweight `/web` frontend that works offline.

## Getting Started

### Prerequisites

- Node.js 20 or newer (matches the version in the `package.json` engines field).

### Install dependencies

```bash
npm install
```

## CLI Usage

Run the CLI with the default seed ("WFHroulette"):

```bash
node cli.js
```

Pass a custom seed so everyone gets a different-but-repeatable rotation:

```bash
node cli.js --seed "team-rocket"
```

Pick a date in the future (or past) to see who will stay home that week:

```bash
node cli.js --seed "product-squad" --date 2024-11-18
```

Run `node cli.js --help` to see all available options.

The CLI prints the ISO week, the selected weekday and calendar date, plus the matching excuse. Because everything is
seeded, running the same command again yields the same result.

## Web Frontend

Open `web/index.html` directly in a browser or serve the repo root with any static file server. The page mirrors the CLI
experience:

- Enter a seed and optional date.
- Press **Spin the Wheel** to compute the WFH day and excuse.
- Results update instantly and remain deterministic for the selected inputs.

All logic runs in the browser—no external network requests are required.

## Customising Excuses

Update `reasons.json` to add, remove, or tweak the excuses. Both the CLI and the web UI load this file at runtime, so any
changes are reflected automatically in both experiences.

## License

This project is released under the [MIT License](./LICENSE).
