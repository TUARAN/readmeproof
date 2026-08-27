import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function extractBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split(/\r?\n/);
  let open = null;
  for (let i = 0; i < lines.length; i++) {
    const fence = lines[i].match(/^\s*```(bash|sh|shell|console)(.*)$/i);
    if (!open && fence) open = { language: fence[1].toLowerCase(), meta: fence[2].trim(), start: i + 2, lines: [] };
    else if (open && /^\s*```\s*$/.test(lines[i])) {
      const script = normalize(open.lines);
      blocks.push({ ...open, script, runnable: /(?:^|\s)readmeproof(?:\s|$)/.test(open.meta) });
      open = null;
    } else if (open) open.lines.push(lines[i]);
  }
  return blocks.filter(block => block.script.trim());
}

function normalize(lines) {
  return lines.map(line => line.replace(/^\s*\$\s?/, '')).filter(line => !/^\s*(?:>|# Output:)/.test(line)).join('\n');
}

export function checkFile(file) {
  const blocks = extractBlocks(fs.readFileSync(file, 'utf8'));
  return blocks.map(block => {
    const result = spawnSync('bash', ['-n'], { input: block.script, encoding: 'utf8' });
    return { ...block, valid: result.status === 0, error: result.stderr.trim() };
  });
}

export function runBlocks(file, blocks) {
  const cwd = path.dirname(path.resolve(file));
  return blocks.filter(block => block.runnable).map(block => {
    const result = spawnSync('bash', ['-eu', '-o', 'pipefail'], { input: block.script, cwd, encoding: 'utf8', timeout: 120000 });
    return { ...block, status: result.status, stdout: result.stdout, stderr: result.stderr };
  });
}
