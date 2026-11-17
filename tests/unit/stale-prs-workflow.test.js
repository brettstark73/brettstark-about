import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// GitHub Actions ignores an unknown `with:` input with only a warning. The
// stale-prs workflow passed `exempt-pr-authors`, which actions/stale does not
// have, so Dependabot PRs were marked stale and closed. Checking each input
// against the pinned action's action.yml turns that warning into a failure.
const workflow = parse(
  readFileSync(new URL('../../.github/workflows/stale-prs.yml', import.meta.url), 'utf8')
);
const step = workflow.jobs.stale.steps.find((s) => s.uses?.startsWith('actions/stale@'));
const ref = step.uses.split('@')[1];

let inputs;

beforeAll(async () => {
  const url = `https://raw.githubusercontent.com/actions/stale/${ref}/action.yml`;
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  }
  inputs = Object.keys(parse(await response.text()).inputs);
}, 20_000);

describe('stale-prs workflow', () => {
  it('pins actions/stale by commit SHA', () => {
    expect(ref).toMatch(/^[0-9a-f]{40}$/);
  });

  it('passes only inputs that actions/stale defines', () => {
    expect(Object.keys(step.with).filter((key) => !inputs.includes(key))).toEqual([]);
  });

  it('exempts Dependabot PRs by the label dependabot.yml applies', () => {
    expect(step.with['exempt-pr-labels'].split(',')).toContain('dependencies');
  });

  it('exempts draft PRs', () => {
    expect(step.with['exempt-draft-pr']).toBe(true);
  });
});
