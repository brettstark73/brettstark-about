import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// npm runs scripts with sh. On macOS sh is bash, which expands an unquoted
// `**/*.{js,css}` to one directory level only; on Linux, dash passes it on
// unexpanded and the tool walks the whole tree. An unquoted glob made the
// local pre-push format check skip root and nested files that CI then failed.
// Quoting hands the glob to the tool, so every machine checks the same files.
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

function unquotedGlobs(command) {
  const outsideQuotes = command.replace(/'[^']*'|"[^"]*"/g, '');
  return outsideQuotes.split(/\s+/).filter((word) => word.includes('*'));
}

describe('package.json scripts', () => {
  it.each(Object.entries(pkg.scripts))(
    '%s quotes every glob it passes to a tool',
    (_name, command) => {
      expect(unquotedGlobs(command)).toEqual([]);
    }
  );
});
