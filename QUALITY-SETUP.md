# Quality Setup Playbook

This project uses a consistent, automated quality pipeline (Prettier, ESLint, Stylelint) locally and in CI. Use these steps to add or reuse the setup in future repos.

## Prerequisites

- Node 20
  - nvm: `nvm install 20 && nvm use 20`
  - Volta: `volta install node@20.11.1 npm@10.2.4`

## One‑Shot Setup (Template Script)

From your project root (must be a git repo):

1. Run the setup script

```
npx create-qa-architect
```

2. Install deps and set up Husky

```
npm install
npm run prepare
```

What it adds

- Husky + lint-staged pre‑commit hooks
- Prettier, ESLint, Stylelint (configs + scripts)
- GitHub Actions workflow for Prettier/ESLint/Stylelint on push/PR

## Commands

- `npm run format` → Prettier write
- `npm run format:check` → Prettier check
- `npm run lint` → ESLint + Stylelint (no fix)
- `npm run lint:fix` → ESLint + Stylelint with fixes

Pre‑commit hook runs lint‑staged on changed files automatically.

## CI Integration (GitHub Actions)

The workflow `.github/workflows/quality.yml` runs on every push/PR with Node 20:

- Prettier check
- ESLint (zero warnings)
- Stylelint
- Non‑blocking security audit

## Vercel Runtime (Note)

- Prefer auto‑detection of Node from `package.json` `engines` when deploying to Vercel.
- Avoid hard‑coding a `runtime` in `vercel.json` unless verified against current Vercel docs — incorrect values can break deploys.
- Local/CI Node 20 pinning (nvmrc/engines/Volta) is independent of Vercel’s Functions runtime.

## Toolchain Pinning (Recommended)

- `.nvmrc` with `20`
- `package.json` → `"engines": { "node": ">=20" }`
- Optional Volta pin: `"volta": { "node": "20.11.1", "npm": "10.2.4" }`
- `.npmrc` → `engine-strict = true`
- Vercel functions (if used): `vercel.json` → `"functions": { "api/**.js": { "runtime": "nodejs20.x" } }`

## Manual Setup (If Not Using Script)

1. Install dev deps

```
npm i -D prettier eslint stylelint stylelint-config-standard husky lint-staged
```

2. Add scripts to `package.json`

```
"format": "prettier --write .",
"format:check": "prettier --check .",
"lint": "eslint . --ext .js,.jsx,.ts,.tsx,.html && stylelint \"**/*.css\"",
"lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx,.html --fix && stylelint \"**/*.css\" --fix"
```

3. Add `lint-staged` to `package.json`

```
"lint-staged": {
  "package.json": ["prettier --write"],
  "**/*.{js,jsx,ts,tsx,html}": ["eslint --fix", "prettier --write"],
  "**/*.css": ["stylelint --fix", "prettier --write"],
  "**/*.{json,md,yml,yaml}": ["prettier --write"]
}
```

4. Create configs in the repo root

- `.eslintrc.json` (use `eslint:recommended` or your preferred config)
- `.eslintignore` (ignore `dist/`, `build/`, `node_modules/`)
- `.stylelintrc.json` (extends `stylelint-config-standard`)
- `.prettierrc`, `.prettierignore`

5. Initialize Husky

```
npm run prepare
```

## Typical Workflow

- Make changes → `git commit` (hooks run) → push → GitHub Actions runs checks.
- If a hook fails: `npm run lint:fix && npm run format`, then commit again.
- Emergency bypass: `git commit --no-verify` (not recommended; CI will still catch issues).

## Notes

- The sibling template repo (`quality-automation-template`) is already pinned to Node 20 and includes ESLint/Stylelint out of the box.
- For new repos, just run the template’s setup script and you’re ready.
