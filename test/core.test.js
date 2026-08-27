import test from 'node:test';
import assert from 'node:assert/strict';
import { extractBlocks } from '../src/core.js';

test('extracts shell blocks and requires explicit run marker', () => {
  const markdown = '# Demo\n```bash\necho safe\n```\n```bash readmeproof\n$ node --version\n```\n';
  const blocks = extractBlocks(markdown);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].runnable, false);
  assert.equal(blocks[1].runnable, true);
  assert.equal(blocks[1].script, 'node --version');
});
