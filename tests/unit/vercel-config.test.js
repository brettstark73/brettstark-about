import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import Ajv from 'ajv';

// Vercel validates vercel.json against its published schema before a build
// starts, and rejects any property the schema no longer lists. `public: true`
// stayed in this file after Vercel dropped it, and every deployment failed
// with "should NOT have additional property `public`" before a build ran.
// Checking against the live schema catches the next removed key here, not in
// a failed deployment.
const SCHEMA_URL = 'https://openapi.vercel.sh/vercel.json';
const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));

let validate;

beforeAll(async () => {
  const response = await fetch(SCHEMA_URL, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Could not fetch ${SCHEMA_URL}: HTTP ${response.status}`);
  }
  // The schema declares draft-04 but uses draft-06+ keywords (numeric
  // exclusiveMinimum, boolean items), so validate it as draft-07.
  const schema = await response.json();
  delete schema.$schema;
  const ajv = new Ajv({ allErrors: true, strict: false });
  validate = ajv.compile(schema);
}, 20_000);

function errorsFor(document) {
  return validate(document)
    ? []
    : validate.errors.map(
        (e) => `${e.instancePath || '/'} ${e.message} ${JSON.stringify(e.params)}`
      );
}

describe('vercel.json', () => {
  it('matches the schema Vercel publishes', () => {
    expect(errorsFor(config)).toEqual([]);
  });

  it('points editors at the published schema', () => {
    expect(config.$schema).toBe(SCHEMA_URL);
  });

  it('rejects the removed `public` property', () => {
    expect(errorsFor({ ...config, public: true })).not.toEqual([]);
  });

  it('rejects an unknown property', () => {
    expect(errorsFor({ ...config, notAVercelKey: 1 })).not.toEqual([]);
  });
});
